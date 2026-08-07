import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { NuviaText } from "../../../components/atoms/nuvia-text";
import { useNeoStyles } from "../../../shared/hooks/useNeoStyles";
import { useTheme } from "../../../shared/providers/theme-provider";


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

function createStyles(c: { black: string; white: string; border: string; background: string; primary: string }) {
  return {
    container: {
      marginBottom: 16,
      backgroundColor: c.white,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 16,
      shadowColor: c.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
      overflow: 'hidden' as const,
    },
    content: {
      flexDirection: "row" as const,
      padding: 12,
      gap: 16,
    },
    imageContainer: {
      width: 80,
      height: 80,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.background,
      overflow: 'hidden' as const,
    },
    image: {
      width: "100%" as const,
      height: "100%" as const,
    },
    details: {
      flex: 1,
      justifyContent: "space-between" as const,
      paddingVertical: 2,
    },
    actions: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      marginTop: 8,
    },
    quantityControl: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.background,
      borderRadius: 20,
      padding: 2,
    },
    quantityButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: c.white,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      borderWidth: 1,
      borderColor: c.border,
    },
    quantityValue: {
      paddingHorizontal: 12,
      justifyContent: "center" as const,
      alignItems: 'center' as const,
      minWidth: 32,
    },
    removeButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: c.black,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      borderWidth: 1,
      borderColor: c.border,
      shadowColor: c.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
    },
  };
}

export const CartItem = ({
  item,
  onDecrement,
  onIncrement,
  onRemove,
}: CartItemProps) => {
  const styles = useNeoStyles(createStyles);
  const { theme } = useTheme();
  const c = theme.colors;

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
          <NuviaText variant="h3" color={c.primary}>
            ${item.price.toFixed(2)}
          </NuviaText>

          <View style={styles.actions}>
            <View style={styles.quantityControl}>
              <TouchableOpacity
                onPress={() => onDecrement(item.id)}
                style={styles.quantityButton}
              >
                <Ionicons name="remove" size={16} color={c.black} />
              </TouchableOpacity>
              
              <View style={styles.quantityValue}>
                <NuviaText variant="label">{item.quantity}</NuviaText>
              </View>

              <TouchableOpacity
                onPress={() => onIncrement(item.id)}
                style={styles.quantityButton}
              >
                <Ionicons name="add" size={16} color={c.black} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => onRemove(item.id)}
              style={styles.removeButton}
            >
              <Ionicons name="trash-outline" size={20} color={c.white} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
