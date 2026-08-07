import React, { useEffect, useState } from "react";
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
import { useQuery } from '@tanstack/react-query';
import { getOpportunityForProduct, recordCreatorOpportunityEvent } from '../../discovery/api';
import type { DiscoverySource } from '../../../store/cart-store';
import { NuviaButton } from "../../../shared/components/ui/nuvia-button";
import { StaticHeader } from "../../../shared/components/layout/StaticHeader";
import { NuviaText } from "../../../components/atoms/nuvia-text";
import { NuviaTag } from "../../../shared/components/ui/nuvia-tag";

const { width } = Dimensions.get("window");

export default function ProductDetailsScreen() {
  const { slug, source, opportunityId } = useLocalSearchParams<{
    slug: string;
    source?: DiscoverySource;
    opportunityId?: string;
  }>();
  const router = useRouter();
  const toast = useToast();

  const { data: product, error, isLoading } = getProduct(slug);
  const { items, addItem, incrementItem, decrementItem, setAttribution } = useCartStore();

  const cartItem = items.find((item) => item.id === product?.id);
  const initialQuantity = cartItem ? cartItem.quantity : 0;

  const [quantity, setQuantity] = useState(initialQuantity);
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState("M");

  // Get color variants from JSONB column
  const colorVariants = ((product as any)?.color_variants as any[]) || [];

  // Set initial color once the product (and its variants) load. Runs in an effect
  // rather than during render to avoid update-during-render loops.
  useEffect(() => {
    if (colorVariants.length > 0 && !selectedColor) {
      setSelectedColor(colorVariants[0]);
    }
  }, [product?.id]);

  const parsedOpportunityId = opportunityId ? Number(opportunityId) : undefined;
  const opportunity = useQuery({
    queryKey: ['product-opportunity', product?.id, parsedOpportunityId],
    queryFn: () => getOpportunityForProduct(Number(product!.id), parsedOpportunityId),
    enabled: Boolean(product?.id),
    staleTime: 60_000,
  });

  useEffect(() => {
    if (!parsedOpportunityId || !source) return;
    recordCreatorOpportunityEvent(parsedOpportunityId, 'detail_open', source).catch(() => undefined);
  }, [parsedOpportunityId, source]);

  // Get the current hero image based on selected color variant
  const currentHeroImage = selectedColor?.image_url || product?.heroImage;

  if (isLoading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={NEO_THEME.colors.primary} />
      </View>
    );
  if (error) return <View style={styles.loadingContainer}><Text>Error: {(error as Error).message}</Text></View>;
  if (!product) return <Redirect href="/404" />;

  const increaseQuantity = () => {
    if (quantity < (product.maxQuantity || 0)) {
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
      heroImage: product.heroImage || "",
      price: product.price || 0,
      quantity: quantity === 0 ? 1 : quantity,
      maxQuantity: product.maxQuantity || 0,
    });
    if (source) setAttribution({ source, opportunityId: parsedOpportunityId });
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
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: currentHeroImage || 'https://placeholder.com/placeholder.png' }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>

          {/* Product Details */}
          <View style={styles.detailsContainer}>
            {/* Price and Rating */}
            <View style={styles.headerSection}>
              <View style={styles.priceRow}>
                 <NuviaTag 
                    label={`P${(product.price || 0).toFixed(2)}`} 
                    color={NEO_THEME.colors.secondary} 
                    style={{ paddingHorizontal: 20, paddingVertical: 10 }}
                    textStyle={{ fontSize: 24 }}
                 />
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color={NEO_THEME.colors.secondary} />
                  <NuviaText variant="label">4.5</NuviaText>
                </View>
              </View>
            </View>

            {opportunity.data && (
              <View style={styles.opportunityCard}>
                <View style={styles.opportunityHeading}>
                  <View style={styles.tiktokIcon}>
                    <Ionicons name="logo-tiktok" size={22} color={NEO_THEME.colors.white} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <NuviaText variant="caption">CREATOR OPPORTUNITY</NuviaText>
                    <NuviaText variant="h2">P{Number(opportunity.data.reward_value).toFixed(2)} VOUCHER</NuviaText>
                  </View>
                </View>
                <NuviaText variant="bodyBold">{opportunity.data.title}</NuviaText>
                <NuviaText variant="body">{opportunity.data.description}</NuviaText>
                {(opportunity.data.requirements ?? []).slice(0, 3).map((requirement: string) => (
                  <View key={requirement} style={styles.requirementRow}>
                    <Ionicons name="checkmark-circle" size={17} color={NEO_THEME.colors.black} />
                    <NuviaText variant="caption" style={{ flex: 1 }}>{requirement}</NuviaText>
                  </View>
                ))}
                <View style={styles.unlockNote}>
                  <Ionicons name="lock-closed" size={16} color={NEO_THEME.colors.black} />
                  <NuviaText variant="caption" style={{ flex: 1 }}>
                    Complete this purchase to unlock eligibility. Muse verifies your external TikTok before the merchant voucher is issued.
                  </NuviaText>
                </View>
              </View>
            )}

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
                <NuviaText variant="h3" style={styles.sectionTitle}>SIZE</NuviaText>
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
                      <NuviaText
                        variant="label"
                        style={[
                          selectedSize === size && styles.selectedSizeText,
                        ]}
                      >
                        {size}
                      </NuviaText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Description */}
            <View style={styles.section}>
              <NuviaText variant="h3" style={styles.sectionTitle}>DETAILS</NuviaText>
              <NuviaText variant="body" style={styles.description}>
                {product.description || `Learn more about ${product.title}.`}
              </NuviaText>
            </View>

            {/* Additional Images */}
            {product.imagesUrl && product.imagesUrl.length > 0 && (
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

          <NuviaText variant="h3" style={styles.quantityText}>{quantity}</NuviaText>

          <TouchableOpacity
            style={[
              styles.quantityButton,
              quantity >= (product.maxQuantity || 0) && styles.disabledButton,
            ]}
            onPress={increaseQuantity}
            disabled={quantity >= (product.maxQuantity || 0)}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={20} color={NEO_THEME.colors.black} />
          </TouchableOpacity>
        </View>

        <NuviaButton onPress={addToCart} variant="primary" style={styles.buyButton}>
          <NuviaText variant="label" color={NEO_THEME.colors.white}>BUY NOW</NuviaText>
        </NuviaButton>
      </View>

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
  opportunityCard: {
    gap: 10,
    backgroundColor: NEO_THEME.colors.secondary,
    borderWidth: 3,
    borderColor: NEO_THEME.colors.black,
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    boxShadow: '5px 5px 0px #000000',
  },
  opportunityHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tiktokIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: NEO_THEME.colors.black,
    borderRadius: 12,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  unlockNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: NEO_THEME.colors.white,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
    borderRadius: 12,
    padding: 10,
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: NEO_THEME.colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: NEO_THEME.colors.black,
  },
  disabledButton: {
    backgroundColor: NEO_THEME.colors.greyLight,
    borderColor: NEO_THEME.colors.grey,
    opacity: 0.5,
  },
  quantityText: {
    minWidth: 24,
    textAlign: "center",
  },
  buyButton: {
    flex: 1,
  },
});
