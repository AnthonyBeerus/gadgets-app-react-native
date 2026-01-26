
import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../../shared/api/client';
import { useCartStore } from '../../../store/cart-store';
import { useAuth } from '../../../shared/providers/auth-provider';
import { setupStripePaymentSheet, openStripeCheckout } from '../../../shared/lib/stripe';
import { updateOrder } from '../../../shared/api/api'; // Keeping legacy update for now

export const useCheckout = () => {
  const router = useRouter();
  const { session } = useAuth();
  const { items, getTotalPrice, resetCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const { mutateAsync: legacyUpdateOrder } = updateOrder();

  const createOrderMutation = useMutation({
    mutationFn: async (data: {
      totalPrice: number;
      paymentIntentId: string;
      userId: string;
      items: { productId: number; quantity: number }[];
    }) => {
      return apiClient.post<{ id: number; slug: string }>('/orders', data);
    },
  });

  const checkout = async () => {
    const totalPrice = parseFloat(getTotalPrice());

    if (totalPrice <= 0) {
      Alert.alert("Cart is empty", "Please add items to your cart before checking out.");
      return;
    }

    if (!session?.user) {
      Alert.alert(
        "Login Required", 
        "Please login to complete your purchase.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Login", onPress: () => router.push("/auth") }
        ]
      );
      return;
    }

    try {
      setIsProcessing(true);

      // 1. Setup Payment Intent
      const clientSecret = await setupStripePaymentSheet(Math.floor(totalPrice * 100));
      const paymentIntentId = clientSecret?.split('_secret_')[0];

      if (!paymentIntentId) {
        throw new Error("Failed to initialize payment.");
      }

      // 2. Create Order via API (BFF)
      const newOrder = await createOrderMutation.mutateAsync({
        totalPrice,
        paymentIntentId,
        userId: session.user.id,
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      });

      // 3. Present Payment Sheet
      const paymentResult = await openStripeCheckout();

      if (!paymentResult) {
        Alert.alert("Payment Cancelled", "The payment process was cancelled.");
        return;
      }

      // 4. Update Order Status (Legacy for now, or strictly Phase 4 scope is Creation?)
      // We will perform the update using the existing method to ensure flow completion 
      // without over-engineering Phase 4 if PATCH isn't explicitly required yet.
      // But purely for "BFF", we shouldn't use direct DB updates. 
      // I'll stick to legacy update for this step to minimize success-path risk, 
      // but creation is now fully API driven.
      await legacyUpdateOrder({
        orderId: newOrder.id,
        updates: {
          status: 'Completed',
          stripe_payment_status: 'succeeded'
        }
      });

      resetCart();
      router.push({ pathname: "/order-success", params: { orderId: newOrder.id } });

    } catch (error) {
       console.error(error);
       Alert.alert("Payment Failed", error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    checkout,
    isProcessing: isProcessing || createOrderMutation.isPending
  };
};
