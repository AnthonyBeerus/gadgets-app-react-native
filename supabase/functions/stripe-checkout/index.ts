import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@^16.10.0';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { getOrCreateStripeCustonerForSupabaseUser } from '../supabase.ts';

const stripe = Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { httpClient: Stripe.createFetchHttpClient() });
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const admin = createClient(supabaseUrl, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
const headers = { 'Content-Type': 'application/json' };
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers });

Deno.serve(async req => {
  try {
    const authHeader = req.headers.get('Authorization') ?? '';
    const userClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY') ?? '', { global: { headers: { Authorization: authHeader } } });
    const { data: { user }, error: authError } = await userClient.auth.getUser(authHeader.replace(/^Bearer\s+/i, ''));
    if (authError || !user) return reply({ error: 'Unauthorized' }, 401);
    const body = await req.json();

    if (body.action === 'confirm') {
      const { data: order } = await admin.from('order').select('*').eq('id', body.orderId).eq('user', user.id).single();
      if (!order?.stripe_payment_intent_id) return reply({ error: 'Order not found' }, 404);
      const intent = await stripe.paymentIntents.retrieve(order.stripe_payment_intent_id);
      if (intent.status !== 'succeeded') return reply({ error: `Payment is ${intent.status}` }, 409);
      const { data: updated, error } = await admin.from('order').update({ status: 'Paid', stripe_payment_status: 'succeeded' })
        .eq('id', order.id).eq('stripe_payment_status', 'pending').select().single();
      if (error && order.stripe_payment_status !== 'succeeded') throw error;
      return reply({ order: updated ?? order, confirmed: true });
    }

    const items = Array.isArray(body.items) ? body.items : [];
    if (!items.length) return reply({ error: 'Cart is empty' }, 400);
    const requested = new Map<number, number>();
    for (const item of items) {
      const productId = Number(item.productId); const quantity = Number(item.quantity);
      if (!Number.isInteger(productId) || !Number.isInteger(quantity) || quantity < 1) return reply({ error: 'Invalid cart item' }, 400);
      requested.set(productId, (requested.get(productId) ?? 0) + quantity);
    }
    const ids = [...requested.keys()];
    const { data: products, error: productError } = await admin.from('product')
      .select('id,price,shop_id,is_available,maxQuantity').in('id', ids);
    if (productError || products?.length !== ids.length) return reply({ error: 'A product is unavailable' }, 409);
    const shopIds = new Set(products.map(product => product.shop_id));
    if (shopIds.size !== 1) return reply({ error: 'Orders must contain products from one merchant' }, 400);
    let amount = 0;
    for (const product of products) {
      const quantity = requested.get(product.id)!;
      if (!product.is_available || product.maxQuantity < quantity) return reply({ error: 'A product is out of stock' }, 409);
      amount += Math.round(Number(product.price) * 100) * quantity;
    }
    if (amount < 1) return reply({ error: 'Invalid order total' }, 400);

    const allowedSources = new Set(['discover', 'saved', 'marketplace', 'merchant']);
    const discoverySource = allowedSources.has(body.attribution?.source) ? body.attribution.source : null;
    const requestedOpportunityId = Number(body.attribution?.opportunityId);
    let opportunityId: number | null = null;
    if (Number.isInteger(requestedOpportunityId) && requestedOpportunityId > 0) {
      const { data: opportunity } = await admin.from('challenges')
        .select('id,product_id,shop_id,status')
        .eq('id', requestedOpportunityId)
        .eq('status', 'active')
        .maybeSingle();
      if (!opportunity || !ids.includes(Number(opportunity.product_id)) || Number(opportunity.shop_id) !== Number([...shopIds][0])) {
        return reply({ error: 'Invalid creator opportunity attribution' }, 400);
      }
      opportunityId = Number(opportunity.id);
    }
    if ((discoverySource === 'discover' || discoverySource === 'saved') && opportunityId === null) {
      return reply({ error: 'Opportunity attribution is required for this checkout source' }, 400);
    }

    const customer = await getOrCreateStripeCustonerForSupabaseUser(req);
    const ephemeralKey = await stripe.ephemeralKeys.create({ customer }, { apiVersion: '2020-08-27' });
    const intent = await stripe.paymentIntents.create({ amount, currency: 'bwp', customer,
      metadata: {
        muse_user_id: user.id,
        shop_id: String([...shopIds][0]),
        discovery_source: discoverySource ?? 'direct',
        opportunity_id: opportunityId ? String(opportunityId) : '',
      } });
    const fulfillmentToken = crypto.randomUUID();
    const { data: order, error: orderError } = await admin.from('order').insert({
      user: user.id, slug: crypto.randomUUID(), status: 'Payment Pending', totalPrice: amount / 100,
      stripe_payment_intent_id: intent.id, stripe_payment_status: 'pending', fulfillment_token: fulfillmentToken,
      discovery_source: discoverySource,
      opportunity_id: opportunityId,
    }).select().single();
    if (orderError) throw orderError;
    const productById = new Map(products.map(product => [product.id, product]));
    const { error: itemError } = await admin.from('order_item').insert(ids.map(productId => ({
      order: order.id, product: productId, quantity: requested.get(productId), price: Number(productById.get(productId)!.price),
    })));
    if (itemError) throw itemError;
    return reply({ paymentIntent: intent.client_secret, publicKey: Deno.env.get('STRIPE_PUBLISHABLE_KEY'),
      ephemeralKey: ephemeralKey.secret, customer, orderId: order.id, totalAmount: amount });
  } catch (error) {
    return reply({ error: error instanceof Error ? error.message : 'Checkout failed' }, 400);
  }
});
