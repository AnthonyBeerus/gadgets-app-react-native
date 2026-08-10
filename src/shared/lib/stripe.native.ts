import { supabase } from './supabase';
import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';
import type { CreateCheckoutRequest, CreateCheckoutResponse } from '../../features/cart/api/checkout-contract';

const fetchStripeKeys = async (request: CreateCheckoutRequest): Promise<CreateCheckoutResponse> => {
  const { data, error } = await supabase.functions.invoke('stripe-checkout', {
    body: request,
  });

  if (error) {
    console.error("Supabase Function Error:", JSON.stringify(error, null, 2));
    throw new Error(error.message || "Failed to communicate with payment server");
  }

  return data;
};

export const setupStripePaymentSheet = async (request: CreateCheckoutRequest) => {
  // Fetch paymentIntent and publishable key from server
  const { paymentIntent, publicKey, ephemeralKey, customer, orderId, totalMinor, paymentStatus } =
    await fetchStripeKeys(request);

  if (paymentStatus === 'succeeded') {
    return { paymentIntent, orderId: Number(orderId), totalAmount: Number(totalMinor), paymentStatus };
  }
  if (['failed', 'cancelled', 'refunded'].includes(paymentStatus)) {
    throw new Error('This payment attempt has ended. Start a new checkout attempt.');
  }

  if (!paymentIntent || !publicKey) {
    throw new Error('Failed to fetch Stripe keys');
  }

  const { error } = await initPaymentSheet({
    merchantDisplayName: 'Muse Alpha Shop',
    paymentIntentClientSecret: paymentIntent,
    customerId: customer,
    customerEphemeralKeySecret: ephemeralKey,
  });

   if (error) {
     throw new Error(error.message);
   }

  return { paymentIntent, orderId: Number(orderId), totalAmount: Number(totalMinor), paymentStatus };
};

export const openStripeCheckout = async () => {
  const { error } = await presentPaymentSheet();

  if (error) {
    if (error.code === 'Canceled') {
      return false;
    }
    throw new Error(error.message);
  }

  return true;
};

export const initializeChallengePaymentSheet = initPaymentSheet;
export const presentChallengePaymentSheet = presentPaymentSheet;
