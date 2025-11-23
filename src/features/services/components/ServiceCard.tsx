import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { NEO_THEME } from "../../../shared/constants/neobrutalism";

interface ServiceCardProps {
  service: {
    id: string;
    name: string;
    provider: string;
    price: number;
    duration: string;
    rating: number;
  };
  onBook: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onBook }) => (
  <View style={styles.serviceCard}>
    <View style={styles.serviceHeader}>
      <Text style={styles.serviceName}>{service.name}</Text>
      <View style={styles.ratingContainer}>
        <MaterialIcons name="star" size={16} color={NEO_THEME.colors.black} />
        <Text style={styles.rating}>{service.rating}</Text>
      </View>
    </View>
    <Text style={styles.serviceProvider}>{service.provider}</Text>
    <View style={styles.serviceDetails}>
      <View style={styles.serviceInfo}>
        <MaterialIcons name="schedule" size={16} color={NEO_THEME.colors.grey} />
        <Text style={styles.serviceDuration}>{service.duration}</Text>
      </View>
      <Text style={styles.servicePrice}>${service.price}</Text>
    </View>
    <TouchableOpacity style={styles.bookButton} onPress={onBook}>
      <Text style={styles.bookButtonText}>BOOK NOW</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  serviceCard: {
    backgroundColor: NEO_THEME.colors.white,
    borderRadius: NEO_THEME.borders.radius,
    padding: 16,
    marginBottom: 16,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    flex: 1,
    marginRight: 12,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: NEO_THEME.colors.yellow,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
  },
  rating: {
    fontSize: 14,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    marginLeft: 4,
    fontFamily: NEO_THEME.fonts.black,
  },
  serviceProvider: {
    fontSize: 14,
    color: NEO_THEME.colors.grey,
    marginBottom: 12,
    fontWeight: "700",
    fontFamily: NEO_THEME.fonts.bold,
  },
  serviceDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  serviceInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  serviceDuration: {
    fontSize: 14,
    color: NEO_THEME.colors.grey,
    marginLeft: 4,
    fontWeight: "700",
    fontFamily: NEO_THEME.fonts.bold,
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    backgroundColor: NEO_THEME.colors.yellow,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
  },
  bookButton: {
    backgroundColor: NEO_THEME.colors.primary,
    borderRadius: NEO_THEME.borders.radius,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: "900",
    color: NEO_THEME.colors.white,
    fontFamily: NEO_THEME.fonts.black,
  },
});
