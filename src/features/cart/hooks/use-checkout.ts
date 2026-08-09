import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useCartStore } from '../../../store/cart-store';
import { useAuth } from '../../../shared/providers/auth-provider';
import { confirmStripeOrder, openStripeCheckout, setupStripePaymentSheet } from '../../../shared/lib/stripe.native';
import { containsPrototypeCheckoutItem } from '../prototype-checkout-guard';

export const useCheckout = () => {
  const router = useRouter();
  const { session } = useAuth();
  const { items, attribution, resetCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const checkout = async () => {
    if (!items.length) {
      Alert.alert('Cart is empty', 'Please add items before checking out.');
      return;
    }
    if (containsPrototypeCheckoutItem(items)) {
      Alert.alert(
        'Prototype item',
        'This alpha-preview item can be added to the bag, but it cannot enter live checkout or payment systems.',
      );
      return;
    }
    if (!session?.user) {
      Alert.alert('Login Required', 'Please login to complete your purchase.', [
        { text: 'Cancel', style: 'cancel' }, { text: 'Login', onPress: () => router.push('/auth') },
      ]);
      return;
    }
    try {
      setIsProcessing(true);
      const checkoutSession = await setupStripePaymentSheet(
        items.map(item => ({ productId: item.id, quantity: item.quantity })),
        attribution,
      );
      const paid = await openStripeCheckout();
      if (!paid) {
        Alert.alert('Payment Cancelled', 'The order remains unpaid and cannot create creator eligibility.');
        return;
      }
      const order = await confirmStripeOrder(checkoutSession.orderId);
      resetCart();
      router.push({ pathname: '/order-success', params: { orderId: order.id } });
    } catch (error) {
      console.error(error);
      Alert.alert('Payment Failed', error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return { checkout, isProcessing };
};
