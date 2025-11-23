import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useShopStore } from "../../../store/shop-store";
import { NEO_THEME } from "../../../shared/constants/neobrutalism";

const { height } = Dimensions.get("window");

export default function LocationSelectorScreen() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const scrollY = useSharedValue(0);

  // Get data directly from Zustand store
  const { malls, selectedMall, setSelectedMall } = useShopStore();

  const handleSelectMall = async (mallId: number | null) => {
    setLoading(true);
    await setSelectedMall(mallId);
    setLoading(false);
    router.back();
  };

  const filteredMalls = useMemo(() => {
    if (!searchQuery) return malls;
    const lowerQuery = searchQuery.toLowerCase();
    return malls.filter(
      (mall) =>
        mall.name.toLowerCase().includes(lowerQuery) ||
        (mall.location || "").toLowerCase().includes(lowerQuery)
    );
  }, [malls, searchQuery]);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const largeTitleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 45],
      [1, 0],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  const smallHeaderStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [45, 80],
      [0, 1],
      Extrapolation.CLAMP
    );
    const translateY = interpolate(
      scrollY.value,
      [40, 80],
      [20, 0],
      Extrapolation.CLAMP
    );
    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const headerHeight = 60 + top;

  return (
    <View style={styles.container}>
      {/* Small Header (Fixed) */}
      <Animated.View
        style={[
          styles.smallHeader,
          { height: headerHeight, paddingTop: top },
          smallHeaderStyle,
        ]}
      >
        <Text style={styles.smallHeaderTitle}>SELECT LOCATION</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.closeButtonAbsolute, { top: top + 10 }]}
        >
          <Ionicons name="close" size={24} color={NEO_THEME.colors.black} />
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={onScroll}
        contentContainerStyle={{
          paddingBottom: 50,
          paddingTop: headerHeight, 
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Large Header (Scrolls) */}
        <Animated.View
          style={[
            styles.largeHeaderContainer,
            largeTitleStyle,
          ]}
        >
          <View style={styles.largeHeaderRow}>
             <Text style={styles.largeHeaderTitle}>SELECT LOCATION</Text>
             <TouchableOpacity
              onPress={() => router.back()}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color={NEO_THEME.colors.black} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View style={styles.content}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={NEO_THEME.colors.black} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search locations..."
              placeholderTextColor={NEO_THEME.colors.grey}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color={NEO_THEME.colors.grey} />
              </TouchableOpacity>
            )}
          </View>

          {/* All Locations Option - Only show if no search or matches "all" */}
          {!searchQuery && (
            <TouchableOpacity
              style={[
                styles.mallCard,
                selectedMall === null && styles.selectedMallCard,
              ]}
              onPress={() => handleSelectMall(null)}
              activeOpacity={0.7}
              disabled={loading}
            >
              <View style={styles.mallCardLeft}>
                <View
                  style={[
                    styles.mallIconContainer,
                    selectedMall === null && styles.selectedMallIcon,
                  ]}
                >
                  <Ionicons
                    name="apps"
                    size={32}
                    color={selectedMall === null ? NEO_THEME.colors.white : NEO_THEME.colors.primary}
                  />
                </View>
                <View style={styles.mallInfo}>
                  <Text style={styles.mallName}>ALL LOCATIONS</Text>
                  <Text style={styles.mallLocation}>BROWSE ALL SHOPS</Text>
                  <Text style={styles.mallDescription}>
                    View shops from all malls and marketplaces
                  </Text>
                </View>
              </View>
              {selectedMall === null && (
                <Ionicons name="checkmark-circle" size={28} color={NEO_THEME.colors.primary} />
              )}
            </TouchableOpacity>
          )}

          {/* Individual Mall Cards */}
          {filteredMalls.map((mall) => (
            <TouchableOpacity
              key={mall.id}
              style={[
                styles.mallCard,
                selectedMall === mall.id && styles.selectedMallCard,
              ]}
              onPress={() => handleSelectMall(mall.id)}
              activeOpacity={0.7}
              disabled={loading}
            >
              <View style={styles.mallCardLeft}>
                <View
                  style={[
                    styles.mallIconContainer,
                    selectedMall === mall.id && styles.selectedMallIcon,
                  ]}
                >
                  {mall.image_url ? (
                    <Image
                      source={{ uri: mall.image_url }}
                      style={styles.mallImage}
                    />
                  ) : (
                    <Ionicons
                      name={mall.is_physical ? "storefront" : "globe"}
                      size={32}
                      color={selectedMall === mall.id ? NEO_THEME.colors.white : NEO_THEME.colors.primary}
                    />
                  )}
                </View>
                <View style={styles.mallInfo}>
                  <View style={styles.mallNameRow}>
                    <Text style={styles.mallName}>{mall.name}</Text>
                    {mall.is_featured && (
                      <View style={styles.featuredBadge}>
                        <Ionicons name="star" size={12} color={NEO_THEME.colors.black} />
                        <Text style={styles.featuredText}>FEATURED</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.locationRow}>
                    <Ionicons
                      name={mall.is_physical ? "location" : "globe"}
                      size={14}
                      color={NEO_THEME.colors.primary}
                    />
                    <Text style={styles.mallLocation}>{mall.location}</Text>
                  </View>
                  {mall.description && (
                    <Text style={styles.mallDescription} numberOfLines={2}>
                      {mall.description}
                    </Text>
                  )}
                </View>
              </View>
              {selectedMall === mall.id && (
                <Ionicons name="checkmark-circle" size={28} color={NEO_THEME.colors.primary} />
              )}
            </TouchableOpacity>
          ))}

          {/* Empty State */}
          {filteredMalls.length === 0 && searchQuery && (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color={NEO_THEME.colors.grey} />
              <Text style={styles.emptyStateText}>No locations found</Text>
            </View>
          )}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEO_THEME.colors.backgroundLight,
  },
  smallHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: NEO_THEME.colors.white,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    borderBottomWidth: NEO_THEME.borders.width,
    borderBottomColor: NEO_THEME.colors.black,
  },
  smallHeaderTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  closeButtonAbsolute: {
    position: "absolute",
    right: 20,
    width: 40,
    height: 40,
    borderRadius: NEO_THEME.borders.radius,
    backgroundColor: NEO_THEME.colors.backgroundLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
  },
  largeHeaderContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  largeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  largeHeaderTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
    flex: 1,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: NEO_THEME.borders.radius,
    backgroundColor: NEO_THEME.colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
  },
  content: {
    paddingHorizontal: 20,
    gap: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: NEO_THEME.colors.white,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    borderRadius: NEO_THEME.borders.radius,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 8,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: NEO_THEME.fonts.regular,
    fontSize: 16,
    color: NEO_THEME.colors.black,
    height: "100%",
  },
  mallCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: NEO_THEME.colors.white,
    padding: 16,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    marginBottom: 4,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  selectedMallCard: {
    backgroundColor: NEO_THEME.colors.yellow,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  mallCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  mallIconContainer: {
    width: 64,
    height: 64,
    borderRadius: NEO_THEME.borders.radius,
    backgroundColor: NEO_THEME.colors.backgroundLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
  },
  selectedMallIcon: {
    backgroundColor: NEO_THEME.colors.primary,
  },
  mallImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  mallInfo: {
    flex: 1,
  },
  mallNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
    flexWrap: "wrap",
    marginRight: 8,
  },
  mallName: {
    fontSize: 18,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  featuredBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: NEO_THEME.colors.yellow,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: NEO_THEME.borders.radius,
    gap: 4,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
  },
  featuredText: {
    fontSize: 11,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  mallLocation: {
    fontSize: 14,
    color: NEO_THEME.colors.grey,
    fontWeight: "700",
    fontFamily: NEO_THEME.fonts.bold,
    textTransform: "uppercase",
  },
  mallDescription: {
    fontSize: 13,
    color: NEO_THEME.colors.grey,
    lineHeight: 18,
    marginTop: 4,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 16,
    color: NEO_THEME.colors.grey,
    fontFamily: NEO_THEME.fonts.bold,
  },
});
