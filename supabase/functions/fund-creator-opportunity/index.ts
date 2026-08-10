import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@^16.10.0';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  httpClient: Stripe.createFetchHttpClient(),
});
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const admin = createClient(supabaseUrl, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

const reply = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: corsHeaders });

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return reply({ error: 'Method not allowed' }, 405);

  try {
    const authorization = request.headers.get('Authorization');
    if (!authorization) return reply({ error: 'Unauthorized' }, 401);
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authorization } },
    });
    const { data: profile, error: profileError } = await userClient
      .from('users')
      .select('id, role')
      .single();
    if (profileError || profile?.role !== 'MERCHANT') return reply({ error: 'Merchant access required' }, 403);

    // Funds the prize pot for an existing draft campaign. Entry is open, so there is
    // no accepted-entry-fee liability to pre-fund any more -- the pot is the whole ask.
    const body = await request.json();
    const challengeId = Number(body.challengeId);
    const prizePotMinor = Number(body.prizePotMinor);
    if (!Number.isInteger(challengeId) || challengeId < 1) return reply({ error: 'Invalid campaign' }, 400);
    if (!Number.isInteger(prizePotMinor) || prizePotMinor < 100) {
      return reply({ error: 'Prize pot is below the minimum' }, 400);
    }

    const { data: shop } = await admin.from('shops').select('id').eq('owner_id', profile.id).single();
    if (!shop) return reply({ error: 'Create a merchant shop before funding a campaign' }, 409);

    const { data: campaign, error: campaignError } = await admin
      .from('challenges')
      .select('id, status, shop_id')
      .eq('id', challengeId)
      .eq('shop_id', shop.id)
      .single();
    if (campaignError || !campaign) return reply({ error: 'Campaign not found' }, 404);
    if (campaign.status !== 'draft') {
      return reply({ error: 'Only a draft campaign can be funded' }, 409);
    }

    const intent = await stripe.paymentIntents.create(
      {
        amount: prizePotMinor,
        currency: 'bwp',
        automatic_payment_methods: { enabled: true },
        metadata: {
          muse_purpose: 'campaign_pot_funding',
          challenge_id: String(campaign.id),
          merchant_profile_id: profile.id,
        },
      },
      { idempotencyKey: `fund_campaign_${campaign.id}_${prizePotMinor}` },
    );

    await admin.from('challenges')
      .update({ pot_value: prizePotMinor })
      .eq('id', campaign.id);

    return reply({
      challengeId: campaign.id,
      paymentIntentClientSecret: intent.client_secret,
      requiredAmountMinor: prizePotMinor,
    });
  } catch (error) {
    return reply({ error: error instanceof Error ? error.message : 'Could not fund campaign' }, 400);
  }
});
