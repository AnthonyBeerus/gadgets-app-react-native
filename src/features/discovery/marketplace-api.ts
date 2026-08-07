import { supabase } from '../../shared/lib/supabase';

const db = supabase as any;

export type MarketplaceProduct = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  heroImage: string;
  price: number;
  category: number;
  shop_id: number;
  is_available: boolean;
  maxQuantity: number;
};

export type MarketplaceShop = {
  id: number;
  name: string;
  description: string | null;
  location: string;
  mall_id: number | null;
  image_url: string | null;
  logo_url: string | null;
  has_delivery: boolean;
  has_collection: boolean;
  is_active: boolean;
};

export async function getMarketplaceCatalog() {
  const [productsResult, shopsResult, categoriesResult] = await Promise.all([
    db.from('product').select('*').eq('is_available', true).gt('maxQuantity', 0).order('created_at', { ascending: false }),
    db.from('shops').select('*').eq('is_active', true).order('is_featured', { ascending: false }),
    db.from('category').select('*').order('name'),
  ]);
  const error = productsResult.error ?? shopsResult.error ?? categoriesResult.error;
  if (error) throw error;
  return {
    products: (productsResult.data ?? []) as MarketplaceProduct[],
    shops: (shopsResult.data ?? []) as MarketplaceShop[],
    categories: categoriesResult.data ?? [],
  };
}
