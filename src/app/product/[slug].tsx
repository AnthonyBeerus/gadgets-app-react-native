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
import { NEO_THEME } from "../../constants/neobrutalism";

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
  const colorVariants = (product?.color_variants as any[]) || [];
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
        <ActivityIndicator size="large" color={NEO_THEME.colors.primary} />
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
              <Ionicons name="arrow-back" size={24} color={NEO_THEME.colors.black} />
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
                <Text style={styles.tryOnButtonTitle}>VIRTUAL TRY-ON</Text>
                <Text style={styles.tryOnButtonSubtitle}>
                  See how it looks on you!
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={NEO_THEME.colors.black} />
            </TouchableOpacity>
          </View>
        )}

        {/* Product Details */}
        <View style={styles.detailsContainer}>
          {/* Title and Price */}
          <View style={styles.headerSection}>
            <Text style={styles.productTitle}>{product.title.toUpperCase()}</Text>
            <View style={styles.priceRow}>
              <View style={styles.priceTag}>
                <Text style={styles.price}>P{product.price.toFixed(2)}</Text>
              </View>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color={NEO_THEME.colors.black} />
                <Text style={styles.ratingText}>4.5</Text>
              </View>
            </View>
          </View>

          {/* Color Variant Images */}
          {supportsVirtualTryOn && colorVariants.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {isBeautyService ? "AVAILABLE STYLES" : "AVAILABLE COLORS"}{" "}
                {selectedColor && `- ${selectedColor.color_name.toUpperCase()}`}
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
                            color={NEO_THEME.colors.primary}
                          />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
              </ScrollView>
              {selectedColor && (
                <Text style={styles.stockText}>
                  {selectedColor.stock_quantity > 0
                    ? `${selectedColor.stock_quantity} IN STOCK`
                    : "OUT OF STOCK"}
                </Text>
              )}
            </View>
          )}

          {/* Size Selection */}
          {isClothing && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>SIZE</Text>
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
            <Text style={styles.sectionTitle}>DETAILS</Text>
            <Text style={styles.description}>
              A stylish and comfortable {product.title.toLowerCase()}. Made with
              high-quality materials for maximum durability and comfort. Perfect
              for casual wear or special occasions.
            </Text>
          </View>

          {/* Additional Images */}
          {product.imagesUrl.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>MORE IMAGES</Text>
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
            <Ionicons name="remove" size={20} color={NEO_THEME.colors.white} />
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
            <Ionicons name="add" size={20} color={NEO_THEME.colors.white} />
          </TouchableOpacity>
        </View>

        {/* Buy Now Button */}
        <TouchableOpacity
          style={styles.buyButton}
          onPress={addToCart}
          activeOpacity={0.8}>
          <Text style={styles.buyButtonText}>BUY NOW</Text>
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
    backgroundColor: NEO_THEME.colors.backgroundLight,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: NEO_THEME.borders.radius,
    backgroundColor: NEO_THEME.colors.yellow,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 16,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: NEO_THEME.colors.backgroundLight,
  },
  heroContainer: {
    backgroundColor: NEO_THEME.colors.primary,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: "hidden",
    height: width * 1.1,
    borderBottomWidth: NEO_THEME.borders.width,
    borderBottomColor: NEO_THEME.colors.black,
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
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    marginBottom: 12,
    lineHeight: 36,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceTag: {
    backgroundColor: NEO_THEME.colors.yellow,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  price: {
    fontSize: 28,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: NEO_THEME.colors.yellow,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "700",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.bold,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    marginBottom: 12,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  variantContainer: {
    gap: 12,
    paddingRight: 20,
  },
  variantImageBox: {
    width: 80,
    height: 80,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.grey,
    overflow: "hidden",
    position: "relative",
  },
  selectedVariantBox: {
    borderColor: NEO_THEME.colors.primary,
    borderWidth: NEO_THEME.borders.width,
  },
  variantImage: {
    width: "100%",
    height: "100%",
  },
  variantCheckMark: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: NEO_THEME.colors.white,
    borderRadius: 12,
  },
  stockText: {
    fontSize: 14,
    color: NEO_THEME.colors.black,
    marginTop: 8,
    fontWeight: "700",
    fontFamily: NEO_THEME.fonts.bold,
    textTransform: "uppercase",
  },
  sizeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  sizeOption: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: NEO_THEME.borders.radius,
    backgroundColor: NEO_THEME.colors.white,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    minWidth: 60,
    alignItems: "center",
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  selectedSize: {
    backgroundColor: NEO_THEME.colors.primary,
    borderColor: NEO_THEME.colors.black,
  },
  sizeText: {
    fontSize: 16,
    fontWeight: "700",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.bold,
  },
  selectedSizeText: {
    color: NEO_THEME.colors.white,
  },
  description: {
    fontSize: 16,
    color: NEO_THEME.colors.grey,
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
    backgroundColor: NEO_THEME.colors.yellow,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  tryOnIconContainer: {
    width: 56,
    height: 56,
    borderRadius: NEO_THEME.borders.radius,
    backgroundColor: NEO_THEME.colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  tryOnTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  tryOnButtonTitle: {
    color: NEO_THEME.colors.black,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 4,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  tryOnButtonSubtitle: {
    color: NEO_THEME.colors.black,
    fontSize: 13,
    fontWeight: "600",
  },
  tryOnButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: NEO_THEME.colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: NEO_THEME.borders.radius,
    marginBottom: 16,
    gap: 8,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  tryOnButtonText: {
    color: NEO_THEME.colors.white,
    fontSize: 16,
    fontWeight: "900",
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  thumbnailContainer: {
    gap: 12,
  },
  thumbnailImage: {
    width: 80,
    height: 80,
    borderRadius: NEO_THEME.borders.radius,
    backgroundColor: NEO_THEME.colors.grey,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: NEO_THEME.colors.white,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: NEO_THEME.borders.width,
    borderTopColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: NEO_THEME.colors.backgroundLight,
    borderRadius: NEO_THEME.borders.radius,
    padding: 4,
    gap: 12,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: NEO_THEME.borders.radius,
    backgroundColor: NEO_THEME.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
  },
  disabledButton: {
    backgroundColor: NEO_THEME.colors.grey,
    opacity: 0.6,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    minWidth: 24,
    textAlign: "center",
    fontFamily: NEO_THEME.fonts.black,
  },
  buyButton: {
    flex: 1,
    backgroundColor: NEO_THEME.colors.primary,
    paddingVertical: 16,
    borderRadius: NEO_THEME.borders.radius,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  buyButtonText: {
    color: NEO_THEME.colors.white,
    fontSize: 18,
    fontWeight: "900",
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
});
