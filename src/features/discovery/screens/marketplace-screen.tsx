import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text, fonts, radii, space, useDesignTokens, useThemedStyles, type DesignTokens, type SemanticColors } from '../../../shared/design-system';
import { useShopStore } from '../../../store/shop-store';
import { ConsumerUtilityHeader } from '../components/consumer-utility-header';
import { MerchantGrowthCard } from '../components/merchant-growth-card';
import { getCampaignAwareShops } from '../marketplace-api';
import { searchMerchantGrowthProfiles, type ShopIntent } from '../shops-model';

const intents: Array<ShopIntent | 'All'> = ['All', 'Eat', 'Beauty', 'Style', 'Creator Tech', 'Experiences'];

export default function MarketplaceScreen() {
  const styles = useThemedStyles(createStyles);
  const { colors } = useDesignTokens();
  const router = useRouter();
  const selectedMall = useShopStore(state => state.selectedMall);
  const malls = useShopStore(state => state.malls);
  const [query, setQuery] = useState('');
  const [intent, setIntent] = useState<ShopIntent | 'All'>('All');
  const [fulfillment, setFulfillment] = useState<'all' | 'collection' | 'delivery'>('all');
  const shops = useQuery({ queryKey: ['campaign-aware-shops'], queryFn: getCampaignAwareShops, staleTime: 60_000 });

  const profiles = useMemo(() => (shops.data ?? []).filter(profile => {
    const intentMatch = intent === 'All' || profile.intent === intent;
    const fulfillmentMatch = fulfillment === 'all' || (fulfillment === 'collection' ? profile.hasCollection : profile.hasDelivery);
    return intentMatch && fulfillmentMatch;
  }), [fulfillment, intent, shops.data]);
  const results = useMemo(() => searchMerchantGrowthProfiles(profiles, query), [profiles, query]);
  const location = malls.find(mall => mall.id === selectedMall)?.name ?? 'Molapo Crossing';
  const sponsored = profiles.find(profile => profile.isSponsored);
  const active = profiles.filter(profile => profile.opportunity && profile.id !== sponsored?.id);
  const allShops = profiles.filter(profile => profile.id !== sponsored?.id);
  const searching = query.trim().length > 0;
  const openMerchant = (id: number) => router.push(`/shop/${id}`);
  const openOpportunity = (id: number) => router.push(`/opportunity/${id}`);
  const openProduct = (slug: string, opportunityId?: number) => router.push({ pathname: '/product/[slug]', params: { slug, source: 'merchant', ...(opportunityId ? { opportunityId } : {}) } });

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ConsumerUtilityHeader />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.heading}>
          <Text variant="caption" color={colors.accent}>SHOPS · {location.toUpperCase()}</Text>
          <Text variant="h1">Shop businesses that invest in Botswana&apos;s creators.</Text>
          <Text variant="body" color={colors.inkMuted}>Find the business, see the funded brief, then shop the products that make participation possible.</Text>
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color={colors.inkMuted} />
          <TextInput accessibilityLabel="Search businesses, opportunities and products" value={query} onChangeText={setQuery} placeholder="Search businesses, briefs or products" placeholderTextColor={colors.inkMuted} style={styles.searchInput} />
          {!!query && <Pressable accessibilityLabel="Clear search" onPress={() => setQuery('')}><Ionicons name="close-circle" size={20} color={colors.inkMuted} /></Pressable>}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {intents.map(value => <Chip key={value} label={value} active={intent === value} onPress={() => setIntent(value)} styles={styles} />)}
        </ScrollView>
        <View style={styles.fulfillment}>
          <Chip label="Any fulfilment" active={fulfillment === 'all'} onPress={() => setFulfillment('all')} styles={styles} />
          <Chip label="Collection" active={fulfillment === 'collection'} onPress={() => setFulfillment('collection')} styles={styles} />
          <Chip label="Delivery" active={fulfillment === 'delivery'} onPress={() => setFulfillment('delivery')} styles={styles} />
        </View>

        {shops.isLoading ? <ActivityIndicator size="large" color={colors.ink} /> : shops.error ? (
          <View style={styles.empty}><Text variant="h2">Shops took a break</Text><Text variant="body" color={colors.inkMuted}>Try again to load creator-backed businesses.</Text><Pressable onPress={() => shops.refetch()} style={styles.retry}><Text variant="bodyBold">Try again</Text></Pressable></View>
        ) : searching ? (
          <View style={styles.sections}>
            <SectionTitle title="Businesses" count={results.merchants.length} />
            {results.merchants.map(profile => <MerchantGrowthCard key={profile.id} profile={profile} onPress={() => openMerchant(profile.id)} />)}
            <SectionTitle title="Opportunities" count={results.opportunities.length} />
            {results.opportunities.map(item => <Pressable key={item.opportunity_id} onPress={() => openOpportunity(item.opportunity_id)} style={styles.resultRow}><Ionicons name="sparkles" size={20} color={colors.accent} /><View style={styles.resultCopy}><Text variant="bodyBold">{item.opportunity_title}</Text><Text variant="caption" color={colors.inkMuted}>P{item.pot_value} pot · {item.merchant_name}</Text></View><Ionicons name="chevron-forward" size={18} color={colors.inkMuted} /></Pressable>)}
            <SectionTitle title="Products" count={results.products.length} />
            {results.products.map(item => <Pressable key={item.id} onPress={() => openProduct(item.slug)} style={styles.resultRow}><Image source={{ uri: item.heroImage }} style={styles.productThumb} /><View style={styles.resultCopy}><Text variant="bodyBold">{item.title}</Text><Text variant="caption" color={colors.inkMuted}>P{item.price}</Text></View><Ionicons name="chevron-forward" size={18} color={colors.inkMuted} /></Pressable>)}
            {results.merchants.length + results.opportunities.length + results.products.length === 0 && <View style={styles.empty}><Text variant="h2">Nothing matched</Text><Text variant="body" color={colors.inkMuted}>Try a merchant, category or product name.</Text></View>}
          </View>
        ) : (
          <View style={styles.sections}>
            {sponsored && <><SectionTitle title="Sponsored spotlight" /><MerchantGrowthCard profile={sponsored} onPress={() => openMerchant(sponsored.id)} /></>}
            <SectionTitle title="Businesses funding creators" count={active.length} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalCards}>{active.map(profile => <MerchantGrowthCard key={profile.id} profile={profile} compact onPress={() => openMerchant(profile.id)} />)}</ScrollView>
            <SectionTitle title="Campaign collections" />
            <View style={styles.collectionRow}>
              <CollectionCard title="Beauty Made in Botswana" subtitle="Scents, style and local professionals" icon="color-palette" onPress={() => { setIntent('Beauty'); setQuery(''); }} styles={styles} />
              <CollectionCard title="Made at Molapo" subtitle="Creative experiences and creator tools" icon="videocam" onPress={() => { setIntent('Experiences'); setQuery(''); }} styles={styles} />
            </View>
            <SectionTitle title="All shops" count={allShops.length} />
            {allShops.map(profile => <MerchantGrowthCard key={profile.id} profile={profile} onPress={() => openMerchant(profile.id)} />)}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionTitle({ title, count }: { title: string; count?: number }) { return <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}><Text variant="h2">{title}</Text>{count != null && <Text variant="caption">{count}</Text>}</View>; }
