
import { supabase } from '../../../../shared/lib/supabase';

export async function GET(request: Request, { slug }: { slug: string }) {
  try {
    const { data, error } = await supabase
      .from('product')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }

    return Response.json(data);
  } catch (error) {
    console.error("API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
