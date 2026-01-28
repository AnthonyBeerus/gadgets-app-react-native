export const setupStripePaymentSheet = async (totalAmount: number) => {
  console.warn('Stripe is not supported on web');
  return null; 
};

export const openStripeCheckout = async () => {
  console.warn('Stripe is not supported on web');
  return false;
};
