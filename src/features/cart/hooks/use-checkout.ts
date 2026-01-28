
import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useCartStore } from '../../../store/cart-store';
import { useAuth } from '../../../shared/providers/auth-provider';
import { setupStripePaymentSheet, openStripeCheckout } from '../../../shared/lib/stripe.native';
import { createOrder, createOrderItem, updateOrder } from '../../../shared/api/api'; 

export const useCheckout = () => {
  const router = useRouter();
  const { session } = useAuth();
  const { items, getTotalPrice, resetCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Use direct Supabase mutations
  const { mutateAsync: createNewOrder } = createOrder();
  const { mutateAsync: createOrderItems } = createOrderItem();
  const { mutateAsync: updateOrderStatus } = updateOrder();

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

      // 1. Setup Payment Intent first to ensure we can pay
      const clientSecret = await setupStripePaymentSheet(Math.floor(totalPrice * 100));
      const paymentIntentId = clientSecret?.split('_secret_')[0];

      if (!paymentIntentId) {
        throw new Error("Failed to initialize payment.");
      }

      // 2. Create Order directly in Supabase
      const newOrder = await createNewOrder({
        totalPrice,
        paymentIntentId,
        paymentStatus: 'pending'
      });

      if (!newOrder) throw new Error("Failed to create order");

      // 3. Create Order Items
      await createOrderItems(items.map(item => ({
        orderId: newOrder.id,
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      })));

      // 4. Present Payment Sheet
      const paymentResult = await openStripeCheckout();

      if (!paymentResult) {
        Alert.alert("Payment Cancelled", "The payment process was cancelled.");
        return;
      }

      // 5. Update Order Status on success
      await updateOrderStatus({
        orderId: newOrder.id,
        updates: {
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
    isProcessing
  };
};
