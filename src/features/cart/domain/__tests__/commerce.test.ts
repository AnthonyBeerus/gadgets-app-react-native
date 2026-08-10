import { calculateCheckoutTotals, canShowCollectionQr, isBotswanaPhone } from '../commerce';

describe('commerce rules', () => {
  it('adds a per-shop delivery fee only for delivery', () => {
    const items = [{ price: 49.95, quantity: 2 }];

    expect(calculateCheckoutTotals(items, 'delivery', 25)).toEqual({
      subtotalMinor: 9990,
      deliveryFeeMinor: 2500,
      totalMinor: 12490,
      currency: 'BWP',
    });
    expect(calculateCheckoutTotals(items, 'collection', 25).deliveryFeeMinor).toBe(0);
  });

  it('accepts local and international Botswana phone formats', () => {
    expect(isBotswanaPhone('71 234 567')).toBe(true);
    expect(isBotswanaPhone('+267 31 234 567')).toBe(true);
    expect(isBotswanaPhone('11 234 567')).toBe(false);
  });

  it('shows a QR only for a paid collection ready for handover', () => {
    expect(canShowCollectionQr({
      fulfilmentType: 'collection',
      orderStatus: 'ready_for_collection',
      paymentStatus: 'succeeded',
    })).toBe(true);
    expect(canShowCollectionQr({
      fulfilmentType: 'delivery',
      orderStatus: 'ready_for_collection',
      paymentStatus: 'succeeded',
    })).toBe(false);
  });
});
