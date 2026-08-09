import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';

import { NuviaText } from '../../../components/atoms/nuvia-text';
import { CartItem } from '../../cart/components/CartItem';
import { useCheckout } from '../../cart/hooks/use-checkout';
import { useDesignTokens, useThemedStyles, type DesignTokens, type SemanticColors } from '../../../shared/design-system';
import { NuviaButton } from '../../../shared/components/ui/nuvia-button';
import { useCartStore } from '../../../store/cart-store';
import { getSavedCreatorOpportunities, restoreCreatorOpportunityPreference } from '../api';

type BagTab = 'cart' | 'saved';

const FlashListFixed = FlashList as unknown as <T>(
  props: React.ComponentProps<typeof FlashList<T>> & { estimatedItemSize: number },
) => React.ReactElement;

function createStyles(c: SemanticColors, tokens: DesignTokens) {
  return {
    container: { flex: 1, backgroundColor: c.canvas },
    topBar: { flexDirection: 'row' as const, alignItems: 'flex-start' as const, gap: 12, paddingHorizontal: 16, paddingTop: 8 },
    headerCopy: { flex: 1, gap: 2 },
    iconButton: {
      width: 46,
      height: 46,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 14,
      backgroundColor: c.surface,
    },
    segments: {
      flexDirection: 'row' as const,
      gap: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    segment: {
      flex: 1,
      minHeight: 44,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      gap: 6,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 999,
      backgroundColor: c.surface,
    },
    segmentActive: { backgroundColor: c.accentMuted },
    panel: { flex: 1 },
    listWrap: { flex: 1, minHeight: 2 },
    listContent: { padding: 16, paddingBottom: 24 },
    savedContent: { gap: 14, padding: 16, paddingBottom: 48 },
    empty: {
      alignItems: 'center' as const,
      gap: 14,
      margin: 16,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 20,
      backgroundColor: c.surface,
      padding: 28,
    },
    footer: {
      padding: 16,
      backgroundColor: c.surface,
      borderTopWidth: 1,
      borderColor: c.border,
      gap: 12,
    },
    totalRow: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const },
    checkoutButton: { width: '100%' as const },
    card: {
      overflow: 'hidden' as const,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 20,
      backgroundColor: c.surface,
      ...tokens.elevation.hairline,
    },
    image: { width: '100%' as const, aspectRatio: 1.8 },
    cardBody: { gap: 8, padding: 14 },
    badges: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: 7 },
    badge: {
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 999,
      backgroundColor: c.surface,
      paddingHorizontal: 9,
      paddingVertical: 5,
    },
    eligibleBadge: { backgroundColor: c.success },
    potBadge: { backgroundColor: c.accentMuted },
    action: {
      minHeight: 48,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      gap: 8,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 999,
      backgroundColor: c.accentMuted,
      paddingHorizontal: 18,
    },
    eligibleAction: { backgroundColor: c.success },
    removeButton: { alignSelf: 'center' as const, padding: 8 },
  };
}

