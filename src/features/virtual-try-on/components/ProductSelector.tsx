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
import { Tables } from "../../../types/database.types";

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
      <Text style={styles.instruction}>Select a clothing item to try on:</Text>
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
  },
  instruction: {
    fontSize: 20,
    marginBottom: 24,
    marginTop: 16,
    textAlign: "center",
    fontWeight: "600",
    color: "#333",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 12,
    paddingHorizontal: 32,
    lineHeight: 24,
  },
  item: {
    flex: 1,
    margin: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    maxWidth: "48%",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
    color: "#333",
  },
  price: {
    fontSize: 16,
    color: "#9C27B0",
    fontWeight: "bold",
    marginTop: 4,
  },
});
