import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import Animated from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useShopStore } from "../../../store/shop-store";
import { NeoView } from "../../../shared/components/ui/neo-view";
import { NeoShopCard } from "../../../components/shop/neo-shop-card";
import { NEO_THEME } from "../../../shared/constants/neobrutalism";
import { AnimatedHeaderLayout } from "../../../shared/components/layout/AnimatedHeaderLayout";

const { width } = Dimensions.get("window");

export default function ShopsScreen() {
  const router = useRouter();
  const scrollViewRef = React.useRef<ScrollView>(null);
  const [currentSlide, setCurrentSlide] = React.useState(0);

  // Global Zustand store for all shop data and filters
  const {
    shops,
    allShops,
    categories,
    malls,
    selectedMall,
    selectedCategory,
    searchQuery,
    loading,
    error,
    loadInitialData,
    setSelectedCategory,
    setSearchQuery,
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

  // Featured shops for hero carousel - use allShops to ignore filters
  const featuredShops = React.useMemo(() => {
    return allShops.filter(shop => 
      ['Sefalana', 'La Parada', 'Cappello'].includes(shop.name)
    );
  }, [allShops]);

  // Auto-scroll carousel
  useEffect(() => {
    if (featuredShops.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = (prev + 1) % featuredShops.length;
        scrollViewRef.current?.scrollTo({
          x: (width - 32) * next,
          animated: true,
        });
        return next;
      });
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [featuredShops.length]);

  const handleScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / (width - 32));
    setCurrentSlide(slideIndex);
  };

  const navigateToShop = (shopId: number) => {
    router.push(`/shop/${shopId}`);
  };

  const selectedMallData = malls.find((m) => m.id === selectedMall);
  const mallName = selectedMallData?.name?.toUpperCase() || "Malopo Crossing";

  const renderShopCard = ({ item }: { item: any }) => (
    <NeoShopCard shop={item} onPress={() => navigateToShop(item.id)} />
  );

  const renderSmallTitle = () => (
    <TouchableOpacity onPress={() => router.push("/mall-selector")} activeOpacity={0.7}>
      <View style={styles.smallHeaderContent}>
        <Text style={styles.smallHeaderTitle}>{mallName}</Text>
        <Ionicons name="chevron-down" size={20} color={NEO_THEME.colors.black} />
      </View>
    </TouchableOpacity>
  );

  const renderLargeTitle = () => (
    <TouchableOpacity onPress={() => router.push("/mall-selector")} activeOpacity={0.8}>
      <NeoView style={styles.mallSelector} shadowOffset={3} containerStyle={{ alignSelf: 'stretch' }}>
        <Text style={styles.mallSelectorText}>{mallName}</Text>
        <Ionicons name="chevron-down" size={24} color={NEO_THEME.colors.black} />
      </NeoView>
    </TouchableOpacity>
  );

  return (
    <AnimatedHeaderLayout
      renderSmallTitle={renderSmallTitle}
      renderLargeTitle={renderLargeTitle}
    >
      <View style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchWrapper}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for products, brands..."
              placeholderTextColor={NEO_THEME.colors.grey}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.searchButton}>
              <Text style={styles.searchButtonText}>SEARCH</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Carousel */}
        {featuredShops.length > 0 && (
          <View style={styles.heroSection}>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              style={styles.carousel}
            >
              {featuredShops.map((shop) => (
                <TouchableOpacity
                  key={shop.id}
                  activeOpacity={0.9}
                  onPress={() => navigateToShop(shop.id)}
                  style={styles.carouselSlide}
                >
                  <View style={styles.heroBorder}>
                    <ImageBackground
                      source={{ uri: shop.image_url || 'https://via.placeholder.com/400x200' }}
                      style={styles.heroImage}
                    >
                      <View style={styles.heroOverlay}>
                        <Text style={styles.heroTitle}>{shop.name.toUpperCase()}</Text>
                        {shop.category && (
                          <Text style={styles.heroSubtitle}>{shop.category.name}</Text>
                        )}
                      </View>
                    </ImageBackground>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {/* Pagination Dots */}
            <View style={styles.pagination}>
              {featuredShops.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    currentSlide === index && styles.activeDot
                  ]}
                />
              ))}
            </View>
          </View>
        )}

        {/* Category Filter Pills */}
        <Animated.ScrollView 
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
        </Animated.ScrollView>

        <View style={styles.listContainer}>
          {loading ? (
            <ActivityIndicator size="large" color={NEO_THEME.colors.primary} style={{ marginTop: 40 }} />
          ) : (
            <>
              {shops.map((item) => (
                <NeoShopCard key={item.id} shop={item} onPress={() => navigateToShop(item.id)} />
              ))}
            </>
          )}
        </View>
      </View>
    </AnimatedHeaderLayout>
  );
}

const styles = StyleSheet.create({
  smallHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  smallHeaderTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  mallSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  mallSelectorText: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 20,
    color: NEO_THEME.colors.black,
    fontWeight: '900',
    textTransform: 'uppercase',
    flex: 1,
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchWrapper: {
    flexDirection: 'row',
    height: 48,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    backgroundColor: NEO_THEME.colors.white,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    fontFamily: NEO_THEME.fonts.regular,
    fontSize: 14,
    color: NEO_THEME.colors.black,
  },
  searchButton: {
    backgroundColor: NEO_THEME.colors.blue,
    paddingHorizontal: 24,
    justifyContent: 'center',
    borderLeftWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
  },
  searchButtonText: {
    fontFamily: NEO_THEME.fonts.bold,
    color: NEO_THEME.colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  heroSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  carousel: {
    width: '100%',
  },
  carouselSlide: {
    width: width - 32, // Account for padding
  },
  heroBorder: {
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
  },
  heroImage: {
    width: '100%',
    height: 200,
    justifyContent: 'flex-end',
  },
  heroOverlay: {
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  heroTitle: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 28,
    color: NEO_THEME.colors.white,
    textShadowColor: NEO_THEME.colors.black,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
    textTransform: 'uppercase',
    fontWeight: '900',
  },
  heroSubtitle: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 14,
    color: NEO_THEME.colors.white,
    textShadowColor: NEO_THEME.colors.black,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
    marginTop: 4,
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
    backgroundColor: NEO_THEME.colors.white,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
  },
  activeDot: {
    backgroundColor: NEO_THEME.colors.black,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  filterPill: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
  },
  activeFilterPill: {
    backgroundColor: NEO_THEME.colors.black,
  },
  inactiveFilterPill: {
    backgroundColor: NEO_THEME.colors.white,
  },
  filterText: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 14,
    fontWeight: '700',
  },
  activeFilterText: {
    color: NEO_THEME.colors.white,
  },
  inactiveFilterText: {
    color: NEO_THEME.colors.black,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});
