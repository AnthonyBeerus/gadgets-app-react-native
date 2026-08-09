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

    const body = await request.json();
    const entryFeeMinor = Number(body.acceptedEntryFeeMinor);
    const maximumEntries = Number(body.maximumAcceptedEntries);
    const prizePotMinor = Number(body.prizePotMinor);
    const requiredAmountMinor = entryFeeMinor * maximumEntries + prizePotMinor;
    if (!Number.isInteger(entryFeeMinor) || entryFeeMinor < 0) return reply({ error: 'Invalid accepted-entry fee' }, 400);
    if (!Number.isInteger(maximumEntries) || maximumEntries < 1 || maximumEntries > 10_000) return reply({ error: 'Invalid entry limit' }, 400);
    if (!Number.isInteger(prizePotMinor) || prizePotMinor < 1) return reply({ error: 'Invalid prize pot' }, 400);
    if (requiredAmountMinor < 100) return reply({ error: 'Funding amount is below the minimum' }, 400);

    const { data: shop } = await admin.from('shops').select('id').eq('owner_id', profile.id).single();
    if (!shop) return reply({ error: 'Create a merchant shop before funding an opportunity' }, 409);

    const { data: opportunity, error: opportunityError } = await admin
      .from('creator_opportunities')
      .insert({
        shop_id: shop.id,
        title: String(body.title ?? '').trim(),
        brief: String(body.brief ?? '').trim(),
        image_url: body.imageUrl || null,
        accepted_entry_fee_minor: entryFeeMinor,
        maximum_accepted_entries: maximumEntries,
        prize_pot_minor: prizePotMinor,
        ends_at: body.endsAt,
        created_by: profile.id,
        status: 'AWAITING_FUNDING',
      })
      .select('id')
      .single();
    if (opportunityError) throw opportunityError;

    const intent = await stripe.paymentIntents.create(
      {
        amount: requiredAmountMinor,
        currency: 'bwp',
        automatic_payment_methods: { enabled: true },
        metadata: {
          muse_purpose: 'creator_opportunity_funding',
          opportunity_id: opportunity.id,
          merchant_profile_id: profile.id,
        },
      },
      { idempotencyKey: `fund_creator_opportunity_${opportunity.id}` },
    );
    await admin.from('creator_opportunities')
      .update({ stripe_payment_intent_id: intent.id })
      .eq('id', opportunity.id);

    return reply({
      opportunityId: opportunity.id,
      paymentIntentClientSecret: intent.client_secret,
      requiredAmountMinor,
    });
  } catch (error) {
    return reply({ error: error instanceof Error ? error.message : 'Could not fund opportunity' }, 400);
  }
});
