import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@^16.10.0';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const stripe = Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { httpClient: Stripe.createFetchHttpClient() });
const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

function paymentIntentId(event: Stripe.Event): string | null {
  if (event.type.startsWith('payment_intent.')) return (event.data.object as Stripe.PaymentIntent).id;
  if (event.type === 'charge.refunded') {
    const value = (event.data.object as Stripe.Charge).payment_intent;
    return typeof value === 'string' ? value : value?.id ?? null;
  }
  return null;
}

Deno.serve(async req => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  const signature = req.headers.get('stripe-signature');
  if (!signature) return new Response('Missing Stripe signature', { status: 400 });

  try {
    const payload = await req.text();
    const event = await stripe.webhooks.constructEventAsync(
      payload,
      signature,
      Deno.env.get('STRIPE_ORDER_WEBHOOK_SECRET')!,
      undefined,
      Stripe.createSubtleCryptoProvider(),
    );
    const supported = new Set([
      'payment_intent.succeeded',
      'payment_intent.payment_failed',
      'payment_intent.canceled',
      'charge.refunded',
    ]);
    if (!supported.has(event.type)) return new Response(JSON.stringify({ received: true }), { status: 200 });
    const intentId = paymentIntentId(event);
    if (!intentId) return new Response('PaymentIntent missing', { status: 400 });

    const { error } = await admin.rpc('apply_order_payment_event', {
      p_event_id: event.id,
      p_event_type: event.type,
      p_payment_intent_id: intentId,
    });
    if (error) throw error;
    return new Response(JSON.stringify({ received: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('[stripe-order-webhook]', error instanceof Error ? error.message : error);
    return new Response('Webhook failed', { status: 400 });
  }
});
