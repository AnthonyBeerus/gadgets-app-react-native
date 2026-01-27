
import { z } from 'zod';
import { supabase } from '../../../shared/lib/supabase';
import { generateOrderSlug } from '../../../shared/utils/utils';
import { createClient } from '@supabase/supabase-js';

const OrderSchema = z.object({
  totalPrice: z.number().positive(),
  paymentIntentId: z.string().min(1),
  userId: z.string().min(1),
  items: z.array(z.object({
    productId: z.number().int().positive(),
    quantity: z.number().int().positive(),
    price: z.number().positive()
  })).min(1)
});

// Moved to top


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = OrderSchema.safeParse(body);

    if (!result.success) {
      return Response.json({ error: result.error }, { status: 400 });
    }

    const authHeader = request.headers.get('Authorization');
    const supabaseClient = createClient(
      process.env.EXPO_PUBLIC_SUPABASE_URL!,
      process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: authHeader! } } }
    );

    const { totalPrice, paymentIntentId, items, userId } = result.data;
    const slug = generateOrderSlug();

    // 1. Create Order
    const { data: order, error: orderError } = await supabaseClient
      .from('order')
      .insert({
        totalPrice: totalPrice, // Real column name
        slug,
        user: userId, // Real column name
        status: 'Pending',
        payment_intent_id: paymentIntentId,
        stripe_payment_status: 'pending' // Default
      })
      .select('id, slug')
      .single();

    if (orderError || !order) {
      return Response.json({ error: orderError?.message || 'Failed to create order' }, { status: 500 });
    }

    // 2. Create Order Items
    const orderItems = items.map(item => ({
      order: order.id,
      product: item.productId,
      quantity: item.quantity,
      price: item.price
    }));

    const { error: itemsError } = await supabaseClient
      .from('order_item')
      .insert(orderItems);

    if (itemsError) {
      // In a real implementation, we would rollback the order here.
      // For this MVP, we'll return an error.
      return Response.json({ error: itemsError.message }, { status: 500 });
    }

    return Response.json(order, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
