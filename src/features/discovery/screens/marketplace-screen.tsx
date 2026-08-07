import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NuviaText } from '../../../components/atoms/nuvia-text';
import { NuviaShopCard } from '../../../components/molecules/nuvia-shop-card';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { useNeoStyles } from '../../../shared/hooks/useNeoStyles';
import { useTheme } from '../../../shared/providers/theme-provider';
import { useShopStore } from '../../../store/shop-store';
import { ConsumerUtilityHeader } from '../components/consumer-utility-header';
import { getMarketplaceCatalog } from '../marketplace-api';

type Fulfillment = 'all' | 'collection' | 'delivery';

function createStyles(c: { black: string; white: string; grey: string; border: string; background: string; secondary: string; primary: string }) {
  return {
    container: { flex: 1, backgroundColor: c.background },
    content: { gap: 18, paddingHorizontal: 16, paddingBottom: 110 },
    subtitle: { color: c.grey },
    searchBox: { minHeight: 54, flexDirection: 'row' as const, alignItems: 'center' as const, gap: 10, borderWidth: 1, borderColor: c.border, borderRadius: 16, backgroundColor: c.white, paddingHorizontal: 14, boxShadow: '0px 2px 8px rgba(0,0,0,0.08)' },
    searchInput: { flex: 1, fontFamily: NEO_THEME.fonts.regular, fontSize: 16, color: c.black },
    filters: { gap: 8, paddingRight: 16 },
    fulfillmentRow: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: 8 },
    filter: { minHeight: 38, justifyContent: 'center' as const, borderWidth: 1, borderColor: c.border, borderRadius: 999, backgroundColor: c.white, paddingHorizontal: 14 },
    filterActive: { backgroundColor: c.secondary },
    sectionHeader: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'space-between' as const },
    productGrid: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: 12 },
    productCard: { width: '48%' as const, gap: 8, borderWidth: 1, borderColor: c.border, borderRadius: 16, backgroundColor: c.white, padding: 10, boxShadow: '0px 2px 8px rgba(0,0,0,0.08)' },
    productImage: { width: '100%' as const, aspectRatio: 1, borderRadius: 11, borderWidth: 1, borderColor: c.border },
    shopList: { gap: 12 },
    empty: { alignItems: 'center' as const, gap: 10, borderWidth: 1, borderColor: c.border, borderRadius: 16, backgroundColor: c.white, padding: 24 },
    retry: { borderWidth: 1, borderColor: c.border, borderRadius: 999, backgroundColor: c.secondary, paddingHorizontal: 20, paddingVertical: 10 },
  };
}

export default function MarketplaceScreen() {
  const styles = useNeoStyles(createStyles);
  const { theme } = useTheme();
  const c = theme.colors;
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
          <Ionicons name="search" size={22} color={c.grey} />
          <TextInput
            accessibilityLabel="Search products and merchants"
            value={query}
            onChangeText={setQuery}
            placeholder="Search products first..."
            placeholderTextColor={c.grey}
            style={styles.searchInput}
          />
          {query.length > 0 && <Pressable accessibilityLabel="Clear search" onPress={() => setQuery('')}><Ionicons name="close-circle" size={21} color={c.grey} /></Pressable>}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          <Filter label="ALL" active={!categoryId} onPress={() => setCategoryId(null)} styles={styles} />
          {(catalog.data?.categories ?? []).map((category: any) => (
            <Filter key={category.id} label={category.name} active={categoryId === category.id} onPress={() => setCategoryId(category.id)} styles={styles} />
          ))}
        </ScrollView>
        <View style={styles.fulfillmentRow}>
          <Filter label="ANY" active={fulfillment === 'all'} onPress={() => setFulfillment('all')} styles={styles} />
          <Filter label="COLLECTION" active={fulfillment === 'collection'} onPress={() => setFulfillment('collection')} styles={styles} />
          <Filter label="DELIVERY" active={fulfillment === 'delivery'} onPress={() => setFulfillment('delivery')} styles={styles} />
        </View>

        {catalog.isLoading ? <ActivityIndicator size="large" color={c.primary} /> : catalog.error ? (
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
                  <NuviaText variant="h3" color={c.primary}>P{Number(product.price).toFixed(2)}</NuviaText>
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

function Filter({ label, active, onPress, styles }: { label: string; active: boolean; onPress: () => void; styles: ReturnType<typeof createStyles> }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ selected: active }} onPress={onPress} style={[styles.filter, active && styles.filterActive]}><NuviaText variant="caption">{label}</NuviaText></Pressable>;
}
