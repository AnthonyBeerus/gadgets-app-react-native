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
import { ServiceCard } from "../../../features/services/components/ServiceCard";

import { useSafeAreaInsets } from "react-native-safe-area-context";

const CategoryServicesScreen = () => {
  const insets = useSafeAreaInsets();
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
          <MaterialIcons name="arrow-back" size={24} color={NEO_THEME.colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{params.categoryName?.toUpperCase()}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {servicesLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={NEO_THEME.colors.primary} />
          <Text style={styles.loadingText}>LOADING SERVICES...</Text>
        </View>
      ) : servicesError ? (
        <View style={styles.errorContainer}>
          <MaterialIcons
            name="error-outline"
            size={48}
            color={NEO_THEME.colors.yellow}
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
  servicesList: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  loadingText: {
    fontSize: 16,
    color: NEO_THEME.colors.grey,
    marginTop: 12,
    fontWeight: "700",
    fontFamily: NEO_THEME.fonts.bold,
    textTransform: "uppercase",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    marginTop: 12,
    textAlign: "center",
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
});
