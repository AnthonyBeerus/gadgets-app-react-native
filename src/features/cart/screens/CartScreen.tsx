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
import { FlashList } from "@shopify/flash-list";
import { useCartStore } from "../../../store/cart-store";
import { AnimatedHeaderLayout } from "../../../shared/components/layout/AnimatedHeaderLayout";
import { CartItem } from "../components/CartItem";
import { NEO_THEME } from "../../../shared/constants/neobrutalism";
import { NuviaButton } from "../../../shared/components/ui/nuvia-button";
import { NuviaText } from "../../../components/atoms/nuvia-text";
import { useAuth } from "../../../shared/providers/auth-provider";

import { useRouter } from "expo-router"; // Added import
import { useCheckout } from "../hooks/use-checkout";

// Fix for missing estimatedItemSize inside FlashListProps
const FlashListFixed = FlashList as unknown as <T>(props: React.ComponentProps<typeof FlashList<T>> & { estimatedItemSize: number }) => React.ReactElement;

export default function CartScreen() {
  const router = useRouter(); 
  const { session } = useAuth();
  const {
    items,
    removeItem,
    incrementItem,
    decrementItem,
    getTotalPrice,
    resetCart,
  } = useCartStore();

  const { checkout, isProcessing } = useCheckout();

  const handleCheckout = () => {
      checkout();
  };


  const renderSmallTitle = () => (
    <NuviaText variant="label">MY CART</NuviaText>
  );

  const renderLargeTitle = () => (
    <View>
      <NuviaText variant="display">MY CART</NuviaText>
      <NuviaText variant="label" color={NEO_THEME.colors.grey}>
        {items.length} {items.length === 1 ? "ITEM" : "ITEMS"}
      </NuviaText>
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
              <NuviaText variant="h3">TOTAL</NuviaText>
              <NuviaText variant="display" color={NEO_THEME.colors.primary}>
                ${getTotalPrice()}
              </NuviaText>
            </View>
            
            <NuviaButton 
              onPress={handleCheckout}
              disabled={isProcessing}
              variant="primary"
              style={styles.checkoutButton}
            >
              {isProcessing ? (
                <ActivityIndicator color={NEO_THEME.colors.white} />
              ) : (
                <NuviaText variant="label" color={NEO_THEME.colors.white}>
                    CHECKOUT
                </NuviaText>
              )}
            </NuviaButton>
          </View>
        ) : null
      }
    >
      <View style={styles.content}>
        {items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <NuviaText variant="h2">YOUR CART IS EMPTY</NuviaText>
            <NuviaText variant="body" color={NEO_THEME.colors.grey} style={{ textAlign: "center", marginTop: 8 }}>
              Start adding some awesome gadgets!
            </NuviaText>
          </View>
        ) : (
          <View style={{ flex: 1, minHeight: 2 }}>
            <FlashListFixed<any>
              data={items}
              renderItem={({ item }) => (
                <CartItem
                  item={item}
                  onRemove={removeItem}
                  onIncrement={incrementItem}
                  onDecrement={decrementItem}
                />
              )}
              estimatedItemSize={120}
              contentContainerStyle={styles.listContainer}
            />
          </View>
        )}
      </View>
    </AnimatedHeaderLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 200,
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    padding: 16,
    backgroundColor: NEO_THEME.colors.white,
    borderTopWidth: 2,
    borderColor: NEO_THEME.colors.black,
    paddingBottom: 32,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  checkoutButton: {
    width: "100%",
  },
});
