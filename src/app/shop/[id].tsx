import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getShopById, getShopProducts } from "../../shared/api/shops";
import { supabase } from "../../shared/lib/supabase";
import TryOnModal from "../../features/virtual-try-on/components/TryOnModal";
import BookingModal from "../../components/booking-modal";
import { useBookingStore } from "../../store/booking-store";
import { NeoView } from "../../shared/components/ui/neo-view";
import { NEO_THEME } from "../../shared/constants/neobrutalism";

export default function ShopDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { openBookingModal } = useBookingStore();

  const [shop, setShop] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [tryOnModalVisible, setTryOnModalVisible] = useState(false);
  const [serviceSelectionVisible, setServiceSelectionVisible] = useState(false);

  useEffect(() => {
    if (id) {
      console.log("Shop ID from URL:", id);
      console.log("Parsed Shop ID:", parseInt(id));
      loadShopDetails();
      loadShopProducts();
    }
  }, [id]);

  const loadShopDetails = async () => {
    try {
      setLoading(true);
      const shopId = parseInt(id!);
      console.log("Fetching shop with ID:", shopId);

      if (isNaN(shopId)) {
        throw new Error(`Invalid shop ID: ${id}`);
      }

      const shopData = await getShopById(shopId);
      console.log("Shop data received:", shopData?.name || "null");
      setShop(shopData);
    } catch (error) {
      console.error("Error loading shop details:", error);
      Alert.alert(
        "Error",
        `Failed to load shop details. Shop ID: ${id}\n\nError: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const loadShopProducts = async () => {
    try {
      setProductsLoading(true);
      const productsData = await getShopProducts(parseInt(id!));
      setProducts(productsData || []);
    } catch (error) {
      console.error("Error loading shop products:", error);
      // Don't show error for products - gracefully degrade
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  const loadShopServices = async () => {
    try {
      console.log("Loading services for shop ID:", id);
      setServicesLoading(true);
      // Fetch services associated with this shop through service_provider
      const { data, error } = await supabase
        .from("service")
        .select(
          `
          *,
          service_provider!inner (
            id,
            name,
            rating,
            total_reviews,
            is_verified,
            shop_id
          )
        `
        )
        .eq("service_provider.shop_id", parseInt(id!))
        .eq("is_active", true)
        .order("name");

      console.log("Services query result:", { data, error });
      console.log("Number of services found:", data?.length || 0);

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error("Error loading shop services:", error);
      setServices([]);
    } finally {
      setServicesLoading(false);
    }
  };

  const handleBrowseProducts = () => {
    if (products.length > 0) {
      // Navigate to product listing page with shop filter
      router.push(
        `/product?shop=${shop.id}&shopName=${encodeURIComponent(shop.name)}`
      );
    } else {
      Alert.alert(
        "Products",
        "Contact the shop directly for available products and services."
      );
    }
  };

  const handleBookAppointment = () => {
    console.log("Book Appointment clicked for shop:", shop.name);
    // Load services when user clicks book appointment
    loadShopServices();
    setServiceSelectionVisible(true);
  };

  const handleServiceSelect = (service: any) => {
    setServiceSelectionVisible(false);

    // Create shop context for booking modal
    const shopContext = {
      id: shop.id,
      name: shop.name,
      logo_url: shop.logo_url,
      image_url: shop.image_url,
      location: shop.location,
      phone: shop.phone,
    };

    console.log("Shop Detail - Selected service:", service);
    console.log("Shop Detail - Shop context:", shopContext);

    openBookingModal(service, shopContext);
  };

  const handleCallShop = () => {
    if (shop?.phone) {
      const phoneUrl = `tel:${shop.phone}`;
      Linking.canOpenURL(phoneUrl).then((supported) => {
        if (supported) {
          Linking.openURL(phoneUrl);
        } else {
          Alert.alert("Error", "Phone dialer not available");
        }
      });
    }
  };

  const handleVirtualTryOn = () => {
    setTryOnModalVisible(true);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={NEO_THEME.colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>LOADING...</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={NEO_THEME.colors.primary} />
          <Text style={styles.loadingText}>LOADING SHOP DETAILS...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!shop) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={NEO_THEME.colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>SHOP NOT FOUND</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="storefront-outline" size={64} color={NEO_THEME.colors.grey} />
          <Text style={styles.emptyTitle}>SHOP NOT FOUND</Text>
          <Text style={styles.emptySubtitle}>
            The shop you're looking for could not be found.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={NEO_THEME.colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {shop?.name?.toUpperCase() || "SHOP DETAILS"}
        </Text>
        {shop?.is_featured && (
          <View style={styles.featuredBadge}>
            <Ionicons name="star" size={16} color={NEO_THEME.colors.black} />
          </View>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Shop Image */}
        {shop.image_url && (
          <Image source={{ uri: shop.image_url }} style={styles.shopImage} />
        )}

        {/* Shop Info */}
        <View style={styles.shopInfo}>
          <Text style={styles.categoryName}>{shop.category?.name?.toUpperCase() || "SHOP"}</Text>

          {shop.description && (
            <Text style={styles.description}>{shop.description}</Text>
          )}

          {/* Quick Actions - Prominent CTAs */}
          <View style={styles.quickActionsSection}>
            <TouchableOpacity
              style={styles.primaryActionButton}
              onPress={handleBrowseProducts}>
              <Ionicons name="storefront" size={24} color={NEO_THEME.colors.white} />
              <Text style={styles.primaryActionText}>BROWSE PRODUCTS</Text>
            </TouchableOpacity>

            <View style={styles.secondaryActions}>
              {shop.has_appointment_booking && (
                <TouchableOpacity
                  style={styles.secondaryActionButton}
                  onPress={handleBookAppointment}>
                  <Ionicons name="calendar" size={20} color={NEO_THEME.colors.black} />
                  <Text style={styles.secondaryActionText}>
                    BOOK
                  </Text>
                </TouchableOpacity>
              )}

              {shop.phone && (
                <TouchableOpacity
                  style={styles.secondaryActionButton}
                  onPress={handleCallShop}>
                  <Ionicons name="call" size={20} color={NEO_THEME.colors.black} />
                  <Text style={styles.secondaryActionText}>CALL</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Products & Services Section - Priority placement */}
          <View style={styles.productsSection}>
            <View style={styles.productsSectionHeader}>
              <Text style={styles.sectionTitle}>PRODUCTS & SERVICES</Text>
              {products.length > 0 && (
                <TouchableOpacity style={styles.viewAllButton}>
                  <Text style={styles.viewAllText}>
                    VIEW ALL ({products.length})
                  </Text>
                  <Ionicons name="arrow-forward" size={16} color={NEO_THEME.colors.primary} />
                </TouchableOpacity>
              )}
            </View>

            {productsLoading ? (
              <View style={styles.productsLoadingContainer}>
                <ActivityIndicator size="small" color={NEO_THEME.colors.primary} />
                <Text style={styles.loadingText}>LOADING PRODUCTS...</Text>
              </View>
            ) : products.length > 0 ? (
              <>
                <View style={styles.productsHighlight}>
                  {products.slice(0, 2).map((product, index) => (
                    <TouchableOpacity
                      key={product.id}
                      style={styles.productCardPreview}
                      onPress={() => router.push(`/product/${product.slug}`)}>
                      {product.imageUrl ? (
                        <Image
                          source={{ uri: product.imageUrl }}
                          style={styles.productPreviewImage}
                        />
                      ) : (
                        <Ionicons name="cube" size={32} color={NEO_THEME.colors.grey} />
                      )}
                      <Text
                        style={styles.productPreviewTitle}
                        numberOfLines={1}>
                        {product.name}
                      </Text>
                      {product.price && (
                        <Text style={styles.productPreviewPrice}>
                          P
                          {typeof product.price === "number"
                            ? product.price.toFixed(2)
                            : product.price}
                        </Text>
                      )}
                    </TouchableOpacity>
                  ))}

                  {products.length === 1 && (
                    <View style={styles.productCardPreview}>
                      <Ionicons name="construct" size={32} color={NEO_THEME.colors.primary} />
                      <Text style={styles.productPreviewTitle}>
                        Expert Services
                      </Text>
                      <Text style={styles.productPreviewSubtitle}>
                        Professional assistance available
                      </Text>
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  style={styles.exploreProductsButton}
                  onPress={handleBrowseProducts}>
                  <Text style={styles.exploreProductsText}>
                    EXPLORE ALL {products.length} PRODUCT
                    {products.length !== 1 ? "S" : ""}
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color={NEO_THEME.colors.white} />
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.productsHighlight}>
                <View style={styles.productCardPreview}>
                  <Ionicons name="cube" size={32} color={NEO_THEME.colors.primary} />
                  <Text style={styles.productPreviewTitle}>
                    QUALITY PRODUCTS
                  </Text>
                  <Text style={styles.productPreviewSubtitle}>
                    Carefully selected items
                  </Text>
                </View>

                <View style={styles.productCardPreview}>
                  <Ionicons name="construct" size={32} color={NEO_THEME.colors.grey} />
                  <Text style={styles.productPreviewTitle}>
                    Expert Services
                  </Text>
                  <Text style={styles.productPreviewSubtitle}>
                    Professional assistance available
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Available Services */}
          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>SERVICES</Text>
            <View style={styles.featuresGrid}>
              {shop.has_delivery && (
                <View style={styles.featureCard}>
                  <Ionicons name="bicycle" size={24} color={NEO_THEME.colors.black} />
                  <Text style={styles.featureLabel}>DELIVERY</Text>
                  {shop.delivery_fee && (
                    <Text style={styles.featureDetail}>
                      FROM P{shop.delivery_fee}
                    </Text>
                  )}
                </View>
              )}

              {shop.has_collection && (
                <View style={styles.featureCard}>
                  <Ionicons name="bag-handle" size={24} color={NEO_THEME.colors.black} />
                  <Text style={styles.featureLabel}>COLLECTION</Text>
                </View>
              )}

              {shop.has_appointment_booking && (
                <View style={styles.featureCard}>
                  <Ionicons name="calendar" size={24} color={NEO_THEME.colors.black} />
                  <Text style={styles.featureLabel}>APPOINTMENTS</Text>
                </View>
              )}

              {shop.has_virtual_try_on && (
                <TouchableOpacity
                  style={styles.featureCard}
                  onPress={handleVirtualTryOn}>
                  <Ionicons name="glasses" size={24} color={NEO_THEME.colors.black} />
                  <Text style={styles.featureLabel}>TRY-ON</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Shop Details */}
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>DETAILS</Text>

            {shop.location && (
              <View style={styles.detailRow}>
                <Ionicons name="location" size={20} color={NEO_THEME.colors.black} />
                <Text style={styles.detailText}>{shop.location}</Text>
              </View>
            )}

            {shop.phone && (
              <View style={styles.detailRow}>
                <Ionicons name="call" size={20} color={NEO_THEME.colors.black} />
                <Text style={styles.detailText}>{shop.phone}</Text>
              </View>
            )}

            {shop.rating && shop.rating > 0 && (
              <View style={styles.detailRow}>
                <Ionicons name="star" size={20} color={NEO_THEME.colors.yellow} />
                <Text style={styles.detailText}>
                  {shop.rating.toFixed(1)} RATING
                </Text>
              </View>
            )}
          </View>

          {/* Opening Hours */}
          {shop.opening_hours && (
            <View style={styles.hoursSection}>
              <Text style={styles.sectionTitle}>Opening Hours</Text>
              <View style={styles.hoursContainer}>
                <Text style={styles.hoursText}>
                  {typeof shop.opening_hours === "string"
                    ? shop.opening_hours
                    : JSON.stringify(shop.opening_hours, null, 2)}
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <TryOnModal
        visible={tryOnModalVisible}
        onClose={() => setTryOnModalVisible(false)}
        shopProducts={products}
      />

      {/* Service Selection Modal */}
      <Modal
        visible={serviceSelectionVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setServiceSelectionVisible(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>SELECT SERVICE</Text>
            <TouchableOpacity
              onPress={() => setServiceSelectionVisible(false)}
              style={styles.closeButton}>
              <Ionicons name="close" size={28} color={NEO_THEME.colors.black} />
            </TouchableOpacity>
          </View>

          {servicesLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={NEO_THEME.colors.primary} />
              <Text style={styles.loadingText}>LOADING SERVICES...</Text>
            </View>
          ) : services.length > 0 ? (
            <ScrollView style={styles.servicesList}>
              {services.map((service) => (
                <TouchableOpacity
                  key={service.id}
                  style={styles.serviceCard}
                  onPress={() => handleServiceSelect(service)}>
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName}>{service.name?.toUpperCase() || "SERVICE"}</Text>
                    {service.description && (
                      <Text style={styles.serviceDescription} numberOfLines={2}>
                        {service.description}
                      </Text>
                    )}
                    <View style={styles.serviceDetails}>
                      <View style={styles.serviceDetailItem}>
                        <Ionicons name="time-outline" size={16} color={NEO_THEME.colors.grey} />
                        <Text style={styles.serviceDetailText}>
                          {service.duration_minutes} MIN
                        </Text>
                      </View>
                      {service.service_provider && (
                        <View style={styles.serviceDetailItem}>
                          <Ionicons
                            name="person-outline"
                            size={16}
                            color={NEO_THEME.colors.grey}
                          />
                          <Text style={styles.serviceDetailText}>
                            {service.service_provider.name}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <View style={styles.servicePriceContainer}>
                    <Text style={styles.servicePrice}>
                      P{service.price.toFixed(2)}
                    </Text>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={NEO_THEME.colors.black}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={64} color={NEO_THEME.colors.grey} />
              <Text style={styles.emptyTitle}>NO SERVICES</Text>
              <Text style={styles.emptySubtitle}>
                This shop doesn't have any bookable services at the moment.
              </Text>
            </View>
          )}
        </SafeAreaView>
      </Modal>

      {/* Booking Modal - controlled by Zustand store */}
      <BookingModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEO_THEME.colors.backgroundLight,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: NEO_THEME.colors.white,
    borderBottomWidth: NEO_THEME.borders.width,
    borderBottomColor: NEO_THEME.colors.black,
    gap: 8,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    flex: 1,
    marginRight: 8,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "700",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.bold,
    textTransform: "uppercase",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    marginTop: 16,
    marginBottom: 8,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  emptySubtitle: {
    fontSize: 14,
    color: NEO_THEME.colors.grey,
    textAlign: "center",
    lineHeight: 20,
  },
  content: {
    flex: 1,
  },
  shopImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  shopInfo: {
    padding: 20,
  },
  featuredBadge: {
    backgroundColor: NEO_THEME.colors.yellow,
    padding: 6,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryName: {
    fontSize: 16,
    color: NEO_THEME.colors.primary,
    marginBottom: 16,
    fontWeight: "700",
    marginTop: 4,
    fontFamily: NEO_THEME.fonts.bold,
    textTransform: "uppercase",
  },
  description: {
    fontSize: 16,
    color: NEO_THEME.colors.black,
    lineHeight: 24,
    marginBottom: 24,
  },
  detailsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    marginBottom: 16,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: NEO_THEME.colors.black,
    marginLeft: 12,
    fontWeight: "600",
  },
  featuresSection: {
    marginBottom: 24,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureCard: {
    backgroundColor: NEO_THEME.colors.white,
    padding: 16,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    alignItems: "center",
    width: "48%",
    marginBottom: 12,
    // Hard shadow
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  featureLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: NEO_THEME.colors.black,
    marginTop: 8,
    fontFamily: NEO_THEME.fonts.bold,
    textTransform: "uppercase",
  },
  featureDetail: {
    fontSize: 12,
    color: NEO_THEME.colors.grey,
    marginTop: 4,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  hoursSection: {
    marginBottom: 24,
  },
  hoursContainer: {
    backgroundColor: NEO_THEME.colors.white,
    padding: 16,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    // Hard shadow
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  hoursText: {
    fontSize: 14,
    color: NEO_THEME.colors.black,
    lineHeight: 20,
  },
  productsSection: {
    marginBottom: 24,
  },
  // Quick Actions Styles
  quickActionsSection: {
    marginBottom: 24,
  },
  primaryActionButton: {
    backgroundColor: NEO_THEME.colors.blue,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    marginBottom: 16,
    // Hard shadow
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  primaryActionText: {
    fontSize: 18,
    fontWeight: "900",
    color: NEO_THEME.colors.white,
    marginLeft: 8,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  secondaryActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  secondaryActionButton: {
    backgroundColor: NEO_THEME.colors.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    flex: 1,
    // Hard shadow
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  secondaryActionText: {
    fontSize: 14,
    fontWeight: "700",
    color: NEO_THEME.colors.black,
    marginLeft: 6,
    fontFamily: NEO_THEME.fonts.bold,
    textTransform: "uppercase",
  },
  // Enhanced Products Section Styles
  productsSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "700",
    color: NEO_THEME.colors.primary,
    marginRight: 4,
    fontFamily: NEO_THEME.fonts.bold,
    textTransform: "uppercase",
  },
  productsHighlight: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 12,
  },
  productCardPreview: {
    backgroundColor: NEO_THEME.colors.white,
    padding: 20,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    alignItems: "center",
    flex: 1,
    // Hard shadow
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  productPreviewTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: NEO_THEME.colors.black,
    marginTop: 12,
    marginBottom: 4,
    textAlign: "center",
    fontFamily: NEO_THEME.fonts.bold,
    textTransform: "uppercase",
  },
  productPreviewSubtitle: {
    fontSize: 12,
    color: NEO_THEME.colors.grey,
    textAlign: "center",
    lineHeight: 16,
  },
  exploreProductsButton: {
    backgroundColor: NEO_THEME.colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    // Hard shadow
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  exploreProductsText: {
    fontSize: 16,
    fontWeight: "900",
    color: NEO_THEME.colors.white,
    marginRight: 8,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  // Additional product display styles
  productsLoadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: NEO_THEME.colors.white,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    marginBottom: 16,
  },
  productPreviewImage: {
    width: 48,
    height: 48,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    resizeMode: "cover",
    marginBottom: 8,
  },
  productPreviewPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: NEO_THEME.colors.black,
    marginTop: 4,
    backgroundColor: NEO_THEME.colors.yellow,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontFamily: NEO_THEME.fonts.bold,
  },
  // Service Selection Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: NEO_THEME.colors.backgroundLight,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: NEO_THEME.colors.white,
    borderBottomWidth: NEO_THEME.borders.width,
    borderBottomColor: NEO_THEME.colors.black,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  closeButton: {
    padding: 8,
  },
  servicesList: {
    flex: 1,
    padding: 16,
  },
  serviceCard: {
    backgroundColor: NEO_THEME.colors.white,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // Hard shadow
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  serviceInfo: {
    flex: 1,
    marginRight: 12,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "700",
    color: NEO_THEME.colors.black,
    marginBottom: 4,
    fontFamily: NEO_THEME.fonts.bold,
    textTransform: "uppercase",
  },
  serviceDescription: {
    fontSize: 14,
    color: NEO_THEME.colors.grey,
    marginBottom: 8,
    lineHeight: 20,
  },
  serviceDetails: {
    flexDirection: "row",
    gap: 16,
  },
  serviceDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  serviceDetailText: {
    fontSize: 13,
    color: NEO_THEME.colors.grey,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  servicePriceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  servicePrice: {
    fontSize: 20,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    backgroundColor: NEO_THEME.colors.yellow,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontFamily: NEO_THEME.fonts.black,
  },
});
