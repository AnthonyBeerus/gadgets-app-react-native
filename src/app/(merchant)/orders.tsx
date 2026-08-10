import { useQueryClient } from '@tanstack/react-query';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getMerchantOrders, performOrderAction } from '../../shared/api/api';
import { Button, Text, useDesignTokens, useThemedStyles, type DesignTokens, type SemanticColors } from '../../shared/design-system';
import { useAuth } from '../../shared/providers/auth-provider';

const nextAction = (order: any): { action: string; label: string } | null => {
  if (order.order_status === 'paid') return { action: 'accept', label: 'ACCEPT ORDER' };
  if (order.order_status === 'accepted') return { action: 'preparing', label: 'START PREPARING' };
  if (order.order_status === 'preparing' && order.fulfilment_type === 'collection') return { action: 'ready_for_collection', label: 'READY FOR COLLECTION' };
  if (order.order_status === 'preparing' && order.fulfilment_type === 'delivery') return { action: 'out_for_delivery', label: 'OUT FOR DELIVERY' };
  if (order.order_status === 'out_for_delivery') return { action: 'complete_delivery', label: 'MARK DELIVERED' };
  return null;
};

function createStyles(c: SemanticColors, tokens: DesignTokens) {
  return { safe: { flex: 1, backgroundColor: c.canvas }, content: { gap: 14, padding: 20, paddingBottom: 48 }, card: { gap: 10, borderWidth: 1, borderColor: c.border, borderRadius: 18, backgroundColor: c.surface, padding: 16, ...tokens.elevation.hairline }, row: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, gap: 12 }, actions: { gap: 8 }, empty: { alignItems: 'center' as const, gap: 10, paddingVertical: 48 } };
}

export default function MerchantOrdersScreen() {
  const styles = useThemedStyles(createStyles); const { colors } = useDesignTokens(); const router = useRouter();
  const { merchantShopId } = useAuth(); const query = getMerchantOrders(merchantShopId); const client = useQueryClient(); const [busyId, setBusyId] = useState<number | null>(null);
  const act = async (order: any, action: string) => { setBusyId(order.id); try { await performOrderAction(order.id, action); await client.invalidateQueries({ queryKey: ['merchant-orders'] }); } catch (e) { Alert.alert('Order was not updated', e instanceof Error ? e.message : 'Try again.'); } finally { setBusyId(null); } };
  return <SafeAreaView style={styles.safe}><Stack.Screen options={{ headerShown: false }} /><ScrollView contentContainerStyle={styles.content}>
    <Button variant="ghost" onPress={() => router.back()} style={{ alignSelf: 'flex-start' }}>‹ DASHBOARD</Button>
    <View><Text variant="display">ORDERS</Text><Text variant="body" color={colors.inkMuted}>Accept, prepare and hand over paid orders</Text></View>
    {query.isLoading ? <ActivityIndicator color={colors.ink} /> : !query.data?.length ? <View style={styles.empty}><Text variant="h2">NO ACTIVE ORDERS</Text><Text variant="body" align="center">Paid sandbox orders appear here automatically.</Text></View> : query.data.map((order: any) => {
      const next = nextAction(order); const fulfilment = order.delivery_orders?.[0];
      return <View key={order.id} style={styles.card}><View style={styles.row}><Text variant="h2">ORDER #{order.id}</Text><Text variant="caption">{order.order_status.replaceAll('_', ' ').toUpperCase()}</Text></View><Text variant="bodyBold">{order.fulfilment_type === 'delivery' ? 'DELIVERY' : 'COLLECTION'} · P{(order.total_minor / 100).toFixed(2)}</Text><Text variant="body">{fulfilment?.delivery_phone}</Text>{fulfilment?.delivery_address ? <Text variant="body">{fulfilment.delivery_address}</Text> : null}<View style={styles.actions}>{next ? <Button disabled={busyId === order.id} onPress={() => act(order, next.action)}>{busyId === order.id ? 'UPDATING…' : next.label}</Button> : null}{['paid', 'accepted'].includes(order.order_status) ? <Button variant="outline" disabled={busyId === order.id} onPress={() => Alert.alert('Reject and refund?', 'Stripe will issue a sandbox refund and notify the buyer in Orders.', [{ text: 'Keep order', style: 'cancel' }, { text: 'Reject', style: 'destructive', onPress: () => act(order, 'reject') }])}>REJECT + REFUND</Button> : null}{order.order_status === 'ready_for_collection' ? <Button variant="secondary" onPress={() => router.push('/scan-order')}>SCAN COLLECTION CODE</Button> : null}</View></View>;
    })}
  </ScrollView></SafeAreaView>;
}
