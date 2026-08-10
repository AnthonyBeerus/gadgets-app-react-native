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
      if (intent.metadata.muse_purpose === 'campaign_pot_funding') {
        // A funded pot makes the campaign publishable; the merchant still hits Publish.
        await admin.from('challenges')
          .update({ pot_value: intent.amount_received / 1 })
          .eq('id', Number(intent.metadata.challenge_id))
          .eq('status', 'draft');
      }
    }
    if (event.type === 'payment_intent.payment_failed' || event.type === 'payment_intent.canceled') {
      const intent = event.data.object;
      if (intent.metadata.muse_purpose === 'campaign_pot_funding') {
        // Funding failed, so the pot goes back to unfunded and publish_campaign will refuse.
        await admin.from('challenges')
          .update({ pot_value: null })
          .eq('id', Number(intent.metadata.challenge_id))
          .eq('status', 'draft');
      }
    }
    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(error instanceof Error ? error.message : 'Invalid webhook', { status: 400 });
  }
});
