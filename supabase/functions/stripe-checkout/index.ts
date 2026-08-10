import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@^16.10.0';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const stripe = Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { httpClient: Stripe.createFetchHttpClient() });
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const admin = createClient(supabaseUrl, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: corsHeaders });

type MuseProfile = {
  id: string;
  email: string;
  full_name: string | null;
  stripe_customer_id: string | null;
};

async function authenticatedProfile(req: Request): Promise<MuseProfile> {
  const authorization = req.headers.get('Authorization');
  if (!authorization?.startsWith('Bearer ')) throw new Error('AUTH_REQUIRED');
  const client = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authorization } } });
  const { data, error } = await client.rpc('current_muse_profile');
  if (error || !data?.id) throw new Error('AUTH_REQUIRED');
  return data as MuseProfile;
}

async function stripeCustomer(profile: MuseProfile, requestedEmail: string): Promise<string> {
  if (profile.stripe_customer_id) return profile.stripe_customer_id;
  const email = profile.email || requestedEmail;
  const customer = await stripe.customers.create({
    email: email || undefined,
    name: profile.full_name || undefined,
    metadata: { muse_profile_id: profile.id },
  }, { idempotencyKey: `muse-customer-${profile.id}` });
  const { error } = await admin.from('users').update({ stripe_customer_id: customer.id }).eq('id', profile.id);
  if (error) throw error;
  return customer.id;
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return reply({ error: 'Method not allowed' }, 405);

  try {
    const profile = await authenticatedProfile(req);
    const body = await req.json();
    if (body.action !== 'create') return reply({ error: 'Unsupported checkout action' }, 400);
    if (!/^[0-9a-f-]{36}$/i.test(String(body.idempotencyKey ?? ''))) return reply({ error: 'Invalid checkout key' }, 400);

    const fulfilment = {
      ...body.fulfilment,
      phone: String(body.fulfilment?.phone ?? '').replace(/[\s-]/g, ''),
    };
    const { data: reserved, error: reserveError } = await admin.rpc('reserve_checkout_order', {
      p_user_id: profile.id,
      p_items: body.items,
      p_fulfilment: fulfilment,
      p_attribution: body.attribution ?? {},
      p_idempotency_key: body.idempotencyKey,
    });
    if (reserveError || !reserved?.orderId) throw reserveError ?? new Error('Order reservation failed');

    const { data: orderRecord, error: orderError } = await admin
      .from('order')
      .select('shop_id,payment_status')
      .eq('id', reserved.orderId)
      .single();
    if (orderError || !orderRecord?.shop_id) throw orderError ?? new Error('Reserved order has no merchant');

    const customer = await stripeCustomer(profile, String(body.customerEmail ?? ''));
    let intent: Stripe.PaymentIntent;
    if (reserved.paymentIntentId) {
      intent = await stripe.paymentIntents.retrieve(reserved.paymentIntentId);
    } else {
      intent = await stripe.paymentIntents.create({
        amount: Number(reserved.totalMinor),
        currency: 'bwp',
        customer,
        receipt_email: profile.email || undefined,
        automatic_payment_methods: { enabled: true },
        metadata: {
          muse_order_id: String(reserved.orderId),
          muse_profile_id: profile.id,
          shop_id: String(orderRecord.shop_id),
        },
      }, { idempotencyKey: `muse-checkout-${body.idempotencyKey}` });
      const { error: updateError } = await admin.from('order').update({
        stripe_payment_intent_id: intent.id,
        payment_intent_id: intent.id,
        payment_status: intent.status === 'processing' ? 'processing' : 'requires_payment',
      }).eq('id', reserved.orderId).is('stripe_payment_intent_id', null);
      if (updateError) throw updateError;
    }

    const ephemeralKey = await stripe.ephemeralKeys.create({ customer }, { apiVersion: '2024-06-20' });
    return reply({
      ...reserved,
      paymentIntent: intent.client_secret,
      publicKey: Deno.env.get('STRIPE_PUBLISHABLE_KEY'),
      ephemeralKey: ephemeralKey.secret,
      customer,
      paymentStatus: orderRecord.payment_status,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Checkout failed';
    if (message === 'AUTH_REQUIRED') return reply({ error: 'Sign in again to continue' }, 401);
    console.error('[stripe-checkout]', message);
    return reply({ error: message }, 400);
  }
});
