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
import { useDesignTokens, useThemedStyles, radii, fonts, type DesignTokens, type SemanticColors } from "../../../shared/design-system";
import { useQuery } from '@tanstack/react-query';
import { getOpportunityForProduct, recordCreatorOpportunityEvent } from '../../discovery/api';
import type { DiscoverySource } from '../../../store/cart-store';
import { NuviaButton } from "../../../shared/components/ui/nuvia-button";
import { StaticHeader } from "../../../shared/components/layout/StaticHeader";
import { NuviaText } from "../../../components/atoms/nuvia-text";
import { NuviaTag } from "../../../shared/components/ui/nuvia-tag";

const { width } = Dimensions.get("window");

function createStyles(c: SemanticColors, _tokens: DesignTokens) {
  return {
    container: {
      flex: 1,
      backgroundColor: c.canvas,
    },
    header: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: c.surface,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    backButton: {
      padding: 4,
      marginRight: 12,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: c.ink,
      fontFamily: fonts.semibold,
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
      justifyContent: "center" as const,
      alignItems: "center" as const,
      backgroundColor: c.canvas,
    },
    heroContainer: {
      backgroundColor: c.surface,
      height: width * 1.1,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
      marginBottom: 20,
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
      overflow: 'hidden' as const,
      shadowColor: c.ink,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 2,
    },
    heroImage: {
      width: "100%" as const,
      height: "100%" as const,
    },
    detailsContainer: {
      paddingHorizontal: 20,
    },
    headerSection: {
      marginBottom: 20,
    },
    priceRow: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,
    },
    priceTag: {
      backgroundColor: c.accent,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: radii.md,
      shadowColor: c.ink,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 0,
    },
    price: {
      fontSize: 24,
      fontWeight: '600' as const,
      color: c.ink,
      fontFamily: fonts.bold,
    },
    ratingContainer: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      backgroundColor: c.surface,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: radii.md,
      borderWidth: 1,
      borderColor: c.border,
      gap: 4,
    },
    ratingText: {
      fontSize: 14,
      fontWeight: "700" as const,
      color: c.ink,
      fontFamily: fonts.semibold,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: c.ink,
      marginBottom: 12,
      fontFamily: fonts.semibold,
    },
    variantContainer: {
      gap: 12,
      paddingRight: 20,
    },
    variantImageBox: {
      width: 60,
      height: 60,
      borderRadius: 30,
      borderWidth: 1,
      borderColor: c.inkMuted,
      overflow: "hidden" as const,
      position: "relative" as const,
    },
    selectedVariantBox: {
      borderColor: c.border,
      borderWidth: 1,
      transform: [{ scale: 1.1 }],
    },
    variantImage: {
      width: "100%" as const,
      height: "100%" as const,
    },
    variantCheckMark: {
      position: "absolute" as const,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: 'rgba(167, 139, 250, 0.3)',
      borderRadius: 30,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    sizeContainer: {
      flexDirection: "row" as const,
      gap: 12,
    },
    sizeOption: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      shadowColor: c.ink,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    },
    selectedSize: {
      backgroundColor: c.ink,
      borderColor: c.border,
      transform: [{ translateY: -2 }],
    },
    sizeText: {
      fontSize: 14,
      fontWeight: "700" as const,
      color: c.ink,
      fontFamily: fonts.semibold,
    },
    selectedSizeText: {
      color: c.surface,
    },
    description: {
      fontSize: 16,
      color: c.ink,
      lineHeight: 24,
      fontFamily: fonts.regular,
    },
    opportunityCard: {
      gap: 10,
      backgroundColor: c.accent,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 18,
      padding: 16,
      marginBottom: 20,
      boxShadow: '0px 2px 8px rgba(0,0,0,0.08)',
    },
    opportunityHeading: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 10,
    },
    tiktokIcon: {
      width: 44,
      height: 44,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      backgroundColor: c.ink,
      borderRadius: 12,
    },
    requirementRow: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 7,
    },
    unlockNote: {
      flexDirection: 'row' as const,
      alignItems: 'flex-start' as const,
      gap: 8,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
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
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,
      backgroundColor: c.accent,
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: c.border,
      shadowColor: c.ink,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    },
    tryOnIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: c.ink,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },
    tryOnTextContainer: {
      flex: 1,
      marginLeft: 16,
    },
    tryOnButtonTitle: {
      color: c.ink,
      fontSize: 16,
      fontWeight: '600' as const,
      marginBottom: 2,
      fontFamily: fonts.semibold,
    },
    tryOnButtonSubtitle: {
      color: c.ink,
      fontSize: 12,
      fontWeight: "600" as const,
    },
    thumbnailContainer: {
      gap: 12,
    },
    thumbnailImage: {
      width: 80,
      height: 80,
      borderRadius: 16,
      backgroundColor: c.inkMuted,
      borderWidth: 1,
      borderColor: c.border,
    },
    bottomBar: {
      position: "absolute" as const,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: c.surface,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      paddingHorizontal: 20,
      paddingVertical: 16,
      gap: 16,
      borderTopWidth: 1,
      borderTopColor: c.border,
      shadowColor: c.ink,
      shadowOffset: { width: 0, height: -5 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
    },
    quantityControl: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      backgroundColor: c.canvas,
      borderRadius: 24,
      padding: 6,
      gap: 12,
      borderWidth: 1,
      borderColor: c.border,
    },
    quantityButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: c.surface,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      borderWidth: 1,
      borderColor: c.border,
    },
    disabledButton: {
      backgroundColor: c.gray200,
      borderColor: c.inkMuted,
      opacity: 0.5,
    },
    quantityText: {
      minWidth: 24,
      textAlign: "center" as const,
    },
    buyButton: {
      flex: 1,
    },
  };
}

