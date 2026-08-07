import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NuviaText } from '../../../components/atoms/nuvia-text';
import { NuviaShopCard } from '../../../components/molecules/nuvia-shop-card';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { useShopStore } from '../../../store/shop-store';
import { ConsumerUtilityHeader } from '../components/consumer-utility-header';
import { getMarketplaceCatalog } from '../marketplace-api';

type Fulfillment = 'all' | 'collection' | 'delivery';

export default function MarketplaceScreen() {
  const router = useRouter();
  const selectedMall = useShopStore(state => state.selectedMall);
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [fulfillment, setFulfillment] = useState<Fulfillment>('all');
  const catalog = useQuery({ queryKey: ['marketplace-catalog'], queryFn: getMarketplaceCatalog, staleTime: 60_000 });

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const shops = (catalog.data?.shops ?? []).filter(shop => {
      const textMatch = !normalized || `${shop.name} ${shop.description ?? ''} ${shop.location}`.toLowerCase().includes(normalized);
      const mallMatch = !selectedMall || shop.mall_id === selectedMall;
      const fulfillmentMatch = fulfillment === 'all'
        || (fulfillment === 'delivery' && shop.has_delivery)
        || (fulfillment === 'collection' && shop.has_collection);
      return textMatch && mallMatch && fulfillmentMatch;
    });
    const eligibleShopIds = new Set(shops.map(shop => shop.id));
    const products = (catalog.data?.products ?? []).filter(product => {
      const textMatch = !normalized || `${product.title} ${product.description ?? ''}`.toLowerCase().includes(normalized);
      return textMatch && eligibleShopIds.has(product.shop_id) && (!categoryId || product.category === categoryId);
    });
    return { products, shops };
  }, [catalog.data, categoryId, fulfillment, query, selectedMall]);

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ConsumerUtilityHeader />
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View>
          <NuviaText variant="display">MARKETPLACE</NuviaText>
          <NuviaText variant="body" style={styles.subtitle}>Know what you want? Search every local product and merchant.</NuviaText>
        </View>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={22} color={NEO_THEME.colors.grey} />
          <TextInput
            accessibilityLabel="Search products and merchants"
            value={query}
            onChangeText={setQuery}
            placeholder="Search products first..."
            placeholderTextColor={NEO_THEME.colors.grey}
            style={styles.searchInput}
          />
          {query.length > 0 && <Pressable accessibilityLabel="Clear search" onPress={() => setQuery('')}><Ionicons name="close-circle" size={21} /></Pressable>}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          <Filter label="ALL" active={!categoryId} onPress={() => setCategoryId(null)} />
          {(catalog.data?.categories ?? []).map((category: any) => (
            <Filter key={category.id} label={category.name} active={categoryId === category.id} onPress={() => setCategoryId(category.id)} />
          ))}
        </ScrollView>
        <View style={styles.fulfillmentRow}>
          <Filter label="ANY" active={fulfillment === 'all'} onPress={() => setFulfillment('all')} />
          <Filter label="COLLECTION" active={fulfillment === 'collection'} onPress={() => setFulfillment('collection')} />
          <Filter label="DELIVERY" active={fulfillment === 'delivery'} onPress={() => setFulfillment('delivery')} />
        </View>

        {catalog.isLoading ? <ActivityIndicator size="large" color={NEO_THEME.colors.primary} /> : catalog.error ? (
          <View style={styles.empty}><NuviaText variant="h2">MARKETPLACE UNAVAILABLE</NuviaText><Pressable onPress={() => catalog.refetch()} style={styles.retry}><NuviaText variant="bodyBold">TRY AGAIN</NuviaText></Pressable></View>
        ) : (
          <>
            <View style={styles.sectionHeader}>
              <NuviaText variant="h2">PRODUCTS</NuviaText>
              <NuviaText variant="caption">{filtered.products.length} FOUND</NuviaText>
            </View>
            <View style={styles.productGrid}>
              {filtered.products.map(product => (
                <Pressable
                  key={product.id}
                  accessibilityRole="button"
                  accessibilityLabel={`${product.title}, P${Number(product.price).toFixed(2)}`}
                  onPress={() => router.push({ pathname: '/product/[slug]', params: { slug: product.slug, source: 'marketplace' } })}
                  style={styles.productCard}
                >
                  <Image source={{ uri: product.heroImage }} style={styles.productImage} contentFit="cover" />
                  <NuviaText variant="bodyBold" numberOfLines={2}>{product.title}</NuviaText>
                  <NuviaText variant="h3" color={NEO_THEME.colors.primary}>P{Number(product.price).toFixed(2)}</NuviaText>
                </Pressable>
              ))}
            </View>
            {filtered.products.length === 0 && <View style={styles.empty}><NuviaText variant="h3">NO PRODUCTS MATCH</NuviaText><NuviaText variant="body" align="center">Try another term or remove a filter.</NuviaText></View>}

            <View style={styles.sectionHeader}>
              <NuviaText variant="h2">MERCHANTS</NuviaText>
              <NuviaText variant="caption">{filtered.shops.length} FOUND</NuviaText>
            </View>
            <View style={styles.shopList}>
              {filtered.shops.map(shop => (
                <NuviaShopCard key={shop.id} shop={shop as any} onPress={() => router.push(`/shop/${shop.id}`)} />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Filter({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ selected: active }} onPress={onPress} style={[styles.filter, active && styles.filterActive]}><NuviaText variant="caption">{label}</NuviaText></Pressable>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: NEO_THEME.colors.background },
  content: { gap: 18, paddingHorizontal: 16, paddingBottom: 110 },
  subtitle: { color: NEO_THEME.colors.grey },
  searchBox: { minHeight: 54, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 2, borderColor: NEO_THEME.colors.black, borderRadius: 16, backgroundColor: NEO_THEME.colors.white, paddingHorizontal: 14, boxShadow: '4px 4px 0px #000000' },
  searchInput: { flex: 1, fontFamily: NEO_THEME.fonts.regular, fontSize: 16, color: NEO_THEME.colors.black },
  filters: { gap: 8, paddingRight: 16 },
  fulfillmentRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filter: { minHeight: 38, justifyContent: 'center', borderWidth: 2, borderColor: NEO_THEME.colors.black, borderRadius: 999, backgroundColor: NEO_THEME.colors.white, paddingHorizontal: 14 },
  filterActive: { backgroundColor: NEO_THEME.colors.secondary },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  productCard: { width: '48%', gap: 8, borderWidth: 2, borderColor: NEO_THEME.colors.black, borderRadius: 16, backgroundColor: NEO_THEME.colors.white, padding: 10, boxShadow: '4px 4px 0px #000000' },
  productImage: { width: '100%', aspectRatio: 1, borderRadius: 11, borderWidth: 1, borderColor: NEO_THEME.colors.black },
  shopList: { gap: 12 },
  empty: { alignItems: 'center', gap: 10, borderWidth: 2, borderColor: NEO_THEME.colors.black, borderRadius: 16, backgroundColor: NEO_THEME.colors.white, padding: 24 },
  retry: { borderWidth: 2, borderColor: NEO_THEME.colors.black, borderRadius: 999, backgroundColor: NEO_THEME.colors.secondary, paddingHorizontal: 20, paddingVertical: 10 },
});
