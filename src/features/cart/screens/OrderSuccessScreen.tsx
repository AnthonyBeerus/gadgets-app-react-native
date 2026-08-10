import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, usePathname, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { getMyOrder } from '../../../shared/api/api';
import { supabase } from '../../../shared/lib/supabase';
import { Button, Chip, EligibilityPanel, Money, PaymentProcessingOrganism, PinnedActionBar, StatusScreenTemplate, Text, useDesignTokens } from '../../../shared/design-system';
import { useCartStore } from '../../../store/cart-store';

export default function OrderSuccessScreen() {
  const tokens = useDesignTokens();
  const router = useRouter();
  const pathname = usePathname();
  const params = useLocalSearchParams<{ orderId?: string; id?: string }>();
  const id = String(params.orderId ?? params.id ?? '');
  const query = getMyOrder(id);
  const order = query.data;
  const clear = useCartStore(state => state.clearCompletedCheckout);
  const terminal = ['succeeded', 'failed', 'cancelled', 'refunded'].includes(order?.payment_status ?? '');
  useEffect(() => { if (terminal) return; const timer = setInterval(() => query.refetch(), 2_000); return () => clearInterval(timer); }, [terminal, query.refetch]);
  useEffect(() => { if (order?.payment_status === 'succeeded') clear(); }, [clear, order?.payment_status]);
  useEffect(() => { if (pathname === '/payment-processing' && order?.payment_status === 'succeeded') router.replace(`/order-confirmed/${order.id}`); }, [order?.id, order?.payment_status, pathname, router]);
  const proof = useQuery({
    queryKey: ['order-purchase-proof', order?.id], enabled: order?.payment_status === 'succeeded',
    queryFn: async () => { const { data: purchase } = await (supabase as any).from('purchase_proofs').select('product_id').eq('order_id', order!.id).is('revoked_at', null).limit(1).maybeSingle(); if (!purchase) return null; const { data } = await (supabase as any).from('challenges').select('id,title,reward_value,pot_value,contest_mode').eq('product_id', purchase.product_id).eq('status', 'active').limit(1).maybeSingle(); return data ?? null; },
  });
  if (!order || ['requires_payment', 'processing'].includes(order.payment_status)) return <StatusScreenTemplate><PaymentProcessingOrganism model={{ reference: `MUSE-${id}`, cardAuthorized: true, networkConfirmed: false, merchantNotified: false }} /></StatusScreenTemplate>;
  if (order.payment_status !== 'succeeded') return <StatusScreenTemplate><Text variant="display">Payment not completed</Text><Text variant="body">The payment network did not confirm this order. Nothing was charged.</Text><Button onPress={() => router.replace('/bag')}>Back to bag</Button></StatusScreenTemplate>;
  const dark = tokens.mode === 'dark';
  const heroBackground = dark ? tokens.colors.ink : tokens.colors.ink;
  const heroText = tokens.colors.onInk;
  const items = order.order_items ?? [];
  return <View style={[styles.safe, { backgroundColor: tokens.colors.canvas }]}>
    <View style={[styles.hero, { backgroundColor: heroBackground }]}><Chip kind="status" tone="success" label="Payment confirmed" /><Text variant="display" color={heroText}>Order MUSE-{order.id}</Text><Text variant="bodySm" color={heroText}>Confirmed by the payment network, not by this phone. {order.shops?.name ?? 'The shop'} has your order.</Text></View>
    <View style={styles.body}>{items.map((item: any) => <View key={item.id} style={styles.line}><Text variant="bodySm">{item.quantity} × {item.products?.title ?? 'Product'}</Text><Money amount={Number(item.products?.price ?? 0) * item.quantity} /></View>)}<View style={styles.line}><Text variant="h3">Paid</Text><Money amount={order.total_minor / 100} emphasis="strong" /></View>{proof.data ? <EligibilityPanel model={{ title: proof.data.title, perEntry: Number(proof.data.reward_value ?? 0), pot: Number(proof.data.pot_value ?? 0), qualifying: true }} /> : null}<Text variant="label">Next</Text><Text variant="bodySm">We will tell you when it is ready. A collection code appears only after the shop marks the order ready.</Text></View>
    <PinnedActionBar><Button onPress={() => router.replace(`/orders/${order.slug ?? order.id}`)}>Track order</Button></PinnedActionBar>
  </View>;
}
const styles = StyleSheet.create({ safe: { flex: 1 }, hero: { paddingHorizontal: 16, paddingVertical: 26, gap: 11 }, body: { flex: 1, padding: 16, gap: 14 }, line: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 } });
