import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Tables } from "../shared/types/database.types";
import { useNeoStyles } from '../shared/hooks/useNeoStyles';
import { useTheme } from '../shared/providers/theme-provider';

type ShopWithProductCount = Tables<"shops"> & {
  products?: { count: number }[];
  category?: {
    id: number;
    name: string;
  };
};

export const ShopListItem = ({ shop }: { shop: ShopWithProductCount }) => {
  const styles = useNeoStyles(createStyles);
  const { theme } = useTheme();
  const productCount = shop.products?.[0]?.count || 0;

  return (
    <Link asChild href={`/shop/${shop.id}`}>
      <Pressable style={styles.item}>
        {/* Hero Image */}
        <View style={styles.imageWrapper}>
          <Image
            source={{
              uri: shop.image_url || "https://via.placeholder.com/400x200",
            }}
            style={styles.shopImage}
          />
          {/* Category Badge */}
          {shop.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{shop.category.name}</Text>
            </View>
          )}
        </View>

        {/* Content Section */}
        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.shopName} numberOfLines={1}>
              {shop.name}
            </Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.primary} />
          </View>

          <Text style={styles.shopDescription} numberOfLines={2}>
            {shop.description}
          </Text>

          {/* Footer Row */}
          <View style={styles.footerRow}>
            <View style={styles.productCountContainer}>
              <Ionicons name="pricetag-outline" size={14} color={theme.colors.primary} />
              <Text style={styles.productCount}>
                {productCount} {productCount !== 1 ? "products" : "product"}
              </Text>
            </View>
            <Text style={styles.exploreText}>Explore →</Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
};

function createStyles(c) {
  return {
  item: {
    backgroundColor: c.white,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 16,
    overflow: "hidden" as const,
    elevation: 2,
    shadowColor: c.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  imageWrapper: {
    width: "100%" as const,
    height: 200,
    position: "relative" as const,
  },
  shopImage: {
    width: "100%" as const,
    height: "100%" as const,
    resizeMode: "cover" as const,
  },
  categoryBadge: {
    position: "absolute" as const,
    top: 12,
    right: 12,
    backgroundColor: c.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    elevation: 2,
    shadowColor: c.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: c.white,
    textTransform: "uppercase" as const,
    letterSpacing: 0.8,
  },
  contentContainer: {
    padding: 16,
    gap: 10,
  },
  headerRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
  },
  shopName: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700" as const,
    color: c.black,
    letterSpacing: -0.3,
  },
  shopDescription: {
    fontSize: 14,
    color: c.grey,
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  footerRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingTop: 4,
  },
  productCountContainer: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
  },
  productCount: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: c.primary,
    letterSpacing: 0.2,
  },
  exploreText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: c.primary,
    letterSpacing: 0.3,
  },
  };
}
