export const setupStripePaymentSheet = async (
  _items: Array<{ productId: number; quantity: number }>,
  _attribution?: unknown,
) => {
  console.warn('Stripe is not supported on web');
  throw new Error('Checkout is available in the Muse mobile app.');
};

export const confirmStripeOrder = async (_orderId: number) => {
  throw new Error('Checkout is available in the Muse mobile app.');
};

export const openStripeCheckout = async () => {
  console.warn('Stripe is not supported on web');
  return false;
};
