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

import { useCheckout } from "../hooks/use-checkout";

export default function CartScreen() {
  const router = useRouter(); 
  const { session } = useAuth();
  const {
    items,
    removeItem,
    incrementItem,
    decrementItem,
    getTotalPrice,
  } = useCartStore();

  const { checkout, isProcessing } = useCheckout();

  const handleCheckout = () => {
      checkout();
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
              disabled={isProcessing}
              style={styles.checkoutButton}
            >
              {isProcessing ? (
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
