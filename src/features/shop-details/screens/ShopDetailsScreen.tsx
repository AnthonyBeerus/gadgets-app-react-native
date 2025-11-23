import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getShopById, getShopProducts } from "../../../shared/api/shops";
import { supabase } from "../../../shared/lib/supabase";
import TryOnModal from "../../virtual-try-on/components/TryOnModal";
import BookingModal from "../../../components/booking-modal";
import { useBookingStore } from "../../../store/booking-store";
import { StaticHeader } from "../../../shared/components/layout/StaticHeader";
import { NEO_THEME } from "../../../shared/constants/neobrutalism";
import { NeoButton } from "../../../shared/components/ui/neo-button";

export default function ShopDetailsScreen() {
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
      loadShopDetails();
      loadShopProducts();
    }
  }, [id]);

  const loadShopDetails = async () => {
    try {
      setLoading(true);
      const shopId = parseInt(id!);
      if (isNaN(shopId)) throw new Error(`Invalid shop ID: ${id}`);

      const shopData = await getShopById(shopId);
      setShop(shopData);
    } catch (error) {
      console.error("Error loading shop details:", error);
      Alert.alert("Error", "Failed to load shop details.");
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
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  const loadShopServices = async () => {
    try {
      setServicesLoading(true);
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
    loadShopServices();
    setServiceSelectionVisible(true);
  };

  const handleServiceSelect = (service: any) => {
    setServiceSelectionVisible(false);
    const shopContext = {
      id: shop.id,
      name: shop.name,
      logo_url: shop.logo_url,
      image_url: shop.image_url,
      location: shop.location,
      phone: shop.phone,
    };
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={NEO_THEME.colors.primary} />
      </View>
    );
  }

  if (!shop) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>SHOP NOT FOUND</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StaticHeader 
        title={shop.name.toUpperCase()} 
        onBackPress={() => router.back()} 
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Shop Image */}
        {shop.image_url && (
          <Image source={{ uri: shop.image_url }} style={styles.shopImage} />
        )}

        {/* Shop Info */}
        <View style={styles.shopInfo}>
          {shop.description && (
            <Text style={styles.description}>{shop.description}</Text>
          )}

          {/* Quick Actions */}
          <View style={styles.quickActionsSection}>
            <NeoButton
              onPress={handleBrowseProducts}
              style={styles.primaryActionButton}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="storefront" size={24} color={NEO_THEME.colors.white} style={{ marginRight: 8 }} />
                <Text style={styles.primaryActionText}>BROWSE PRODUCTS</Text>
              </View>
            </NeoButton>

            <View style={styles.secondaryActions}>
              {shop.has_appointment_booking && (
                <TouchableOpacity
                  style={styles.secondaryActionButton}
                  onPress={handleBookAppointment}
                >
                  <Ionicons name="calendar" size={20} color={NEO_THEME.colors.black} />
                  <Text style={styles.secondaryActionText}>BOOK</Text>
                </TouchableOpacity>
              )}

              {shop.phone && (
                <TouchableOpacity
                  style={styles.secondaryActionButton}
                  onPress={handleCallShop}
                >
                  <Ionicons name="call" size={20} color={NEO_THEME.colors.black} />
                  <Text style={styles.secondaryActionText}>CALL</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Products Preview */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>PRODUCTS & SERVICES</Text>
              {products.length > 0 && (
                <TouchableOpacity onPress={handleBrowseProducts}>
                  <Text style={styles.viewAllText}>VIEW ALL</Text>
                </TouchableOpacity>
              )}
            </View>

            {productsLoading ? (
              <ActivityIndicator color={NEO_THEME.colors.primary} />
            ) : products.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productsScroll}>
                {products.slice(0, 5).map((product) => (
                  <TouchableOpacity
                    key={product.id}
                    style={styles.productCard}
                    onPress={() => router.push(`/product/${product.slug}`)}
                  >
                    <Image
                      source={{ uri: product.imageUrl || "https://via.placeholder.com/150" }}
                      style={styles.productImage}
                    />
                    <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                    <Text style={styles.productPrice}>P{product.price}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.emptyText}>No products available.</Text>
            )}
          </View>

          {/* Services Grid */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SERVICES</Text>
            <View style={styles.featuresGrid}>
              {shop.has_delivery && (
                <View style={styles.featureCard}>
                  <Ionicons name="bicycle" size={24} color={NEO_THEME.colors.black} />
                  <Text style={styles.featureLabel}>DELIVERY</Text>
                </View>
              )}
              {shop.has_collection && (
                <View style={styles.featureCard}>
                  <Ionicons name="bag-handle" size={24} color={NEO_THEME.colors.black} />
                  <Text style={styles.featureLabel}>COLLECTION</Text>
                </View>
              )}
              {shop.has_virtual_try_on && (
                <TouchableOpacity style={styles.featureCard} onPress={handleVirtualTryOn}>
                  <Ionicons name="glasses" size={24} color={NEO_THEME.colors.black} />
                  <Text style={styles.featureLabel}>TRY-ON</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>DETAILS</Text>
            {shop.location && (
              <View style={styles.detailRow}>
                <Ionicons name="location" size={20} color={NEO_THEME.colors.black} />
                <Text style={styles.detailText}>{shop.location}</Text>
              </View>
            )}
            {shop.rating && (
              <View style={styles.detailRow}>
                <Ionicons name="star" size={20} color={NEO_THEME.colors.yellow} />
                <Text style={styles.detailText}>{shop.rating.toFixed(1)} RATING</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <TryOnModal
        visible={tryOnModalVisible}
        onClose={() => setTryOnModalVisible(false)}
        shopProducts={products}
      />

      <Modal
        visible={serviceSelectionVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setServiceSelectionVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>SELECT SERVICE</Text>
            <TouchableOpacity onPress={() => setServiceSelectionVisible(false)}>
              <Ionicons name="close" size={28} color={NEO_THEME.colors.black} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.servicesList}>
            {services.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={styles.serviceCard}
                onPress={() => handleServiceSelect(service)}
              >
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.servicePrice}>P{service.price.toFixed(2)}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <BookingModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEO_THEME.colors.backgroundLight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
  },
  shopImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
    borderBottomWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
  },
  shopInfo: {
    padding: 20,
  },
  description: {
    fontSize: 16,
    color: NEO_THEME.colors.black,
    marginBottom: 24,
    lineHeight: 24,
  },
  quickActionsSection: {
    marginBottom: 24,
  },
  primaryActionButton: {
    marginBottom: 16,
  },
  primaryActionText: {
    color: NEO_THEME.colors.white,
    fontWeight: "900",
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 16,
  },
  secondaryActions: {
    flexDirection: "row",
    gap: 12,
  },
  secondaryActionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    backgroundColor: NEO_THEME.colors.white,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    borderRadius: NEO_THEME.borders.radius,
    gap: 8,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  secondaryActionText: {
    fontWeight: "900",
    fontFamily: NEO_THEME.fonts.black,
    color: NEO_THEME.colors.black,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  viewAllText: {
    color: NEO_THEME.colors.primary,
    fontWeight: "700",
    fontFamily: NEO_THEME.fonts.bold,
  },
  productsScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  productCard: {
    width: 140,
    marginRight: 12,
    backgroundColor: NEO_THEME.colors.white,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    borderRadius: NEO_THEME.borders.radius,
    padding: 8,
  },
  productImage: {
    width: "100%",
    height: 100,
    marginBottom: 8,
    borderRadius: NEO_THEME.borders.radius,
  },
  productName: {
    fontWeight: "700",
    fontFamily: NEO_THEME.fonts.bold,
    marginBottom: 4,
  },
  productPrice: {
    fontWeight: "900",
    fontFamily: NEO_THEME.fonts.black,
    color: NEO_THEME.colors.primary,
  },
  emptyText: {
    color: NEO_THEME.colors.grey,
    fontStyle: "italic",
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  featureCard: {
    width: "48%",
    backgroundColor: NEO_THEME.colors.white,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    borderRadius: NEO_THEME.borders.radius,
    padding: 16,
    alignItems: "center",
    gap: 8,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  featureLabel: {
    fontWeight: "900",
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 12,
  },
  detailText: {
    fontSize: 16,
    color: NEO_THEME.colors.black,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: NEO_THEME.colors.backgroundLight,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    backgroundColor: NEO_THEME.colors.white,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "900",
    fontFamily: NEO_THEME.fonts.black,
  },
  servicesList: {
    flex: 1,
    padding: 20,
  },
  serviceCard: {
    backgroundColor: NEO_THEME.colors.white,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    borderRadius: NEO_THEME.borders.radius,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  serviceName: {
    fontWeight: "700",
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 16,
  },
  servicePrice: {
    fontWeight: "900",
    fontFamily: NEO_THEME.fonts.black,
    color: NEO_THEME.colors.primary,
  },
});
