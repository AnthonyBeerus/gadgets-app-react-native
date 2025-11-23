import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { useShopStore } from "../store/shop-store";
import { NEO_THEME } from "../shared/constants/neobrutalism";

const { height } = Dimensions.get("window");

export default function MallSelectorModal() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Get data directly from Zustand store
  const { malls, selectedMall, setSelectedMall } = useShopStore();

  const handleSelectMall = async (mallId: number | null) => {
    setLoading(true);

    // Update the store directly - this will trigger data fetching
    await setSelectedMall(mallId);

    setLoading(false);

    // Navigate back without params - store already has the data
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Handle Bar */}
      <View style={styles.handleBar} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>SELECT LOCATION</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeButton}>
          <Ionicons name="close" size={24} color={NEO_THEME.colors.black} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* All Locations Option */}
        <TouchableOpacity
          style={[
            styles.mallCard,
            selectedMall === null && styles.selectedMallCard,
          ]}
          onPress={() => handleSelectMall(null)}
          activeOpacity={0.7}
          disabled={loading}>
          <View style={styles.mallCardLeft}>
            <View
              style={[
                styles.mallIconContainer,
                selectedMall === null && styles.selectedMallIcon,
              ]}>
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

        {/* Individual Mall Cards */}
        {malls.map((mall) => (
          <TouchableOpacity
            key={mall.id}
            style={[
              styles.mallCard,
              selectedMall === mall.id && styles.selectedMallCard,
            ]}
            onPress={() => handleSelectMall(mall.id)}
            activeOpacity={0.7}
            disabled={loading}>
            <View style={styles.mallCardLeft}>
              <View
                style={[
                  styles.mallIconContainer,
                  selectedMall === mall.id && styles.selectedMallIcon,
                ]}>
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEO_THEME.colors.backgroundLight,
  },
  handleBar: {
    width: 60,
    height: 6,
    backgroundColor: NEO_THEME.colors.black,
    borderRadius: 0,
    alignSelf: "center",
    marginTop: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: NEO_THEME.borders.width,
    borderBottomColor: NEO_THEME.colors.black,
    backgroundColor: NEO_THEME.colors.white,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: NEO_THEME.borders.radius,
    backgroundColor: NEO_THEME.colors.backgroundLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
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
});
