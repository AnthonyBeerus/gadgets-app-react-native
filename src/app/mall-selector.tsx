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
import { getMalls, Mall } from "../api/shops";

const { height } = Dimensions.get("window");

export default function MallSelectorModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{ selectedMallId?: string }>();
  const [malls, setMalls] = useState<Mall[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedMallId = params.selectedMallId
    ? parseInt(params.selectedMallId)
    : null;

  useEffect(() => {
    loadMalls();
  }, []);

  const loadMalls = async () => {
    try {
      const mallsData = await getMalls();
      setMalls(mallsData || []);
    } catch (error) {
      console.error("Error loading malls:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMall = (mallId: number | null) => {
    // Navigate back to the shops tab with the selected mall ID
    router.navigate({
      pathname: "/(shop)",
      params: { selectedMall: String(mallId ?? "") },
    });
  };

  return (
    <View style={styles.container}>
      {/* Handle Bar */}
      <View style={styles.handleBar} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Select Location</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#666" />
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
            selectedMallId === null && styles.selectedMallCard,
          ]}
          onPress={() => handleSelectMall(null)}
          activeOpacity={0.7}>
          <View style={styles.mallCardLeft}>
            <View
              style={[
                styles.mallIconContainer,
                selectedMallId === null && styles.selectedMallIcon,
              ]}>
              <Ionicons
                name="apps"
                size={32}
                color={selectedMallId === null ? "#fff" : "#9C27B0"}
              />
            </View>
            <View style={styles.mallInfo}>
              <Text style={styles.mallName}>All Locations</Text>
              <Text style={styles.mallLocation}>Browse all shops</Text>
              <Text style={styles.mallDescription}>
                View shops from all malls and marketplaces
              </Text>
            </View>
          </View>
          {selectedMallId === null && (
            <Ionicons name="checkmark-circle" size={28} color="#9C27B0" />
          )}
        </TouchableOpacity>

        {/* Individual Mall Cards */}
        {malls.map((mall) => (
          <TouchableOpacity
            key={mall.id}
            style={[
              styles.mallCard,
              selectedMallId === mall.id && styles.selectedMallCard,
            ]}
            onPress={() => handleSelectMall(mall.id)}
            activeOpacity={0.7}>
            <View style={styles.mallCardLeft}>
              <View
                style={[
                  styles.mallIconContainer,
                  selectedMallId === mall.id && styles.selectedMallIcon,
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
                    color={selectedMallId === mall.id ? "#fff" : "#9C27B0"}
                  />
                )}
              </View>
              <View style={styles.mallInfo}>
                <View style={styles.mallNameRow}>
                  <Text style={styles.mallName}>{mall.name}</Text>
                  {mall.is_featured && (
                    <View style={styles.featuredBadge}>
                      <Ionicons name="star" size={12} color="#FFD700" />
                      <Text style={styles.featuredText}>Featured</Text>
                    </View>
                  )}
                </View>
                <View style={styles.locationRow}>
                  <Ionicons
                    name={mall.is_physical ? "location" : "globe"}
                    size={14}
                    color="#9C27B0"
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
            {selectedMallId === mall.id && (
              <Ionicons name="checkmark-circle" size={28} color="#9C27B0" />
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
    backgroundColor: "#fff",
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: "#D1D5DB",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    letterSpacing: -0.5,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 12,
  },
  mallCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FAFAFA",
    padding: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#F0F0F0",
    marginBottom: 4,
  },
  selectedMallCard: {
    backgroundColor: "#F3E5F5",
    borderColor: "#9C27B0",
    elevation: 4,
    shadowColor: "#9C27B0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  mallCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  mallIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#F3E5F5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    overflow: "hidden",
  },
  selectedMallIcon: {
    backgroundColor: "#9C27B0",
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
    marginBottom: 6,
    gap: 8,
  },
  mallName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    letterSpacing: -0.3,
  },
  featuredBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 215, 0, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  featuredText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#D97706",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  mallLocation: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  mallDescription: {
    fontSize: 13,
    color: "#888",
    lineHeight: 18,
    marginTop: 4,
  },
});
