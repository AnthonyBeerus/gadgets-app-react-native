import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter, Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useToast } from "react-native-toast-notifications";
import { useCartStore } from "../../../store/cart-store";
import { getProduct } from "../../../shared/api/api";
import { NEO_THEME } from "../../../shared/constants/neobrutalism";
import TryOnModal from "../../virtual-try-on/components/TryOnModal";
import { NeoButton } from "../../../shared/components/ui/neo-button";
import { StaticHeader } from "../../../shared/components/layout/StaticHeader";

const { width } = Dimensions.get("window");

export default function ProductDetailsScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const toast = useToast();

  const { data: product, error, isLoading } = getProduct(slug);
  const { items, addItem, incrementItem, decrementItem } = useCartStore();

  const cartItem = items.find((item) => item.id === product?.id);
  const initialQuantity = cartItem ? cartItem.quantity : 0;

  const [quantity, setQuantity] = useState(initialQuantity);
  const [tryOnModalVisible, setTryOnModalVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState("M");

  // Get color variants from JSONB column
  const colorVariants = (product?.color_variants as any[]) || [];

  // Set initial color when variants load
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
    // Navigate to Cart
    router.push("/cart");
  };

  // Check if product supports virtual try-on
  const isClothing = product.category === 2;
  const isBeautyService = product.category === 4;
  const supportsVirtualTryOn = isClothing || isBeautyService;
  const SIZES = ["S", "M", "L", "XL", "2XL"];

  return (
    <SafeAreaView style={styles.container}>
      <StaticHeader 
        title={product.title.toUpperCase()} 
        onBackPress={() => router.back()} 
        rightElement={
          <TouchableOpacity onPress={() => router.push("/cart")}>
            <Ionicons name="cart" size={24} color={NEO_THEME.colors.black} />
            {items.length > 0 && (
              <View style={{
                position: 'absolute',
                top: -5,
                right: -5,
                backgroundColor: NEO_THEME.colors.primary,
                borderRadius: 10,
                width: 16,
                height: 16,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: 'white'
              }}>
                <Text style={{ fontSize: 10, color: 'white', fontWeight: 'bold' }}>
                  {items.length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: currentHeroImage }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>

          {/* Virtual Try-On Button */}
          {supportsVirtualTryOn && (
            <View style={styles.tryOnButtonContainer}>
              <TouchableOpacity
                style={styles.tryOnButtonProminent}
                onPress={() => setTryOnModalVisible(true)}
                activeOpacity={0.8}
              >
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
            {/* Price and Rating */}
            <View style={styles.headerSection}>
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

            {/* Color Variants */}
            {supportsVirtualTryOn && colorVariants.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {isBeautyService ? "AVAILABLE STYLES" : "AVAILABLE COLORS"}{" "}
                  {selectedColor && `- ${selectedColor.color_name.toUpperCase()}`}
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.variantContainer}
                >
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
                        activeOpacity={0.7}
                      >
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
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.sizeText,
                          selectedSize === size && styles.selectedSizeText,
                        ]}
                      >
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

        {/* Bottom Action Bar - Fixed at bottom */}
        <View style={styles.bottomBar}>
          <View style={styles.quantityControl}>
            <TouchableOpacity
              style={[
                styles.quantityButton,
                quantity <= 1 && styles.disabledButton,
              ]}
              onPress={decreaseQuantity}
              disabled={quantity <= 1}
              activeOpacity={0.7}
            >
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
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={20} color={NEO_THEME.colors.white} />
          </TouchableOpacity>
        </View>

        <NeoButton onPress={addToCart} style={styles.buyButton}>
          BUY NOW
        </NeoButton>
      </View>

      {/* Virtual Try-On Modal */}
      <TryOnModal
        visible={tryOnModalVisible}
        onClose={() => setTryOnModalVisible(false)}
        shopProducts={[
          {
            ...product,
            heroImage: currentHeroImage,
          },
        ]}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEO_THEME.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: NEO_THEME.colors.white,
    borderBottomWidth: NEO_THEME.borders.width,
    borderBottomColor: NEO_THEME.colors.black,
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.bold,
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: NEO_THEME.colors.background,
  },
  heroContainer: {
    backgroundColor: NEO_THEME.colors.white,
    height: width * 1.1,
    borderBottomWidth: NEO_THEME.borders.width,
    borderBottomColor: NEO_THEME.colors.black,
    marginBottom: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  detailsContainer: {
    paddingHorizontal: 20,
  },
  headerSection: {
    marginBottom: 20,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceTag: {
    backgroundColor: NEO_THEME.colors.secondary, // Yellow
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    borderRadius: NEO_THEME.borders.radius,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  price: {
    fontSize: 24,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: NEO_THEME.colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: NEO_THEME.borders.width,
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
    fontFamily: NEO_THEME.fonts.bold,
  },
  variantContainer: {
    gap: 12,
    paddingRight: 20,
  },
  variantImageBox: {
    width: 60,
    height: 60,
    borderRadius: 30, // Circle
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.grey,
    overflow: "hidden",
    position: "relative",
  },
  selectedVariantBox: {
    borderColor: NEO_THEME.colors.primary,
    borderWidth: 2,
    transform: [{ scale: 1.1 }],
  },
  variantImage: {
    width: "100%",
    height: "100%",
  },
  variantCheckMark: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(167, 139, 250, 0.3)', // Lilac overlay
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  sizeOption: {
    width: 48,
    height: 48,
    borderRadius: 24, // Circle
    backgroundColor: NEO_THEME.colors.white,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  selectedSize: {
    backgroundColor: NEO_THEME.colors.primary,
    borderColor: NEO_THEME.colors.black,
    transform: [{ translateY: -2 }],
  },
  sizeText: {
    fontSize: 14,
    fontWeight: "700",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.bold,
  },
  selectedSizeText: {
    color: NEO_THEME.colors.white,
  },
  description: {
    fontSize: 16,
    color: NEO_THEME.colors.dark,
    lineHeight: 24,
    fontFamily: NEO_THEME.fonts.regular,
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
    backgroundColor: NEO_THEME.colors.secondary, // Yellow
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  tryOnIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 2,
    fontFamily: NEO_THEME.fonts.bold,
  },
  tryOnButtonSubtitle: {
    color: NEO_THEME.colors.black,
    fontSize: 12,
    fontWeight: "600",
  },
  thumbnailContainer: {
    gap: 12,
  },
  thumbnailImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
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
    gap: 16,
    borderTopWidth: NEO_THEME.borders.width,
    borderTopColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: NEO_THEME.colors.background,
    borderRadius: 24,
    padding: 6,
    gap: 12,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: NEO_THEME.colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: NEO_THEME.colors.black,
  },
  disabledButton: {
    backgroundColor: NEO_THEME.colors.greyLight,
    borderColor: NEO_THEME.colors.grey,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    minWidth: 20,
    textAlign: "center",
    fontFamily: NEO_THEME.fonts.bold,
  },
  buyButton: {
    flex: 1,
  },
});
