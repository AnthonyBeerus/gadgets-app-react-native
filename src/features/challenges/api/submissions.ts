import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../shared/lib/supabase';
import {
  CampaignResults,
  ChallengeLeaderboardEntry,
  ChallengeSubmission,
  CreatorPlatformAccount,
  PurchaseProof,
  TikTokVideo,
} from '../types/challenge';

// RPC return shapes / joined selects are wider than generated Row types in places.
const db = supabase as any;

export const CONSENT_VERSION = 'muse-external-post-verification-v1';
export const CONSENT_TERMS = [
  'Muse may verify this public TikTok post and its account ownership.',
  'Muse may share the public post link and campaign result with the sponsoring merchant.',
  'The reward is for meeting the opportunity brief, never for expressing a positive opinion.',
  'The video stays on TikTok. Muse stores its public link and verification metadata, not the media file.',
];

async function invokeTikTok<T>(body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke('tiktok-creator', { body });
  if (error) throw new Error(error.message || 'TikTok request failed');
  if (data?.error) throw new Error(data.error);
  return data as T;
}

export const tiktokApi = {
  authorize: (redirectUri: string, codeChallenge: string) =>
    invokeTikTok<{ authorizationUrl: string }>({ action: 'authorize', redirectUri, codeChallenge }),
  callback: (code: string, state: string, codeVerifier: string) =>
    invokeTikTok<{ account: CreatorPlatformAccount }>({ action: 'callback', code, state, codeVerifier }),
  videos: () =>
    invokeTikTok<{ account: CreatorPlatformAccount; videos: TikTokVideo[] }>({ action: 'videos' }),
  verify: (videoId: string) =>
    invokeTikTok<{ account: CreatorPlatformAccount; video: TikTokVideo }>({ action: 'verify', videoId }),
  disconnect: () => invokeTikTok<{ disconnected: boolean }>({ action: 'disconnect' }),
};

export function useCreatorAccount() {
  return useQuery({
    queryKey: ['creatorPlatformAccount', 'tiktok'],
    queryFn: async () => {
      const { data, error } = await db.from('creator_platform_accounts').select('*')
        .eq('platform', 'tiktok').maybeSingle();
      if (error) throw error;
      return data as CreatorPlatformAccount | null;
    },
  });
}

export function useTikTokVideos(enabled: boolean) {
  return useQuery({
    queryKey: ['creatorTikTokVideos'],
    queryFn: () => tiktokApi.videos().then(result => result.videos),
    enabled,
    staleTime: 60_000,
    retry: 1,
  });
}

export function useOpportunityEligibility(challengeId: number, productId?: number | null, shopId?: number | null) {
  return useQuery({
    queryKey: ['opportunityEligibility', challengeId, productId, shopId],
    queryFn: async () => {
      const { data: qualifying, error: qualifyingError } = await db
        .from('challenge_qualifying_products')
        .select('product_id')
        .eq('challenge_id', challengeId);
      if (qualifyingError) throw qualifyingError;
      const productIds = Array.from(
        new Set([
          ...(productId ? [productId] : []),
          ...((qualifying ?? []) as Array<{ product_id: number }>).map(row => Number(row.product_id)),
        ].filter(Boolean))
      );
      if (productIds.length === 0) return [] as PurchaseProof[];

      let query = db
        .from('purchase_proofs')
        .select('*')
        .in('product_id', productIds)
        .is('consumed_by_submission_id', null)
        .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);
      if (shopId) query = query.eq('shop_id', shopId);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as PurchaseProof[];
    },
    enabled: !!challengeId && (!!productId || !!shopId),
  });
}

type SubmitInput = {
  challengeId: number;
  purchaseProofId: number;
  account: CreatorPlatformAccount | null;
  video: TikTokVideo | null;
  manualUrl?: string;
  manualHandle?: string;
  consentAccepted: boolean;
};

