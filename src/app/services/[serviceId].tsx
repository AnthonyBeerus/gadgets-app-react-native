import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { NEO_THEME } from "../../shared/constants/neobrutalism";

import { useSafeAreaInsets } from "react-native-safe-area-context";

const ServiceDetailsScreen = () => {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    serviceId: string;
    serviceName: string;
    price: string;
    duration: string;
    providerId: string;
    providerName: string;
    rating: string;
  }>();

  const handleBookNow = () => {
    router.push({
      pathname: "/services/booking-modal",
      params: {
        serviceId: params.serviceId,
        serviceName: params.serviceName,
        price: params.price,
        duration: params.duration,
        providerId: params.providerId,
        providerName: params.providerName,
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={NEO_THEME.colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SERVICE DETAILS</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Service Header */}
        <View style={styles.serviceHeader}>
          <Text style={styles.serviceName}>{params.serviceName}</Text>
          <View style={styles.ratingBadge}>
            <MaterialIcons name="star" size={18} color={NEO_THEME.colors.black} />
            <Text style={styles.ratingText}>{params.rating || "5.0"}</Text>
          </View>
        </View>

        {/* Provider Info */}
        <View style={styles.providerSection}>
          <Text style={styles.sectionTitle}>PROVIDER</Text>
          <View style={styles.providerCard}>
            <MaterialIcons name="store" size={32} color={NEO_THEME.colors.primary} />
            <Text style={styles.providerName}>{params.providerName}</Text>
          </View>
        </View>

        {/* Service Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>DETAILS</Text>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <MaterialIcons name="schedule" size={24} color={NEO_THEME.colors.grey} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Duration</Text>
                <Text style={styles.detailValue}>{params.duration} minutes</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <MaterialIcons name="payments" size={24} color={NEO_THEME.colors.grey} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Price</Text>
                <Text style={styles.detailValue}>${params.price}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>ABOUT THIS SERVICE</Text>
          <View style={styles.descriptionCard}>
            <Text style={styles.descriptionText}>
              Professional {params.serviceName?.toLowerCase() || "service"} provided by {params.providerName || "our team"}.
              Our experienced staff ensures high-quality service with attention to detail.
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Book Button */}
      <View style={styles.bookButtonContainer}>
        <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
          <Text style={styles.bookButtonText}>BOOK NOW - ${params.price}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ServiceDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEO_THEME.colors.backgroundLight,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: NEO_THEME.colors.white,
    borderBottomWidth: NEO_THEME.borders.width,
    borderBottomColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
  },
  headerSpacer: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  serviceHeader: {
    backgroundColor: NEO_THEME.colors.white,
    padding: 24,
    marginBottom: 16,
    borderBottomWidth: NEO_THEME.borders.width,
    borderBottomColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  serviceName: {
    fontSize: 28,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: NEO_THEME.colors.yellow,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: NEO_THEME.borders.radius,
    alignSelf: "flex-start",
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
    marginLeft: 6,
  },
  providerSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
    marginBottom: 12,
  },
  providerCard: {
    backgroundColor: NEO_THEME.colors.white,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  providerName: {
    fontSize: 18,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
    marginLeft: 12,
  },
  detailsSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  detailsCard: {
    backgroundColor: NEO_THEME.colors.white,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
    padding: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  detailContent: {
    marginLeft: 16,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: NEO_THEME.colors.grey,
    fontWeight: "700",
    fontFamily: NEO_THEME.fonts.bold,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
  },
  descriptionSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  descriptionCard: {
    backgroundColor: NEO_THEME.colors.white,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
    padding: 16,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: NEO_THEME.colors.black,
    fontWeight: "500",
  },
  bottomSpacing: {
    height: 120,
  },
  bookButtonContainer: {
    padding: 20,
    backgroundColor: NEO_THEME.colors.white,
    borderTopWidth: NEO_THEME.borders.width,
    borderTopColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  bookButton: {
    backgroundColor: NEO_THEME.colors.primary,
    borderRadius: NEO_THEME.borders.radius,
    paddingVertical: 18,
    alignItems: "center",
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  bookButtonText: {
    fontSize: 18,
    fontWeight: "900",
    color: NEO_THEME.colors.white,
    fontFamily: NEO_THEME.fonts.black,
  },
});
