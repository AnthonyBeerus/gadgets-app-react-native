import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { Link } from "expo-router";
import { Tables } from "../shared/types/database.types";
import { NEO_THEME } from "../shared/constants/neobrutalism";

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
              <Text style={styles.shopBadgeText}>{product.shops.name.toUpperCase()}</Text>
            </View>
          )}
        </View>
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemTitle} numberOfLines={2}>{product.title.toUpperCase()}</Text>
          <View style={styles.priceTag}>
            <Text style={styles.itemPrice}>P{product.price.toFixed(2)}</Text>
          </View>
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
    backgroundColor: NEO_THEME.colors.white,
    marginVertical: 8,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    overflow: "hidden",
    // Hard shadow
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  itemImageContainer: {
    borderRadius: 0,
    width: "100%",
    height: 150,
    position: "relative",
    borderBottomWidth: NEO_THEME.borders.width,
    borderBottomColor: NEO_THEME.colors.black,
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
    backgroundColor: NEO_THEME.colors.black,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.white,
  },
  shopBadgeText: {
    color: NEO_THEME.colors.white,
    fontSize: 10,
    fontWeight: "700",
    fontFamily: NEO_THEME.fonts.bold,
    textTransform: "uppercase",
  },
  itemTextContainer: {
    padding: 12,
    alignItems: "flex-start",
    gap: 8,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.bold,
    textTransform: "uppercase",
    lineHeight: 18,
  },
  priceTag: {
    backgroundColor: NEO_THEME.colors.yellow,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
    alignSelf: "flex-start",
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
  },
  shopName: {
    fontSize: 12,
    color: NEO_THEME.colors.grey,
    fontWeight: "600",
    textTransform: "uppercase",
  },
});
