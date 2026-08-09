import { supabase } from '../../shared/lib/supabase';
import Constants from 'expo-constants';
import { getCreatorOpportunityFeed } from './api';
import { buildMerchantGrowthProfiles, PROTOTYPE_MERCHANTS, type MerchantSeed, type ShopIntent } from './shops-model';

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

function inferIntent(categoryName: string): ShopIntent {
  const value = categoryName.toLowerCase();
  if (value.includes('food') || value.includes('restaurant')) return 'Eat';
  if (value.includes('beauty') || value.includes('health')) return 'Beauty';
  if (value.includes('fashion') || value.includes('clothing')) return 'Style';
  if (value.includes('tech') || value.includes('electronic')) return 'Creator Tech';
  return 'Experiences';
}

export async function getCampaignAwareShops() {
  const variant = Constants.expoConfig?.extra?.appVariant;
  if (variant === 'development' || variant === 'preview' || (__DEV__ && !variant)) {
    return buildMerchantGrowthProfiles(PROTOTYPE_MERCHANTS, await getCreatorOpportunityFeed({ includeHiddenPreferences: true, limit: 200 }));
  }

  const [catalog, opportunities] = await Promise.all([
    getMarketplaceCatalog(),
    getCreatorOpportunityFeed({ includeHiddenPreferences: true, limit: 200 }),
  ]);
  const categoryById = new Map<number, string>(
    catalog.categories.map((category: any): [number, string] => [Number(category.id), String(category.name)]),
  );
  const merchants: MerchantSeed[] = catalog.shops.map(shop => {
    const products = catalog.products.filter(product => product.shop_id === shop.id).slice(0, 4);
    const categoryName = products[0] ? categoryById.get(products[0].category) ?? '' : '';
    return {
      id: shop.id,
      name: shop.name,
      story: shop.description ?? `${shop.name} serves customers in ${shop.location}.`,
      location: shop.location,
      imageUrl: shop.image_url ?? shop.logo_url ?? 'https://picsum.photos/seed/muse-shop/1000/700',
      logoUrl: shop.logo_url ?? undefined,
      intent: inferIntent(categoryName),
      hasDelivery: shop.has_delivery,
      hasCollection: shop.has_collection,
      isPrototype: false,
      products: products.map(product => ({ ...product, description: product.description ?? product.title })),
    };
  });
  return buildMerchantGrowthProfiles(merchants, opportunities);
}

export async function getCampaignAwareShopById(id: number) {
  const profiles = await getCampaignAwareShops();
  return profiles.find(profile => profile.id === id) ?? null;
}
