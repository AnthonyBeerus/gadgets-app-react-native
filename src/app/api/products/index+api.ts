
import { supabase } from '../../../shared/lib/supabase';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const shopId = url.searchParams.get('shop_id');

    let query = supabase.from('product').select('*');

    if (shopId) {
      query = query.eq('shop_id', parseInt(shopId, 10));
    }

    const { data, error } = await query;

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    console.error("API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
