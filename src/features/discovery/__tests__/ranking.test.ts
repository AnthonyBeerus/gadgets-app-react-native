import { diversifyOpportunityFeed } from '../ranking';
import type { CreatorOpportunityFeedItem } from '../types';

const item = (id: number, merchantId: number): CreatorOpportunityFeedItem => ({
  opportunity_id: id,
  opportunity_title: `Opportunity ${id}`,
  opportunity_description: 'Brief',
  requirements: [],
  deadline: '2026-12-31',
  product_id: id,
  product_slug: `product-${id}`,
  product_title: `Product ${id}`,
  product_description: null,
  hero_image: 'https://example.com/product.jpg',
  price: 100,
  max_quantity: 5,
  category_id: 1,
  merchant_id: merchantId,
  merchant_name: `Merchant ${merchantId}`,
  merchant_location: 'Gaborone',
  mall_id: 1,
  has_delivery: true,
  has_collection: true,
  reward_value: 50,
  reward_currency: 'BWP',
  preference_state: null,
  eligibility_proof_id: null,
  eligibility_consumed: false,
  rank_score: 10,
  contest_mode: 'competitive_pot',
  pot_value: 500,
  pot_currency: 'BWP',
  pot_splits: { winner: 1 },
  accepted_entry_fee: 50,
  settled_at: null,
  score_rule: 'hybrid_quality_engagement',
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
