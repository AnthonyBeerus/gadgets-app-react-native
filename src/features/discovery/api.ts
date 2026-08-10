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
import { getPrototypeOpportunity, PROTOTYPE_OPPORTUNITIES } from './prototype-opportunities';
import { withIllustrativeFallback, type RepositoryResult } from './repositories';

const db = supabase as any;

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
    accepted_entry_fee: Number(row.accepted_entry_fee ?? row.consolation_voucher_value ?? row.reward_value ?? 0),
    settled_at: row.settled_at ?? null,
    score_rule: 'hybrid_quality_engagement',
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
  const result = await getCreatorOpportunityFeedResult({ cursor, limit, mallId });
  let normalized = diversifyOpportunityFeed(result.records);
  if (includeHiddenPreferences) return normalized;

  try {
    const { data: authData } = await supabase.auth.getUser();
    if (authData.user) return normalized;
  } catch {
    // Public discovery still works as a guest when the auth service is offline.
  }

  const guestPreferences = await getGuestOpportunityPreferences();
  const hidden = new Set(
    guestPreferences
      .filter(item => item.state === 'saved' || (item.state === 'dismissed' && Date.now() - Date.parse(item.updated_at) < 30 * 86400000))
      .map(item => item.opportunity_id),
  );
  return normalized.filter(item => !hidden.has(item.opportunity_id));
}

export async function getCreatorOpportunityFeedResult({
  cursor = 0,
  limit = 20,
  mallId = null,
}: {
  cursor?: number;
  limit?: number;
  mallId?: number | null;
} = {}): Promise<RepositoryResult<CreatorOpportunityFeedItem>> {
  const seed = new Date().toISOString().slice(0, 10);
  return withIllustrativeFallback(async () => {
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
    return normalizeFeed(result.data);
  }, PROTOTYPE_OPPORTUNITIES.slice(cursor, cursor + limit));
}

export async function getSavedCreatorOpportunities() {
  const guestSaved = (await getGuestOpportunityPreferences())
    .filter(item => item.state === 'saved')
    .sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at));
  const prototypeSaved = guestSaved.filter(item => item.opportunity_id < 0);
  if (prototypeSaved.length > 0) {
    const byId = new Map(PROTOTYPE_OPPORTUNITIES.map(item => [item.opportunity_id, item]));
    return prototypeSaved
      .map(pref => byId.get(pref.opportunity_id))
      .filter((item): item is CreatorOpportunityFeedItem => Boolean(item))
      .map(item => ({ ...item, preference_state: 'saved' as const }));
  }
  const { data: authData } = await supabase.auth.getUser();
  if (authData.user) {
    const { data, error } = await db.rpc('get_saved_creator_opportunities');
    if (error) throw error;
    return normalizeFeed(data);
  }

  const savedPrefs = guestSaved;
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
  if (opportunityId < 0) return setGuestOpportunityPreference(opportunityId, state);
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
  if (opportunityId < 0) return restoreGuestOpportunityPreference(opportunityId);
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return restoreGuestOpportunityPreference(opportunityId);
  const { error } = await db.rpc('restore_creator_opportunity_preference', {
    p_opportunity_id: opportunityId,
  });
  if (error && opportunityId < 0) return restoreGuestOpportunityPreference(opportunityId);
  if (error) throw error;
}

export async function mergeGuestCreatorOpportunityPreferences() {
  const preferences = (await getGuestOpportunityPreferences())
    .filter(preference => preference.opportunity_id > 0);
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
  if (opportunityId < 0) return;
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
  if (productId < 0) {
    const prototype = opportunityId
      ? getPrototypeOpportunity(opportunityId)
      : PROTOTYPE_OPPORTUNITIES.find(item => item.product_id === productId) ?? null;
    if (!prototype) return null;
    return {
      id: prototype.opportunity_id,
      title: prototype.opportunity_title,
      description: prototype.opportunity_description,
      requirements: prototype.requirements,
      deadline: prototype.deadline,
      reward_value: prototype.reward_value,
      accepted_entry_fee: prototype.accepted_entry_fee,
      reward_currency: prototype.reward_currency,
      product_id: prototype.product_id,
      status: 'prototype',
    };
  }
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
    accepted_entry_fee?: number;
    reward_currency: string;
    product_id: number;
    status: string;
  };
}
