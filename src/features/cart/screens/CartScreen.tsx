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
import { createOrder, createOrderItem } from "../../../shared/api/api";
import { openStripeCheckout, setupStripePaymentSheet } from "../../../shared/lib/stripe";
import { AnimatedHeaderLayout } from "../../../shared/components/layout/AnimatedHeaderLayout";
import { CartItem } from "../components/CartItem";
import { NEO_THEME } from "../../../shared/constants/neobrutalism";
import { NeoButton } from "../../../shared/components/ui/neo-button";

export default function CartScreen() {
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

  const handleCheckout = async () => {
    const totalPrice = parseFloat(getTotalPrice());

    if (totalPrice <= 0) {
      Alert.alert("Cart is empty", "Please add items to your cart before checking out.");
      return;
    }

    try {
      await setupStripePaymentSheet(Math.floor(totalPrice * 100));

      const result = await openStripeCheckout();

      if (!result) {
        Alert.alert("Payment Cancelled", "The payment process was cancelled.");
        return;
      }

      await createSupabaseOrder(
        { totalPrice },
        {
          onSuccess: (data) => {
            createSupabaseOrderItem(
              items.map((item) => ({
                orderId: data.id,
                productId: item.id,
                quantity: item.quantity,
              })),
              {
                onSuccess: () => {
                  Alert.alert("Success", "Order created successfully!");
                  resetCart();
                },
              }
            );
          },
        }
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while creating the order.");
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

        {items.length > 0 && (
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
        )}
      </View>
    </AnimatedHeaderLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingBottom: 100,
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
