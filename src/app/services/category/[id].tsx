import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { getServicesByCategory } from "../../../shared/api/api";
import { NEO_THEME } from "../../../shared/constants/neobrutalism";
import { useNeoStyles } from "../../../shared/hooks/useNeoStyles";
import { useTheme } from "../../../shared/providers/theme-provider";
import { ServiceCard } from "../../../features/services/components/ServiceCard";

import { useSafeAreaInsets } from "react-native-safe-area-context";

const CategoryServicesScreen = () => {
  const insets = useSafeAreaInsets();
  const styles = useNeoStyles(createStyles);
  const { theme } = useTheme();
  const params = useLocalSearchParams<{
    id: string;
    categoryName: string;
  }>();

  const {
    data: services,
    isLoading: servicesLoading,
    error: servicesError,
  } = getServicesByCategory(Number(params.id));

  const handleBookService = (service: any) => {
    router.push({
      pathname: "/services/booking-modal",
      params: {
        serviceId: service.id.toString(),
        serviceName: service.name,
        price: service.price.toString(),
        duration: service.duration_minutes.toString(),
        providerId: service.service_provider.id.toString(),
        providerName: service.service_provider.name,
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{params.categoryName?.toUpperCase()}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {servicesLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>LOADING SERVICES...</Text>
        </View>
      ) : servicesError ? (
        <View style={styles.errorContainer}>
          <MaterialIcons
            name="error-outline"
            size={48}
            color={theme.colors.yellow}
          />
          <Text style={styles.errorText}>FAILED TO LOAD SERVICES</Text>
        </View>
      ) : (
        <FlatList
          data={services || []}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ServiceCard
              service={{
                id: item.id.toString(),
                name: item.name,
                provider: item.service_provider?.name || "Unknown Provider",
                price: Number(item.price),
                duration: `${item.duration_minutes} min`,
                rating: Number(item.rating) || 0,
              }}
              onBook={() =>
                handleBookService({
                  id: item.id,
                  name: item.name,
                  price: Number(item.price),
                  duration_minutes: item.duration_minutes,
                  rating: item.rating,
                  service_provider: {
                    id: item.provider_id,
                    name: item.service_provider?.name || "Unknown Provider",
                  },
                })
              }
            />
          )}
          contentContainerStyle={styles.servicesList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default CategoryServicesScreen;

function createStyles(c: { backgroundLight: string; white: string; border: string; black: string; grey: string }) {
  return {
  container: {
    flex: 1,
    backgroundColor: c.backgroundLight,
  },
  header: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: c.white,
    borderBottomWidth: 1,
    borderBottomColor: c.border,
    shadowColor: c.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 0,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: c.black,
    fontFamily: NEO_THEME.fonts.black,
  },
  headerSpacer: {
    width: 32,
  },
  servicesList: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    paddingVertical: 50,
  },
  loadingText: {
    fontSize: 16,
    color: c.grey,
    marginTop: 12,
    fontWeight: "700" as const,
    fontFamily: NEO_THEME.fonts.bold,
    textTransform: "uppercase" as const,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    paddingVertical: 50,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: c.black,
    marginTop: 12,
    textAlign: "center" as const,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase" as const,
  },
  };
}
