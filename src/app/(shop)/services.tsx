import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  getServiceCategories,
  getServicesByCategory,
  getAllServices,
} from "../../api/api";
import { Tables } from "../../types/database.types";
import BookingModal from "../../components/booking-modal";

const COLORS = {
  primary: "#1BC464",
  secondary: "#FF6B6B",
  tertiary: "#4ECDC4",
  quaternary: "#45B7D1",
  background: "#F8F9FA",
  white: "#FFFFFF",
  text: "#1D1D1F",
  textSecondary: "#8E8E93",
  border: "#E5E5E7",
};

const ServiceCard = ({
  service,
  onBook,
}: {
  service: any;
  onBook: () => void;
}) => (
  <View style={styles.serviceCard}>
    <View style={styles.serviceHeader}>
      <Text style={styles.serviceName}>{service.name}</Text>
      <View style={styles.ratingContainer}>
        <MaterialIcons name="star" size={16} color="#FFD700" />
        <Text style={styles.rating}>{service.rating}</Text>
      </View>
    </View>
    <Text style={styles.serviceProvider}>{service.provider}</Text>
    <View style={styles.serviceDetails}>
      <View style={styles.serviceInfo}>
        <MaterialIcons name="schedule" size={16} color={COLORS.textSecondary} />
        <Text style={styles.serviceDuration}>{service.duration}</Text>
      </View>
      <Text style={styles.servicePrice}>${service.price}</Text>
    </View>
    <TouchableOpacity style={styles.bookButton} onPress={onBook}>
      <Text style={styles.bookButtonText}>Book Now</Text>
    </TouchableOpacity>
  </View>
);

const CategoryCard = ({
  category,
  onPress,
}: {
  category: any;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.categoryCard} onPress={onPress}>
    <View
      style={[styles.categoryIcon, { backgroundColor: `${category.color}20` }]}>
      <MaterialIcons
        name={category.icon as any}
        size={30}
        color={category.color}
      />
    </View>
    <Text style={styles.categoryName}>{category.name}</Text>
    <Text style={styles.categoryDescription}>{category.description}</Text>
  </TouchableOpacity>
);

const Services = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);

  // Fetch service categories
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = getServiceCategories();

  // Fetch services for selected category
  const {
    data: services,
    isLoading: servicesLoading,
    error: servicesError,
  } = getServicesByCategory(selectedCategory!);

  // Conditionally fetch services if a category is selected
  const shouldFetchServices = selectedCategory !== null;

  const handleCategoryPress = (categoryId: number) => {
    setSelectedCategory(categoryId);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  const handleBookService = (service: any) => {
    setSelectedService(service);
    setBookingModalVisible(true);
  };

  const handleCloseBookingModal = () => {
    setBookingModalVisible(false);
    setSelectedService(null);
  };

  const selectedCategoryData = categories?.find(
    (cat) => cat.id === selectedCategory
  );

  // Loading state
  if (categoriesLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading services...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (categoriesError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialIcons
            name="error-outline"
            size={48}
            color={COLORS.secondary}
          />
          <Text style={styles.errorText}>Failed to load services</Text>
          <Text style={styles.errorSubtext}>Please try again later</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (selectedCategory && selectedCategoryData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackToCategories}>
            <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <View
              style={[
                styles.categoryIconSmall,
                { backgroundColor: `${selectedCategoryData.color}20` },
              ]}>
              <MaterialIcons
                name={selectedCategoryData.icon as any}
                size={24}
                color={selectedCategoryData.color}
              />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>
                {selectedCategoryData.name}
              </Text>
              <Text style={styles.headerSubtitle}>
                {services?.length || 0} services available
              </Text>
            </View>
          </View>
        </View>

        {servicesLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading services...</Text>
          </View>
        ) : servicesError ? (
          <View style={styles.errorContainer}>
            <MaterialIcons
              name="error-outline"
              size={48}
              color={COLORS.secondary}
            />
            <Text style={styles.errorText}>Failed to load services</Text>
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
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.mainHeader}>
          <Text style={styles.mainTitle}>Book Services</Text>
          <Text style={styles.mainSubtitle}>
            Find and book appointments for beauty, health, sports, and more
          </Text>
        </View>

        {/* Featured Banner */}
        <View style={styles.featuredBanner}>
          <Text style={styles.bannerTitle}>🎉 New Customer Special</Text>
          <Text style={styles.bannerText}>Get 20% off your first booking!</Text>
        </View>

        {/* Service Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Service Categories</Text>
          <View style={styles.categoriesGrid}>
            {categories?.map((category) => (
              <CategoryCard
                key={category.id}
                category={{
                  id: category.id.toString(),
                  name: category.name,
                  icon: category.icon,
                  color: category.color,
                  description: category.description,
                  services: [], // This will be loaded when category is selected
                }}
                onPress={() => handleCategoryPress(category.id)}
              />
            ))}
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Booking Modal */}
      <BookingModal
        visible={bookingModalVisible}
        onClose={handleCloseBookingModal}
        service={selectedService}
      />
    </SafeAreaView>
  );
};

export default Services;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    marginRight: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIconSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text,
  },
  mainHeader: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },
  mainSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  featuredBanner: {
    backgroundColor: COLORS.primary,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.white,
    marginBottom: 4,
  },
  bannerText: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
  },
  categoriesSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryCard: {
    width: "48%",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 16,
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 4,
  },
  servicesList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  serviceCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    flex: 1,
    marginRight: 12,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
    marginLeft: 4,
  },
  serviceProvider: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
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
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
  },
  bookButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.white,
  },
  bottomSpacing: {
    height: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginTop: 12,
    textAlign: "center",
  },
  errorSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: "center",
  },
  headerTextContainer: {
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
