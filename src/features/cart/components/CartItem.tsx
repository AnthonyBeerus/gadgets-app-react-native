import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { NEO_THEME } from "../../../shared/constants/neobrutalism";
import { NuviaText } from "../../../components/atoms/nuvia-text";


type CartItemType = {
  id: number;
  title: string;
  heroImage: string;
  price: number;
  quantity: number;
  maxQuantity: number;
};

type CartItemProps = {
  item: CartItemType;
  onRemove: (id: number) => void;
  onIncrement: (id: number) => void;
  onDecrement: (id: number) => void;
};

export const CartItem = ({
  item,
  onDecrement,
  onIncrement,
  onRemove,
}: CartItemProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image source={item.heroImage} style={styles.image} contentFit="cover" />
        </View>

        <View style={styles.details}>
          <NuviaText variant="bodyBold" numberOfLines={2}>
            {item.title}
          </NuviaText>
          <NuviaText variant="h3" color={NEO_THEME.colors.primary}>
            ${item.price.toFixed(2)}
          </NuviaText>

          <View style={styles.actions}>
            <View style={styles.quantityControl}>
              <TouchableOpacity
                onPress={() => onDecrement(item.id)}
                style={styles.quantityButton}
              >
                <Ionicons name="remove" size={16} color={NEO_THEME.colors.black} />
              </TouchableOpacity>
              
              <View style={styles.quantityValue}>
                <NuviaText variant="label">{item.quantity}</NuviaText>
              </View>

              <TouchableOpacity
                onPress={() => onIncrement(item.id)}
                style={styles.quantityButton}
              >
                <Ionicons name="add" size={16} color={NEO_THEME.colors.black} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => onRemove(item.id)}
              style={styles.removeButton}
            >
              <Ionicons name="trash-outline" size={20} color={NEO_THEME.colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    backgroundColor: NEO_THEME.colors.white,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
    borderRadius: 16,
    // Softer Nuvia Shadow
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    overflow: 'hidden',
  },
  content: {
    flexDirection: "row",
    padding: 12,
    gap: 16,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: NEO_THEME.colors.black,
    backgroundColor: NEO_THEME.colors.background,
    overflow: 'hidden',
  },
  image: {
    width: "100%",
    height: "100%",
  },
  details: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: NEO_THEME.colors.black,
    backgroundColor: NEO_THEME.colors.background,
    borderRadius: 20, // Pill shape
    padding: 2,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: NEO_THEME.colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: NEO_THEME.colors.black,
  },
  quantityValue: {
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: 'center',
    minWidth: 32,
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: NEO_THEME.colors.black,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
});
