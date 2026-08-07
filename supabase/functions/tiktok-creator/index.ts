import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

const jsonHeaders = { "Content-Type": "application/json" };
const scopes = "user.info.basic,video.list";

const response = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: jsonHeaders });

async function tiktokRequest(path: string, accessToken: string, init: RequestInit = {}) {
  const result = await fetch(`https://open.tiktokapis.com${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json", ...(init.headers ?? {}) },
  });
  const payload = await result.json().catch(() => ({}));
  if (!result.ok || payload?.error?.code) {
    throw new Error(payload?.error?.message || payload?.error_description || "TikTok request failed");
  }
  return payload;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return response({ error: "Method not allowed" }, 405);
  const authHeader = req.headers.get("Authorization") ?? "";
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const clientKey = Deno.env.get("TIKTOK_CLIENT_KEY") ?? "";
  const clientSecret = Deno.env.get("TIKTOK_CLIENT_SECRET") ?? "";
  if (!clientKey || !clientSecret) return response({ error: "TikTok is not configured" }, 503);

  const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authHeader } } });
  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const token = authHeader.replace(/^Bearer\s+/i, "");
  const { data: { user }, error: userError } = await userClient.auth.getUser(token);
  if (userError || !user) return response({ error: "Unauthorized" }, 401);

  try {
    const body = await req.json();
    const action = String(body.action ?? "");

    if (action === "authorize") {
      const state = crypto.randomUUID();
      const redirectUri = String(body.redirectUri ?? "");
      const codeChallenge = String(body.codeChallenge ?? "");
      if (!redirectUri || !codeChallenge) return response({ error: "Missing OAuth parameters" }, 400);
      const { error } = await admin.from("creator_oauth_states").insert({
        state, user_id: user.id, redirect_uri: redirectUri,
        expires_at: new Date(Date.now() + 10 * 60_000).toISOString(),
      });
      if (error) throw error;
      const url = new URL("https://www.tiktok.com/v2/auth/authorize/");
      url.searchParams.set("client_key", clientKey);
      url.searchParams.set("scope", scopes);
      url.searchParams.set("response_type", "code");
      url.searchParams.set("redirect_uri", redirectUri);
      url.searchParams.set("state", state);
      url.searchParams.set("code_challenge", codeChallenge);
      url.searchParams.set("code_challenge_method", "S256");
      return response({ authorizationUrl: url.toString() });
    }

    if (action === "callback") {
      const code = String(body.code ?? "");
      const state = String(body.state ?? "");
      const verifier = String(body.codeVerifier ?? "");
      const { data: oauthState, error: stateError } = await admin.from("creator_oauth_states")
        .select("*").eq("state", state).eq("user_id", user.id).is("consumed_at", null).single();
      if (stateError || !oauthState || new Date(oauthState.expires_at) <= new Date()) {
        return response({ error: "OAuth state is invalid or expired" }, 400);
      }
      const tokenBody = new URLSearchParams({
        client_key: clientKey, client_secret: clientSecret, code,
        grant_type: "authorization_code", redirect_uri: oauthState.redirect_uri,
        code_verifier: verifier,
      });
      const tokenResponse = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
        method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: tokenBody,
      });
      const tokens = await tokenResponse.json();
      if (!tokenResponse.ok || !tokens.access_token) throw new Error(tokens.error_description || "TikTok token exchange failed");
      const profile = await tiktokRequest("/v2/user/info/?fields=open_id,display_name,avatar_url,profile_deep_link", tokens.access_token);
      const profileData = profile.data?.user ?? {};
      const { data: account, error: accountError } = await admin.from("creator_platform_accounts").upsert({
        user_id: user.id, platform: "tiktok", platform_open_id: tokens.open_id,
        display_name: profileData.display_name, avatar_url: profileData.avatar_url,
        profile_deep_link: profileData.profile_deep_link,
        granted_scopes: String(tokens.scope ?? scopes).split(","), connection_status: "connected",
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id,platform" }).select().single();
      if (accountError) throw accountError;
      const now = Date.now();
      const { error: tokenError } = await admin.from("creator_platform_tokens").upsert({
        account_id: account.id, access_token: tokens.access_token, refresh_token: tokens.refresh_token,
        access_expires_at: new Date(now + Number(tokens.expires_in) * 1000).toISOString(),
        refresh_expires_at: new Date(now + Number(tokens.refresh_expires_in) * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      });
      if (tokenError) throw tokenError;
      await admin.from("creator_oauth_states").update({ consumed_at: new Date().toISOString() }).eq("state", state);
      return response({ account });
    }

    const { data: account, error: accountError } = await admin.from("creator_platform_accounts")
      .select("*").eq("user_id", user.id).eq("platform", "tiktok").single();
    if (accountError || !account) return response({ error: "TikTok account is not connected" }, 409);

    if (action === "disconnect") {
      await admin.from("creator_platform_tokens").delete().eq("account_id", account.id);
      await admin.from("creator_platform_accounts").update({ connection_status: "revoked", updated_at: new Date().toISOString() }).eq("id", account.id);
      return response({ disconnected: true });
    }

    const { data: stored, error: storedError } = await admin.from("creator_platform_tokens").select("*").eq("account_id", account.id).single();
    if (storedError || !stored) return response({ error: "TikTok connection must be renewed" }, 409);
    let accessToken = stored.access_token;
    if (new Date(stored.access_expires_at).getTime() < Date.now() + 10 * 60_000) {
      const refreshBody = new URLSearchParams({ client_key: clientKey, client_secret: clientSecret,
        grant_type: "refresh_token", refresh_token: stored.refresh_token });
      const refreshedResponse = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
        method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: refreshBody,
      });
      const refreshed = await refreshedResponse.json();
      if (!refreshedResponse.ok || !refreshed.access_token) {
        await admin.from("creator_platform_accounts").update({ connection_status: "expired" }).eq("id", account.id);
        return response({ error: "TikTok connection expired", reconnectRequired: true }, 409);
      }
      accessToken = refreshed.access_token;
      await admin.from("creator_platform_tokens").update({
        access_token: refreshed.access_token, refresh_token: refreshed.refresh_token ?? stored.refresh_token,
        access_expires_at: new Date(Date.now() + Number(refreshed.expires_in) * 1000).toISOString(),
        refresh_expires_at: new Date(Date.now() + Number(refreshed.refresh_expires_in) * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      }).eq("account_id", account.id);
    }

    if (action === "videos") {
      const result = await tiktokRequest("/v2/video/list/?fields=id,title,video_description,duration,cover_image_url,embed_link,share_url,create_time", accessToken, {
        method: "POST", body: JSON.stringify({ max_count: 20 }),
      });
      return response({ account, videos: result.data?.videos ?? [] });
    }
    if (action === "verify") {
      const videoId = String(body.videoId ?? "");
      const result = await tiktokRequest("/v2/video/query/?fields=id,title,video_description,duration,cover_image_url,embed_link,share_url,create_time", accessToken, {
        method: "POST", body: JSON.stringify({ filters: { video_ids: [videoId] } }),
      });
      const video = result.data?.videos?.[0];
      if (!video) return response({ error: "Video was not found on the connected account" }, 404);
      return response({ account, video });
    }
    return response({ error: "Unknown action" }, 400);
  } catch (error) {
    return response({ error: error instanceof Error ? error.message : "Unexpected error" }, 400);
  }
});
