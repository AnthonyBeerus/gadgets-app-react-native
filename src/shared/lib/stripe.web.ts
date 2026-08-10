export const setupStripePaymentSheet = async (_request: unknown) => {
  console.warn('Stripe is not supported on web');
  throw new Error('Checkout is available in the Muse mobile app.');
};

export const openStripeCheckout = async () => {
  console.warn('Stripe is not supported on web');
  return false;
};
