import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@^16.10.0';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const stripe = Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { httpClient: Stripe.createFetchHttpClient() });
const url = Deno.env.get('SUPABASE_URL')!;
const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const admin = createClient(url, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers });

async function profile(req: Request) {
  const authorization = req.headers.get('Authorization');
  if (!authorization) return null;
  const client = createClient(url, anonKey, { global: { headers: { Authorization: authorization } } });
  const { data } = await client.rpc('current_muse_profile');
  return data?.id ? data : null;
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers });
  if (req.method !== 'POST') return reply({ error: 'Method not allowed' }, 405);
  try {
    const actor = await profile(req);
    if (!actor) return reply({ error: 'Sign in again to continue' }, 401);
    const body = await req.json();
    const orderId = Number(body.orderId);
    if (!Number.isInteger(orderId)) return reply({ error: 'Invalid order' }, 400);
    const { data: order, error } = await admin.from('order')
      .select('*, shops:shop_id(owner_id), purchase_proofs(id, consumed_by_submission_id)')
      .eq('id', orderId).single();
    if (error || !order) return reply({ error: 'Order not found' }, 404);
    const buyer = order.user === actor.id;
    const merchant = order.shops?.owner_id === actor.id;
    const operator = actor.role === 'OPERATOR';

    if (body.action === 'cancel' || body.action === 'reject') {
      if (body.action === 'cancel' && (!buyer || !['awaiting_payment', 'paid'].includes(order.order_status))) return reply({ error: 'This order can no longer be cancelled in-app' }, 409);
      if (body.action === 'reject' && (!(merchant || operator) || !['paid', 'accepted'].includes(order.order_status))) return reply({ error: 'This order cannot be rejected' }, 409);
      if (order.purchase_proofs?.some((proof: { consumed_by_submission_id: number | null }) => proof.consumed_by_submission_id)) {
        return reply({ error: 'A creator entry uses this purchase. Operator review is required.' }, 409);
      }
      const reason = String(body.reason ?? (body.action === 'reject' ? 'merchant_rejected' : 'buyer_cancelled')).slice(0, 300);
      if (order.stripe_payment_intent_id) {
        const intent = await stripe.paymentIntents.retrieve(order.stripe_payment_intent_id);
        if (intent.status === 'succeeded') {
          await stripe.refunds.create({ payment_intent: intent.id, reason: 'requested_by_customer', metadata: { muse_order_id: String(order.id), reason } }, { idempotencyKey: `muse-refund-${order.id}` });
        } else if (intent.status !== 'canceled') {
          await stripe.paymentIntents.cancel(intent.id, {}, { idempotencyKey: `muse-cancel-${order.id}` });
        }
      }
      await admin.from('order').update({
        order_status: body.action === 'reject' ? 'rejected' : 'cancelled',
        status: body.action === 'reject' ? 'Rejected' : 'Cancelled',
        cancelled_at: new Date().toISOString(),
        cancellation_reason: reason,
      }).eq('id', order.id);
      return reply({ ok: true });
    }

    if (!(merchant || operator)) return reply({ error: 'Merchant access required' }, 403);
    const transitions: Record<string, { from: string[]; to: string; fulfilment?: string }> = {
      accept: { from: ['paid'], to: 'accepted' },
      preparing: { from: ['accepted'], to: 'preparing' },
      ready_for_collection: { from: ['preparing'], to: 'ready_for_collection', fulfilment: 'collection' },
      out_for_delivery: { from: ['preparing'], to: 'out_for_delivery', fulfilment: 'delivery' },
      complete_delivery: { from: ['out_for_delivery'], to: 'completed', fulfilment: 'delivery' },
    };
    const transition = transitions[body.action];
    if (!transition || !transition.from.includes(order.order_status)) return reply({ error: 'Invalid order transition' }, 409);
    if (transition.fulfilment && transition.fulfilment !== order.fulfilment_type) return reply({ error: 'Wrong fulfilment action' }, 409);
    await admin.from('order').update({ order_status: transition.to, status: transition.to }).eq('id', order.id);
    await admin.from('delivery_orders').update({
      status: transition.to === 'accepted' ? 'pending' : transition.to === 'completed' ? 'delivered' : transition.to,
      actual_delivery_time: transition.to === 'completed' ? new Date().toISOString() : null,
    }).eq('order_id', order.id);
    return reply({ ok: true, orderStatus: transition.to });
  } catch (error) {
    console.error('[order-actions]', error instanceof Error ? error.message : error);
    return reply({ error: error instanceof Error ? error.message : 'Order action failed' }, 400);
  }
});
