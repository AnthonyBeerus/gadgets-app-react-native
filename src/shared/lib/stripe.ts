// 1 setup payment sheet
// 2 Open stripe checkout form

import { Platform } from 'react-native';
import { supabase } from './supabase';

// Only import Stripe on native platforms
let initPaymentSheet: any;
let presentPaymentSheet: any;

if (Platform.OS !== 'web') {
  const stripe = require('@stripe/stripe-react-native');
  initPaymentSheet = stripe.initPaymentSheet;
  presentPaymentSheet = stripe.presentPaymentSheet;
}

const fetchStripekeys = async (totalAmount: number) => {
  const { data, error } = await supabase.functions.invoke('stripe-checkout', {
    body: {
      totalAmount,
    },
  });

  if (error) {
    console.error("Supabase Function Error:", JSON.stringify(error, null, 2));
    throw new Error(error.message || "Failed to communicate with payment server");
  }

  return data;
};

export const setupStripePaymentSheet = async (totalAmount: number) => {
  if (Platform.OS === 'web') {
    throw new Error('Stripe is not supported on web');
  }

  // Fetch paymentIntent and publishable key from server
  const { paymentIntent, publicKey, ephemeralKey, customer } =
    await fetchStripekeys(totalAmount);

  if (!paymentIntent || !publicKey) {
    throw new Error('Failed to fetch Stripe keys');
  }

  await initPaymentSheet({
    merchantDisplayName: 'Codewithlari',
    paymentIntentClientSecret: paymentIntent,
    customerId: customer,
    customerEphemeralKeySecret: ephemeralKey,
    billingDetailsCollectionConfiguration: {
      name: 'always',
      phone: 'always',
    },
  });

  return paymentIntent;
};

export const openStripeCheckout = async () => {
  if (Platform.OS === 'web') {
    throw new Error('Stripe is not supported on web');
  }

  const { error } = await presentPaymentSheet();

  if (error) {
    if (error.code === 'Canceled') {
      return false;
    }
    throw new Error(error.message);
  }

  return true;
};
