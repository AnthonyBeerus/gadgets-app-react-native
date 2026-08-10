export type OpportunityPreferenceState = 'saved' | 'dismissed';
export type OpportunitySource = 'discover' | 'saved' | 'marketplace' | 'merchant';

export type CreatorOpportunityFeedItem = {
  opportunity_id: number;
  opportunity_title: string;
  opportunity_description: string;
  requirements: string[];
  talking_points: string[];
  dos: string[];
  donts: string[];
  deadline: string;
  hero_image: string;
  brand_asset_paths: string[];
  category: string | null;
  campaign_goal: string | null;
  content_format: 'video' | 'photo' | 'either';
  deliverable_count: number;
  video_min_seconds: number | null;
  video_max_seconds: number | null;
  usage_rights: string;
  revisions_allowed: number;
  review_sla_days: number;
  merchant_id: number;
  merchant_name: string;
  merchant_location: string;
  mall_id: number | null;
  preference_state: OpportunityPreferenceState | null;
  participants_count: number;
  has_joined: boolean;
  my_submission_status: string | null;
  status: string;
  pot_value: number | null;
  pot_currency: string;
  pot_splits: Record<string, number> | null;
  settled_at: string | null;
  rank_score: number;
  is_prototype?: boolean;
  prototype_disclaimer?: string;
};

export type SponsoredDemo = {
  id: string;
  advertiser: string;
  headline: string;
  body: string;
  badge: string;
  merchantId: number;
};

export type DiscoveryDeckEntry =
  | { kind: 'opportunity'; key: string; item: CreatorOpportunityFeedItem }
  | { kind: 'sponsored-demo'; key: string; item: SponsoredDemo };

export type GuestOpportunityPreference = {
  opportunity_id: number;
  state: OpportunityPreferenceState;
  updated_at: string;
};
