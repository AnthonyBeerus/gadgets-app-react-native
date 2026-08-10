import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MerchantIdentityRow, Money, SearchField, Text, useDesignTokens } from '../../../shared/design-system';
import { useShopStore } from '../../../store/shop-store';
import { getCampaignAwareShopsResult } from '../marketplace-api';
import type { MerchantGrowthProfile } from '../shops-model';

export default function MarketplaceScreen() {
  const { colors } = useDesignTokens();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const selectedMall = useShopStore(state => state.selectedMall);
  const malls = useShopStore(state => state.malls);
  const shops = useQuery({
    queryKey: ['shops', 'campaign-aware', selectedMall],
    queryFn: getCampaignAwareShopsResult,
    staleTime: 60_000,
    retry: 2,
  });
  const records = shops.data?.records ?? [];
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return records;
    return records.filter(item => `${item.name} ${item.story}`.toLowerCase().includes(term));
  }, [query, records]);
  const featured = filtered[0];
  const list = featured ? filtered.slice(1) : [];
  const location = malls.find(mall => mall.id === selectedMall)?.name ?? 'Molapo';
  const open = (id: number) => router.push(`/shop/${id}`);

  return <SafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: colors.canvas }]}>
    <View style={[styles.header, { borderBottomColor: colors.stroke }]}>
      <Text variant="h2">Shops</Text>
      <Pressable onPress={() => router.push('/mall-selector')} accessibilityLabel="Change location"><Text variant="label" color={colors.inkMuted}>{location.toUpperCase()} ▾</Text></Pressable>
    </View>
    <FlatList
      data={list}
      keyExtractor={item => String(item.id)}
      contentContainerStyle={styles.content}
      refreshing={shops.isFetching}
      onRefresh={() => shops.refetch()}
      ListHeaderComponent={<View style={styles.top}>
        <SearchField label="Search" placeholder="Search shops" value={query} onChangeText={setQuery} />
        {shops.data?.provenance === 'illustrative-fallback' ? <View style={[styles.disclosure, { backgroundColor: colors.ink }]}><Text variant="label" color={colors.onInk}>Illustrative · live shops unavailable</Text></View> : null}
        {shops.isLoading ? <ShopSkeleton /> : featured ? <FeaturedMerchant profile={featured} onPress={() => open(featured.id)} /> : <View style={[styles.empty, { borderColor: colors.strokeDim }]}><Text variant="h1">No shops yet</Text><Text variant="body">No businesses match this search. Clear it to see every available shop.</Text></View>}
        {list.length ? <Text variant="label">All shops</Text> : null}
      </View>}
      renderItem={({ item }) => <MerchantRow profile={item} onPress={() => open(item.id)} />}
      ItemSeparatorComponent={() => <View style={[styles.rule, { backgroundColor: colors.strokeDim }]} />}
    />
  </SafeAreaView>;
}

function pot(profile: MerchantGrowthProfile) { return Number(profile.opportunity?.pot_value ?? profile.opportunity?.reward_value ?? 0); }
function identity(profile: MerchantGrowthProfile) { return { id: profile.id, name: profile.name, location: profile.location, imageUrl: profile.logoUrl }; }
function FeaturedMerchant({ profile, onPress }: { profile: MerchantGrowthProfile; onPress: () => void }) {
  const { colors } = useDesignTokens();
  return <Pressable onPress={onPress} style={[styles.featured, { borderColor: colors.stroke, backgroundColor: colors.surface }]}>
    <View style={[styles.heroFrame, { borderBottomColor: colors.stroke }]}><Image source={{ uri: profile.imageUrl }} style={styles.hero} contentFit="cover" /></View>
    <View style={styles.featuredBody}><MerchantIdentityRow merchant={identity(profile)} />
      <View style={[styles.pot, { backgroundColor: colors.ink }]}><Text variant="label" color={colors.onInk}>Open creator pot</Text><Money amount={pot(profile)} format="prize" emphasis="strong" style={{ color: colors.payout }} /></View>
    </View>
  </Pressable>;
}
function MerchantRow({ profile, onPress }: { profile: MerchantGrowthProfile; onPress: () => void }) {
  return <Pressable onPress={onPress} style={styles.row}><View style={styles.rowIdentity}><MerchantIdentityRow merchant={identity(profile)} /></View><View style={styles.rowMoney}><Money amount={pot(profile)} format="prize" emphasis="strong" /><Text variant="caption">pot</Text></View></Pressable>;
}
function ShopSkeleton() { const { colors } = useDesignTokens(); return <View style={[styles.skeleton, { borderColor: colors.strokeDim, backgroundColor: colors.surfaceSunken }]}><View style={[styles.skeletonHero, { borderBottomColor: colors.strokeDim }]} /><View style={styles.skeletonLines}><View style={[styles.skeletonLine, { borderColor: colors.strokeDim }]} /><View style={[styles.skeletonLineShort, { borderColor: colors.strokeDim }]} /></View></View>; }

const styles = StyleSheet.create({
  safe: { flex: 1 }, header: { minHeight: 58, paddingHorizontal: 16, borderBottomWidth: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  content: { paddingHorizontal: 16, paddingBottom: 104 }, top: { gap: 14, paddingVertical: 14 }, disclosure: { padding: 10 }, featured: { borderWidth: 2 }, heroFrame: { height: 174, borderBottomWidth: 2 }, hero: { width: '100%', height: '100%' }, featuredBody: { padding: 12, gap: 12 }, pot: { padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  row: { minHeight: 72, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 8 }, rowIdentity: { flex: 1, minWidth: 0 }, rowMoney: { flexShrink: 0, alignItems: 'flex-end' }, rule: { height: 1 },
  empty: { borderWidth: 2, borderStyle: 'dashed', padding: 20, gap: 8 }, skeleton: { height: 286, borderWidth: 2 }, skeletonHero: { height: 174, borderBottomWidth: 2 }, skeletonLines: { padding: 14, gap: 10 }, skeletonLine: { height: 24, width: '70%', borderWidth: 2 }, skeletonLineShort: { height: 18, width: '42%', borderWidth: 2 },
});
