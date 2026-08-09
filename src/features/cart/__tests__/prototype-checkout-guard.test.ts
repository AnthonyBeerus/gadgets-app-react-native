import { containsPrototypeCheckoutItem } from '../prototype-checkout-guard';

describe('prototype checkout guard', () => {
  it('blocks negative-ID fixture products from payment infrastructure', () => {
    expect(containsPrototypeCheckoutItem([{ id: -101 }, { id: 12 }])).toBe(true);
    expect(containsPrototypeCheckoutItem([{ id: 11 }, { id: 12 }])).toBe(false);
  });
});
