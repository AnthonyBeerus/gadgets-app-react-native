import { Redirect, Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
} from "react-native";
import { useToast } from "react-native-toast-notifications";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { useCartStore } from "../../store/cart-store";
import { getProduct } from "../../api/api";
import { ActivityIndicator } from "react-native";
import TryOnModal from "../../features/virtual-try-on/components/TryOnModal";

const { width } = Dimensions.get("window");

const ProductDetails = () => {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const toast = useToast();

  const { data: product, error, isLoading } = getProduct(slug);

  const { items, addItem, incrementItem, decrementItem } = useCartStore();

  const cartItem = items.find((item) => item.id === product?.id);

  const initialQuantity = cartItem ? cartItem.quantity : 0;

  const [quantity, setQuantity] = useState(initialQuantity);
  const [tryOnModalVisible, setTryOnModalVisible] = useState(false);

  // Get color variants from JSONB column
  const colorVariants = product?.color_variants || [];
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState("M");

  // Set initial color and image when variants load
  if (colorVariants.length > 0 && !selectedColor) {
    setSelectedColor(colorVariants[0]);
  }

  // Get the current hero image based on selected color variant
  const currentHeroImage = selectedColor?.image_url || product?.heroImage;

  if (isLoading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9C27B0" />
      </View>
    );
  if (error) return <Text>Error: {error.message}</Text>;
  if (!product) return <Redirect href="/404" />;

  const increaseQuantity = () => {
    if (quantity < product.maxQuantity) {
      setQuantity((prev) => prev + 1);
      incrementItem(product.id);
    } else {
      toast.show("Cannot add more than maximum quantity", {
        type: "warning",
        placement: "top",
        duration: 1500,
      });
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
      decrementItem(product.id);
    }
  };

  const addToCart = () => {
    if (quantity === 0) {
      setQuantity(1);
    }
    addItem({
      id: product.id,
      title: product.title,
      heroImage: product.heroImage,
      price: product.price,
      quantity: quantity === 0 ? 1 : quantity,
      maxQuantity: product.maxQuantity,
    });
    toast.show("Added to cart", {
      type: "success",
      placement: "top",
      duration: 1500,
    });
  };

  // Check if product supports virtual try-on (clothing category 2, or beauty services category 4)
  const isClothing = product.category === 2;
  const isBeautyService = product.category === 4;
  const supportsVirtualTryOn = isClothing || isBeautyService;
  const SIZES = ["S", "M", "L", "XL", "2XL"];

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen
        options={{
          title: "",
          headerTransparent: true,
          headerTintColor: "#fff",
          headerLeft: () => (
            <TouchableOpacity
              onPress={handleGoBack}
              style={styles.backButton}
              activeOpacity={0.7}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image with curved bottom */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: currentHeroImage }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>

        {/* Virtual Try-On Button - Below Hero Image */}
        {supportsVirtualTryOn && (
          <View style={styles.tryOnButtonContainer}>
            <TouchableOpacity
              style={styles.tryOnButtonProminent}
              onPress={() => setTryOnModalVisible(true)}
              activeOpacity={0.8}>
              <View style={styles.tryOnIconContainer}>
                <Ionicons name="camera" size={28} color="#fff" />
              </View>
              <View style={styles.tryOnTextContainer}>
                <Text style={styles.tryOnButtonTitle}>Virtual Try-On</Text>
                <Text style={styles.tryOnButtonSubtitle}>
                  See how it looks on you!
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {/* Product Details */}
        <View style={styles.detailsContainer}>
          {/* Title and Price */}
          <View style={styles.headerSection}>
            <Text style={styles.productTitle}>{product.title}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>${product.price.toFixed(2)}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFA500" />
                <Text style={styles.ratingText}>4.5</Text>
              </View>
            </View>
          </View>

          {/* Color Variant Images */}
          {supportsVirtualTryOn && colorVariants.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {isBeautyService ? "Available Styles" : "Available Colors"}{" "}
                {selectedColor && `- ${selectedColor.color_name}`}
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.variantContainer}>
                {colorVariants
                  .filter((variant: any) => variant.is_available)
                  .map((variant: any, index: number) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.variantImageBox,
                        selectedColor?.color_name === variant.color_name &&
                          styles.selectedVariantBox,
                      ]}
                      onPress={() => setSelectedColor(variant)}
                      activeOpacity={0.7}>
                      <Image
                        source={{ uri: variant.image_url }}
                        style={styles.variantImage}
                        resizeMode="cover"
                      />
                      {selectedColor?.color_name === variant.color_name && (
                        <View style={styles.variantCheckMark}>
                          <Ionicons
                            name="checkmark-circle"
                            size={24}
                            color="#9C27B0"
                          />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
              </ScrollView>
              {selectedColor && (
                <Text style={styles.stockText}>
                  {selectedColor.stock_quantity > 0
                    ? `${selectedColor.stock_quantity} in stock`
                    : "Out of stock"}
                </Text>
              )}
            </View>
          )}

          {/* Size Selection */}
          {isClothing && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Size</Text>
              <View style={styles.sizeContainer}>
                {SIZES.map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.sizeOption,
                      selectedSize === size && styles.selectedSize,
                    ]}
                    onPress={() => setSelectedSize(size)}
                    activeOpacity={0.7}>
                    <Text
                      style={[
                        styles.sizeText,
                        selectedSize === size && styles.selectedSizeText,
                      ]}>
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Details</Text>
            <Text style={styles.description}>
              A stylish and comfortable {product.title.toLowerCase()}. Made with
              high-quality materials for maximum durability and comfort. Perfect
              for casual wear or special occasions.
            </Text>
          </View>

          {/* Additional Images */}
          {product.imagesUrl.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>More Images</Text>
              <FlatList
                data={product.imagesUrl}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <Image source={{ uri: item }} style={styles.thumbnailImage} />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.thumbnailContainer}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        {/* Quantity Controls */}
        <View style={styles.quantityControl}>
          <TouchableOpacity
            style={[
              styles.quantityButton,
              quantity <= 1 && styles.disabledButton,
            ]}
            onPress={decreaseQuantity}
            disabled={quantity <= 1}
            activeOpacity={0.7}>
            <Ionicons name="remove" size={20} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.quantityText}>{quantity}</Text>

          <TouchableOpacity
            style={[
              styles.quantityButton,
              quantity >= product.maxQuantity && styles.disabledButton,
            ]}
            onPress={increaseQuantity}
            disabled={quantity >= product.maxQuantity}
            activeOpacity={0.7}>
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Buy Now Button */}
        <TouchableOpacity
          style={styles.buyButton}
          onPress={addToCart}
          activeOpacity={0.8}>
          <Text style={styles.buyButtonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>

      {/* Virtual Try-On Modal */}
      <TryOnModal
        visible={tryOnModalVisible}
        onClose={() => setTryOnModalVisible(false)}
        shopProducts={[
          {
            ...product,
            heroImage: currentHeroImage, // Use the selected variant's image
          },
        ]}
      />
    </SafeAreaView>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  heroContainer: {
    backgroundColor: "#9C27B0",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
    height: width * 1.1,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  detailsContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  headerSection: {
    marginBottom: 20,
  },
  productTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
    lineHeight: 36,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  price: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#9C27B0",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF7ED",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#F59E0B",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 12,
  },
  variantContainer: {
    gap: 12,
    paddingRight: 20,
  },
  variantImageBox: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    position: "relative",
  },
  selectedVariantBox: {
    borderColor: "#9C27B0",
    borderWidth: 3,
  },
  variantImage: {
    width: "100%",
    height: "100%",
  },
  variantCheckMark: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  stockText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 8,
    fontWeight: "500",
  },
  sizeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  sizeOption: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    minWidth: 60,
    alignItems: "center",
  },
  selectedSize: {
    backgroundColor: "#9C27B0",
    borderColor: "#9C27B0",
  },
  sizeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
  selectedSizeText: {
    color: "#fff",
  },
  description: {
    fontSize: 16,
    color: "#6B7280",
    lineHeight: 24,
  },
  tryOnButtonContainer: {
    paddingHorizontal: 20,
    marginTop: -40,
    marginBottom: 20,
    zIndex: 10,
  },
  tryOnButtonProminent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#9C27B0",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 8,
    shadowColor: "#9C27B0",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    borderWidth: 2,
    borderColor: "#D946EF",
  },
  tryOnIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  tryOnTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  tryOnButtonTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  tryOnButtonSubtitle: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 13,
    fontWeight: "500",
  },
  tryOnButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#9C27B0",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 16,
    gap: 8,
    elevation: 4,
    shadowColor: "#9C27B0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  tryOnButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  thumbnailContainer: {
    gap: 12,
  },
  thumbnailImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 4,
    gap: 12,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#9C27B0",
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: "#D1D5DB",
    opacity: 0.6,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    minWidth: 24,
    textAlign: "center",
  },
  buyButton: {
    flex: 1,
    backgroundColor: "#9C27B0",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#9C27B0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buyButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
