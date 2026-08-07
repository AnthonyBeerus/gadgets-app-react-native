import { supabase } from '../../shared/lib/supabase';
import { diversifyOpportunityFeed } from './ranking';
import {
  clearGuestOpportunityPreferences,
  getGuestOpportunityPreferences,
  restoreGuestOpportunityPreference,
  setGuestOpportunityPreference,
} from './guest-preferences';
import type {
  CreatorOpportunityFeedItem,
  OpportunityPreferenceState,
  OpportunitySource,
} from './types';
import { getMarketplaceCatalog } from './marketplace-api';

const db = supabase as any;

async function getPreviewOpportunityFeed(mallId: number | null) {
  const catalog = await getMarketplaceCatalog();
  const shops = new Map(catalog.shops.map(shop => [Number(shop.id), shop]));
  return catalog.products
    .map(product => {
      const shop = shops.get(Number(product.shop_id));
      if (!shop || (mallId != null && Number(shop.mall_id) !== mallId)) return null;
      const price = Number(product.price);
      return {
        opportunity_id: -Number(product.id),
        opportunity_title: `Create for ${product.title}`,
        opportunity_description: `Show how you would use ${product.title} in an authentic public TikTok.`,
        requirements: ['Public TikTok post', 'Show the product clearly', 'Keep the post live during review'],
        deadline: new Date(Date.now() + 30 * 86400000).toISOString(),
        product_id: Number(product.id),
        product_slug: product.slug,
        product_title: product.title,
        product_description: product.description,
        hero_image: product.heroImage,
        price,
        max_quantity: Number(product.maxQuantity),
        category_id: Number(product.category),
        merchant_id: Number(shop.id),
        merchant_name: shop.name,
        merchant_location: shop.location,
        mall_id: shop.mall_id == null ? null : Number(shop.mall_id),
        has_delivery: Boolean(shop.has_delivery),
        has_collection: Boolean(shop.has_collection),
        reward_value: Math.min(100, Math.max(25, Math.round(price * 0.2 / 5) * 5)),
        reward_currency: 'BWP',
        preference_state: null,
        eligibility_proof_id: null,
        eligibility_consumed: false,
        rank_score: 0,
        contest_mode: 'standard',
        pot_value: null,
        pot_currency: 'BWP',
        pot_splits: null,
        consolation_voucher_value: null,
        settled_at: null,
        score_rule: 'engagement_quality',
      } satisfies CreatorOpportunityFeedItem;
    })
    .filter(item => item !== null)
    .slice(0, 20) as CreatorOpportunityFeedItem[];
}

function normalizeFeed(rows: any[] | null): CreatorOpportunityFeedItem[] {
  return (rows ?? []).map(row => ({
    ...row,
    opportunity_id: Number(row.opportunity_id),
    product_id: Number(row.product_id),
    price: Number(row.price),
    max_quantity: Number(row.max_quantity),
    category_id: Number(row.category_id),
    merchant_id: Number(row.merchant_id),
    mall_id: row.mall_id == null ? null : Number(row.mall_id),
    reward_value: Number(row.reward_value),
    rank_score: Number(row.rank_score),
    requirements: Array.isArray(row.requirements) ? row.requirements : [],
    contest_mode: row.contest_mode === 'competitive_pot' ? 'competitive_pot' : 'standard',
    pot_value: row.pot_value == null ? null : Number(row.pot_value),
    pot_currency: row.pot_currency ?? 'BWP',
    pot_splits: row.pot_splits && typeof row.pot_splits === 'object' ? row.pot_splits : { '1': 0.4, '2': 0.25, '3': 0.15, '4': 0.1, '5': 0.1 },
    consolation_voucher_value: row.consolation_voucher_value == null ? null : Number(row.consolation_voucher_value),
    settled_at: row.settled_at ?? null,
    score_rule: row.score_rule ?? 'engagement_quality',
  }));
}

