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
  container: { flex: 1 },
  instruction: { fontSize: 18, marginBottom: 20, textAlign: "center" },
  emptyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 20,
  },
  item: {
    flex: 1,
    margin: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  image: { width: 100, height: 100, borderRadius: 10 },
  title: { fontSize: 14, fontWeight: "bold", marginTop: 5 },
  price: { fontSize: 12, color: "#666" },
});
