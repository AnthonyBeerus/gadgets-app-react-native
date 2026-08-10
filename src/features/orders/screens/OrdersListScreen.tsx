import { FlashList } from '@shopify/flash-list';
import { format } from 'date-fns';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getMyOrders } from '../../../shared/api/api';
import {
  Button,
  Chip,
  EmptyState,
  ErrorNotice,
  Money,
  Rule,
  ScreenHeader,
  Text,
  layout,
  space,
  useDesignTokens,
  useThemedStyles,
  type SemanticColors,
} from '../../../shared/design-system';

const FlashListFixed = FlashList as unknown as <T>(props: React.ComponentProps<typeof FlashList<T>> & { estimatedItemSize: number }) => React.ReactElement;

/** Terminal-ish states get a settled tone; anything still moving stays a warning. */
const TONE: Record<string, 'success' | 'warning' | 'danger'> = {
  completed: 'success',
  ready_for_collection: 'success',
  paid: 'success',
  cancelled: 'danger',
  refunded: 'danger',
  failed: 'danger',
};

function createStyles(c: SemanticColors) {
  return {
    safe: { flex: 1, backgroundColor: c.canvas },
    list: { padding: layout.screenGutter, paddingBottom: 48 },
    card: {
      gap: space.xs,
      marginBottom: space.sm,
      borderWidth: 2,
      borderRadius: 0,
      borderColor: c.stroke,
      backgroundColor: c.surface,
      padding: layout.cardPadding,
    },
    row: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, gap: space.sm },
    state: { padding: space.xl, gap: space.md },
  };
}

export default function OrdersListScreen() {
  const styles = useThemedStyles(createStyles);
  const { colors } = useDesignTokens();
  const router = useRouter();
  const query = getMyOrders();
  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScreenHeader title="My orders" subtitle="Payments and fulfilment in one timeline" onBack={() => router.canGoBack() ? router.back() : router.replace('/(shop)/activity')} />
      {query.isLoading ? (
        <ActivityIndicator color={colors.ink} style={{ marginTop: space.xl }} />
      ) : query.error ? (
        <View style={styles.state}>
          <ErrorNotice
            title="Orders could not load"
            impact="Nothing about your orders changed — this phone just could not reach Muse."
            recovery="Check your connection and try again."
          />
          <Button onPress={() => query.refetch()}>Try again</Button>
        </View>
      ) : !query.data?.length ? (
        <View style={styles.state}>
          <EmptyState
            title="No orders yet"
            rule="Buying a qualifying product is what unlocks a merchant's brief, so orders start in Shops."
            actionLabel="Browse shops"
            onAction={() => router.push('/(shop)/marketplace')}
          />
        </View>
      ) : (
        <FlashListFixed<any>
          data={query.data}
          estimatedItemSize={128}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const status = String(item.order_status ?? item.status ?? '');
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Order MUSE-${item.id}`}
                onPress={() => router.push(`/orders/${item.slug ?? item.id}`)}
                style={styles.card}
              >
                <View style={styles.row}>
                  <Text variant="h3">MUSE-{item.id}</Text>
                  <Chip kind="status" tone={TONE[status] ?? 'warning'} label={status.replaceAll('_', ' ') || 'Pending'} />
                </View>
                <Text variant="bodySm">{item.shops?.name ?? 'Muse shop'} · {item.fulfilment_type ?? 'Collection'}</Text>
                <Rule quiet />
                <View style={styles.row}>
                  <Text variant="caption">{format(new Date(item.created_at), 'dd MMM yyyy, HH:mm')}</Text>
                  <Money amount={Number(item.total_minor ?? Number(item.totalPrice ?? 0) * 100) / 100} emphasis="strong" />
                </View>
              </Pressable>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}
