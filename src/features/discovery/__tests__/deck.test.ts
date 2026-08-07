import { injectDiscoverAdSlots } from '../deck';
import type { CreatorOpportunityFeedItem } from '../types';

const item = (id: number): CreatorOpportunityFeedItem => ({
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
  merchant_id: id,
  merchant_name: `Merchant ${id}`,
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
  pot_value: 1000,
  pot_currency: 'BWP',
  pot_splits: { '1': 0.4, '2': 0.25, '3': 0.15, '4': 0.1, '5': 0.1 },
  consolation_voucher_value: 30,
  settled_at: null,
  score_rule: 'engagement_quality',
});

describe('injectDiscoverAdSlots', () => {
  it('inserts an ad after every N opportunities', () => {
    const deck = injectDiscoverAdSlots([item(1), item(2), item(3), item(4), item(5), item(6)], 5);
    expect(deck.map(entry => entry.kind)).toEqual([
      'opportunity',
      'opportunity',
      'opportunity',
      'opportunity',
      'opportunity',
      'ad',
      'opportunity',
    ]);
  });

  it('returns opportunities only when the deck is shorter than the interval', () => {
    const deck = injectDiscoverAdSlots([item(1), item(2)], 5);
    expect(deck.every(entry => entry.kind === 'opportunity')).toBe(true);
  });
});
