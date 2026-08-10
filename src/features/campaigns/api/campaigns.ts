import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { supabase } from '../../../shared/lib/supabase';
import { useAuth } from '../../../shared/providers/auth-provider';
import type { CampaignStatus } from '../domain/campaign-status';
import type { CampaignFormValues } from '../domain/campaign-schema';

export type Campaign = {
  id: number;
  shop_id: number | null;
  title: string;
  description: string;
  brand_name: string;
  brand_logo_url: string | null;
  image_url: string;
  brand_asset_paths: string[];
  category: string | null;
  campaign_goal: string | null;
  content_format: 'video' | 'photo' | 'either';
  deliverable_count: number;
  video_min_seconds: number | null;
  video_max_seconds: number | null;
  requirements: string[];
  talking_points: string[];
  dos: string[];
  donts: string[];
  usage_rights: string;
  revisions_allowed: number;
  review_sla_days: number;
  deadline: string;
  pot_value: number | null;
  pot_currency: string;
  pot_splits: Record<string, number>;
  status: CampaignStatus;
  published_at: string | null;
  closed_at: string | null;
  settled_at: string | null;
  created_at: string | null;
};

export type CampaignResults = {
  challenge_id: number;
  entries: number;
  submitted: number;
  revision_requested: number;
  approved: number;
  rejected: number;
  winners: number;
};

const db = () => supabase as any;

export const campaignKeys = {
  all: ['campaigns'] as const,
  merchantList: (shopId: number | null) => ['campaigns', 'merchant', shopId] as const,
  detail: (id: number) => ['campaigns', 'detail', id] as const,
  results: (id: number) => ['campaigns', 'results', id] as const,
};

/** Every campaign owned by the signed-in merchant's shop, newest first. */
export function useMerchantCampaigns() {
  const { merchantShopId } = useAuth();
  return useQuery({
    queryKey: campaignKeys.merchantList(merchantShopId),
    enabled: merchantShopId != null,
    queryFn: async (): Promise<Campaign[]> => {
      const { data, error } = await db()
        .from('challenges')
        .select('*')
        .eq('shop_id', merchantShopId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as Campaign[];
    },
  });
}

export function useCampaign(id: number | null) {
  return useQuery({
    queryKey: campaignKeys.detail(id ?? 0),
    enabled: id != null,
    queryFn: async (): Promise<Campaign> => {
      const { data, error } = await db().from('challenges').select('*').eq('id', id).single();
      if (error) throw error;
      return data as Campaign;
    },
  });
}

export function useCampaignResults(id: number | null) {
  return useQuery({
    queryKey: campaignKeys.results(id ?? 0),
    enabled: id != null,
    queryFn: async (): Promise<CampaignResults> => {
      const { data, error } = await db().rpc('get_campaign_results', { p_challenge_id: id });
      if (error) throw error;
      return data as CampaignResults;
    },
  });
}

function toRow(values: CampaignFormValues, shopId: number, brandName: string) {
  return {
    shop_id: shopId,
    brand_name: brandName,
    title: values.title,
    description: values.description,
    campaign_goal: values.campaignGoal,
    category: values.category ?? null,
    content_format: values.contentFormat,
    deliverable_count: values.deliverableCount,
    video_min_seconds: values.contentFormat === 'photo' ? null : (values.videoMinSeconds ?? null),
    video_max_seconds: values.contentFormat === 'photo' ? null : (values.videoMaxSeconds ?? null),
    talking_points: values.talkingPoints,
    dos: values.dos,
    donts: values.donts,
    // `requirements` predates the structured brief; keep it populated so older readers
    // and the creator card still show something useful.
    requirements: [...values.talkingPoints, ...values.dos],
    brand_asset_paths: values.brandAssetPaths,
    image_url: values.imageUrl,
    usage_rights: values.usageRights,
    revisions_allowed: values.revisionsAllowed,
    review_sla_days: values.reviewSlaDays,
    deadline: values.deadline.toISOString(),
    pot_value: values.potValue,
    pot_currency: values.potCurrency,
    reward: `${values.potCurrency} ${values.potValue}`,
    reward_value: values.potValue,
    reward_currency: values.potCurrency,
  };
}

export function useSaveCampaignDraft() {
  const { merchantShopId, user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, values }: { id: number | null; values: CampaignFormValues }) => {
      if (merchantShopId == null) throw new Error('Open a shop before creating a campaign');
      const row = toRow(values, merchantShopId, user?.full_name ?? 'Muse merchant');

      if (id == null) {
        const { data, error } = await db()
          .from('challenges')
          .insert({ ...row, status: 'draft' })
          .select()
          .single();
        if (error) throw error;
        return data as Campaign;
      }

      const { data, error } = await db()
        .from('challenges')
        .update(row)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Campaign;
    },
    onSuccess: campaign => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.merchantList(merchantShopId) });
      queryClient.setQueryData(campaignKeys.detail(campaign.id), campaign);
    },
  });
}

function useCampaignRpc<TResult>(rpc: string) {
  const { merchantShopId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (challengeId: number): Promise<TResult> => {
      const { data, error } = await db().rpc(rpc, { p_challenge_id: challengeId });
      if (error) throw error;
      return data as TResult;
    },
    onSuccess: (_data, challengeId) => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.detail(challengeId) });
      queryClient.invalidateQueries({ queryKey: campaignKeys.results(challengeId) });
      queryClient.invalidateQueries({ queryKey: campaignKeys.merchantList(merchantShopId) });
    },
  });
}

export const usePublishCampaign = () => useCampaignRpc<Campaign>('publish_campaign');
export const useCloseCampaign = () => useCampaignRpc<Campaign>('close_campaign');
export const useSettleCampaign = () =>
  useCampaignRpc<{ challenge_id: number; settled: boolean; vouchers_issued: number }>(
    'settle_campaign',
  );

export type WinnerPreview = {
  challenge_id: number;
  pot_value: number;
  currency: string;
  winners: { rank: number; submission_id: number; user_id: string; prize_value: number }[];
};

export function useSelectCampaignWinners() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      challengeId,
      rankedSubmissionIds,
    }: {
      challengeId: number;
      rankedSubmissionIds: number[];
    }): Promise<WinnerPreview> => {
      const { data, error } = await db().rpc('select_campaign_winners', {
        p_challenge_id: challengeId,
        p_ranked_submission_ids: rankedSubmissionIds,
      });
      if (error) throw error;
      return data as WinnerPreview;
    },
    onSuccess: (_data, { challengeId }) => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.results(challengeId) });
      queryClient.invalidateQueries({ queryKey: ['submissions', challengeId] });
    },
  });
}