export async function getCreatorOpportunityFeed({
  cursor = 0,
  limit = 20,
  mallId = null,
  includeHiddenPreferences = false,
}: {
  cursor?: number;
  limit?: number;
  mallId?: number | null;
  includeHiddenPreferences?: boolean;
} = {}) {
  const seed = new Date().toISOString().slice(0, 10);
  let rows: any[] | null = null;
  try {
    const result = await Promise.race([
      db.rpc('get_creator_opportunity_feed', {
        p_cursor: cursor,
        p_limit: Math.min(200, Math.max(1, limit)),
        p_mall_id: mallId,
        p_seed: seed,
      }),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Opportunity feed timed out')), 5000)),
    ]);
    if (result.error) throw result.error;
    rows = result.data;
  } catch {
    console.warn('[Discover] Using preview opportunities until the feed migration is applied.');
    rows = await getPreviewOpportunityFeed(mallId);
  }

  const normalized = diversifyOpportunityFeed(normalizeFeed(rows));
  if (includeHiddenPreferences) return normalized;

  const { data: authData } = await supabase.auth.getUser();
  // Server feed already applies auth preferences; only filter guest prefs when logged out.
  if (authData.user) return normalized;

  const guestPreferences = await getGuestOpportunityPreferences();
  const hidden = new Set(
    guestPreferences
      .filter(item => {
        if (item.state === 'saved') return true;
        if (item.state !== 'dismissed') return false;
        return Date.now() - Date.parse(item.updated_at) < 30 * 86400000;
      })
      .map(item => item.opportunity_id),
  );
  return normalized.filter(item => !hidden.has(item.opportunity_id));
}

export async function getSavedCreatorOpportunities() {
  const { data: authData } = await supabase.auth.getUser();
  if (authData.user) {
    const { data, error } = await db.rpc('get_saved_creator_opportunities');
    if (error) throw error;
    return normalizeFeed(data);
  }

  const savedPrefs = (await getGuestOpportunityPreferences())
    .filter(item => item.state === 'saved')
    .sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at));
  if (savedPrefs.length === 0) return [];

  const savedIds = savedPrefs.map(item => item.opportunity_id);
  const feed = await getCreatorOpportunityFeed({
    mallId: null,
    limit: 200,
    includeHiddenPreferences: true,
  });
  const byId = new Map(feed.map(item => [item.opportunity_id, item]));
  return savedIds
    .map(id => byId.get(id))
    .filter((item): item is CreatorOpportunityFeedItem => Boolean(item))
    .map(item => ({ ...item, preference_state: 'saved' as const }));
}

export async function setCreatorOpportunityPreference(
  opportunityId: number,
  state: OpportunityPreferenceState,
) {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return setGuestOpportunityPreference(opportunityId, state);
  const { data, error } = await db.rpc('set_creator_opportunity_preference', {
    p_opportunity_id: opportunityId,
    p_state: state,
  });
  if (error && opportunityId < 0) return setGuestOpportunityPreference(opportunityId, state);
  if (error) throw error;
  return data;
}

export async function restoreCreatorOpportunityPreference(opportunityId: number) {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return restoreGuestOpportunityPreference(opportunityId);
  const { error } = await db.rpc('restore_creator_opportunity_preference', {
    p_opportunity_id: opportunityId,
  });
  if (error && opportunityId < 0) return restoreGuestOpportunityPreference(opportunityId);
  if (error) throw error;
}

export async function mergeGuestCreatorOpportunityPreferences() {
  const preferences = await getGuestOpportunityPreferences();
  if (preferences.length === 0) return 0;
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return 0;
  const { data, error } = await db.rpc('merge_creator_opportunity_preferences', {
    p_preferences: preferences,
  });
  if (error) throw error;
  await clearGuestOpportunityPreferences();
  return Number(data ?? 0);
}

export async function recordCreatorOpportunityEvent(
  opportunityId: number,
  eventType: 'impression' | 'detail_open',
  source: OpportunitySource,
) {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return;
  const { error } = await db.rpc('record_creator_opportunity_event', {
    p_opportunity_id: opportunityId,
    p_event_type: eventType,
    p_source: source,
  });
  if (error) throw error;
}

export async function getOpportunityForProduct(productId: number, opportunityId?: number) {
  let query = db.from('challenges')
    .select('id,title,description,requirements,deadline,reward_value,reward_currency,product_id,status')
    .eq('product_id', productId)
    .eq('status', 'active');
  if (opportunityId) query = query.eq('id', opportunityId);
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data as null | {
    id: number;
    title: string;
    description: string;
    requirements: string[];
    deadline: string;
    reward_value: number;
    reward_currency: string;
    product_id: number;
    status: string;
  };
}
