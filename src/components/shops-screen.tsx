import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  getShops,
  getCategoriesWithShopFeatures,
  searchShops,
  getShopsWithFeature,
  getShopsByCategory,
} from "../api/shops";
import {
  getShopsWithProductCount,
  fetchShopsWithProductCount,
} from "../api/api";
import { Tables } from "../types/database.types";
import { ShopListItem } from "./shop-list-item";

type Shop = Tables<"shops">;
type Category = Tables<"category">;

interface ShopWithCategory extends Shop {
  category: Category;
}

export default function ShopsScreen() {
  const router = useRouter();
  const [shops, setShops] = useState<ShopWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [shopsData, categoriesData] = await Promise.all([
        getShops(),
        getCategoriesWithShopFeatures(),
      ]);
      setShops(shopsData as ShopWithCategory[]);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error loading shops:", error);
      Alert.alert("Error", "Failed to load shops data");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        setLoading(true);
        const results = await searchShops(query);
        setShops(results as ShopWithCategory[]);
      } catch (error) {
        console.error("Search error:", error);
        Alert.alert("Error", "Failed to search shops");
      } finally {
        setLoading(false);
      }
    } else {
      loadData();
    }
  };

  const handleFeatureFilter = async (feature: string | null) => {
    setSelectedFeature(feature);
    setSelectedCategory(null);
    setSearchQuery("");

    try {
      setLoading(true);
      let results;
      if (feature) {
        results = await getShopsWithFeature(feature as any);
      } else {
        results = await getShops();
      }
      setShops(results as ShopWithCategory[]);
    } catch (error) {
      console.error("Feature filter error:", error);
      Alert.alert("Error", "Failed to filter shops by feature");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = async (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setSelectedFeature(null);
    setSearchQuery("");

    try {
      setLoading(true);
      let results;
      if (categoryId) {
        results = await getShopsByCategory(categoryId);
      } else {
        results = await getShops();
      }
      setShops(results as ShopWithCategory[]);
    } catch (error) {
      console.error("Category filter error:", error);
      Alert.alert("Error", "Failed to filter shops by category");
    } finally {
      setLoading(false);
    }
  };

  const navigateToShop = (shopId: number) => {
    router.push(`/shop/${shopId}`);
  };

  const features = [
    { key: "has_delivery", label: "Delivery", icon: "bicycle" },
    { key: "has_collection", label: "Collection", icon: "bag-handle" },
    { key: "has_appointment_booking", label: "Appointments", icon: "calendar" },
    { key: "has_virtual_try_on", label: "Virtual Try-On", icon: "glasses" },
  ];

  const renderShopCard = ({ item }: { item: ShopWithCategory }) => (
    <ShopListItem shop={item} />
  );

  const renderCategoryChip = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        selectedCategory === item.id && styles.selectedCategoryChip,
      ]}
      onPress={() =>
        handleCategoryFilter(selectedCategory === item.id ? null : item.id)
      }>
      <Text
        style={[
          styles.categoryChipText,
          selectedCategory === item.id && styles.selectedCategoryChipText,
        ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderFeatureChip = ({ item }: { item: (typeof features)[0] }) => (
    <TouchableOpacity
      style={[
        styles.featureChip,
        selectedFeature === item.key && styles.selectedFeatureChip,
      ]}
      onPress={() =>
        handleFeatureFilter(selectedFeature === item.key ? null : item.key)
      }>
      <Ionicons
        name={item.icon as any}
        size={16}
        color={selectedFeature === item.key ? "#fff" : "#666"}
      />
      <Text
        style={[
          styles.featureChipText,
          selectedFeature === item.key && styles.selectedFeatureChipText,
        ]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Molapo Crossing</Text>
        <Text style={styles.subtitle}>{shops.length} shops</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={18}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search shops..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Filters Combined */}
      <View style={styles.filtersWrapper}>
        {/* Feature Filters */}
        <FlatList
          data={features}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderFeatureChip}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.filtersContent}
        />

        {/* Category Filters */}
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderCategoryChip}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.categoriesContent}
        />
      </View>

      {/* Shops List */}
      {loading && shops.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading shops...</Text>
        </View>
      ) : shops.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="storefront-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>No shops found</Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery
              ? `No shops match "${searchQuery}"`
              : selectedCategory || selectedFeature
              ? "No shops match your filters"
              : "No shops available at the moment"}
          </Text>
          {(searchQuery || selectedCategory || selectedFeature) && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                setSearchQuery("");
                setSelectedCategory(null);
                setSelectedFeature(null);
                loadData();
              }}>
              <Text style={styles.clearButtonText}>Clear Filters</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={shops}
          renderItem={renderShopCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.shopsContainer}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={loadData}
          style={styles.shopsList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#212529",
  },
  subtitle: {
    fontSize: 14,
    color: "#6c757d",
    marginTop: 2,
    fontWeight: "400",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },
  filtersWrapper: {
    marginBottom: 16,
  },
  filtersContainer: {
    maxHeight: 50,
    marginBottom: 8,
    paddingVertical: 2,
  },
  filtersContent: {
    paddingHorizontal: 16,
    paddingVertical: 2,
  },
  featureChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: "#e9ecef",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedFeatureChip: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
    shadowColor: "#007AFF",
    shadowOpacity: 0.3,
    elevation: 3,
  },
  featureChipText: {
    fontSize: 11,
    color: "#666",
    marginLeft: 4,
  },
  selectedFeatureChipText: {
    color: "#fff",
  },
  categoriesContainer: {
    maxHeight: 50,
    marginBottom: 8,
    paddingVertical: 2,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingVertical: 2,
  },
  categoryChip: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: "#e9ecef",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedCategoryChip: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
    shadowColor: "#007AFF",
    shadowOpacity: 0.3,
    elevation: 3,
  },
  categoryChipText: {
    fontSize: 13,
    color: "#666",
  },
  selectedCategoryChipText: {
    color: "#fff",
  },
  shopsContainer: {
    padding: 16,
    paddingBottom: 100, // Add extra padding for bottom navigation
  },
  shopsList: {
    flex: 1,
  },
  shopCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    marginHorizontal: 4,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  shopImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  shopInfo: {
    padding: 16,
  },
  shopHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  shopName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#212529",
    flex: 1,
  },
  featuredBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFD700",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featuredText: {
    fontSize: 10,
    color: "#fff",
    marginLeft: 2,
    fontWeight: "bold",
  },
  categoryName: {
    fontSize: 13,
    color: "#007AFF",
    marginBottom: 6,
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
    color: "#6c757d",
    lineHeight: 20,
    marginBottom: 12,
  },
  shopDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  featuresRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
    marginTop: 8,
  },
  featureTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  featureTagText: {
    fontSize: 10,
    color: "#666",
    marginLeft: 4,
  },
  deliveryInfo: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6c757d",
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: "#f8f9fa",
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#495057",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 8,
  },
  clearButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 20,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
