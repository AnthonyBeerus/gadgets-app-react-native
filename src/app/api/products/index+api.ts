
import { supabase } from '../../../shared/lib/supabase';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const shopId = url.searchParams.get('shop_id');

  let query = supabase.from('product').select('*');

  if (shopId) {
    query = query.eq('shop_id', shopId);
  }

  const { data, error } = await query;

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}
