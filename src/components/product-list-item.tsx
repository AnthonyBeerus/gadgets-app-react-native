import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { Link } from "expo-router";
import { Tables } from "../types/database.types";

type ProductWithShop = Tables<"product"> & {
  shops?: {
    id: number;
    name: string;
    description?: string;
    logo_url?: string;
  } | null;
};

export const ProductListItem = ({ product }: { product: ProductWithShop }) => {
  return (
    <Link asChild href={`/product/${product.slug}`}>
      <Pressable style={styles.item}>
        <View style={styles.itemImageContainer}>
          <Image source={{ uri: product.heroImage }} style={styles.itemImage} />
          {product.shops && (
            <View style={styles.shopBadge}>
              <Text style={styles.shopBadgeText}>{product.shops.name}</Text>
            </View>
          )}
        </View>
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemTitle}>{product.title}</Text>
          <Text style={styles.itemPrice}>${product.price.toFixed(2)}</Text>
          {product.shops && (
            <Text style={styles.shopName}>from {product.shops.name}</Text>
          )}
        </View>
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  item: {
    width: "48%",
    backgroundColor: "white",
    marginVertical: 8,
    borderRadius: 10,
    overflow: "hidden",
  },
  itemImageContainer: {
    borderRadius: 10,
    width: "100%",
    height: 150,
    position: "relative",
  },
  itemImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  shopBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  shopBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },
  itemTextContainer: {
    padding: 8,
    alignItems: "flex-start",
    gap: 4,
  },
  itemTitle: {
    fontSize: 16,
    color: "#888",
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "bold",
  },
  shopName: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
});
