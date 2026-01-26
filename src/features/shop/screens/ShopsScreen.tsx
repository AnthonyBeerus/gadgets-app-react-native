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
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useShopStore } from "../../../store/shop-store";
import { NeoView } from "../../../shared/components/ui/neo-view";
import { NeoShopCard } from "../../../components/shop/neo-shop-card";
import { NEO_THEME } from "../../../shared/constants/neobrutalism";
import { AnimatedHeaderLayout } from "../../../shared/components/layout/AnimatedHeaderLayout";
import { HeaderRightGroup } from "../../../shared/components/ui/header-right-group";
import { SmallHeaderTitle, LargeHeaderTitle } from "../../../shared/components/layout/header-titles";
import { FadeIn, FadeInDown } from "react-native-reanimated";
import { DURATION, EASING } from "../../../shared/constants/animations";
import { NuviaInput } from "../../../shared/components/ui/nuvia-input";

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
  const mallName = selectedMallData?.name?.toUpperCase() || "Molapo Crossing";

  const renderShopCard = ({ item }: { item: any }) => (
    <NeoShopCard shop={item} onPress={() => navigateToShop(item.id)} />
  );

  const renderSmallTitle = () => (
    <TouchableOpacity onPress={() => router.push("/mall-selector")} activeOpacity={0.7}>
      <SmallHeaderTitle title={mallName}>
        <Ionicons name="chevron-down" size={20} color={NEO_THEME.colors.black} style={{ marginLeft: 4 }} />
      </SmallHeaderTitle>
    </TouchableOpacity>
  );

  const renderLargeTitle = () => (
    <TouchableOpacity 
      onPress={() => router.push("/mall-selector")} 
      activeOpacity={0.8}
      style={{ marginTop: 8 }}
    >
      <View>
        {/* Meta Label */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
           <View style={{ width: 8, height: 8, backgroundColor: NEO_THEME.colors.primary, marginRight: 8 }} />
           <Text style={{ 
             fontFamily: NEO_THEME.fonts.bold, 
             fontSize: 12, 
             letterSpacing: 2, 
             color: NEO_THEME.colors.grey 
           }}>
             CURRENT LOCATION
           </Text>
        </View>

        {/* Massive Title */}
        <Text style={{ 
            fontFamily: NEO_THEME.fonts.black, 
            fontSize: 40, 
            lineHeight: 40, 
            color: NEO_THEME.colors.black,
            letterSpacing: -1, // Tight tracking for impact
            marginBottom: 8
        }}>
          {mallName}
        </Text>

        {/* Action Indicator */}
         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ 
              fontFamily: NEO_THEME.fonts.bold, 
              fontSize: 14,
              marginRight: 6,
              textDecorationLine: 'underline'
            }}>
              CHANGE
            </Text>
            <Ionicons name="arrow-forward" size={16} color={NEO_THEME.colors.black} />
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
            placeholder="Search for products, brands..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon={<Ionicons name="search" size={20} color={NEO_THEME.colors.grey} />}
            rightIcon={
               <TouchableOpacity onPress={() => console.log('Search')}>
                 <View style={{ backgroundColor: NEO_THEME.colors.secondary, borderRadius: 12, padding: 4 }}>
                   <Ionicons name="arrow-forward" size={16} color={NEO_THEME.colors.black} />
                 </View>
               </TouchableOpacity>
            }
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
                        <Text style={styles.heroTitle}>{shop.name.toUpperCase()}</Text>
                        {shop.category && (
                          <Text style={styles.heroSubtitle}>{shop.category.name}</Text>
                        )}
                      </View>
                    </View>
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
          </Animated.View>
        )}

        {/* Category Filter Pills */}
        <Animated.View entering={FadeInDown.duration(DURATION.normal).delay(300).easing(EASING.out)}>
          <Animated.ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.filtersContainer}
          >
            {categories.map((item: any, index: number) => (
              <Animated.View 
                key={item.id}
                entering={FadeIn.duration(DURATION.fast).delay(300 + (index * 50)).easing(EASING.out)}
              >
              <TouchableOpacity
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
              </Animated.View>
            ))}
          </Animated.ScrollView>
        </Animated.View>

        <View style={styles.listContainer}>
          {loading ? (
            <ActivityIndicator size="large" color={NEO_THEME.colors.primary} style={{ marginTop: 40 }} />
          ) : (
            <FlashList
              data={shops}
              renderItem={renderShopCard}
              // @ts-ignore: estimatedItemSize definition missing
              estimatedItemSize={280}
              scrollEnabled={false}
            />
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
    borderRadius: NEO_THEME.borders.radius,
    overflow: 'hidden',
    // Hard shadow for search bar
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
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
    backgroundColor: NEO_THEME.colors.secondary, // Yellow CTA
    paddingHorizontal: 24,
    justifyContent: 'center',
    borderLeftWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
  },
  searchButtonText: {
    fontFamily: NEO_THEME.fonts.bold,
    color: NEO_THEME.colors.black,
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
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    borderRadius: NEO_THEME.borders.radius,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    backgroundColor: NEO_THEME.colors.white,
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
    color: NEO_THEME.colors.white,
    textShadowColor: NEO_THEME.colors.black,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
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
    borderRadius: 6,
  },
  activeDot: {
    backgroundColor: NEO_THEME.colors.black,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  filterPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    borderRadius: 20, // Pill shape
  },
  activeFilterPill: {
    backgroundColor: NEO_THEME.colors.primary, // Lilac for active
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
    transform: [{ translateY: -2 }], // Pop up slightly
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