function Chip({ label, active, onPress, styles }: { label: string; active: boolean; onPress: () => void; styles: ReturnType<typeof createStyles> }) { return <Pressable accessibilityRole="button" accessibilityState={{ selected: active }} onPress={onPress} style={[styles.chip, active && styles.chipActive]}><Text variant="caption">{label}</Text></Pressable>; }
function CollectionCard({ title, subtitle, icon, onPress, styles }: { title: string; subtitle: string; icon: keyof typeof Ionicons.glyphMap; onPress: () => void; styles: ReturnType<typeof createStyles> }) { const { colors } = useDesignTokens(); return <Pressable onPress={onPress} style={styles.collection}><Ionicons name={icon} size={25} color={colors.accent} /><Text variant="bodyBold">{title}</Text><Text variant="caption" color={colors.inkMuted}>{subtitle}</Text></Pressable>; }

function createStyles(c: SemanticColors, tokens: DesignTokens) {
  return {
    container: { flex: 1, backgroundColor: c.canvas }, content: { gap: space.md, paddingHorizontal: space.md, paddingBottom: 110 }, heading: { gap: space.xs },
    searchBox: { minHeight: 50, flexDirection: 'row' as const, alignItems: 'center' as const, gap: space.sm, borderRadius: radii.md, backgroundColor: c.surface, paddingHorizontal: space.md, ...tokens.elevation.hairline },
    searchInput: { flex: 1, color: c.ink, fontFamily: fonts.regular, fontSize: 15 }, chips: { gap: space.xs, paddingRight: space.md }, chip: { minHeight: 38, justifyContent: 'center' as const, borderRadius: 999, borderWidth: 1, borderColor: c.border, backgroundColor: c.surface, paddingHorizontal: space.md }, chipActive: { backgroundColor: c.accentMuted, borderColor: c.accent },
    fulfillment: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: space.xs }, sections: { gap: space.md }, horizontalCards: { gap: space.md, paddingRight: space.md },
    collectionRow: { flexDirection: 'row' as const, gap: space.sm }, collection: { flex: 1, minHeight: 150, borderRadius: radii.md, backgroundColor: c.surface, padding: space.md, gap: space.xs, ...tokens.elevation.hairline },
    resultRow: { minHeight: 72, flexDirection: 'row' as const, alignItems: 'center' as const, gap: space.sm, borderRadius: radii.md, backgroundColor: c.surface, padding: space.sm, ...tokens.elevation.hairline }, resultCopy: { flex: 1, gap: 3 }, productThumb: { width: 54, height: 54, borderRadius: radii.sm },
    empty: { alignItems: 'center' as const, gap: space.sm, borderRadius: radii.md, backgroundColor: c.surface, padding: space.lg }, retry: { minHeight: 44, justifyContent: 'center' as const, borderRadius: radii.md, backgroundColor: c.accentMuted, paddingHorizontal: space.md },
  };
}
