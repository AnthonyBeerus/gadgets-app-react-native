import { isSignedInToMuse, supabase } from '../../shared/lib/supabase';
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
    // The RPC speaks the campaign schema; the deck speaks "opportunity".
    opportunity_id: Number(row.id ?? row.opportunity_id),
    opportunity_title: row.title ?? row.opportunity_title,
    opportunity_description: row.description ?? row.opportunity_description,
    hero_image: row.image_url ?? row.hero_image,
    merchant_id: row.shop_id == null ? 0 : Number(row.shop_id),
    merchant_name: row.brand_name ?? row.merchant_name ?? '',
    merchant_location: row.merchant_location ?? '',
    mall_id: row.mall_id == null ? null : Number(row.mall_id),
    requirements: Array.isArray(row.requirements) ? row.requirements : [],
    talking_points: Array.isArray(row.talking_points) ? row.talking_points : [],
    dos: Array.isArray(row.dos) ? row.dos : [],
    donts: Array.isArray(row.donts) ? row.donts : [],
    brand_asset_paths: Array.isArray(row.brand_asset_paths) ? row.brand_asset_paths : [],
    content_format: row.content_format ?? 'either',
    deliverable_count: Number(row.deliverable_count ?? 1),
    video_min_seconds: row.video_min_seconds == null ? null : Number(row.video_min_seconds),
    video_max_seconds: row.video_max_seconds == null ? null : Number(row.video_max_seconds),
    usage_rights: row.usage_rights ?? 'organic_social_12m',
    revisions_allowed: Number(row.revisions_allowed ?? 0),
    review_sla_days: Number(row.review_sla_days ?? 5),
    participants_count: Number(row.participants_count ?? 0),
    has_joined: Boolean(row.has_joined),
    my_submission_status: row.my_submission_status ?? null,
    status: row.status ?? 'published',
    pot_value: row.pot_value == null ? null : Number(row.pot_value),
    pot_currency: row.pot_currency ?? 'BWP',
    pot_splits:
      row.pot_splits && typeof row.pot_splits === 'object'
        ? row.pot_splits
        : { '1': 0.4, '2': 0.25, '3': 0.15, '4': 0.1, '5': 0.1 },
    settled_at: row.settled_at ?? null,
    rank_score: Number(row.rank_score ?? 0),
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

  // Signed-in creators get their saved/dismissed state from the RPC itself.
  if (isSignedInToMuse()) return normalized;

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
  if (isSignedInToMuse()) {
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
  if (!isSignedInToMuse()) return setGuestOpportunityPreference(opportunityId, state);
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
  if (!isSignedInToMuse()) return restoreGuestOpportunityPreference(opportunityId);
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
  if (!isSignedInToMuse()) return 0;
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
  if (!isSignedInToMuse()) return;
  const { error } = await db.rpc('record_creator_opportunity_event', {
    p_opportunity_id: opportunityId,
    p_event_type: eventType,
    p_source: source,
  });
  if (error) throw error;
}
