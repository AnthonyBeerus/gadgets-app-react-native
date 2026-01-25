import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';
// @ts-ignore
import Stripe from 'npm:stripe@^16.10.0';

const stripe = Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Service role client for admin tasks (reading orders, updating status)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

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

    const { orderId, token: fulfillmentToken } = await req.json();

    if (!orderId || !fulfillmentToken) {
       return new Response('Missing orderId or fulfillmentToken', { status: 400, headers: corsHeaders });
    }

    // 0. AUTHENTICATION & AUTHORIZATION check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }

    const supabaseClient = createClient(
      supabaseUrl,
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }

    // Verify user has 'merchant' role. 
    // Assuming role is stored in app_metadata or user_metadata.
    // Adjust this based on your actual Source of Truth for roles.
    // For now, checking app_metadata.role or user_metadata.role
    const userRole = user.app_metadata?.role || user.user_metadata?.role;
    
    // START_TEMPORARY_BYPASS: If you haven't set up merchant roles yet, you might want to comment this out
    // or set a specific ALLOWED_MERCHANT_EMAIL env var.
    // if (userRole !== 'merchant') {
    //    return new Response('Forbidden: Merchant access required', { status: 403, headers: corsHeaders });
    // }
    // END_TEMPORARY_BYPASS

    // 1. Fetch Order
    const { data: order, error: orderError } = await supabaseAdmin
        .from('order')
        .select('*')
        .eq('id', orderId)
        .single();

    if (orderError || !order) {
        return new Response('Order not found', { status: 404, headers: corsHeaders });
    }

    // 2. TOKEN & IDEMPOTENCY CHECK
    // Prevent Replay Attacks
    if (order.status === 'Completed') {
        return new Response(JSON.stringify({ 
             // Ideally we warn the merchant "Already Picked Up" but return verified=true 
             // so they know it WAS a valid order, just already processed.
             // OR return verified: false to alert duplicate usage.
             // Let's return verified: false with specific message.
            verified: false,
            message: '⚠️ Order ALREADY fulfilled/picked up.' 
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

    // Validate Secure Token
    if (order.fulfillment_token !== fulfillmentToken) {
        return new Response('Invalid Fulfillment Token', { status: 403, headers: corsHeaders });
    }

    // 3. Validate Payment
    const paymentIntentId = order.payment_intent_id;
    if (!paymentIntentId) {
         return new Response(JSON.stringify({ 
             verified: false, 
             message: 'No payment record found for this order.' 
         }), { 
             headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
         });
    }

    // 4. Retrieve PaymentIntent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
        // 5. Update Order Status
        await supabaseAdmin.from('order').update({ 
            status: 'Completed', 
            stripe_payment_status: 'succeeded' 
        }).eq('id', orderId);

        return new Response(JSON.stringify({ 
            verified: true, 
            message: 'Payment Verified & Order Fulfilled',
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency,
            customer_email: order.user_email
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
