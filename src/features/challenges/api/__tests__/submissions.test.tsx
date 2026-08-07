import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from '../../../../shared/lib/supabase';
import { CONSENT_VERSION, useCampaignResults, useClaimPurchaseCode, useCreateSubmission, useRedeemVoucher, useRefreshSubmissionMetrics, useReviewSubmission, useSettleCompetitiveChallenge } from '../submissions';
import { setCreatorOpportunityPreference } from '../../../discovery/api';

jest.mock('../../../../shared/lib/supabase');
jest.mock('../../../discovery/guest-preferences', () => ({
  getGuestOpportunityPreferences: jest.fn(async () => []),
  setGuestOpportunityPreference: jest.fn(async () => undefined),
  restoreGuestOpportunityPreference: jest.fn(async () => undefined),
  clearGuestOpportunityPreferences: jest.fn(async () => undefined),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}>
    {children}
  </QueryClientProvider>
);

describe('external creator opportunity API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (supabase.rpc as jest.Mock) = jest.fn();
    (supabase.from as jest.Mock) = jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
      is: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
    }));
  });

  it('submits verified TikTok metadata without uploading media', async () => {
    (supabase.rpc as jest.Mock).mockResolvedValue({ data: { id: 7 }, error: null });
    const { result } = renderHook(() => useCreateSubmission(), { wrapper });
    await act(async () => result.current.mutateAsync({ challengeId: 1, purchaseProofId: 4,
      account: { id: 3, user_id: 'u', platform: 'tiktok', platform_open_id: 'open-1', display_name: 'Creator',
        avatar_url: null, profile_deep_link: null, granted_scopes: ['video.list'], connection_status: 'connected' },
      video: { id: 'video-1', share_url: 'https://www.tiktok.com/@creator/video/1', video_description: 'Coffee', create_time: 10 },
      consentAccepted: true }));
    expect(supabase.rpc).toHaveBeenCalledWith('submit_creator_opportunity', expect.objectContaining({
      p_purchase_proof_id: 4, p_platform_video_id: 'video-1', p_verification_status: 'api_verified',
      p_consent_version: CONSENT_VERSION,
    }));
    expect(supabase.storage.from).not.toHaveBeenCalled();
  });

  it('requires consent before calling the database', async () => {
    const { result } = renderHook(() => useCreateSubmission(), { wrapper });
    await act(async () => expect(result.current.mutateAsync({ challengeId: 1, purchaseProofId: 4,
      account: null, video: null, manualUrl: 'https://www.tiktok.com/@creator/video/1', manualHandle: '@creator',
      consentAccepted: false })).rejects.toThrow(/accept/i));
    expect(supabase.rpc).not.toHaveBeenCalled();
  });

  it('sends fallback URLs to manual verification', async () => {
    (supabase.rpc as jest.Mock).mockResolvedValue({ data: { id: 8 }, error: null });
    const { result } = renderHook(() => useCreateSubmission(), { wrapper });
    await act(async () => result.current.mutateAsync({ challengeId: 1, purchaseProofId: 4,
      account: null, video: null, manualUrl: 'https://vm.tiktok.com/test', manualHandle: '@creator', consentAccepted: true }));
    expect(supabase.rpc).toHaveBeenCalledWith('submit_creator_opportunity', expect.objectContaining({
      p_verification_status: 'manual_verification_required', p_platform_account_id: null,
    }));
  });

  it('uses the transactional admin review RPC', async () => {
    (supabase.rpc as jest.Mock).mockResolvedValue({ data: { status: 'approved', voucher_id: 5 }, error: null });
    const { result } = renderHook(() => useReviewSubmission(), { wrapper });
    await act(async () => result.current.mutateAsync({ submissionId: 7, decision: 'approved' }));
    expect(supabase.rpc).toHaveBeenCalledWith('review_creator_submission', {
      p_submission_id: 7, p_decision: 'approved', p_rejection_reason: null,
    });
  });

  it('returns the merchant growth counters', async () => {
    (supabase.rpc as jest.Mock).mockResolvedValue({ data: [{ eligible_purchasers: 10, connected_creators: 5,
      submitted_posts: 4, verified_posts: 3, approved_posts: 2, vouchers_issued: 2, vouchers_redeemed: 1 }], error: null });
    const { result } = renderHook(() => useCampaignResults(1), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.vouchers_redeemed).toBe(1);
  });

  it('claims a merchant purchase code into a purchase proof', async () => {
    (supabase.rpc as jest.Mock).mockResolvedValue({
      data: { id: 9, product_id: 2, shop_id: 1, source: 'merchant_code', consumed_by_submission_id: null },
      error: null,
    });
    const { result } = renderHook(() => useClaimPurchaseCode(), { wrapper });
    await act(async () => result.current.mutateAsync('ABC123'));
    expect(supabase.rpc).toHaveBeenCalledWith('claim_merchant_purchase_code', { p_code: 'ABC123' });
  });

  it('redeems a reward voucher at the till', async () => {
    (supabase.rpc as jest.Mock).mockResolvedValue({ data: { voucher_id: 3, redeemed: true, idempotent: false }, error: null });
    const { result } = renderHook(() => useRedeemVoucher(), { wrapper });
    await act(async () => result.current.mutateAsync('VOUCHER1'));
    expect(supabase.rpc).toHaveBeenCalledWith('redeem_reward_voucher', { p_code: 'VOUCHER1' });
  });

  it('refreshes engagement metrics for competitive scoring', async () => {
    (supabase.rpc as jest.Mock).mockResolvedValue({ data: { id: 7, score: 17 }, error: null });
    const { result } = renderHook(() => useRefreshSubmissionMetrics(), { wrapper });
    await act(async () => result.current.mutateAsync({
      submissionId: 7, likeCount: 5, commentCount: 2, saveCount: 3, viewCount: 100,
    }));
    expect(supabase.rpc).toHaveBeenCalledWith('refresh_submission_metrics', {
      p_submission_id: 7,
      p_like_count: 5,
      p_comment_count: 2,
      p_save_count: 3,
      p_view_count: 100,
    });
  });

  it('settles a competitive pot with multi-tier vouchers', async () => {
    (supabase.rpc as jest.Mock).mockResolvedValue({
      data: { challenge_id: 1, settled: true, placement_vouchers: 3, consolation_vouchers: 2 },
      error: null,
    });
    const { result } = renderHook(() => useSettleCompetitiveChallenge(), { wrapper });
    await act(async () => result.current.mutateAsync(1));
    expect(supabase.rpc).toHaveBeenCalledWith('settle_competitive_challenge', { p_challenge_id: 1 });
  });
});

describe('discover preference Save/Pass', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (supabase.rpc as jest.Mock) = jest.fn().mockResolvedValue({ data: { state: 'saved' }, error: null });
    (supabase.auth.getUser as jest.Mock) = jest.fn().mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null,
    });
  });

  it('records a saved preference through the opportunity RPC', async () => {
    await setCreatorOpportunityPreference(42, 'saved');
    expect(supabase.rpc).toHaveBeenCalledWith('set_creator_opportunity_preference', {
      p_opportunity_id: 42,
      p_state: 'saved',
    });
  });

  it('records a dismissed preference through the opportunity RPC', async () => {
    await setCreatorOpportunityPreference(42, 'dismissed');
    expect(supabase.rpc).toHaveBeenCalledWith('set_creator_opportunity_preference', {
      p_opportunity_id: 42,
      p_state: 'dismissed',
    });
  });
});
