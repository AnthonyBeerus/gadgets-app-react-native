export type OpportunityPreferenceState = 'saved' | 'dismissed';
export type OpportunitySource = 'discover' | 'saved' | 'marketplace' | 'merchant';
export type ContestMode = 'standard' | 'competitive_pot';

export type CreatorOpportunityFeedItem = {
  opportunity_id: number;
  opportunity_title: string;
  opportunity_description: string;
  requirements: string[];
  deadline: string;
  product_id: number;
  product_slug: string;
  product_title: string;
  product_description: string | null;
  hero_image: string;
  price: number;
  max_quantity: number;
  category_id: number;
  merchant_id: number;
  merchant_name: string;
  merchant_location: string;
  mall_id: number | null;
  has_delivery: boolean;
  has_collection: boolean;
  reward_value: number;
  reward_currency: string;
  preference_state: OpportunityPreferenceState | null;
  eligibility_proof_id: number | null;
  eligibility_consumed: boolean;
  rank_score: number;
  contest_mode: ContestMode;
  pot_value: number | null;
  pot_currency: string;
  pot_splits: Record<string, number> | null;
  accepted_entry_fee: number;
  settled_at: string | null;
  score_rule: 'hybrid_quality_engagement';
};

export type GuestOpportunityPreference = {
  opportunity_id: number;
  state: OpportunityPreferenceState;
  updated_at: string;
};