export default function BagScreen() {
  const styles = useThemedStyles(createStyles);
  const { colors } = useDesignTokens();
  const router = useRouter();
  const params = useLocalSearchParams<{ tab?: string }>();
  const [tab, setTab] = useState<BagTab>(params.tab === 'saved' ? 'saved' : 'cart');

  useEffect(() => {
    setTab(params.tab === 'saved' ? 'saved' : 'cart');
  }, [params.tab]);
  const queryClient = useQueryClient();

  const {
    items,
    removeItem,
    incrementItem,
    decrementItem,
    getTotalPrice,
  } = useCartStore();
  const { checkout, isProcessing } = useCheckout();

  const saved = useQuery({
    queryKey: ['creator-opportunity-saved'],
    queryFn: getSavedCreatorOpportunities,
    staleTime: 15_000,
  });

  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ['creator-opportunity-saved'] });
    }, [queryClient]),
  );

  const removeSaved = async (opportunityId: number) => {
    await restoreCreatorOpportunityPreference(opportunityId);
    queryClient.invalidateQueries({ queryKey: ['creator-opportunity-saved'] });
    queryClient.invalidateQueries({ queryKey: ['creator-opportunity-feed'] });
  };

  const savedCount = saved.data?.length ?? 0;
  const cartCount = items.length;
  const subtitle = useMemo(() => {
    if (tab === 'cart') return `${cartCount} item${cartCount === 1 ? '' : 's'} ready to buy`;
    return `${savedCount} saved challenge${savedCount === 1 ? '' : 's'}`;
  }, [tab, cartCount, savedCount]);

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.topBar}>
        <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={22} color={colors.ink} />
        </Pressable>
        <View style={styles.headerCopy}>
          <NuviaText variant="display">BAG</NuviaText>
          <NuviaText variant="body">{subtitle}</NuviaText>
        </View>
      </View>

      <View style={styles.segments}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: tab === 'cart' }}
          onPress={() => setTab('cart')}
          style={[styles.segment, tab === 'cart' && styles.segmentActive]}
        >
          <Ionicons name="bag-handle" size={18} color={colors.ink} />
          <NuviaText variant="caption">CART{cartCount > 0 ? ` (${cartCount})` : ''}</NuviaText>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: tab === 'saved' }}
          onPress={() => setTab('saved')}
          style={[styles.segment, tab === 'saved' && styles.segmentActive]}
        >
          <Ionicons name="heart" size={18} color={colors.ink} />
          <NuviaText variant="caption">SAVED{savedCount > 0 ? ` (${savedCount})` : ''}</NuviaText>
        </Pressable>
      </View>

      {tab === 'cart' ? (
        <View style={styles.panel}>
          {items.length === 0 ? (
            <View style={styles.empty}>
              <NuviaText variant="h2">CART IS EMPTY</NuviaText>
              <NuviaText variant="body" align="center">
                Add a qualifying product to enter a challenge, or browse Shops.
              </NuviaText>
              <Pressable onPress={() => router.replace('/(shop)/marketplace')} style={styles.action}>
                <NuviaText variant="bodyBold">BROWSE MARKETPLACE</NuviaText>
              </Pressable>
            </View>
          ) : (
            <>
              <View style={styles.listWrap}>
                <FlashListFixed
                  data={items}
                  estimatedItemSize={120}
                  contentContainerStyle={styles.listContent}
                  renderItem={({ item }) => (
                    <CartItem
                      item={item}
                      onRemove={removeItem}
                      onIncrement={incrementItem}
                      onDecrement={decrementItem}
                    />
                  )}
                />
              </View>
              <View style={styles.footer}>
                <View style={styles.totalRow}>
                  <NuviaText variant="h3">TOTAL</NuviaText>
                  <NuviaText variant="h1" color={colors.ink}>P{getTotalPrice()}</NuviaText>
                </View>
                <NuviaButton onPress={() => checkout()} disabled={isProcessing} variant="primary" style={styles.checkoutButton}>
                  {isProcessing ? (
                    <ActivityIndicator color={colors.surface} />
                  ) : (
                    <NuviaText variant="bodyBold" color={colors.surface}>CHECKOUT</NuviaText>
                  )}
                </NuviaButton>
              </View>
            </>
          )}
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.savedContent} contentInsetAdjustmentBehavior="automatic">
          {saved.isLoading ? (
            <ActivityIndicator size="large" color={colors.ink} />
          ) : saved.error ? (
            <View style={styles.empty}>
              <NuviaText variant="h2">COULDN'T LOAD SAVED</NuviaText>
              <Pressable onPress={() => saved.refetch()} style={styles.action}>
                <NuviaText variant="bodyBold">TRY AGAIN</NuviaText>
              </Pressable>
            </View>
          ) : saved.data?.length ? (
            saved.data.map(item => {
              const competitive = item.contest_mode === 'competitive_pot';
              const eligible = Boolean(item.eligibility_proof_id && !item.eligibility_consumed);
              const potLabel = competitive && item.pot_value != null
                ? `P${Number(item.pot_value).toFixed(0)} POT`
                : `P${Number(item.accepted_entry_fee).toFixed(0)} ACCEPTED-ENTRY FEE`;
              return (
                <View key={item.opportunity_id} style={styles.card}>
                  <Image source={{ uri: item.hero_image }} style={styles.image} contentFit="cover" />
                  <View style={styles.cardBody}>
                    <View style={styles.badges}>
                      <View style={[styles.badge, eligible && styles.eligibleBadge]}>
                        <NuviaText variant="caption">{eligible ? 'READY TO ENTER' : 'SAVED'}</NuviaText>
                      </View>
                      <View style={[styles.badge, styles.potBadge]}>
                        <NuviaText variant="caption">{potLabel}</NuviaText>
                      </View>
                    </View>
                    <NuviaText variant="h2">{item.opportunity_title || item.product_title}</NuviaText>
                    <NuviaText variant="body">{item.merchant_name} · {item.merchant_location}</NuviaText>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => router.push(`/challenges/${item.opportunity_id}`)}
                      style={[styles.action, eligible && styles.eligibleAction]}
                    >
                      <NuviaText variant="bodyBold">
                        {eligible ? 'ENTER CHALLENGE' : competitive ? 'VIEW CHALLENGE' : 'VIEW PRODUCT + BRIEF'}
                      </NuviaText>
                      <Ionicons name="arrow-forward" size={18} color={colors.ink} />
                    </Pressable>
                    <Pressable accessibilityRole="button" onPress={() => removeSaved(item.opportunity_id)} style={styles.removeButton}>
                      <NuviaText variant="caption">REMOVE FROM SAVED</NuviaText>
                    </Pressable>
                  </View>
                </View>
              );
            })
          ) : (
            <View style={styles.empty}>
              <Ionicons name="heart-outline" size={54} color={colors.ink} />
              <NuviaText variant="h2">NO SAVED CHALLENGES</NuviaText>
              <NuviaText variant="body" align="center">
                Swipe right in Discover to shortlist pots. Buy from Cart when you are ready to enter.
              </NuviaText>
              <Pressable onPress={() => router.replace('/(shop)')} style={styles.action}>
                <NuviaText variant="bodyBold">START DISCOVERING</NuviaText>
              </Pressable>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
