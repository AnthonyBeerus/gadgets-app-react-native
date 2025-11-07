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
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  getShops,
  getCategoriesWithShopFeatures,
  searchShops,
  getShopsWithFeature,
  getShopsByCategory,
  getMalls,
  getShopsByMall,
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
  category: {
    id: number;
    name: string;
    slug: string;
    imageUrl: string;
  };
}

export default function ShopsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ selectedMall?: string }>();
  const [shops, setShops] = useState<ShopWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [malls, setMalls] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedMall, setSelectedMall] = useState<number | null>(1); // Default to Molapo Crossing
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen for mall selection from modal
  useEffect(() => {
    if (params.selectedMall !== undefined) {
      const mallId =
        params.selectedMall === "" ? null : parseInt(params.selectedMall);
      handleMallFilter(mallId);
    }
  }, [params.selectedMall]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [shopsData, categoriesData, mallsData] = await Promise.all([
        // Load shops filtered by default mall (Molapo Crossing)
        selectedMall ? getShopsByMall(selectedMall) : getShops(),
        getCategoriesWithShopFeatures(),
        getMalls(),
      ]);
      setShops(shopsData as any);
      setCategories(categoriesData);
      setMalls(mallsData || []);
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
        // Apply mall filter if one is selected
        if (selectedMall) {
          const filteredResults = (results as any[]).filter(
            (shop) => shop.mall_id === selectedMall
          );
          setShops(filteredResults as any);
        } else {
          setShops(results as any);
        }
      } catch (error) {
        console.error("Search error:", error);
        Alert.alert("Error", "Failed to search shops");
      } finally {
        setLoading(false);
      }
    } else {
      // If search is cleared, reload with current mall filter
      if (selectedMall) {
        handleMallFilter(selectedMall);
      } else {
        loadData();
      }
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
        // Apply mall filter if one is selected
        if (selectedMall) {
          results = (results as any[]).filter(
            (shop) => shop.mall_id === selectedMall
          );
        }
      } else {
        // If feature is cleared, reload with current mall filter
        if (selectedMall) {
          results = await getShopsByMall(selectedMall);
        } else {
          results = await getShops();
        }
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
    // Don't clear mall filter - respect current mall selection

    try {
      setLoading(true);
      let results;
      if (categoryId) {
        results = await getShopsByCategory(categoryId);
        // Apply mall filter if one is selected
        if (selectedMall) {
          results = (results as any[]).filter(
            (shop) => shop.mall_id === selectedMall
          );
        }
      } else {
        // If category is cleared, reload with current mall filter
        if (selectedMall) {
          results = await getShopsByMall(selectedMall);
        } else {
          results = await getShops();
        }
      }
      setShops(results as any);
    } catch (error) {
      console.error("Category filter error:", error);
      Alert.alert("Error", "Failed to filter shops by category");
    } finally {
      setLoading(false);
    }
  };

  const handleMallFilter = async (mallId: number | null) => {
    setSelectedMall(mallId);
    setSelectedCategory(null);
    setSelectedFeature(null);
    setSearchQuery("");

    try {
      setLoading(true);
      let results;
      if (mallId) {
        results = await getShopsByMall(mallId);
      } else {
        results = await getShops();
      }
      setShops(results as any);
    } catch (error) {
      console.error("Mall filter error:", error);
      Alert.alert("Error", "Failed to filter shops by mall");
    } finally {
      setLoading(false);
    }
  };

  const navigateToShop = (shopId: number) => {
    router.push(`/shop/${shopId}`);
  };

  const selectedMallData = malls.find((m) => m.id === selectedMall);

  const features = [
    { key: "has_virtual_try_on", label: "Virtual Try-On", icon: "glasses" },
    { key: "has_delivery", label: "Delivery", icon: "bicycle" },
    { key: "has_collection", label: "Collection", icon: "bag-handle" },
    { key: "has_appointment_booking", label: "Appointments", icon: "calendar" },
  ];

  const renderShopCard = ({ item }: { item: ShopWithCategory }) => (
    <ShopListItem shop={item} />
  );

  return (
    <View style={styles.container}>
      {/* Custom Header with Mall Selector */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.mallSelectorButton}
          onPress={() =>
            router.push({
              pathname: "/mall-selector",
              params: { selectedMallId: String(selectedMall || "") },
            })
          }
          activeOpacity={0.7}>
          <View style={styles.headerLeft}>
            <View style={styles.mallIconSmall}>
              <Ionicons
                name={
                  selectedMallData?.is_physical === false
                    ? "globe"
                    : selectedMall
                    ? "storefront"
                    : "apps"
                }
                size={20}
                color="#9C27B0"
              />
            </View>
            <View>
              <Text style={styles.title}>
                {selectedMallData?.name || "All Locations"}
              </Text>
              <View style={styles.subtitleRow}>
                <Ionicons name="location" size={12} color="#9C27B0" />
                <Text style={styles.subtitle}>
                  {selectedMallData?.location || "Browse all shops"}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.shopsBadge}>
              <Text style={styles.shopsBadgeNumber}>{shops.length}</Text>
            </View>
            <Ionicons name="chevron-down" size={20} color="#9C27B0" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Premium Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#9C27B0"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search luxury brands..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => handleSearch("")}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Premium Feature Pills */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Services</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuresContent}>
          {features.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.featurePill,
                selectedFeature === item.key && styles.selectedFeaturePill,
              ]}
              onPress={() =>
                handleFeatureFilter(
                  selectedFeature === item.key ? null : item.key
                )
              }
              activeOpacity={0.7}>
              <View
                style={[
                  styles.featurePillIconContainer,
                  selectedFeature === item.key &&
                    styles.selectedFeaturePillIcon,
                ]}>
                <Ionicons
                  name={item.icon as any}
                  size={18}
                  color={selectedFeature === item.key ? "#fff" : "#9C27B0"}
                />
              </View>
              <Text
                style={[
                  styles.featurePillText,
                  selectedFeature === item.key &&
                    styles.selectedFeaturePillText,
                ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Premium Category Tabs */}
      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}>
          {categories.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.categoryTab,
                selectedCategory === item.id && styles.selectedCategoryTab,
              ]}
              onPress={() =>
                handleCategoryFilter(
                  selectedCategory === item.id ? null : item.id
                )
              }
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.categoryTabText,
                  selectedCategory === item.id &&
                    styles.selectedCategoryTabText,
                ]}>
                {item.name}
              </Text>
              {selectedCategory === item.id && (
                <View style={styles.categoryTabIndicator} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Shops List Header */}
      {!loading && shops.length > 0 && (
        <View style={styles.shopsHeader}>
          <Text style={styles.shopsHeaderTitle}>
            {selectedCategory || selectedFeature || searchQuery
              ? "Filtered Results"
              : "All Shops"}
          </Text>
          <Text style={styles.shopsHeaderCount}>{shops.length} shops</Text>
        </View>
      )}

      {/* Shops List */}
      {loading && shops.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9C27B0" />
          <Text style={styles.loadingText}>Curating your experience...</Text>
        </View>
      ) : shops.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="storefront-outline" size={64} color="#D1D5DB" />
          </View>
          <Text style={styles.emptyTitle}>No Shops Found</Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery
              ? `We couldn't find any shops matching "${searchQuery}"`
              : selectedCategory || selectedFeature
              ? "Try adjusting your filters to see more results"
              : "No shops are currently available"}
          </Text>
          {(searchQuery || selectedCategory || selectedFeature) && (
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
                setSearchQuery("");
                setSelectedCategory(null);
                setSelectedFeature(null);
                loadData();
              }}
              activeOpacity={0.8}>
              <Text style={styles.resetButtonText}>Reset Filters</Text>
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
    backgroundColor: "#FAFAFA",
  },
  header: {
    backgroundColor: "#fff",
    paddingTop: 6,
    paddingBottom: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  mallSelectorButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  mallIconSmall: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F3E5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  subtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  shopsBadge: {
    backgroundColor: "#F3E5F5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E1BEE7",
  },
  shopsBadgeNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: "#9C27B0",
    letterSpacing: -0.5,
  },
  shopsBadgeLabel: {
    fontSize: 10,
    color: "#7B1FA2",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 2,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#F0F0F0",
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1A1A1A",
    fontWeight: "500",
  },
  featuresSection: {
    paddingTop: 6,
    paddingBottom: 6,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    paddingHorizontal: 20,
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  featuresContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  featurePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#F0F0F0",
    gap: 8,
  },
  selectedFeaturePill: {
    backgroundColor: "#9C27B0",
    borderColor: "#9C27B0",
    elevation: 4,
    shadowColor: "#9C27B0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  featurePillIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3E5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedFeaturePillIcon: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
  featurePillText: {
    fontSize: 14,
    color: "#1A1A1A",
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  selectedFeaturePillText: {
    color: "#fff",
  },
  categoriesSection: {
    paddingTop: 6,
    paddingBottom: 6,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryTab: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: "#FAFAFA",
    borderWidth: 2,
    borderColor: "#F0F0F0",
    position: "relative",
  },
  selectedCategoryTab: {
    backgroundColor: "#F3E5F5",
    borderColor: "#9C27B0",
  },
  categoryTabText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  selectedCategoryTabText: {
    color: "#9C27B0",
  },
  categoryTabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "#9C27B0",
    borderRadius: 2,
  },
  shopsHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
    backgroundColor: "#FAFAFA",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  shopsHeaderTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    letterSpacing: -0.3,
  },
  shopsHeaderCount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9C27B0",
    letterSpacing: 0.2,
  },
  shopsContainer: {
    paddingTop: 8,
    paddingBottom: 100,
  },
  shopsList: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 48,
    backgroundColor: "#FAFAFA",
  },
  loadingText: {
    marginTop: 20,
    fontSize: 17,
    color: "#666",
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 48,
    backgroundColor: "#FAFAFA",
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#E0E0E0",
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 12,
    paddingHorizontal: 24,
    fontWeight: "500",
  },
  resetButton: {
    backgroundColor: "#9C27B0",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 28,
    marginTop: 24,
    elevation: 4,
    shadowColor: "#9C27B0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  // Remove old mall section styles - no longer needed
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
    color: "#9C27B0",
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
  deliveryInfo: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "500",
  },
});
