import { supabase } from './supabase';
import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';

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
  // Fetch paymentIntent and publishable key from server
  const { paymentIntent, publicKey, ephemeralKey, customer } =
    await fetchStripekeys(totalAmount);

  if (!paymentIntent || !publicKey) {
    throw new Error('Failed to fetch Stripe keys');
  }

  const { error } = await initPaymentSheet({
    merchantDisplayName: 'Codewithlari',
    paymentIntentClientSecret: paymentIntent,
    customerId: customer,
    customerEphemeralKeySecret: ephemeralKey,
    billingDetailsCollectionConfiguration: {
      name: 'always' as 'always',
      phone: 'always' as 'always',
    },
  });

   if (error) {
     throw new Error(error.message);
   }

  return paymentIntent;
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
