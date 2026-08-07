import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { PopProductCard } from "../../components/shop/PopProductCard";
import { useProducts } from "../../features/product/hooks/use-products";
import { NEO_THEME } from "../../shared/constants/neobrutalism";
import { useNeoStyles } from "../../shared/hooks/useNeoStyles";
import { useTheme } from "../../shared/providers/theme-provider";

const ProductsPage = () => {
  const styles = useNeoStyles(createStyles);
  const { theme } = useTheme();
  const { shop, shopName } = useLocalSearchParams<{
    shop: string;
    shopName: string;
  }>();
  const router = useRouter();
  
  const shopId = shop ? parseInt(shop) : undefined;
  const { data: rawProducts = [], isLoading: loading } = useProducts(shopId);

  const products = rawProducts.map(p => ({
      ...p,
      image_url: p.heroImage || (p.imagesUrl && p.imagesUrl[0]) || undefined,
      heroImage: p.heroImage || undefined,
      description: p.description || undefined,
      imagesUrl: p.imagesUrl || undefined,
      category: p.category?.toString() || undefined,
      shop_id: p.shop_id || undefined,
      available: p.available ?? undefined,
      maxQuantity: p.maxQuantity || undefined
  }));

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            title: "Products",
            headerBackTitle: "Back",
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>LOADING PRODUCTS...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: shopName
            ? `${decodeURIComponent(shopName).toUpperCase()} PRODUCTS`
            : "PRODUCTS",
          headerBackTitle: "BACK",
        }}
      />

      {products.length > 0 ? (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <PopProductCard 
                item={item} 
                index={index}
                onPress={() => router.push(`/product/${item.slug}`)}
                 style={{ width: '100%', marginBottom: 16 }}
                 // Default variant (horizontal)
                 actionButton={
                     <TouchableOpacity 
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: 16,
                            backgroundColor: theme.colors.yellow,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                        }}
                        onPress={(e) => {
                             e.stopPropagation();
                             // Add to cart logic here
                             console.log('Add to cart', item.id);
                        }}
                     >
                         <Ionicons name="bag-add" size={16} color={theme.colors.black} />
                     </TouchableOpacity>
                 }
            />
          )}
          contentContainerStyle={styles.productsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="storefront-outline" size={64} color={theme.colors.grey} />
          <Text style={styles.emptyTitle}>NO PRODUCTS FOUND</Text>
          <Text style={styles.emptySubtitle}>
            This shop doesn't have any products listed yet.
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}>
            <Text style={styles.backButtonText}>GO BACK</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ProductsPage;

function createStyles(c: { backgroundLight: string; black: string; grey: string; primary: string; border: string; white: string }) {
  return {
  container: {
    flex: 1,
    backgroundColor: c.backgroundLight,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "700" as const,
    color: c.black,
    fontFamily: NEO_THEME.fonts.bold,
    textTransform: "uppercase" as const,
  },
  productsList: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: c.black,
    marginTop: 16,
    marginBottom: 8,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase" as const,
  },
  emptySubtitle: {
    fontSize: 16,
    color: c.grey,
    textAlign: "center" as const,
    marginBottom: 32,
  },
  backButton: {
    backgroundColor: c.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: 1,
    borderColor: c.border,
    shadowColor: c.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 0,
  },
  backButtonText: {
    color: c.white,
    fontSize: 16,
    fontWeight: '600' as const,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase" as const,
  },
  };
}
