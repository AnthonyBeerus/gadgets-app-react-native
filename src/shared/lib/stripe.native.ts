import { supabase } from './supabase';
import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';
import type { CartAttribution } from '../../store/cart-store';

type CheckoutItem = { productId: number; quantity: number };

const fetchStripeKeys = async (items: CheckoutItem[], attribution: CartAttribution | null) => {
  const { data, error } = await supabase.functions.invoke('stripe-checkout', {
    body: {
      action: 'create',
      items,
      attribution,
    },
  });

  if (error) {
    console.error("Supabase Function Error:", JSON.stringify(error, null, 2));
    throw new Error(error.message || "Failed to communicate with payment server");
  }

  return data;
};

export const setupStripePaymentSheet = async (items: CheckoutItem[], attribution: CartAttribution | null = null) => {
  // Fetch paymentIntent and publishable key from server
  const { paymentIntent, publicKey, ephemeralKey, customer, orderId, totalAmount } =
    await fetchStripeKeys(items, attribution);

  if (!paymentIntent || !publicKey) {
    throw new Error('Failed to fetch Stripe keys');
  }

  const { error } = await initPaymentSheet({
    merchantDisplayName: 'Codewithlari',
    paymentIntentClientSecret: paymentIntent,
    customerId: customer,
    customerEphemeralKeySecret: ephemeralKey,
  });

   if (error) {
     throw new Error(error.message);
   }

  return { paymentIntent, orderId: Number(orderId), totalAmount: Number(totalAmount) };
};

export const confirmStripeOrder = async (orderId: number) => {
  const { data, error } = await supabase.functions.invoke('stripe-checkout', {
    body: { action: 'confirm', orderId },
  });
  if (error || data?.error) throw new Error(data?.error || error?.message || 'Payment confirmation failed');
  return data.order;
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
