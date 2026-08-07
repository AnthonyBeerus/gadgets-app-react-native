import React, { useEffect } from "react";
import {
  View,
  Text, FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useShopStore } from "../store/shop-store";
import { NeoView } from "../shared/components/ui/neo-view";
import { NeoShopCard } from "./shop/neo-shop-card";
import { NEO_THEME } from "../shared/constants/neobrutalism";
import { useNeoStyles } from "../shared/hooks/useNeoStyles";
import { useTheme } from "../shared/providers/theme-provider";

export default function ShopsScreen() {
  const router = useRouter();
  const styles = useNeoStyles(createStyles);
  const { theme } = useTheme();

  // Global Zustand store for all shop data and filters
  const {
    shops,
    categories,
    malls,
    selectedMall,
    selectedCategory,
    selectedFeature,
    searchQuery,
    loading,
    error,
    loadInitialData,
    setSelectedCategory,
    setSelectedFeature,
    setSearchQuery,
    clearAllExceptMall,
  } = useShopStore();

  // Load initial data on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  // Show error alerts
  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
    }
  }, [error]);

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

  const renderShopCard = ({ item }: { item: any }) => (
    <NeoShopCard shop={item} onPress={() => navigateToShop(item.id)} />
  );

  return (
    <View style={styles.container}>
      {/* Neobrutalist Header */}
      <View style={styles.header}>
        {/* Mall Selector Button */}
        <TouchableOpacity onPress={() => router.push("/mall-selector")} activeOpacity={0.8}>
          <NeoView style={styles.mallSelector} shadowOffset={3} containerStyle={{ alignSelf: 'stretch' }}>
            <Text style={styles.mallSelectorText}>
              {selectedMallData?.name?.toUpperCase() || "MALL OF METROPOLIS"}
            </Text>
            <Ionicons name="chevron-down" size={24} color={theme.colors.black} />
          </NeoView>
        </TouchableOpacity>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchWrapper}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for products, brands..."
              placeholderTextColor={theme.colors.grey}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.searchButton}>
              <Text style={styles.searchButtonText}>SEARCH</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroBorder}>
            <ImageBackground
              source={{ uri: "https://images.unsplash.com/photo-1552346154-21d32cc4bc66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" }}
              style={styles.heroImage}
            >
              <View style={styles.heroOverlay}>
                <Text style={styles.heroTitle}>NEW SNEAKER DROP</Text>
              </View>
            </ImageBackground>
          </View>
          {/* Pagination Dots */}
          <View style={styles.pagination}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        {/* Category Filter Pills */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.filtersContainer}
        >
          {categories.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => setSelectedCategory(selectedCategory === item.id ? null : item.id)}
              style={{ marginRight: 12 }}
            >
              <View
                style={[
                  styles.filterPill,
                  selectedCategory === item.id ? styles.activeFilterPill : styles.inactiveFilterPill
                ]}
              >
                <Text style={[
                  styles.filterText,
                  selectedCategory === item.id ? styles.activeFilterText : styles.inactiveFilterText
                ]}>
                  {item.name}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Shop List */}
        <View style={styles.listContainer}>
          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 40 }} />
          ) : (
            <FlatList
              data={shops}
              renderItem={renderShopCard}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={styles.columnWrapper}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function createStyles(c) {
  return {
  container: {
    flex: 1,
    backgroundColor: c.backgroundLight,
  },
  header: {
    backgroundColor: c.backgroundLight,
    padding: 16,
    gap: 16,
  },
  mallSelector: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  mallSelectorText: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 14,
    color: c.black,
    fontWeight: '700',
  },
  searchContainer: {
    marginTop: 4,
  },
  searchWrapper: {
    flexDirection: 'row',
    height: 48,
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: c.white,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    fontFamily: NEO_THEME.fonts.regular,
    fontSize: 14,
    color: c.black,
  },
  searchButton: {
    backgroundColor: c.blue,
    paddingHorizontal: 24,
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderColor: c.border,
  },
  searchButtonText: {
    fontFamily: NEO_THEME.fonts.bold,
    color: c.white,
    fontSize: 14,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  heroSection: {
    padding: 16,
  },
  heroBorder: {
    borderWidth: 1,
    borderColor: c.border,
  },
  heroImage: {
    width: '100%',
    height: 200,
    justifyContent: 'flex-end',
  },
  heroOverlay: {
    padding: 16,
  },
  heroTitle: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 28,
    color: c.white,
    textShadowColor: c.black,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  dot: {
    width: 12,
    height: 12,
    backgroundColor: c.white,
    borderWidth: 1,
    borderColor: c.border,
  },
  activeDot: {
    backgroundColor: c.black,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  filterPill: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: c.border,
  },
  activeFilterPill: {
    backgroundColor: c.black,
  },
  inactiveFilterPill: {
    backgroundColor: c.white,
  },
  filterText: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 14,
    fontWeight: '700',
  },
  activeFilterText: {
    color: c.white,
  },
  inactiveFilterText: {
    color: c.black,
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  };
}
