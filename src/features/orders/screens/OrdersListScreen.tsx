import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Link, Stack } from 'expo-router';
import { format } from 'date-fns';

import { Tables } from '../../../shared/types/database.types';
import { getMyOrders } from '../../../shared/api/api';
import { AnimatedHeaderLayout } from '../../../shared/components/layout/AnimatedHeaderLayout';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { NeoView } from '../../../shared/components/ui/neo-view';

const renderItem = (item: Tables<'order'>) => (
  <Link href={`/orders/${item.slug}`} asChild key={item.id}>
    <Pressable>
      <NeoView style={styles.orderContainer} containerStyle={styles.neoContainer}>
        <View style={styles.orderContent}>
          <View style={styles.orderDetailsContainer}>
            <Text style={styles.orderItem}>{item.slug}</Text>
            <Text style={styles.orderDetails}>{item.description}</Text>
            <Text style={styles.orderDate}>
              {format(new Date(item.created_at), 'MMM dd, yyyy')}
            </Text>
          </View>
          <View
            style={[styles.statusBadge, styles[`statusBadge_${item.status}`]]}
          >
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>
      </NeoView>
    </Pressable>
  </Link>
);

const OrdersListScreen = () => {
  const { data: orders, error, isLoading } = getMyOrders();

  const renderSmallTitle = () => (
    <Text style={styles.smallHeaderTitle}>MY ORDERS</Text>
  );

  const renderLargeTitle = () => (
    <View>
      <Text style={styles.largeHeaderTitle}>MY ORDERS</Text>
      <Text style={styles.largeHeaderSubtitle}>TRACK YOUR PURCHASES</Text>
    </View>
  );

  if (isLoading) return <ActivityIndicator size="large" color={NEO_THEME.colors.primary} style={{ marginTop: 40 }} />;

  if (error) return <Text style={styles.errorText}>Error: {error?.message}</Text>;

  return (
    <AnimatedHeaderLayout
      renderSmallTitle={renderSmallTitle}
      renderLargeTitle={renderLargeTitle}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.content}>
        {!orders || !orders.length ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>NO ORDERS YET</Text>
            <Text style={styles.emptyMessage}>
              Start shopping to see your orders here!
            </Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {orders.map((item: Tables<'order'>) => renderItem(item))}
          </View>
        )}
      </View>
    </AnimatedHeaderLayout>
  );
};

export default OrdersListScreen;

const styles: { [key: string]: any } = StyleSheet.create({
  content: {
    flex: 1,
    paddingBottom: 40,
  },
  smallHeaderTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  largeHeaderTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  largeHeaderSubtitle: {
    fontSize: 14,
    color: NEO_THEME.colors.grey,
    marginTop: 4,
    fontWeight: '700',
    fontFamily: NEO_THEME.fonts.bold,
    textTransform: 'uppercase',
  },
  listContainer: {
    padding: 16,
  },
  orderContainer: {
    backgroundColor: NEO_THEME.colors.white,
    padding: 16,
  },
  neoContainer: {
    marginBottom: 16,
  },
  orderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderDetailsContainer: {
    flex: 1,
  },
  orderItem: {
    fontSize: 18,
    fontWeight: '900',
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
    marginBottom: 4,
  },
  orderDetails: {
    fontSize: 14,
    color: NEO_THEME.colors.grey,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: NEO_THEME.colors.black,
    fontWeight: '700',
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 0,
    alignSelf: 'flex-start',
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '900',
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
  },
  statusBadge_Pending: {
    backgroundColor: NEO_THEME.colors.yellow,
  },
  statusBadge_Completed: {
    backgroundColor: '#4caf50', // Consider adding to theme
  },
  statusBadge_Shipped: {
    backgroundColor: NEO_THEME.colors.blue,
  },
  statusBadge_InTransit: {
    backgroundColor: '#ff9800', // Consider adding to theme
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    marginTop: 16,
    marginBottom: 8,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  emptyMessage: {
    fontSize: 16,
    color: NEO_THEME.colors.grey,
    textAlign: "center",
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  }
});
