import React from 'react';
import { Redirect, Stack, useLocalSearchParams, router } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { format } from 'date-fns';
import QRCode from 'react-native-qrcode-svg'; // Added import

import { getMyOrder } from '../../../shared/api/api';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { StaticHeader } from '../../../shared/components/layout/StaticHeader';

const OrderDetailsScreen = () => {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const { data: order, error, isLoading } = getMyOrder(slug);

  if (isLoading) return <ActivityIndicator size="large" color={NEO_THEME.colors.primary} style={{ marginTop: 40 }} />;

  if (error || !order) return <Text style={styles.errorText}>Error: {error?.message}</Text>;

  const orderItems = order.order_items.map((orderItem: any) => {
    return {
      id: orderItem.id,
      title: orderItem.products.title,
      heroImage: orderItem.products.heroImage,
      price: orderItem.products.price,
      quantity: orderItem.quantity,
    };
  });

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StaticHeader title={`ORDER ${order.slug}`} onBackPress={() => router.back()} />
      
      <View style={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.item}>{order.slug}</Text>
          <Text style={styles.details}>{order.description}</Text>
          
          <View style={styles.qrContainer}>
            <QRCode value={order.id.toString()} size={150} />
            <Text style={styles.qrLabel}>Scan for pickup</Text>
          </View>

          <View style={[styles.statusBadge, styles[`statusBadge_${order.status}`]]}>
            <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
          </View>
          <Text style={styles.date}>
            {format(new Date(order.created_at), 'MMM dd, yyyy')}
          </Text>
        </View>

        <Text style={styles.itemsTitle}>ITEMS ORDERED</Text>
        <FlatList
          data={orderItems}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.orderItem}>
              <Image source={{ uri: item.heroImage }} style={styles.heroImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.title}</Text>
                <Text style={styles.itemPrice}>Price: ${item.price}</Text>
                <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
              </View>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </View>
  );
};

export default OrderDetailsScreen;

const styles: { [key: string]: any } = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEO_THEME.colors.backgroundLight,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  headerSection: {
    backgroundColor: NEO_THEME.colors.white,
    padding: 16,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    marginBottom: 24,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  item: {
    fontSize: 24,
    fontWeight: '900',
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
    marginBottom: 8,
  },
  details: {
    fontSize: 16,
    color: NEO_THEME.colors.grey,
    marginBottom: 16,
    fontWeight: '500',
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    alignSelf: 'flex-start',
  },
  statusBadge_Pending: {
    backgroundColor: NEO_THEME.colors.yellow,
  },
  statusBadge_Completed: {
    backgroundColor: '#4caf50',
  },
  statusBadge_Shipped: {
    backgroundColor: NEO_THEME.colors.blue,
  },
  statusBadge_InTransit: {
    backgroundColor: '#ff9800',
  },
  statusText: {
    color: NEO_THEME.colors.black,
    fontWeight: '900',
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 12,
  },
  date: {
    fontSize: 14,
    color: NEO_THEME.colors.black,
    marginTop: 16,
    fontWeight: '700',
  },
  itemsTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  listContent: {
    paddingBottom: 40,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: NEO_THEME.colors.white,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  heroImage: {
    width: 80,
    height: 80,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: 1,
    borderColor: NEO_THEME.colors.black,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 16,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '900',
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.bold,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: NEO_THEME.colors.primary,
  },
  itemQuantity: {
    fontSize: 14,
    color: NEO_THEME.colors.grey,
    marginTop: 2,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  qrContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
    padding: 16,
    backgroundColor: NEO_THEME.colors.white,
    borderWidth: 1,
    borderColor: NEO_THEME.colors.grey,
  },
  qrLabel: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '700',
    color: NEO_THEME.colors.grey,
    fontFamily: NEO_THEME.fonts.bold,
    textTransform: 'uppercase',
  },
});
