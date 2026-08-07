export interface Challenge {
  id: number;
  title: string;
  description: string;
  brand_name: string;
  brand_logo_url?: string;
  reward: string;
  reward_value?: number;
  reward_currency?: string;
  deadline: string;
  participants_count: number;
  image_url: string;
  requirements: string[];
  status: 'active' | 'completed' | 'upcoming';
  type: 'free' | 'paid' | 'subscriber';
  category?: string;
  product_id?: number | null;
  shop_id?: number | null;
  manual_verification_enabled?: boolean;
  contest_mode?: 'standard' | 'competitive_pot';
  pot_value?: number | null;
  pot_currency?: string;
  pot_splits?: Record<string, number> | null;
  consolation_voucher_value?: number | null;
  settled_at?: string | null;
  score_rule?: string;
}

export type VerificationStatus =
  | 'pending'
  | 'api_verified'
  | 'manual_verification_required'
  | 'manually_verified'
  | 'failed';

export interface CreatorPlatformAccount {
  id: number;
  user_id: string;
  platform: 'tiktok';
  platform_open_id: string;
  display_name: string | null;
  avatar_url: string | null;
  profile_deep_link: string | null;
  granted_scopes: string[];
  connection_status: 'connected' | 'expired' | 'revoked';
}

export interface TikTokVideo {
  id: string;
  title?: string;
  video_description?: string;
  duration?: number;
  cover_image_url?: string;
  embed_link?: string;
  share_url: string;
  create_time?: number;
}

export interface PurchaseProof {
  id: number;
  shop_id: number;
  product_id: number;
  source: 'order' | 'merchant_code';
  consumed_by_submission_id: number | null;
  expires_at: string | null;
}

export interface ChallengeSubmission {
  id: number;
  challenge_id: number;
  user_id: string;
  purchase_proof_id: number | null;
  platform_account_id: number | null;
  platform: 'tiktok';
  platform_video_id: string | null;
  public_share_url: string;
  platform_author_open_id: string | null;
  post_description: string | null;
  post_published_at: string | null;
  verification_status: VerificationStatus;
  verified_at: string | null;
  consent_version: string;
  consented_at: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  rejection_reason?: string | null;
  created_at: string;
  like_count?: number;
  comment_count?: number;
  save_count?: number;
  view_count?: number;
  score?: number;
  metrics_captured_at?: string | null;
  final_rank?: number | null;
}

export interface ChallengeLeaderboardEntry {
  submission_id: number;
  user_id: string;
  public_share_url: string | null;
  status: string;
  like_count: number;
  comment_count: number;
  save_count: number;
  view_count: number;
  score: number;
  final_rank: number | null;
  metrics_captured_at: string | null;
}

export interface CampaignResults {
  impressions: number;
  detail_opens: number;
  saves: number;
  attributed_purchases: number;
  eligible_purchasers: number;
  connected_creators: number;
  submitted_posts: number;
  verified_posts: number;
  approved_posts: number;
  vouchers_issued: number;
  vouchers_redeemed: number;
}
