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
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';

import { NuviaText } from '../../../components/atoms/nuvia-text';
import { CartItem } from '../../cart/components/CartItem';
import { useCheckout } from '../../cart/hooks/use-checkout';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { NuviaButton } from '../../../shared/components/ui/nuvia-button';
import { useCartStore } from '../../../store/cart-store';
import { getSavedCreatorOpportunities, restoreCreatorOpportunityPreference } from '../api';

type BagTab = 'cart' | 'saved';

const FlashListFixed = FlashList as unknown as <T>(
  props: React.ComponentProps<typeof FlashList<T>> & { estimatedItemSize: number },
) => React.ReactElement;

export default function BagScreen() {
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
          <Ionicons name="arrow-back" size={22} color={NEO_THEME.colors.black} />
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
          <Ionicons name="bag-handle" size={18} color={NEO_THEME.colors.black} />
          <NuviaText variant="caption">CART{cartCount > 0 ? ` (${cartCount})` : ''}</NuviaText>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: tab === 'saved' }}
          onPress={() => setTab('saved')}
          style={[styles.segment, tab === 'saved' && styles.segmentActive]}
        >
          <Ionicons name="heart" size={18} color={NEO_THEME.colors.black} />
          <NuviaText variant="caption">SAVED{savedCount > 0 ? ` (${savedCount})` : ''}</NuviaText>
        </Pressable>
      </View>

      {tab === 'cart' ? (
        <View style={styles.panel}>
          {items.length === 0 ? (
            <View style={styles.empty}>
              <NuviaText variant="h2">CART IS EMPTY</NuviaText>
              <NuviaText variant="body" align="center">
                Add a qualifying product to enter a challenge, or browse the marketplace.
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
                  <NuviaText variant="h1" color={NEO_THEME.colors.primary}>P{getTotalPrice()}</NuviaText>
                </View>
                <NuviaButton onPress={() => checkout()} disabled={isProcessing} variant="primary" style={styles.checkoutButton}>
                  {isProcessing ? (
                    <ActivityIndicator color={NEO_THEME.colors.white} />
                  ) : (
                    <NuviaText variant="bodyBold" color={NEO_THEME.colors.white}>CHECKOUT</NuviaText>
                  )}
                </NuviaButton>
              </View>
            </>
          )}
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.savedContent} contentInsetAdjustmentBehavior="automatic">
          {saved.isLoading ? (
            <ActivityIndicator size="large" color={NEO_THEME.colors.primary} />
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
                : `P${Number(item.reward_value).toFixed(0)} VOUCHER`;
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
                      <Ionicons name="arrow-forward" size={18} color={NEO_THEME.colors.black} />
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
              <Ionicons name="heart-outline" size={54} color={NEO_THEME.colors.primary} />
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: NEO_THEME.colors.background },
  topBar: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingHorizontal: 16, paddingTop: 8 },
  headerCopy: { flex: 1, gap: 2 },
  iconButton: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
    borderRadius: 14,
    backgroundColor: NEO_THEME.colors.white,
  },
  segments: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  segment: {
    flex: 1,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
    borderRadius: 999,
    backgroundColor: NEO_THEME.colors.white,
  },
  segmentActive: { backgroundColor: NEO_THEME.colors.secondary },
  panel: { flex: 1 },
  listWrap: { flex: 1, minHeight: 2 },
  listContent: { padding: 16, paddingBottom: 24 },
  savedContent: { gap: 14, padding: 16, paddingBottom: 48 },
  empty: {
    alignItems: 'center',
    gap: 14,
    margin: 16,
    borderWidth: 3,
    borderColor: NEO_THEME.colors.black,
    borderRadius: 20,
    backgroundColor: NEO_THEME.colors.white,
    padding: 28,
  },
  footer: {
    padding: 16,
    backgroundColor: NEO_THEME.colors.white,
    borderTopWidth: 2,
    borderColor: NEO_THEME.colors.black,
    gap: 12,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  checkoutButton: { width: '100%' },
  card: {
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: NEO_THEME.colors.black,
    borderRadius: 20,
    backgroundColor: NEO_THEME.colors.white,
    boxShadow: '5px 5px 0px #000000',
  },
  image: { width: '100%', aspectRatio: 1.8 },
  cardBody: { gap: 8, padding: 14 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  badge: {
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
    borderRadius: 999,
    backgroundColor: NEO_THEME.colors.white,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  eligibleBadge: { backgroundColor: NEO_THEME.colors.success },
  potBadge: { backgroundColor: NEO_THEME.colors.secondary },
  action: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
    borderRadius: 999,
    backgroundColor: NEO_THEME.colors.secondary,
    paddingHorizontal: 18,
  },
  eligibleAction: { backgroundColor: NEO_THEME.colors.success },
  removeButton: { alignSelf: 'center', padding: 8 },
});
