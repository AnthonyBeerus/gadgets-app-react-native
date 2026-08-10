import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const url = Deno.env.get('SUPABASE_URL')!;
const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const admin = createClient(url, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: corsHeaders });

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return reply({ error: 'Method not allowed' }, 405);
  try {
    const authorization = req.headers.get('Authorization');
    if (!authorization) return reply({ error: 'Sign in again' }, 401);
    const userClient = createClient(url, anonKey, { global: { headers: { Authorization: authorization } } });
    const { data: actor } = await userClient.rpc('current_muse_profile');
    if (!actor?.id) return reply({ error: 'Sign in again' }, 401);

    const { orderId, token } = await req.json();
    const { data: order } = await admin.from('order').select('*, shops:shop_id(owner_id)')
      .eq('id', Number(orderId)).single();
    if (!order) return reply({ error: 'Order not found' }, 404);
    if (order.shops?.owner_id !== actor.id && actor.role !== 'OPERATOR') return reply({ error: 'This order belongs to another business' }, 403);
    if (order.fulfilment_type !== 'collection') return reply({ error: 'Delivery orders do not use collection QR codes' }, 409);
    if (order.payment_status !== 'succeeded') return reply({ error: 'Payment is not confirmed' }, 409);
    if (order.order_status === 'completed') return reply({ error: 'This collection code has already been used' }, 409);
    if (order.order_status !== 'ready_for_collection') return reply({ error: 'Order is not ready for collection' }, 409);
    if (!order.fulfillment_token || order.fulfillment_token !== token) return reply({ error: 'Invalid collection code' }, 403);

    await admin.from('order').update({ order_status: 'completed', status: 'Completed' }).eq('id', order.id).eq('order_status', 'ready_for_collection');
    await admin.from('delivery_orders').update({ status: 'delivered', actual_delivery_time: new Date().toISOString() }).eq('order_id', order.id);
    return reply({ success: true, orderId: order.id, status: 'completed' });
  } catch (error) {
    console.error('[verify-fulfillment]', error instanceof Error ? error.message : error);
    return reply({ error: error instanceof Error ? error.message : 'Collection verification failed' }, 400);
  }
});
