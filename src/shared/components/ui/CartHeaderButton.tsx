import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useDesignTokens, useThemedStyles, type DesignTokens, type SemanticColors } from "../../design-system";
import { useCartStore } from "../../../store/cart-store";

function createStyles(c: SemanticColors, _tokens: DesignTokens) {
  return {
    container: {
      padding: 4,
      position: "relative" as const,
    },
    badge: {
      position: "absolute" as const,
      top: -5,
      right: -5,
      backgroundColor: c.accent,
      borderRadius: 10,
      width: 16,
      height: 16,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      borderWidth: 1,
      borderColor: c.surface,
    },
    badgeText: {
      fontSize: 10,
      color: c.surface,
      fontWeight: "bold" as const,
    },
  };
}

export const CartHeaderButton = () => {
  const styles = useThemedStyles(createStyles);
  const { colors } = useDesignTokens();
  const router = useRouter();
  const { items } = useCartStore();

  return (
    <TouchableOpacity onPress={() => router.push("/bag")} style={styles.container}>
      <Ionicons name="cart" size={24} color={colors.ink} />
      {items.length > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{items.length}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
