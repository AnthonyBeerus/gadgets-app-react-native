import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const url = Deno.env.get('SUPABASE_URL')!;
const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const admin = createClient(url, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
const headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Content-Type': 'application/json' };
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers });

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers });
  if (req.method !== 'POST') return reply({ error: 'Method not allowed' }, 405);
  try {
    const authorization = req.headers.get('Authorization');
    if (!authorization) return reply({ error: 'Sign in first' }, 401);
    const client = createClient(url, anonKey, { global: { headers: { Authorization: authorization } } });
    const { data: actor } = await client.rpc('current_muse_profile');
    if (!actor?.id) return reply({ error: 'Muse profile is not ready' }, 401);
    const { code } = await req.json();
    if (!Deno.env.get('ALPHA_MERCHANT_CLAIM_CODE') || code !== Deno.env.get('ALPHA_MERCHANT_CLAIM_CODE')) return reply({ error: 'Incorrect Alpha access code' }, 403);
    const { data: shop } = await admin.from('shops').select('id,owner_id').eq('name', 'Muse Alpha Shop').single();
    if (!shop) return reply({ error: 'Muse Alpha Shop is unavailable' }, 404);
    if (shop.owner_id && shop.owner_id !== actor.id) return reply({ error: 'The Alpha merchant role is already assigned' }, 409);
    const { error: userError } = await admin.from('users').update({ role: 'MERCHANT' }).eq('id', actor.id);
    if (userError) throw userError;
    const { error: shopError } = await admin.from('shops').update({ owner_id: actor.id }).eq('id', shop.id);
    if (shopError) throw shopError;
    return reply({ ok: true, shopId: shop.id });
  } catch (error) {
    return reply({ error: error instanceof Error ? error.message : 'Access could not be granted' }, 400);
  }
});