export function useCreateSubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: SubmitInput) => {
      if (!input.consentAccepted) throw new Error('Please accept the verification terms.');
      const isApiVerified = !!input.account && !!input.video;
      const shareUrl = input.video?.share_url ?? input.manualUrl?.trim();
      if (!shareUrl) throw new Error('Select a verified TikTok video or enter its public URL.');
      if (!/^https:\/\/(www\.)?tiktok\.com\//i.test(shareUrl) && !/^https:\/\/vm\.tiktok\.com\//i.test(shareUrl)) {
        throw new Error('Enter a public TikTok URL.');
      }
      const { data, error } = await db.rpc('submit_creator_opportunity', {
        p_challenge_id: input.challengeId,
        p_purchase_proof_id: input.purchaseProofId,
        p_platform_account_id: input.account?.id ?? null,
        p_platform_video_id: input.video?.id ?? null,
        p_public_share_url: shareUrl,
        p_platform_author_open_id: input.account?.platform_open_id ?? input.manualHandle?.trim() ?? null,
        p_post_description: input.video?.video_description ?? input.video?.title ?? null,
        p_post_published_at: input.video?.create_time ? new Date(input.video.create_time * 1000).toISOString() : null,
        p_verification_status: isApiVerified ? 'api_verified' : 'manual_verification_required',
        p_consent_version: CONSENT_VERSION,
      });
      if (error) throw new Error(error.message);
      return data as ChallengeSubmission;
    },
    onSuccess: (_data, input) => {
      queryClient.invalidateQueries({ queryKey: ['mySubmissions'] });
      queryClient.invalidateQueries({ queryKey: ['opportunityEligibility', input.challengeId] });
      queryClient.invalidateQueries({ queryKey: ['adminSubmissions'] });
    },
  });
}

export function useMySubmissions() {
  return useQuery({
    queryKey: ['mySubmissions'],
    queryFn: async () => {
      const { data, error } = await db.from('challenge_submissions').select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as ChallengeSubmission[];
    },
  });
}

export function useCreatorPayouts() {
  return useQuery({
    queryKey: ['creatorPayouts'],
    queryFn: async () => {
      const { data, error } = await db
        .from('creator_payouts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export interface AdminSubmission extends ChallengeSubmission {
  challenge: {
    id: number;
    title: string;
    reward: string;
    shop_id: number;
    product_id: number | null;
    contest_mode?: string | null;
  } | null;
}

export function useAdminSubmissions(status: ChallengeSubmission['status'] | 'all' = 'pending') {
  return useQuery({
    queryKey: ['adminSubmissions', status],
    queryFn: async () => {
      let query = db.from('challenge_submissions')
        .select('*, challenge:challenges(id,title,reward,shop_id,product_id,contest_mode)')
        .order('created_at', { ascending: false });
      if (status !== 'all') query = query.eq('status', status);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as unknown as AdminSubmission[];
    },
  });
}

export function useReviewSubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ submissionId, decision, rejectionReason }: {
      submissionId: number; decision: 'approved' | 'rejected'; rejectionReason?: string;
    }) => {
      const { data, error } = await db.rpc('review_creator_submission', {
        p_submission_id: submissionId, p_decision: decision,
        p_rejection_reason: rejectionReason?.trim() || null,
      });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSubmissions'] });
      queryClient.invalidateQueries({ queryKey: ['creatorOpportunityResults'] });
      queryClient.invalidateQueries({ queryKey: ['mySubmissions'] });
      queryClient.invalidateQueries({ queryKey: ['rewardVouchers'] });
    },
  });
}

export function useMarkManuallyVerified() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (submissionId: number) => {
      const { error } = await db.rpc('mark_submission_manually_verified', { p_submission_id: submissionId });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminSubmissions'] }),
  });
}

