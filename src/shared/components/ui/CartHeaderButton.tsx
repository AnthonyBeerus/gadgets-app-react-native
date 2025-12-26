import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { NEO_THEME } from "../../constants/neobrutalism";
import { useCartStore } from "../../../store/cart-store";

export const CartHeaderButton = () => {
  const router = useRouter();
  const { items } = useCartStore();

  return (
    <TouchableOpacity onPress={() => router.push("/cart")} style={styles.container}>
      <Ionicons name="cart" size={24} color={NEO_THEME.colors.black} />
      {items.length > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{items.length}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 4,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: NEO_THEME.colors.primary,
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "white",
  },
  badgeText: {
    fontSize: 10,
    color: "white",
    fontWeight: "bold",
  },
});
