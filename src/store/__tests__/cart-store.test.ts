import { useCartStore } from '../cart-store';

const first = {
  id: 1,
  shopId: 10,
  shopName: 'Muse Alpha Shop',
  title: 'Creator kit',
  heroImage: '',
  price: 100,
  quantity: 1,
  maxQuantity: 2,
};

describe('cart store', () => {
  beforeEach(() => useCartStore.getState().resetCart());

  it('rejects products from another merchant', () => {
    expect(useCartStore.getState().addItem(first)).toBe('added');
    expect(useCartStore.getState().addItem({ ...first, id: 2, shopId: 11 })).toBe('merchant_conflict');
    expect(useCartStore.getState().items).toHaveLength(1);
  });

  it('never exceeds available stock', () => {
    useCartStore.getState().addItem(first);
    useCartStore.getState().addItem({ ...first, quantity: 2 });
    expect(useCartStore.getState().items[0].quantity).toBe(2);
  });

  it('replaces the cart deliberately when the shopper confirms', () => {
    useCartStore.getState().addItem(first);
    useCartStore.getState().replaceCart({ ...first, id: 2, shopId: 11 });
    expect(useCartStore.getState().items).toEqual([{ ...first, id: 2, shopId: 11 }]);
  });

  it('keeps an interrupted checkout key until the bag changes', () => {
    useCartStore.getState().addItem(first);
    useCartStore.getState().setActiveCheckoutKey('checkout-attempt-1');
    expect(useCartStore.getState().activeCheckoutKey).toBe('checkout-attempt-1');

    useCartStore.getState().incrementItem(first.id);
    expect(useCartStore.getState().activeCheckoutKey).toBeNull();
  });

  it('preserves checkout details when payment is cancelled', () => {
    useCartStore.getState().addItem(first);
    useCartStore.getState().updateCheckoutDraft({ fulfilment: 'delivery', phone: '71234567', address: 'Molapo Crossing' });
    useCartStore.getState().setPaymentFlow({ orderId: 42, status: 'cancelled' });
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().checkoutDraft).toMatchObject({ fulfilment: 'delivery', phone: '71234567' });
  });

  it('clears the matching bag only after server-confirmed completion', () => {
    useCartStore.getState().addItem(first);
    useCartStore.getState().setPaymentFlow({ orderId: 42, status: 'succeeded' });
    useCartStore.getState().clearCompletedCheckout();
    expect(useCartStore.getState().items).toEqual([]);
    expect(useCartStore.getState().paymentFlow).toBeNull();
  });
});
