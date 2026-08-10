import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { useCartStore } from '../../../store/cart-store';
import { useAuth } from '../../../shared/providers/auth-provider';
import { containsPrototypeCheckoutItem } from '../prototype-checkout-guard';

export const useCheckout = () => {
  const router = useRouter();
  const { session } = useAuth();
  const { items } = useCartStore();

  const checkout = () => {
    if (!items.length) {
      Alert.alert('Bag is empty', 'Add an item before checking out.');
      return;
    }
    if (containsPrototypeCheckoutItem(items) || items.some(item => item.shopId < 1)) {
      Alert.alert(
        'Illustrative item',
        'This Alpha Preview item demonstrates the opportunity, but only Muse Alpha Shop products can enter sandbox checkout.',
      );
      return;
    }
    if (!session?.user) {
      Alert.alert('Sign in to continue', 'Your bag will be waiting after authentication.', [
        { text: 'Not now', style: 'cancel' },
        { text: 'Sign in', onPress: () => router.push({ pathname: '/auth', params: { returnTo: '/checkout' } }) },
      ]);
      return;
    }
    router.push('/checkout');
  };

  return { checkout, isProcessing: false };
};
