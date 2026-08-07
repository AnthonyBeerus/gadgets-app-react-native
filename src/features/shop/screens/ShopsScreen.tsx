import { useNeoStyles } from '../../../shared/hooks/useNeoStyles';
import { useTheme } from '../../../shared/providers/theme-provider';
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
  ScrollView,
} from "react-native";
import Animated from "react-native-reanimated";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useShopStore } from "../../../store/shop-store";
import { NEO_THEME } from "../../../shared/constants/neobrutalism";
import { AnimatedHeaderLayout } from "../../../shared/components/layout/AnimatedHeaderLayout";
import { HeaderRightGroup } from "../../../shared/components/ui/header-right-group";
import { FadeIn, FadeInDown } from "react-native-reanimated";
import { DURATION, EASING } from "../../../shared/constants/animations";
import { NuviaInput } from "../../../shared/components/ui/nuvia-input";
import { NuviaProductCard } from "../../../components/molecules/nuvia-product-card";
import { NuviaShopCard } from "../../../components/molecules/nuvia-shop-card";
import { NuviaTag } from "../../../shared/components/ui/nuvia-tag";
import { NuviaText } from "../../../components/atoms/nuvia-text";

const { width } = Dimensions.get("window");

export default function ShopsScreen() {
  const styles = useNeoStyles(createStyles);
  const { theme } = useTheme();
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

  const navigateToShop = (shopId: number | string) => {
    router.push(`/shop/${shopId}`);
  };

  const selectedMallData = malls.find((m) => m.id === selectedMall);
  const mallName = selectedMallData?.name?.toUpperCase() || (malls.length > 0 ? "ALL LOCATIONS" : "LOCATIONS COMING SOON");

  const renderShopCard = ({ item }: { item: any }) => (
    <NuviaShopCard shop={item} onPress={() => navigateToShop(item.id)} />
  );

  const renderSmallTitle = () => (
    <TouchableOpacity onPress={() => router.push("/mall-selector")} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center' }}>
      <NuviaText variant="label" style={{ marginRight: 4 }}>{mallName}</NuviaText>
      <Ionicons name="chevron-down" size={16} color={theme.colors.black} />
    </TouchableOpacity>
  );

  const renderLargeTitle = () => (
    <TouchableOpacity 
      onPress={() => router.push("/mall-selector")} 
      activeOpacity={0.8}
      style={{ marginTop: 8 }}
    >
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
           <NuviaTag label="CURRENT LOCATION" color={theme.colors.secondary} />
        </View>

        <NuviaText variant="display" style={{ fontSize: 36, lineHeight: 42, marginBottom: 8 }}>
          {mallName}
        </NuviaText>

         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <NuviaText variant="label" style={{ textDecorationLine: 'underline', marginRight: 4 }}>
              CHANGE
            </NuviaText>
            <Ionicons name="arrow-forward" size={14} color={theme.colors.black} />
         </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <AnimatedHeaderLayout
      renderSmallTitle={renderSmallTitle}
      renderLargeTitle={renderLargeTitle}
      smallHeaderRight={<HeaderRightGroup />}
      largeHeaderRight={<HeaderRightGroup />}
    >
      <View style={styles.content}>
        {/* Search Bar */}
        <Animated.View 
          entering={FadeInDown.duration(DURATION.normal).delay(100).easing(EASING.out)}
          style={styles.searchContainer}
        >
          <NuviaInput
            placeholder="Search shops or categories..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon={<Ionicons name="search" size={20} color={theme.colors.grey} />}
          />
        </Animated.View>

        {/* Hero Carousel */}
        {featuredShops.length > 0 && (
          <Animated.View 
            style={styles.heroSection}
            entering={FadeInDown.duration(DURATION.normal).delay(200).easing(EASING.out)}
          >
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
                    <View style={styles.heroImageContainer}>
                      <Image
                        source={{ uri: shop.image_url || 'https://via.placeholder.com/400x200' }}
                        style={styles.heroImage}
                        contentFit="cover"
                        transition={200}
                      />
                      <View style={styles.heroOverlay}>
                        <NuviaText variant="h1" color={theme.colors.white}>
                            {shop.name}
                        </NuviaText>
                        {shop.category && (
                          <NuviaTag label={shop.category.name} color={theme.colors.primary} style={{ marginTop: 4 }} />
                        )}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {/* Pagination dots simplified or replaced by Nuvia dots if needed */}
          </Animated.View>
        )}

        {/* Category Filter Pills */}
        <Animated.View entering={FadeInDown.duration(DURATION.normal).delay(300).easing(EASING.out)}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.filtersContainer}
          >
            {categories.map((item: any) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => setSelectedCategory(selectedCategory === item.id ? null : item.id)}
                style={{ marginRight: 10 }}
              >
                <NuviaTag 
                    label={item.name} 
                    color={selectedCategory === item.id ? theme.colors.primary : theme.colors.white}
                    style={{ 
                        paddingHorizontal: 16, 
                        paddingVertical: 8,
                        transform: [{ translateY: selectedCategory === item.id ? -2 : 0 }]
                    }}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        <View style={styles.listContainer}>
          {error && (
            <View style={styles.inlineError}>
              <Ionicons name="warning-outline" size={22} color={theme.colors.black} />
              <NuviaText variant="body" style={styles.inlineErrorText}>{error}</NuviaText>
            </View>
          )}
          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 40 }} />
          ) : (
            <FlashList
              data={shops}
              renderItem={renderShopCard}
              // @ts-ignore: estimatedItemSize definition missing
              estimatedItemSize={280}
              scrollEnabled={false}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Ionicons name="storefront-outline" size={48} color={theme.colors.grey} />
                  <NuviaText variant="h2" style={styles.emptyTitle}>No shops yet</NuviaText>
                  <NuviaText variant="body" style={styles.emptyCopy}>
                    Merchants are setting up their storefronts. Check back soon or open your own shop from Merchant Mode.
                  </NuviaText>
                </View>
              }
            />
          )}
        </View>
      </View>
    </AnimatedHeaderLayout>
  );
}

