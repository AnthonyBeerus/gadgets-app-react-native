import React from "react";
import {
  View,
  ActivityIndicator,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useCartStore } from "../../../store/cart-store";
import { AnimatedHeaderLayout } from "../../../shared/components/layout/AnimatedHeaderLayout";
import { CartItem } from "../components/CartItem";
import { useDesignTokens, useThemedStyles, type DesignTokens, type SemanticColors } from "../../../shared/design-system";
import { NuviaButton } from "../../../shared/components/ui/nuvia-button";
import { NuviaText } from "../../../components/atoms/nuvia-text";
import { useAuth } from "../../../shared/providers/auth-provider";

import { useRouter } from "expo-router";
import { useCheckout } from "../hooks/use-checkout";

const FlashListFixed = FlashList as unknown as <T>(props: React.ComponentProps<typeof FlashList<T>> & { estimatedItemSize: number }) => React.ReactElement;

function createStyles(c: SemanticColors, _tokens: DesignTokens) {
  return {
    content: {
      paddingBottom: 200,
    },
    listContainer: {
      padding: 16,
    },
    emptyContainer: {
      padding: 40,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },
    footer: {
      padding: 16,
      backgroundColor: c.surface,
      borderTopWidth: 1,
      borderColor: c.border,
      paddingBottom: 32,
    },
    totalContainer: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      marginBottom: 16,
    },
    checkoutButton: {
      width: "100%" as const,
    },
  };
}

export default function CartScreen() {
  const styles = useThemedStyles(createStyles);
  const { colors } = useDesignTokens();
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
      <NuviaText variant="label" color={colors.inkMuted}>
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
              <NuviaText variant="display" color={colors.ink}>
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
                <ActivityIndicator color={colors.surface} />
              ) : (
                <NuviaText variant="label" color={colors.surface}>
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
            <NuviaText variant="body" color={colors.inkMuted} style={{ textAlign: "center", marginTop: 8 }}>
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
