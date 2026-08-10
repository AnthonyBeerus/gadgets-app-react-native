import { FlashList } from '@shopify/flash-list';
import { format } from 'date-fns';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NuviaText } from '../../../components/atoms/nuvia-text';
import { getMyOrders } from '../../../shared/api/api';
import { useDesignTokens, useThemedStyles, type DesignTokens, type SemanticColors } from '../../../shared/design-system';

const FlashListFixed = FlashList as unknown as <T>(props: React.ComponentProps<typeof FlashList<T>> & { estimatedItemSize: number }) => React.ReactElement;

function createStyles(c: SemanticColors, tokens: DesignTokens) {
  return {
    safe: { flex: 1, backgroundColor: c.canvas },
    header: { gap: 4, padding: 20, paddingBottom: 12 },
    list: { padding: 20, paddingTop: 6, paddingBottom: 48 },
    card: { gap: 8, marginBottom: 12, borderWidth: 1, borderColor: c.border, borderRadius: 18, backgroundColor: c.surface, padding: 16, ...tokens.elevation.hairline },
    row: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, gap: 12 },
    badge: { borderRadius: 999, backgroundColor: c.accentMuted, paddingHorizontal: 10, paddingVertical: 5 },
    empty: { alignItems: 'center' as const, gap: 10, padding: 40 },
  };
}

export default function OrdersListScreen() {
  const styles = useThemedStyles(createStyles);
  const { colors } = useDesignTokens();
  const router = useRouter();
  const query = getMyOrders();
  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}><NuviaText variant="display">MY ORDERS</NuviaText><NuviaText variant="body" color={colors.inkMuted}>Payments and fulfilment in one timeline</NuviaText></View>
      {query.isLoading ? <ActivityIndicator color={colors.ink} /> : query.error ? (
        <View style={styles.empty}><NuviaText variant="h2">ORDERS COULDN'T LOAD</NuviaText><Pressable onPress={() => query.refetch()}><NuviaText variant="bodyBold">TRY AGAIN</NuviaText></Pressable></View>
      ) : !query.data?.length ? (
        <View style={styles.empty}><NuviaText variant="h2">NO ORDERS YET</NuviaText><NuviaText variant="body" align="center">Purchases from Muse Alpha Shop appear here.</NuviaText></View>
      ) : (
        <FlashListFixed<any>
          data={query.data}
          estimatedItemSize={128}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push(`/orders/${item.slug}`)} style={styles.card}>
              <View style={styles.row}>
                <NuviaText variant="h3">ORDER #{item.id}</NuviaText>
                <View style={styles.badge}><NuviaText variant="caption">{String(item.order_status ?? item.status).replaceAll('_', ' ').toUpperCase()}</NuviaText></View>
              </View>
              <NuviaText variant="body">{item.shops?.name ?? 'Muse shop'} · {item.fulfilment_type ?? 'Collection'}</NuviaText>
              <View style={styles.row}><NuviaText variant="caption">{format(new Date(item.created_at), 'dd MMM yyyy, HH:mm')}</NuviaText><NuviaText variant="bodyBold">P{(Number(item.total_minor ?? item.totalPrice * 100) / 100).toFixed(2)}</NuviaText></View>
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}