function createStyles(c) {
  return {
  smallHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  smallHeaderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: c.black,
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
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: c.white,
    borderRadius: NEO_THEME.borders.radius,
    overflow: 'hidden',
    // Hard shadow for search bar
    shadowColor: c.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
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
    backgroundColor: c.secondary, // Yellow CTA
    paddingHorizontal: 24,
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderColor: c.border,
  },
  searchButtonText: {
    fontFamily: NEO_THEME.fonts.bold,
    color: c.black,
    fontSize: 14,
    fontWeight: '700',
  },
  heroSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
    marginTop: 8,
  },
  carousel: {
    width: '100%',
    overflow: 'visible', // Allow shadows
  },
  carouselSlide: {
    width: width - 32, // Account for padding
  },
  heroBorder: {
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: NEO_THEME.borders.radius,
    shadowColor: c.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    backgroundColor: c.white,
    overflow: 'hidden',
  },
  heroImageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  heroTitle: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 28,
    color: c.white,
    textShadowColor: c.black,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
    fontWeight: '600',
  },
  heroSubtitle: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 14,
    color: c.white,
    textShadowColor: c.black,
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
    backgroundColor: c.white,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 6,
  },
  activeDot: {
    backgroundColor: c.black,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  filterPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 20, // Pill shape
  },
  activeFilterPill: {
    backgroundColor: c.primary, // Lilac for active
    shadowColor: c.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    transform: [{ translateY: -2 }], // Pop up slightly
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
    paddingHorizontal: 16,
  },
  inlineError: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: c.yellow,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: NEO_THEME.borders.radius,
    padding: 12,
    marginBottom: 16,
  },
  inlineErrorText: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 56,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    marginTop: 12,
    textAlign: 'center',
  },
  emptyCopy: {
    marginTop: 8,
    textAlign: 'center',
    color: c.grey,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  };
}
