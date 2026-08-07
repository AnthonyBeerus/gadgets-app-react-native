import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { Link } from "expo-router";
import { Tables } from "../shared/types/database.types";
import { NEO_THEME } from "../shared/constants/neobrutalism";
import { useNeoStyles } from '../shared/hooks/useNeoStyles';
import { useTheme } from '../shared/providers/theme-provider';

type ProductWithShop = Tables<"product"> & {
  shops?: {
    id: number;
    name: string;
    description?: string;
    logo_url?: string;
  } | null;
};

export const ProductListItem = ({ product }: { product: ProductWithShop }) => {
  const styles = useNeoStyles(createStyles);
  const { theme } = useTheme();
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

function createStyles(c) {
  return {
  item: {
    width: "48%",
    backgroundColor: c.white,
    marginVertical: 8,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: 1,
    borderColor: c.border,
    overflow: "hidden",
    shadowColor: c.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 0,
  },
  itemImageContainer: {
    borderRadius: 0,
    width: "100%",
    height: 150,
    position: "relative",
    borderBottomWidth: 1,
    borderBottomColor: c.border,
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
    backgroundColor: c.black,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: 1,
    borderColor: c.white,
  },
  shopBadgeText: {
    color: c.white,
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
    color: c.black,
    fontFamily: NEO_THEME.fonts.bold,
    textTransform: "uppercase",
    lineHeight: 18,
  },
  priceTag: {
    backgroundColor: c.yellow,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: c.border,
    alignSelf: "flex-start",
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: c.black,
    fontFamily: NEO_THEME.fonts.black,
  },
  shopName: {
    fontSize: 12,
    color: c.grey,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  };
}
