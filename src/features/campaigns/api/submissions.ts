import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { supabase } from '../../../shared/lib/supabase';
import { useAuth } from '../../../shared/providers/auth-provider';
import type { SubmissionStatus } from '../domain/campaign-status';
import type { UploadedAsset } from '../media/useAssetUpload';

export const CONSENT_VERSION = 'muse-campaign-content-rights-v1';

export type Submission = {
  id: number;
  challenge_id: number;
  user_id: string;
  status: SubmissionStatus;
  asset_paths: string[];
  asset_meta: { mime?: string; bytes?: number; duration_seconds?: number }[];
  thumbnail_path: string | null;
  media_type: 'video' | 'image' | null;
  caption: string | null;
  public_share_url: string | null;
  merchant_note: string | null;
  rejection_reason: string | null;
  revision_count: number;
  final_rank: number | null;
  submitted_at: string | null;
  reviewed_at: string | null;
  created_at: string;
};

export type SubmissionWithCreator = Submission & {
  creator: { id: string; full_name: string | null; avatar_url: string | null } | null;
};

const db = () => supabase as any;

export const submissionKeys = {
  forCampaign: (challengeId: number) => ['submissions', challengeId] as const,
  mine: (userId: string | null) => ['submissions', 'mine', userId] as const,
  myEntry: (challengeId: number, userId: string | null) =>
    ['submissions', 'mine', challengeId, userId] as const,
};

/** Merchant review queue for one campaign. */
export function useCampaignSubmissions(challengeId: number | null) {
  return useQuery({
    queryKey: submissionKeys.forCampaign(challengeId ?? 0),
    enabled: challengeId != null,
    queryFn: async (): Promise<SubmissionWithCreator[]> => {
      const { data, error } = await db()
        .from('challenge_submissions')
        .select('*, creator:users!challenge_submissions_user_id_fkey(id, full_name, avatar_url)')
        .eq('challenge_id', challengeId)
        .neq('status', 'draft')
        .order('submitted_at', { ascending: true });
      if (error) throw error;
      return (data ?? []) as SubmissionWithCreator[];
    },
  });
}

/** Everything the signed-in creator has entered, for the status tracker. */
export function useMyEntries() {
  const { user } = useAuth();
  return useQuery({
    queryKey: submissionKeys.mine(user?.id ?? null),
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await db()
        .from('challenge_submissions')
        .select(
          '*, campaign:challenges(id, title, brand_name, image_url, deadline, status, pot_value, pot_currency), voucher:reward_vouchers(code, value, currency, placement_rank)',
        )
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as (Submission & {
        campaign: {
          id: number;
          title: string;
          brand_name: string;
          image_url: string;
          deadline: string;
          status: string;
          pot_value: number | null;
          pot_currency: string;
        } | null;
        voucher: { code: string; value: number; currency: string; placement_rank: number | null }[];
      })[];
    },
  });
}

export function useMyEntry(challengeId: number | null) {
  const { user } = useAuth();
  return useQuery({
    queryKey: submissionKeys.myEntry(challengeId ?? 0, user?.id ?? null),
    enabled: challengeId != null && Boolean(user?.id),
    queryFn: async (): Promise<Submission | null> => {
      const { data, error } = await db()
        .from('challenge_submissions')
        .select('*')
        .eq('challenge_id', challengeId)
        .eq('user_id', user!.id)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as Submission | null;
    },
  });
}

export function useJoinCampaign() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (challengeId: number): Promise<Submission> => {
      const { data, error } = await db().rpc('join_campaign', { p_challenge_id: challengeId });
      if (error) throw error;
      return data as Submission;
    },
    onSuccess: (_data, challengeId) => {
      queryClient.invalidateQueries({ queryKey: submissionKeys.myEntry(challengeId, user?.id ?? null) });
      queryClient.invalidateQueries({ queryKey: submissionKeys.mine(user?.id ?? null) });
      queryClient.invalidateQueries({ queryKey: ['opportunity-feed'] });
    },
  });
}

export function useSubmitEntry() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      challengeId,
      assets,
      caption,
      publicShareUrl,
    }: {
      challengeId: number;
      assets: UploadedAsset[];
      caption?: string;
      publicShareUrl?: string;
    }): Promise<Submission> => {
      const { data, error } = await db().rpc('submit_campaign_entry', {
        p_challenge_id: challengeId,
        p_asset_paths: assets.map(a => a.path),
        p_asset_meta: assets.map(a => ({
          mime: a.mimeType,
          bytes: a.bytes ?? null,
          duration_seconds: a.durationSeconds ?? null,
          width: a.width ?? null,
          height: a.height ?? null,
        })),
        p_caption: caption ?? null,
        p_public_share_url: publicShareUrl ?? null,
        p_consent_version: CONSENT_VERSION,
      });
      if (error) throw error;
      return data as Submission;
    },
    onSuccess: (_data, { challengeId }) => {
      queryClient.invalidateQueries({ queryKey: submissionKeys.myEntry(challengeId, user?.id ?? null) });
      queryClient.invalidateQueries({ queryKey: submissionKeys.mine(user?.id ?? null) });
      queryClient.invalidateQueries({ queryKey: submissionKeys.forCampaign(challengeId) });
    },
  });
}

export type ReviewDecision = 'approved' | 'rejected' | 'revision_requested';

export function useReviewSubmission(challengeId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      submissionId,
      decision,
      note,
    }: {
      submissionId: number;
      decision: ReviewDecision;
      note?: string;
    }): Promise<Submission> => {
      const { data, error } = await db().rpc('review_campaign_submission', {
        p_submission_id: submissionId,
        p_decision: decision,
        p_note: note ?? null,
      });
      if (error) throw error;
      return data as Submission;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: submissionKeys.forCampaign(challengeId) });
      queryClient.invalidateQueries({ queryKey: ['campaigns', 'results', challengeId] });
    },
  });
}
