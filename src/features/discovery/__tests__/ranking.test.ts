import { diversifyOpportunityFeed } from '../ranking';
import type { CreatorOpportunityFeedItem } from '../types';

const item = (id: number, merchantId: number): CreatorOpportunityFeedItem => ({
  opportunity_id: id,
  opportunity_title: `Campaign ${id}`,
  opportunity_description: 'Brief',
  requirements: [],
  talking_points: [],
  dos: [],
  donts: [],
  deadline: '2026-12-31',
  hero_image: 'https://example.com/cover.jpg',
  brand_asset_paths: [],
  category: null,
  campaign_goal: 'ugc_library',
  content_format: 'video',
  deliverable_count: 1,
  video_min_seconds: 15,
  video_max_seconds: 60,
  usage_rights: 'organic_social_12m',
  revisions_allowed: 1,
  review_sla_days: 5,
  merchant_id: merchantId,
  merchant_name: `Merchant ${merchantId}`,
  merchant_location: 'Gaborone',
  mall_id: 1,
  preference_state: null,
  participants_count: 0,
  has_joined: false,
  my_submission_status: null,
  status: 'published',
  pot_value: 500,
  pot_currency: 'BWP',
  pot_splits: { '1': 1 },
  settled_at: null,
  rank_score: 10,
});

describe('diversifyOpportunityFeed', () => {
  it('does not allow more than two consecutive cards from one merchant when alternatives exist', () => {
    const result = diversifyOpportunityFeed([
      item(1, 1), item(2, 1), item(3, 1), item(4, 2), item(5, 3), item(6, 1),
    ]);
    for (let index = 2; index < result.length; index += 1) {
      const merchants = result.slice(index - 2, index + 1).map(entry => entry.merchant_id);
      expect(new Set(merchants).size).toBeGreaterThan(1);
    }
  });

  it('uses the fourth slot to explore a less represented merchant', () => {
    const result = diversifyOpportunityFeed([
      item(1, 1), item(2, 1), item(3, 2), item(4, 1), item(5, 3), item(6, 1),
    ]);
    expect(result[3].merchant_id).toBe(3);
  });

  it('preserves every opportunity without mutating the input', () => {
    const source = [item(1, 1), item(2, 2), item(3, 3)];
    const copy = [...source];
    const result = diversifyOpportunityFeed(source);
    expect(source).toEqual(copy);
    expect(result.map(entry => entry.opportunity_id).sort()).toEqual([1, 2, 3]);
  });
});
