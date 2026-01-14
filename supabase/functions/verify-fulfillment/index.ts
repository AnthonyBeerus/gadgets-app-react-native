import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';
// @ts-ignore
import Stripe from 'npm:stripe@^16.10.0';

const stripe = Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

Deno.serve(async (req) => {
  try {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    };

    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    const { orderId } = await req.json();

    if (!orderId) {
       return new Response('Missing orderId', { status: 400, headers: corsHeaders });
    }

    // 1. Fetch Order (using service_role to bypass RLS if needed, though reading might be allowed, updating might not)
    // We strictly select the fields we need.
    const { data: order, error: orderError } = await supabase
        .from('order')
        .select('*')
        .eq('id', orderId)
        .single();

    if (orderError || !order) {
        return new Response('Order not found', { status: 404, headers: corsHeaders });
    }

    // 2. Validate Payment
    const paymentIntentId = order.payment_intent_id;
    if (!paymentIntentId) {
         return new Response(JSON.stringify({ 
             verified: false, 
             message: 'No payment record found for this order (payment_intent_id missing).' 
         }), { 
             headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
         });
    }

    // 3. Retrieve PaymentIntent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
        // 4. Update Order Status if validated
        if (order.status !== 'Completed') {
             await supabase.from('order').update({ 
                 status: 'Completed', 
                 stripe_payment_status: 'succeeded' 
             }).eq('id', orderId);
        }

        return new Response(JSON.stringify({ 
            verified: true, 
            message: 'Payment Verified & Order Completed',
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency,
            customer_email: order.user_email // assuming we have this or can fetch user
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    } else {
         return new Response(JSON.stringify({ 
            verified: false, 
            message: `Payment not successful. Status: ${paymentIntent.status}` 
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
});