export function useCampaignResults(challengeId: number) {
  return useQuery({
    queryKey: ['creatorOpportunityResults', challengeId],
    queryFn: async (): Promise<CampaignResults> => {
      const { data, error } = await db.rpc('get_creator_opportunity_results', { p_challenge_id: challengeId });
      if (error) throw error;
      return data?.[0] ?? { impressions: 0, detail_opens: 0, saves: 0, attributed_purchases: 0,
        eligible_purchasers: 0, connected_creators: 0, submitted_posts: 0,
        verified_posts: 0, approved_posts: 0, vouchers_issued: 0, vouchers_redeemed: 0 };
    },
    enabled: !!challengeId,
  });
}

export function useRewardVouchers() {
  return useQuery({
    queryKey: ['rewardVouchers'],
    queryFn: async () => {
      const { data, error } = await db.from('reward_vouchers').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useRedeemVoucher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (code: string) => {
      const { data, error } = await db.rpc('redeem_reward_voucher', { p_code: code });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rewardVouchers'] }),
  });
}

export function useClaimPurchaseCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (code: string) => {
      const { data, error } = await db.rpc('claim_merchant_purchase_code', { p_code: code.trim().toUpperCase() });
      if (error) throw new Error(error.message);
      return data as PurchaseProof;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['opportunityEligibility'] }),
  });
}

export function useCreatePurchaseCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, amount, expiresAt }: { productId: number; amount: number; expiresAt: string }) => {
      const { data, error } = await db.rpc('create_merchant_purchase_code', {
        p_product_id: productId, p_amount: amount, p_expires_at: expiresAt,
      });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['merchantPurchaseCodes'] }),
  });
}

export function useMerchantPurchaseCodes() {
  return useQuery({
    queryKey: ['merchantPurchaseCodes'],
    queryFn: async () => {
      const { data, error } = await db.from('merchant_purchase_codes').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useChallengeLeaderboard(challengeId: number) {
  return useQuery({
    queryKey: ['challengeLeaderboard', challengeId],
    queryFn: async () => {
      const { data, error } = await db.rpc('get_challenge_leaderboard', { p_challenge_id: challengeId });
      if (error) throw error;
      return ((data ?? []) as any[]).map(row => ({
        submission_id: Number(row.submission_id),
        user_id: row.user_id,
        public_share_url: row.public_share_url,
        status: row.status,
        like_count: Number(row.like_count ?? 0),
        comment_count: Number(row.comment_count ?? 0),
        save_count: Number(row.save_count ?? 0),
        view_count: Number(row.view_count ?? 0),
        score: Number(row.score ?? 0),
        final_rank: row.final_rank == null ? null : Number(row.final_rank),
        metrics_captured_at: row.metrics_captured_at,
      })) as ChallengeLeaderboardEntry[];
    },
    enabled: !!challengeId,
    refetchInterval: 30_000,
  });
}

export function useRefreshSubmissionMetrics() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      submissionId: number;
      likeCount: number;
      commentCount: number;
      saveCount: number;
      viewCount?: number;
    }) => {
      const { data, error } = await db.rpc('refresh_submission_metrics', {
        p_submission_id: input.submissionId,
        p_like_count: input.likeCount,
        p_comment_count: input.commentCount,
        p_save_count: input.saveCount,
        p_view_count: input.viewCount ?? 0,
      });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (_data, input) => {
      queryClient.invalidateQueries({ queryKey: ['adminSubmissions'] });
      queryClient.invalidateQueries({ queryKey: ['challengeLeaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['mySubmissions'] });
      void input;
    },
  });
}

export function useSettleCompetitiveChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (challengeId: number) => {
      const { data, error } = await db.rpc('settle_competitive_challenge', { p_challenge_id: challengeId });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challengeLeaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['creatorOpportunityResults'] });
      queryClient.invalidateQueries({ queryKey: ['rewardVouchers'] });
      queryClient.invalidateQueries({ queryKey: ['shopChallenges'] });
      queryClient.invalidateQueries({ queryKey: ['adminSubmissions'] });
    },
  });
}
