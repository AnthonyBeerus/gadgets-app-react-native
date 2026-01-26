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
import { NuviaButton } from "../../../shared/components/ui/nuvia-button";
import { NuviaText } from "../../../components/atoms/nuvia-text";
import { NuviaTag } from "../../../shared/components/ui/nuvia-tag";
import { useCartStore } from "../../../store/cart-store";
import { NuviaProductCard } from "../../../components/molecules/nuvia-product-card";

export default function ShopDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { openBookingModal } = useBookingStore();
  const { items } = useCartStore(); // Added hook usage

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
        <NuviaText variant="h2">SHOP NOT FOUND</NuviaText>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StaticHeader 
        title={shop.name} 
        onBackPress={() => router.back()} 
        rightElement={
          <TouchableOpacity onPress={() => router.push("/cart")} style={{ position: 'relative' }}>
            <Ionicons name="cart" size={24} color={NEO_THEME.colors.black} />
            {items.length > 0 && (
              <NuviaTag 
                label={items.length.toString()} 
                color={NEO_THEME.colors.primary} 
                style={{
                  position: 'absolute',
                  top: -6,
                  right: -6,
                  paddingHorizontal: 4,
                  minWidth: 18,
                  height: 18,
                  borderRadius: 9,
                }}
                textStyle={{ fontSize: 10, color: NEO_THEME.colors.white }}
              />
            )}
          </TouchableOpacity>
        }
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Shop Image */}
        {shop.image_url && (
          <Image source={{ uri: shop.image_url }} style={styles.shopImage} />
        )}

        {/* Shop Info */}
        <View style={styles.shopInfo}>
          {shop.description && (
            <NuviaText variant="body" style={styles.description}>
              {shop.description}
            </NuviaText>
          )}

          {/* Quick Actions */}
          <View style={styles.quickActionsSection}>
            <NuviaButton
              onPress={handleBrowseProducts}
              variant="primary"
              style={styles.primaryActionButton}
            >
                <Ionicons name="storefront" size={20} color={NEO_THEME.colors.white} style={{ marginRight: 8 }} />
                <NuviaText variant="label" color={NEO_THEME.colors.white}>
                    BROWSE PRODUCTS
                </NuviaText>
            </NuviaButton>

            <View style={styles.secondaryActions}>
              {shop.has_appointment_booking && (
                <TouchableOpacity
                  style={styles.secondaryActionButton}
                  onPress={handleBookAppointment}
                >
                  <Ionicons name="calendar" size={18} color={NEO_THEME.colors.black} />
                  <NuviaText variant="label">BOOK</NuviaText>
                </TouchableOpacity>
              )}

              {shop.phone && (
                <TouchableOpacity
                  style={styles.secondaryActionButton}
                  onPress={handleCallShop}
                >
                  <Ionicons name="call" size={18} color={NEO_THEME.colors.black} />
                  <NuviaText variant="label">CALL</NuviaText>
                </TouchableOpacity>
              )}
            </View>
          </View>



          {/* Services Grid */}
          <View style={styles.section}>
            <NuviaText variant="h3" style={styles.sectionTitle}>SERVICES</NuviaText>
            <View style={styles.featuresGrid}>
              {shop.has_delivery && (
                <View style={styles.featureCard}>
                   <View style={styles.featureIconContainer}>
                    <Ionicons name="bicycle" size={24} color={NEO_THEME.colors.black} />
                   </View>
                   <NuviaText variant="label">DELIVERY</NuviaText>
                </View>
              )}
              {shop.has_collection && (
                <View style={styles.featureCard}>
                   <View style={styles.featureIconContainer}>
                    <Ionicons name="bag-handle" size={24} color={NEO_THEME.colors.black} />
                   </View>
                   <NuviaText variant="label">COLLECTION</NuviaText>
                </View>
              )}
              {shop.has_virtual_try_on && (
                <TouchableOpacity style={styles.featureCard} onPress={handleVirtualTryOn}>
                   <View style={[styles.featureIconContainer, { backgroundColor: NEO_THEME.colors.primary }]}>
                    <Ionicons name="glasses" size={24} color={NEO_THEME.colors.white} />
                   </View>
                   <NuviaText variant="label">TRY-ON</NuviaText>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Details */}
          <View style={styles.section}>
            <NuviaText variant="h3" style={styles.sectionTitle}>DETAILS</NuviaText>
            {shop.location && (
              <View style={styles.detailRow}>
                <Ionicons name="location" size={20} color={NEO_THEME.colors.black} />
                <NuviaText variant="body">{shop.location}</NuviaText>
              </View>
            )}
            {shop.rating && (
              <View style={styles.detailRow}>
                <Ionicons name="star" size={20} color={NEO_THEME.colors.secondary} />
                <NuviaText variant="bodyBold">{shop.rating.toFixed(1)} RATING</NuviaText>
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
                <NuviaText variant="bodyBold">{service.name}</NuviaText>
                <NuviaText variant="h3" color={NEO_THEME.colors.primary}>
                  P{service.price.toFixed(2)}
                </NuviaText>
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
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
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
    fontFamily: NEO_THEME.fonts.regular,
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
    fontFamily: NEO_THEME.fonts.bold,
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
    borderRadius: 24, // Pill
    gap: 8,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  secondaryActionText: {
    fontWeight: "900",
    fontFamily: NEO_THEME.fonts.bold,
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
    fontFamily: NEO_THEME.fonts.bold,
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
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 12,
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
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  featureIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: NEO_THEME.colors.background,
      borderWidth: 1.5,
      borderColor: NEO_THEME.colors.black,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
  }
});
