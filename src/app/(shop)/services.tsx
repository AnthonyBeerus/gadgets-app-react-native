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
} from "../../shared/api/api";
import { Tables } from "../../shared/types/database.types";
import BookingModal from "../../features/appointments/components/BookingModal";
import { NEO_THEME } from "../../shared/constants/neobrutalism";
import { AnimatedHeaderLayout } from "../../shared/components/layout/AnimatedHeaderLayout";

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
          <ActivityIndicator size="large" color={NEO_THEME.colors.primary} />
          <Text style={styles.loadingText}>LOADING SERVICES...</Text>
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
            color={NEO_THEME.colors.yellow}
          />
          <Text style={styles.errorText}>FAILED TO LOAD SERVICES</Text>
          <Text style={styles.errorSubtext}>PLEASE TRY AGAIN LATER</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (selectedCategory && selectedCategoryData) {
    const renderSmallTitle = () => (
      <Text style={styles.headerTitle}>{selectedCategoryData.name.toUpperCase()}</Text>
    );

    const renderLargeTitle = () => (
      <View>
        <Text style={styles.largeHeaderTitle}>{selectedCategoryData.name.toUpperCase()}</Text>
        <Text style={styles.headerSubtitle}>{services?.length || 0} services available</Text>
      </View>
    );

    return (
      <AnimatedHeaderLayout
        renderSmallTitle={renderSmallTitle}
        renderLargeTitle={renderLargeTitle}
        onBackPress={handleBackToCategories}
      >

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
      </AnimatedHeaderLayout>
    );
  }

  const renderSmallTitle = () => (
    <Text style={styles.headerTitle}>BOOK SERVICES</Text>
  );

  const renderLargeTitle = () => (
    <View>
      <Text style={styles.largeHeaderTitle}>BOOK SERVICES</Text>
      <Text style={styles.largeHeaderSubtitle}>
        Find and book appointments for beauty, health, sports, and more
      </Text>
    </View>
  );

  return (
    <AnimatedHeaderLayout
      renderSmallTitle={renderSmallTitle}
      renderLargeTitle={renderLargeTitle}
    >

        {/* Featured Banner */}
        <View style={styles.featuredBanner}>
          <Text style={styles.bannerTitle}>🎉 New Customer Special</Text>
          <Text style={styles.bannerText}>Get 20% off your first booking!</Text>
        </View>

        {/* Service Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>SERVICE CATEGORIES</Text>
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

      {/* Booking Modal */}
      <BookingModal
        visible={bookingModalVisible}
        onClose={handleCloseBookingModal}
        service={selectedService}
      />
    </AnimatedHeaderLayout>
  );
};

export default Services;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEO_THEME.colors.backgroundLight,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
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
    marginRight: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIconSmall: {
    width: 32,
    height: 32,
    borderRadius: NEO_THEME.borders.radius,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  largeHeaderTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  largeHeaderSubtitle: {
    fontSize: 16,
    color: NEO_THEME.colors.grey,
    fontWeight: "700",
    fontFamily: NEO_THEME.fonts.bold,
    lineHeight: 22,
  },
  mainHeader: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    marginBottom: 8,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  mainSubtitle: {
    fontSize: 16,
    color: NEO_THEME.colors.grey,
    lineHeight: 22,
  },
  featuredBanner: {
    backgroundColor: NEO_THEME.colors.yellow,
    marginHorizontal: 20,
    borderRadius: NEO_THEME.borders.radius,
    padding: 20,
    marginBottom: 24,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    marginBottom: 4,
    fontFamily: NEO_THEME.fonts.black,
  },
  bannerText: {
    fontSize: 14,
    color: NEO_THEME.colors.black,
    fontWeight: "700",
    fontFamily: NEO_THEME.fonts.bold,
  },
  categoriesSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    marginBottom: 16,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryCard: {
    width: "48%",
    backgroundColor: NEO_THEME.colors.white,
    borderRadius: NEO_THEME.borders.radius,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: NEO_THEME.borders.radius,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    textAlign: "center",
    marginBottom: 4,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  categoryDescription: {
    fontSize: 12,
    color: NEO_THEME.colors.grey,
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
    backgroundColor: NEO_THEME.colors.white,
    borderRadius: NEO_THEME.borders.radius,
    padding: 16,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    marginTop: 8,
    fontFamily: NEO_THEME.fonts.black,
  },
  statLabel: {
    fontSize: 12,
    color: NEO_THEME.colors.grey,
    textAlign: "center",
    marginTop: 4,
    fontWeight: "700",
    fontFamily: NEO_THEME.fonts.bold,
  },
  servicesList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
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
  errorSubtext: {
    fontSize: 14,
    color: NEO_THEME.colors.grey,
    marginTop: 4,
    textAlign: "center",
    fontWeight: "700",
    fontFamily: NEO_THEME.fonts.bold,
    textTransform: "uppercase",
  },
  headerTextContainer: {
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 14,
    color: NEO_THEME.colors.grey,
    marginTop: 2,
  },
});
