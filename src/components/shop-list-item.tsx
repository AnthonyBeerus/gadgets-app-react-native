import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { Tables } from "../types/database.types";

type ShopWithProductCount = Tables<"shops"> & {
  products?: { count: number }[];
};

export const ShopListItem = ({ shop }: { shop: ShopWithProductCount }) => {
  const productCount = shop.products?.[0]?.count || 0;

  return (
    <Link asChild href={`/shop/${shop.id}`}>
      <Pressable style={styles.item}>
        <View style={styles.shopImageContainer}>
          <Image
            source={{
              uri: shop.image_url || "https://via.placeholder.com/150",
            }}
            style={styles.shopImage}
          />
        </View>
        <View style={styles.shopTextContainer}>
          <Text style={styles.shopName}>{shop.name}</Text>
          <Text style={styles.shopDescription} numberOfLines={2}>
            {shop.description}
          </Text>
          <Text style={styles.productCount}>
            {productCount} product{productCount !== 1 ? "s" : ""}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: "white",
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: "hidden",
    flexDirection: "row",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  shopImageContainer: {
    width: 80,
    height: 80,
    margin: 12,
  },
  shopImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 8,
  },
  shopTextContainer: {
    flex: 1,
    padding: 12,
    paddingLeft: 0,
    justifyContent: "center",
    gap: 4,
  },
  shopName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  shopDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  productCount: {
    fontSize: 12,
    color: "#888",
    fontWeight: "500",
  },
});
