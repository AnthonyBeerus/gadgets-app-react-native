import React from 'react';
import { Redirect, Stack, useLocalSearchParams, router } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableHighlight, TouchableOpacity, FlatList, Image } from "react-native";
import { format } from 'date-fns';
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg'; // Added import

import { getMyOrder } from '../../../shared/api/api';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { StaticHeader } from '../../../shared/components/layout/StaticHeader';

import { formatOrderId } from '../../../shared/utils/order';

const getFriendlyStatusMessage = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return "We've received your order and are preparing it.";
    case 'completed':
      return "Your order has been completed. Thanks for shopping!";
    case 'shipped':
      return "Good news! Your order is on its way.";
    case 'intransit':
      return "Your order is arriving soon.";
    default:
      return "Order status updated.";
  }
};

const OrderDetailsScreen = () => {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const { data: order, error, isLoading } = getMyOrder(slug);

  if (isLoading) return <ActivityIndicator size="large" color={NEO_THEME.colors.primary} style={{ marginTop: 40 }} />;

  if (error || !order) return <Text style={styles.errorText}>Error: {error?.message}</Text>;

  const orderItems = order.order_items.map((orderItem: any) => {
    return {
      id: orderItem.id,
      title: orderItem.products?.title ?? 'Unknown Product',
      heroImage: orderItem.products?.heroImage ?? 'https://via.placeholder.com/150',
      price: orderItem.products?.price ?? 0,
      quantity: orderItem.quantity,
    };
  });

  const calculateTotal = () => {
      // Use DB total if available, else sum items
      if (order.total_amount) return order.total_amount;
      return orderItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
  };

  const totalAmount = calculateTotal();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StaticHeader title="Order Details" onBackPress={() => router.back()} />
      
      <ScrollView style={styles.content} contentContainerStyle={{ paddingTop: 120, paddingBottom: 40 }}>
        <View style={styles.headerSection}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
               <Text style={styles.item}>Order {formatOrderId(order.slug)}</Text>
               <View style={[styles.statusBadge, styles[`statusBadge_${order.status}`]]}>
                    <Text style={styles.statusText}>{order.status}</Text>
               </View>
          </View>
          
          <Text style={styles.friendlyMessage}>{getFriendlyStatusMessage(order.status)}</Text>
          <Text style={styles.date}>Placed on {format(new Date(order.created_at), 'MMMM dd, yyyy')} at {format(new Date(order.created_at), 'h:mm a')}</Text>


          {/* QR Code Section */}
          <View style={styles.qrContainer}>
            <Text style={{ marginBottom: 10, color: NEO_THEME.colors.grey, fontSize: 12 }}>Tap QR to Copy (Dev Mode)</Text>
            <TouchableOpacity 
                activeOpacity={0.7}
                onPress={async () => {
                    const qrPayload = JSON.stringify({ 
                        orderId: order.id, 
                        token: order.fulfillment_token 
                    });
                    await Clipboard.setStringAsync(qrPayload);
                    Alert.alert("Copied!", "QR Payload copied to clipboard. Paste it in the Scanner screen.");
                }}
            >
                <View style={styles.qrWrapper}>
                <QRCode 
                    value={JSON.stringify({ 
                    orderId: order.id, 
                    token: order.fulfillment_token 
                    })} 
                    size={140} 
                />
                </View>
            </TouchableOpacity>
            <Text style={styles.qrLabel}>Pickup QR Code</Text>
            <Text style={styles.qrSublabel}>Show this to staff to collect your items</Text>
          </View>
        </View>

        <Text style={styles.itemsTitle}>Items Ordered</Text>
        <FlatList
          data={orderItems}
          keyExtractor={item => item.id.toString()}
          ListFooterComponent={() => (
              <View style={styles.summarySection}>
                  <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Subtotal</Text>
                      <Text style={styles.summaryValue}>${totalAmount.toFixed(2)}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Payment Status</Text>
                      <Text style={[styles.summaryValue, { color: order.stripe_payment_status === 'succeeded' || 'paid' ? NEO_THEME.colors.primary : 'red' }]}>
                          {order.stripe_payment_status?.toUpperCase() ?? 'PAID'}
                      </Text>
                  </View>
                  <View style={[styles.summaryRow, { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#eee' }]}>
                      <Text style={styles.totalLabel}>Total</Text>
                      <Text style={styles.totalValue}>${totalAmount.toFixed(2)}</Text>
                  </View>
              </View>
          )}
          renderItem={({ item }) => (
            <View style={styles.orderItem}>
              <Image source={{ uri: item.heroImage }} style={styles.heroImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.title}</Text>
                <Text style={styles.itemPrice}>${item.price}</Text>
                <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
              </View>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          contentContainerStyle={styles.listContent}
        />
      </ScrollView>
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
  },
  headerSection: {
    backgroundColor: NEO_THEME.colors.white,
    padding: 16,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    marginBottom: 24,
    borderRadius: 16, // Rounded
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  item: {
    fontSize: 20, // Smaller than before
    fontWeight: '900',
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.bold,
  },
  friendlyMessage: {
    fontSize: 16,
    color: NEO_THEME.colors.black,
    marginBottom: 8,
    fontWeight: '500',
    fontFamily: NEO_THEME.fonts.regular,
  },
  details: {
    fontSize: 14,
    color: NEO_THEME.colors.grey,
    marginBottom: 16,
    fontWeight: '500',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    borderRadius: 20, // Pill
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
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 10,
  },
  date: {
    fontSize: 12,
    color: NEO_THEME.colors.grey,
    marginBottom: 16,
    fontWeight: '500',
  },
  itemsTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.bold, 
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 40,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 12,
    backgroundColor: NEO_THEME.colors.white,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    borderRadius: 12, // Rounded
    // Subtle shadow
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  heroImage: {
    width: 50, 
    height: 50,
    borderRadius: 8, 
    borderWidth: 1,
    borderColor: NEO_THEME.colors.black,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '900',
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.bold,
    flex: 1,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: NEO_THEME.colors.black,
    marginHorizontal: 8,
  },
  itemQuantity: {
    fontSize: 12,
    color: NEO_THEME.colors.grey,
    fontWeight: '700',
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
    marginTop: 8,
    padding: 12,
    backgroundColor: '#FAFAFA', // Slight contrast
    borderWidth: 1,
    borderColor: NEO_THEME.colors.grey,
    borderRadius: 12, 
    borderStyle: 'dashed', 
  },
  qrWrapper: {
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  qrLabel: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '900',
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.bold,
  },
  qrSublabel: {
     fontSize: 12,
     color: NEO_THEME.colors.grey,
     marginTop: 2,
     textAlign: 'center',
  },
  summarySection: {
      marginTop: 24,
      backgroundColor: NEO_THEME.colors.white,
      padding: 16,
      borderWidth: NEO_THEME.borders.width,
      borderColor: NEO_THEME.colors.black,
      borderRadius: 16,
      shadowColor: NEO_THEME.colors.black,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
  },
  summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
  },
  summaryLabel: {
      fontSize: 14,
      color: NEO_THEME.colors.grey,
      fontFamily: NEO_THEME.fonts.bold,
  },
  summaryValue: {
      fontSize: 14,
      color: NEO_THEME.colors.black,
      fontFamily: NEO_THEME.fonts.bold,
  },
  totalLabel: {
      fontSize: 18,
      color: NEO_THEME.colors.black,
      fontFamily: NEO_THEME.fonts.black,
  },
  totalValue: {
      fontSize: 18,
      color: NEO_THEME.colors.primary,
      fontFamily: NEO_THEME.fonts.black,
  }
});
