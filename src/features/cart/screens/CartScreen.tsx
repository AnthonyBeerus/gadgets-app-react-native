import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useCartStore } from "../../../store/cart-store";
import { createOrder, createOrderItem, updateOrder } from "../../../shared/api/api";
import { openStripeCheckout, setupStripePaymentSheet } from "../../../shared/lib/stripe";
import { AnimatedHeaderLayout } from "../../../shared/components/layout/AnimatedHeaderLayout";
import { CartItem } from "../components/CartItem";
import { NEO_THEME } from "../../../shared/constants/neobrutalism";
import { NeoButton } from "../../../shared/components/ui/neo-button";
import { useAuth } from "../../../shared/providers/auth-provider"; // Added import

import { useRouter } from "expo-router"; // Added import

export default function CartScreen() {
  const router = useRouter(); 
  const { session } = useAuth(); // Added hook
  const {
    items,
    removeItem,
    incrementItem,
    decrementItem,
    getTotalPrice,
    resetCart,
  } = useCartStore();

  const { mutateAsync: createSupabaseOrder, isPending: isCreatingOrder } = createOrder();
  const { mutateAsync: createSupabaseOrderItem } = createOrderItem();
  const { mutateAsync: updateSupabaseOrder } = updateOrder();

  const handleCheckout = async () => {
    const totalPrice = parseFloat(getTotalPrice());

    if (totalPrice <= 0) {
      Alert.alert("Cart is empty", "Please add items to your cart before checking out.");
      return;
    }

    if (!session) {
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
      // 1. Setup Payment Intent first to get the ID
      const clientSecret = await setupStripePaymentSheet(Math.floor(totalPrice * 100));
      const paymentIntentId = clientSecret?.split('_secret_')[0];

      if (!paymentIntentId) {
        throw new Error("Failed to initialize payment.");
      }

      // 2. Create Order in PENDING state immediately
      // This prevents "ghost orders" where user pays but no order is created if app crashes.
      const newOrder = await createSupabaseOrder({ 
          totalPrice,
          paymentIntentId,
          paymentStatus: 'pending'
      });

      // 3. Create Order Items linked to the pending order
      await createSupabaseOrderItem(
          items.map((item) => ({
            orderId: newOrder.id,
            productId: item.id,
            quantity: item.quantity,
          }))
      );

      // 4. Present Payment Sheet
      const paymentResult = await openStripeCheckout();

      if (!paymentResult) {
        Alert.alert("Payment Cancelled", "The payment process was cancelled.");
        return;
      }

      // 5. If Payment Succeeded, Update Order Status
      // (Ideally verify with server logic/webhook, but this is better than before)
      await updateSupabaseOrder({
        orderId: newOrder.id,
        updates: {
          status: 'Completed', // Or 'Paid' if you distinguish
          stripe_payment_status: 'succeeded'
        }
      });

      resetCart();
      router.push({ pathname: "/order-success", params: { orderId: newOrder.id } });

    } catch (error) {
      console.error(error);
      Alert.alert("Payment Failed", error instanceof Error ? error.message : "An unknown error occurred");
    }
  };


  const renderSmallTitle = () => (
    <Text style={styles.smallHeaderTitle}>MY CART</Text>
  );

  const renderLargeTitle = () => (
    <View>
      <Text style={styles.largeHeaderTitle}>MY CART</Text>
      <Text style={styles.largeHeaderSubtitle}>
        {items.length} {items.length === 1 ? "ITEM" : "ITEMS"}
      </Text>
    </View>
  );

  return (
    <AnimatedHeaderLayout
      renderSmallTitle={renderSmallTitle}
      renderLargeTitle={renderLargeTitle}
      stickyFooter={
        items.length > 0 ? (
          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>TOTAL</Text>
              <Text style={styles.totalPrice}>${getTotalPrice()}</Text>
            </View>
            
            <NeoButton 
              onPress={handleCheckout}
              disabled={isCreatingOrder}
              style={styles.checkoutButton}
            >
              {isCreatingOrder ? (
                <ActivityIndicator color={NEO_THEME.colors.white} />
              ) : (
                <Text style={styles.checkoutButtonText}>CHECKOUT</Text>
              )}
            </NeoButton>
          </View>
        ) : null
      }
    >
      <View style={styles.content}>
        {items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>YOUR CART IS EMPTY</Text>
            <Text style={styles.emptySubtext}>
              Start adding some awesome gadgets!
            </Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={removeItem}
                onIncrement={incrementItem}
                onDecrement={decrementItem}
              />
            ))}
          </View>
        )}


      </View>
    </AnimatedHeaderLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 200, // Increased padding to account for sticky footer
  },
  smallHeaderTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  largeHeaderTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  largeHeaderSubtitle: {
    fontSize: 16,
    color: NEO_THEME.colors.grey,
    marginTop: 4,
    fontWeight: "700",
    fontFamily: NEO_THEME.fonts.bold,
    textTransform: "uppercase",
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 24,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: NEO_THEME.colors.grey,
    textAlign: "center",
  },
  footer: {
    padding: 16,
    backgroundColor: NEO_THEME.colors.white,

    borderTopWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    paddingBottom: 32, // Add extra padding for bottom safe area if needed, or just visual
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: "900",
    color: NEO_THEME.colors.primary,
    fontFamily: NEO_THEME.fonts.black,
  },
  checkoutButton: {
    width: "100%",
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: "900",
    color: NEO_THEME.colors.white,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
});
