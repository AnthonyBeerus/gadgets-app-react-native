import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button, MerchantIdentityRow, Money, StackScreenTemplate, Text, useDesignTokens } from '../../../shared/design-system';
import { getCampaignAwareShopById } from '../../discovery/marketplace-api';
import type { MerchantProduct } from '../../discovery/shops-model';

export default function ShopDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useDesignTokens();
  const shopId = Number(id);
  const shop = useQuery({ queryKey: ['shop', shopId], queryFn: () => getCampaignAwareShopById(shopId), retry: 2, staleTime: 60_000 });
  const profile = shop.data;
  if (shop.isLoading) return <StackScreenTemplate title="Shop" fallbackHref="/(shop)/marketplace"><MerchantSkeleton /></StackScreenTemplate>;
  if (!profile) return <StackScreenTemplate title="Shop" fallbackHref="/(shop)/marketplace"><Text variant="h1">Shop unavailable</Text><Text variant="body">This business could not be loaded.</Text><Button onPress={() => shop.refetch()}>Try again</Button></StackScreenTemplate>;
  const qualifying = profile.opportunity ? profile.products.filter(item => item.id === profile.opportunity?.product_id) : [];
  const qualifyingIds = new Set(qualifying.map(item => item.id));
  const remaining = profile.products.filter(item => !qualifyingIds.has(item.id));
  const openProduct = (product: MerchantProduct) => router.push({ pathname: '/product/[slug]', params: { slug: product.slug, source: 'merchant', ...(profile.opportunity ? { opportunityId: profile.opportunity.opportunity_id } : {}) } });
  return <StackScreenTemplate title={profile.name} fallbackHref="/(shop)/marketplace">
    <Image source={{ uri: profile.imageUrl }} style={[styles.hero, { borderColor: colors.stroke }]} contentFit="cover" />
    {profile.isPrototype ? <View style={[styles.disclosure, { backgroundColor: colors.ink }]}><Text variant="label" color={colors.onInk}>Illustrative · not a live merchant offer</Text></View> : null}
    <MerchantIdentityRow merchant={{ id: profile.id, name: profile.name, location: profile.location, imageUrl: profile.logoUrl }} />
    <Text variant="body" color={colors.inkMuted}>{profile.story}</Text>
    {profile.opportunity ? <Pressable onPress={() => router.push(`/opportunity/${profile.opportunity!.opportunity_id}`)} style={[styles.brief, { backgroundColor: colors.ink, borderColor: colors.stroke }]}>
      <Text variant="label" color={colors.onInk}>The brief this shop funds</Text><Text variant="h2" color={colors.onInk}>{profile.opportunity.opportunity_title}</Text>
      <View style={styles.payout}><Money amount={Number(profile.opportunity.pot_value ?? 0)} format="prize" emphasis="strong" style={{ color: colors.payout }} /><Text variant="body" color={colors.onInk}>pot</Text></View>
    </Pressable> : null}
    {qualifying.length ? <ProductSection title="Qualifying products" products={qualifying} onOpen={openProduct} /> : null}
    <ProductSection title="Everything else" products={remaining} onOpen={openProduct} />
  </StackScreenTemplate>;
}

function ProductSection({ title, products, onOpen }: { title: string; products: MerchantProduct[]; onOpen: (item: MerchantProduct) => void }) {
  const { colors } = useDesignTokens();
  return <View style={styles.section}><Text variant="label">{title}</Text>{products.map(item => <ProductRow key={item.id} item={item} onPress={() => onOpen(item)} />)}{products.length === 0 ? <Text variant="body" color={colors.inkMuted}>No products in this section.</Text> : null}</View>;
}
function ProductRow({ item, onPress }: { item: MerchantProduct; onPress: () => void }) { const { colors } = useDesignTokens(); return <Pressable onPress={onPress} style={[styles.product, { borderTopColor: colors.strokeQuiet }]}><Image source={{ uri: item.heroImage }} style={[styles.thumb, { borderColor: colors.stroke }]} /><View style={styles.copy}><Text variant="bodyBold">{item.title}</Text><Text variant="caption" numberOfLines={2}>{item.description}</Text></View><Money amount={item.price} emphasis="strong" /></Pressable>; }
function MerchantSkeleton() { const { colors } = useDesignTokens(); return <View style={[styles.skeleton, { borderColor: colors.strokeDim, backgroundColor: colors.surfaceSunken }]} />; }
const styles = StyleSheet.create({ hero: { height: 210, borderWidth: 2 }, disclosure: { padding: 10 }, brief: { borderWidth: 2, padding: 14, gap: 9 }, payout: { flexDirection: 'row', gap: 8, alignItems: 'baseline' }, section: { gap: 4 }, product: { minHeight: 82, borderTopWidth: 1, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 10 }, thumb: { width: 62, height: 62, borderWidth: 2 }, copy: { flex: 1, gap: 3 }, skeleton: { height: 420, borderWidth: 2 } });
