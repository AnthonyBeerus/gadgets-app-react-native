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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getShopById, getShopProducts } from "../../api/shops";

export default function ShopDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [shop, setShop] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadShopDetails();
      loadShopProducts();
    }
  }, [id]);

  const loadShopDetails = async () => {
    try {
      setLoading(true);
      const shopData = await getShopById(parseInt(id!));
      setShop(shopData);
    } catch (error) {
      console.error("Error loading shop details:", error);
      Alert.alert("Error", "Failed to load shop details");
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

  const handleBrowseProducts = () => {
    if (products.length > 0) {
      // Navigate to products page when implemented
      Alert.alert(
        "Browse Products",
        `Viewing ${products.length} products from ${shop?.name}`
      );
    } else {
      Alert.alert(
        "Products",
        "Contact the shop directly for available products and services."
      );
    }
  };

  const handleBookAppointment = () => {
    Alert.alert("Book Appointment", "Appointment booking feature coming soon!");
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Loading...</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading shop details...</Text>
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
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Shop Not Found</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="storefront-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>Shop not found</Text>
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
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {shop?.name || "Shop Details"}
        </Text>
        {shop?.is_featured && (
          <View style={styles.featuredBadge}>
            <Ionicons name="star" size={16} color="#FFD700" />
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
          <Text style={styles.categoryName}>{shop.category?.name}</Text>

          {shop.description && (
            <Text style={styles.description}>{shop.description}</Text>
          )}

          {/* Quick Actions - Prominent CTAs */}
          <View style={styles.quickActionsSection}>
            <TouchableOpacity
              style={styles.primaryActionButton}
              onPress={handleBrowseProducts}>
              <Ionicons name="storefront" size={24} color="#fff" />
              <Text style={styles.primaryActionText}>Browse Products</Text>
            </TouchableOpacity>

            <View style={styles.secondaryActions}>
              {shop.has_appointment_booking && (
                <TouchableOpacity
                  style={styles.secondaryActionButton}
                  onPress={handleBookAppointment}>
                  <Ionicons name="calendar" size={20} color="#007AFF" />
                  <Text style={styles.secondaryActionText}>
                    Book Appointment
                  </Text>
                </TouchableOpacity>
              )}

              {shop.phone && (
                <TouchableOpacity
                  style={styles.secondaryActionButton}
                  onPress={handleCallShop}>
                  <Ionicons name="call" size={20} color="#007AFF" />
                  <Text style={styles.secondaryActionText}>Call Shop</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Products & Services Section - Priority placement */}
          <View style={styles.productsSection}>
            <View style={styles.productsSectionHeader}>
              <Text style={styles.sectionTitle}>Products & Services</Text>
              {products.length > 0 && (
                <TouchableOpacity style={styles.viewAllButton}>
                  <Text style={styles.viewAllText}>
                    View All ({products.length})
                  </Text>
                  <Ionicons name="arrow-forward" size={16} color="#007AFF" />
                </TouchableOpacity>
              )}
            </View>

            {productsLoading ? (
              <View style={styles.productsLoadingContainer}>
                <ActivityIndicator size="small" color="#007AFF" />
                <Text style={styles.loadingText}>Loading products...</Text>
              </View>
            ) : products.length > 0 ? (
              <>
                <View style={styles.productsHighlight}>
                  {products.slice(0, 2).map((product, index) => (
                    <TouchableOpacity
                      key={product.id}
                      style={styles.productCardPreview}>
                      {product.imageUrl ? (
                        <Image
                          source={{ uri: product.imageUrl }}
                          style={styles.productPreviewImage}
                        />
                      ) : (
                        <Ionicons name="cube" size={32} color="#007AFF" />
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
                      <Ionicons name="construct" size={32} color="#4CAF50" />
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
                    Explore All {products.length} Product
                    {products.length !== 1 ? "s" : ""}
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.productsHighlight}>
                <View style={styles.productCardPreview}>
                  <Ionicons name="cube" size={32} color="#007AFF" />
                  <Text style={styles.productPreviewTitle}>
                    Quality Products
                  </Text>
                  <Text style={styles.productPreviewSubtitle}>
                    Carefully selected items
                  </Text>
                </View>

                <View style={styles.productCardPreview}>
                  <Ionicons name="construct" size={32} color="#4CAF50" />
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
            <Text style={styles.sectionTitle}>Delivery & Services</Text>
            <View style={styles.featuresGrid}>
              {shop.has_delivery && (
                <View style={styles.featureCard}>
                  <Ionicons name="bicycle" size={24} color="#4CAF50" />
                  <Text style={styles.featureLabel}>Delivery</Text>
                  {shop.delivery_fee && (
                    <Text style={styles.featureDetail}>
                      From P{shop.delivery_fee}
                    </Text>
                  )}
                </View>
              )}

              {shop.has_collection && (
                <View style={styles.featureCard}>
                  <Ionicons name="bag-handle" size={24} color="#2196F3" />
                  <Text style={styles.featureLabel}>Collection</Text>
                </View>
              )}

              {shop.has_appointment_booking && (
                <View style={styles.featureCard}>
                  <Ionicons name="calendar" size={24} color="#FF9800" />
                  <Text style={styles.featureLabel}>Appointments</Text>
                </View>
              )}

              {shop.has_virtual_try_on && (
                <View style={styles.featureCard}>
                  <Ionicons name="glasses" size={24} color="#9C27B0" />
                  <Text style={styles.featureLabel}>Virtual Try-On</Text>
                </View>
              )}
            </View>
          </View>

          {/* Shop Details */}
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Shop Information</Text>

            {shop.location && (
              <View style={styles.detailRow}>
                <Ionicons name="location" size={20} color="#666" />
                <Text style={styles.detailText}>{shop.location}</Text>
              </View>
            )}

            {shop.phone && (
              <View style={styles.detailRow}>
                <Ionicons name="call" size={20} color="#666" />
                <Text style={styles.detailText}>{shop.phone}</Text>
              </View>
            )}

            {shop.rating && shop.rating > 0 && (
              <View style={styles.detailRow}>
                <Ionicons name="star" size={20} color="#FFD700" />
                <Text style={styles.detailText}>
                  {shop.rating.toFixed(1)} Rating
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    gap: 8,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    marginRight: 8,
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
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
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
    backgroundColor: "#FFD700",
    padding: 6,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryName: {
    fontSize: 16,
    color: "#007AFF",
    marginBottom: 16,
    fontWeight: "600",
    marginTop: 4,
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 24,
  },
  detailsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: "#666",
    marginLeft: 12,
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
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    width: "48%",
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  featureLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginTop: 8,
  },
  featureDetail: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  hoursSection: {
    marginBottom: 24,
  },
  hoursContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  hoursText: {
    fontSize: 14,
    color: "#666",
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
    backgroundColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryActionText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 8,
  },
  secondaryActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  secondaryActionButton: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#007AFF",
    flex: 1,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  secondaryActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
    marginLeft: 6,
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
    fontWeight: "600",
    color: "#007AFF",
    marginRight: 4,
  },
  productsHighlight: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 12,
  },
  productCardPreview: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    flex: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  productPreviewTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 12,
    marginBottom: 4,
    textAlign: "center",
  },
  productPreviewSubtitle: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    lineHeight: 16,
  },
  exploreProductsButton: {
    backgroundColor: "#34C759",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  exploreProductsText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginRight: 8,
  },
  // Additional product display styles
  productsLoadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
  },
  productPreviewImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    resizeMode: "cover",
    marginBottom: 8,
  },
  productPreviewPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#007AFF",
    marginTop: 4,
  },
});
