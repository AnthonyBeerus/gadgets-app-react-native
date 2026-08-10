import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, StyleSheet, View } from 'react-native';
import { useEffect, useState } from 'react';

import { getProduct } from '../../../shared/api/api';
import { Button, Chip, EligibilityPanel, MerchantIdentityRow, Money, PinnedActionBar, QuantityStepper, StackScreenTemplate, Text, useDesignTokens } from '../../../shared/design-system';
import { useCartStore } from '../../../store/cart-store';
import { getOpportunityForProduct } from '../../discovery/api';

export default function ProductDetailsScreen() {
  const { slug, source, opportunityId } = useLocalSearchParams<{ slug: string; source?: 'discover' | 'merchant'; opportunityId?: string }>();
  const router = useRouter();
  const { colors } = useDesignTokens();
  const productQuery = getProduct(slug);
  const product = productQuery.data as any;
  const parsedOpportunityId = opportunityId ? Number(opportunityId) : undefined;
  const opportunity = useQuery({ queryKey: ['product-opportunity', product?.id, parsedOpportunityId], queryFn: () => getOpportunityForProduct(Number(product.id), parsedOpportunityId), enabled: Boolean(product?.id), staleTime: 60_000, retry: 2 });
  const cart = useCartStore();
  const existing = cart.items.find(item => item.id === product?.id);
  const [quantity, setQuantity] = useState(1);
  useEffect(() => { setQuantity(existing?.quantity ?? 1); }, [existing?.quantity, product?.id]);
  if (productQuery.isLoading) return <StackScreenTemplate title="Product" fallbackHref="/(shop)/marketplace"><View style={[styles.skeleton, { borderColor: colors.strokeDim, backgroundColor: colors.surfaceSunken }]} /></StackScreenTemplate>;
  if (productQuery.error) return <StackScreenTemplate title="Product" fallbackHref="/(shop)/marketplace"><Text variant="h1">Product unavailable</Text><Text variant="body">{(productQuery.error as Error).message}</Text><Button onPress={() => productQuery.refetch()}>Try again</Button></StackScreenTemplate>;
  if (!product) return <Redirect href="/(shop)/marketplace" />;
  const illustrative = Number(product.id) < 0;
  const shop = product.shop ?? {};
  const merchant = { id: Number(product.shop_id ?? -1), name: shop.name ?? product.merchantName ?? 'Muse shop' };
  const add = () => {
    if (illustrative) return;
    const item = { id: Number(product.id), shopId: merchant.id, shopName: merchant.name, hasDelivery: Boolean(shop.has_delivery), hasCollection: shop.has_collection !== false, deliveryFee: Number(shop.delivery_fee ?? 0), minimumOrderAmount: Number(shop.minimum_order_amount ?? 0), title: product.title, heroImage: product.heroImage ?? '', price: Number(product.price), quantity: existing ? Math.max(0, quantity - existing.quantity) : quantity, maxQuantity: Number(product.maxQuantity ?? 0) };
    const result = cart.addItem(item);
    if (result === 'merchant_conflict') return Alert.alert('Start a new bag?', `Replace your ${cart.items[0]?.shopName ?? 'current shop'} bag with ${merchant.name}? The current contents will be removed.`, [{ text: 'Keep current bag', style: 'cancel' }, { text: 'Replace bag', style: 'destructive', onPress: () => { cart.replaceCart(item); cart.setAttribution({ source: source ?? 'merchant', opportunityId: parsedOpportunityId }); router.push('/bag'); } }]);
    cart.setAttribution({ source: source ?? 'merchant', opportunityId: parsedOpportunityId });
    router.push('/bag');
  };
  const increment = () => setQuantity(value => Math.min(Number(product.maxQuantity ?? 1), value + 1));
  const decrement = () => setQuantity(value => Math.max(1, value - 1));
  const eligibility = opportunity.data ? { title: opportunity.data.title, pot: Number((opportunity.data as any).pot_value ?? 0), perEntry: Number(opportunity.data.accepted_entry_fee ?? opportunity.data.reward_value), qualifying: true, illustrative } : null;
  return <StackScreenTemplate title="Product" fallbackHref={`/shop/${merchant.id}`} footer={<PinnedActionBar><View style={styles.actions}><QuantityStepper value={quantity} maximum={Number(product.maxQuantity ?? 1)} onIncrement={increment} onDecrement={decrement} /><Button variant="commerce" onPress={add} disabled={illustrative} disabledReason={illustrative ? 'Illustrative products cannot be added to a payable bag.' : undefined} style={styles.flex}>Add to bag</Button></View></PinnedActionBar>} scrollProps={{ contentContainerStyle: styles.content }}>
    <Image source={{ uri: product.heroImage }} style={[styles.hero, { borderColor: colors.stroke }]} contentFit="cover" />
    {illustrative ? <Chip kind="disclosure" tone="illustrative" label="ILLUSTRATIVE" /> : null}
    <MerchantIdentityRow merchant={merchant} />
    <Text variant="display">{product.title}</Text><Money amount={Number(product.price)} emphasis="hero" />
    <View style={styles.chips}>{shop.has_collection !== false ? <Chip kind="status" tone="success" label="Collection" /> : null}{shop.has_delivery ? <Chip kind="status" tone="warning" label={`Delivery ${Number(shop.delivery_fee ?? 0) ? `P${Number(shop.delivery_fee)}` : ''}`} /> : null}<Chip kind="status" tone="warning" label={`${Number(product.maxQuantity ?? 0)} left`} /></View>
    {eligibility ? <EligibilityPanel model={eligibility} /> : null}
    <Text variant="body" color={colors.inkMuted}>{product.description}</Text>
  </StackScreenTemplate>;
}

const styles = StyleSheet.create({ content: { padding: 16, paddingBottom: 170, gap: 14 }, hero: { height: 310, borderWidth: 2 }, chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, actions: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 }, flex: { flex: 1 }, skeleton: { height: 560, borderWidth: 2 } });