export default function ProductDetailsScreen() {
  const styles = useThemedStyles(createStyles);
  const { colors } = useDesignTokens();
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

  const colorVariants = ((product as any)?.color_variants as any[]) || [];

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

  const currentHeroImage = selectedColor?.image_url || product?.heroImage;

  if (isLoading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.ink} />
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
    router.push("/bag");
  };

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
          <TouchableOpacity onPress={() => router.push("/bag")} style={{ position: 'relative' }}>
            <Ionicons name="cart" size={24} color={colors.ink} />
            {items.length > 0 && (
              <NuviaTag 
                label={items.length.toString()} 
                color={colors.ink} 
                style={{
                    position: 'absolute',
                    top: -6,
                    right: -6,
                    paddingHorizontal: 4,
                    minWidth: 18,
                    height: 18,
                    borderRadius: 9,
                }}
                textStyle={{ fontSize: 10, color: colors.surface }}
              />
            )}
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: currentHeroImage || 'https://placeholder.com/placeholder.png' }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>

          <View style={styles.detailsContainer}>
            <View style={styles.headerSection}>
              <View style={styles.priceRow}>
                 <NuviaTag 
                    label={`P${(product.price || 0).toFixed(2)}`} 
                    color={colors.accent} 
                    style={{ paddingHorizontal: 20, paddingVertical: 10 }}
                    textStyle={{ fontSize: 24 }}
                 />
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color={colors.accent} />
                  <NuviaText variant="label">4.5</NuviaText>
                </View>
              </View>
            </View>

            {opportunity.data && (
              <View style={styles.opportunityCard}>
                <View style={styles.opportunityHeading}>
                  <View style={styles.tiktokIcon}>
                    <Ionicons name="logo-tiktok" size={22} color={colors.surface} />
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
                    <Ionicons name="checkmark-circle" size={17} color={colors.ink} />
                    <NuviaText variant="caption" style={{ flex: 1 }}>{requirement}</NuviaText>
                  </View>
                ))}
                <View style={styles.unlockNote}>
                  <Ionicons name="lock-closed" size={16} color={colors.ink} />
                  <NuviaText variant="caption" style={{ flex: 1 }}>
                    Complete this purchase to unlock eligibility. Muse verifies your external TikTok before the merchant voucher is issued.
                  </NuviaText>
                </View>
              </View>
            )}

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
                              color={colors.ink}
                            />
                          </View>
                        )}
                      </TouchableOpacity>
                    ))}
                </ScrollView>
              </View>
            )}

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

            <View style={styles.section}>
              <NuviaText variant="h3" style={styles.sectionTitle}>DETAILS</NuviaText>
              <NuviaText variant="body" style={styles.description}>
                {product.description || `Learn more about ${product.title}.`}
              </NuviaText>
            </View>

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
              <Ionicons name="remove" size={20} color={colors.surface} />
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
            <Ionicons name="add" size={20} color={colors.ink} />
          </TouchableOpacity>
        </View>

        <NuviaButton onPress={addToCart} variant="primary" style={styles.buyButton}>
          <NuviaText variant="label" color={colors.surface}>BUY NOW</NuviaText>
        </NuviaButton>
      </View>

    </SafeAreaView>
  );
}
