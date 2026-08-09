import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@^16.10.0';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  httpClient: Stripe.createFetchHttpClient(),
});
const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

Deno.serve(async request => {
  const signature = request.headers.get('stripe-signature');
  if (!signature) return new Response('Missing signature', { status: 400 });
  try {
    const event = await stripe.webhooks.constructEventAsync(
      await request.text(),
      signature,
      Deno.env.get('STRIPE_OPPORTUNITY_WEBHOOK_SECRET')!,
    );
    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object;
      if (intent.metadata.muse_purpose === 'creator_opportunity_funding') {
        await admin.from('creator_opportunities').update({
          status: 'AWAITING_APPROVAL',
          funded_at: new Date().toISOString(),
        }).eq('id', intent.metadata.opportunity_id).eq('stripe_payment_intent_id', intent.id);
      }
    }
    if (event.type === 'payment_intent.payment_failed' || event.type === 'payment_intent.canceled') {
      const intent = event.data.object;
      if (intent.metadata.muse_purpose === 'creator_opportunity_funding') {
        await admin.from('creator_opportunities').update({ status: 'AWAITING_FUNDING' })
          .eq('id', intent.metadata.opportunity_id).eq('stripe_payment_intent_id', intent.id);
      }
    }
    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(error instanceof Error ? error.message : 'Invalid webhook', { status: 400 });
  }
});
