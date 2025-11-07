import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Tables } from "../types/database.types";

type ShopWithProductCount = Tables<"shops"> & {
  products?: { count: number }[];
  category?: {
    id: number;
    name: string;
  };
};

export const ShopListItem = ({ shop }: { shop: ShopWithProductCount }) => {
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
            <Ionicons name="chevron-forward" size={20} color="#9C27B0" />
          </View>

          <Text style={styles.shopDescription} numberOfLines={2}>
            {shop.description}
          </Text>

          {/* Footer Row */}
          <View style={styles.footerRow}>
            <View style={styles.productCountContainer}>
              <Ionicons name="pricetag-outline" size={14} color="#9C27B0" />
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

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  imageWrapper: {
    width: "100%",
    height: 200,
    position: "relative",
  },
  shopImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  categoryBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(156, 39, 176, 0.95)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  contentContainer: {
    padding: 16,
    gap: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  shopName: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    letterSpacing: -0.3,
  },
  shopDescription: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 4,
  },
  productCountContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  productCount: {
    fontSize: 13,
    fontWeight: "600",
    color: "#9C27B0",
    letterSpacing: 0.2,
  },
  exploreText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9C27B0",
    letterSpacing: 0.3,
  },
});
