import { useNeoStyles } from '../../../shared/hooks/useNeoStyles';
import { useTheme } from '../../../shared/providers/theme-provider';
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

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onBook }) => {
  const styles = useNeoStyles(createStyles);
  const { theme } = useTheme();

  return (
    <View style={styles.serviceCard}>
      <View style={styles.serviceHeader}>
        <Text style={styles.serviceName}>{service.name}</Text>
        <View style={styles.ratingContainer}>
          <MaterialIcons name="star" size={16} color={theme.colors.black} />
          <Text style={styles.rating}>{service.rating}</Text>
        </View>
      </View>
      <Text style={styles.serviceProvider}>{service.provider}</Text>
      <View style={styles.serviceDetails}>
        <View style={styles.serviceInfo}>
          <MaterialIcons name="schedule" size={16} color={theme.colors.grey} />
          <Text style={styles.serviceDuration}>{service.duration}</Text>
        </View>
        <Text style={styles.servicePrice}>${service.price}</Text>
      </View>
      <TouchableOpacity style={styles.bookButton} onPress={onBook}>
        <Text style={styles.bookButtonText}>BOOK NOW</Text>
      </TouchableOpacity>
    </View>
  );
};

function createStyles(c) {
  return {
  serviceCard: {
    backgroundColor: c.white,
    borderRadius: NEO_THEME.borders.radius,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: c.border,
    shadowColor: c.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
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
    fontWeight: '600',
    color: c.black,
    flex: 1,
    marginRight: 12,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: c.yellow,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: 1,
    borderColor: c.border,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: c.black,
    marginLeft: 4,
    fontFamily: NEO_THEME.fonts.black,
  },
  serviceProvider: {
    fontSize: 14,
    color: c.grey,
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
    color: c.grey,
    marginLeft: 4,
    fontWeight: "700",
    fontFamily: NEO_THEME.fonts.bold,
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: '600',
    color: c.black,
    backgroundColor: c.yellow,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: 1,
    borderColor: c.border,
    fontFamily: NEO_THEME.fonts.black,
  },
  bookButton: {
    backgroundColor: c.primary,
    borderRadius: NEO_THEME.borders.radius,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: c.border,
    shadowColor: c.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 0,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: c.white,
    fontFamily: NEO_THEME.fonts.black,
  },
  };
}
