// filepath: src/features/virtual-try-on/components/ProductSelector.tsx
import React from "react";
import {
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  View,
} from "react-native";
import { useTryOnStore } from "../store/tryOnStore";
import { Tables } from '../../../shared/types/database.types';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';

interface ProductSelectorProps {
  products?: Tables<"product">[]; // Clothing products from shop
}

export default function ProductSelector({
  products = [],
}: ProductSelectorProps) {
  const { setSelectedProduct } = useTryOnStore();

  // Filter for clothing category (category 2)
  const clothingProducts = products.filter((p) => p.category === 2);

  if (clothingProducts.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.instruction}>
          No clothing items available for virtual try-on.
        </Text>
        <Text style={styles.emptyText}>
          Please check back later or contact the shop directly.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <Text style={styles.instruction}>
          SELECT A CLOTHING ITEM TO TRY ON:
        </Text>
      <FlatList
        data={clothingProducts}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedProduct(item)}
            style={styles.item}>
            <Image source={{ uri: item.heroImage }} style={styles.image} />
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.price}>P{item.price}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: NEO_THEME.colors.backgroundLight,
  },
  instruction: {
    fontSize: 20,
    marginBottom: 24,
    marginTop: 16,
    textAlign: "center",
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  emptyText: {
    fontSize: 16,
    color: NEO_THEME.colors.grey,
    textAlign: "center",
    marginTop: 12,
    paddingHorizontal: 32,
    lineHeight: 24,
  },
  item: {
    flex: 1,
    margin: 8,
    backgroundColor: NEO_THEME.colors.white,
    borderRadius: NEO_THEME.borders.radius,
    padding: 12,
    alignItems: "center",
    maxWidth: "48%",
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: NEO_THEME.borders.radius,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 8,
    textAlign: "center",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.bold,
    textTransform: "uppercase",
  },
  price: {
    fontSize: 16,
    color: NEO_THEME.colors.black,
    fontWeight: "900",
    marginTop: 4,
    backgroundColor: NEO_THEME.colors.yellow,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
  },
});
