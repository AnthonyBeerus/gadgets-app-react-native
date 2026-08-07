import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { NEO_THEME } from "../../../shared/constants/neobrutalism";
import { NuviaButton } from "../../../shared/components/ui/nuvia-button";
import { NuviaText } from "../../../components/atoms/nuvia-text";
import { AnimatedHeaderLayout } from "../../../shared/components/layout/AnimatedHeaderLayout";
import { getMyOrder } from "../../../shared/api/api";
import { supabase } from "../../../shared/lib/supabase";

export default function OrderSuccessScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
  const [showQR, setShowQR] = useState(false);
  const resolvedOrderId = Array.isArray(orderId) ? orderId[0] : orderId ?? '';

  // Checkout navigates with numeric order.id — lookup must use id, not slug.
  const { data: order, isLoading, isError } = getMyOrder(resolvedOrderId);

  const productIds = (order?.order_items ?? [])
    .map(item => item.product ?? item.products?.id ?? null)
    .filter((id): id is number => typeof id === 'number');

  const opportunityQuery = useQuery({
    queryKey: ['postPurchaseOpportunity', order?.id, productIds],
    enabled: productIds.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('challenges')
        .select('id, title, product_id, reward_value, reward_currency')
        .eq('status', 'active')
        .in('product_id', productIds)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    // Delay QR rendering to prevent IllegalViewOperationException during transition
    const timer = setTimeout(() => {
      setShowQR(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleContinueShopping = () => {
    router.dismissAll();
    router.replace("/");
  };

  const handleCreatorOpportunity = () => {
    if (!opportunityQuery.data?.id) return;
    router.push(`/challenges/entry/${opportunityQuery.data.id}`);
  };

  const renderSmallTitle = () => <NuviaText variant="label">SUCCESS</NuviaText>;

  const renderLargeTitle = () => (
    <View>
      <NuviaText variant="display">ORDER PLACED</NuviaText>
      <NuviaText variant="label" color={NEO_THEME.colors.grey}>THANK YOU!</NuviaText>
    </View>
  );

  const qrPayload =
    order?.fulfillment_token
      ? JSON.stringify({
          orderId: order.id,
          token: order.fulfillment_token,
        })
      : null;

  const rewardLabel = opportunityQuery.data
    ? `P${Number(opportunityQuery.data.reward_value ?? 0).toFixed(0)} voucher`
    : null;

  return (
    <AnimatedHeaderLayout
      renderSmallTitle={renderSmallTitle}
      renderLargeTitle={renderLargeTitle}
    >
      <View style={styles.content}>
        <View style={styles.card}>
          <NuviaText variant="h3" style={styles.message}>
            Your order has been placed successfully!
          </NuviaText>
          
          <View style={styles.qrContainer}>
            {order && showQR && qrPayload ? (
              <QRCode
                value={qrPayload}
                size={200}
                color="black"
                backgroundColor="white"
              />
            ) : (
              <View style={{ height: 200, width: 200, alignItems: 'center', justifyContent: 'center' }}>
                {isError ? (
                  <NuviaText variant="body" color={NEO_THEME.colors.grey} style={{ textAlign: 'center' }}>
                    Order placed, but the pickup QR could not be loaded. Open Orders to collect.
                  </NuviaText>
                ) : (
                  <ActivityIndicator size="large" color={NEO_THEME.colors.primary} />
                )}
              </View>
            )}
          </View>

          <NuviaText variant="label" color={NEO_THEME.colors.grey}>ORDER ID</NuviaText>
          <NuviaText variant="h3" style={{ marginBottom: 16 }}>
            {isLoading ? '...' : order ? order.id : resolvedOrderId || '...'}
          </NuviaText>
          
          <NuviaText variant="body" color={NEO_THEME.colors.grey} style={{ textAlign: "center" }}>
            Show this QR code at the counter for pickup.
          </NuviaText>

          {opportunityQuery.data ? (
            <View style={styles.opportunityBox}>
              <NuviaText variant="label" style={{ marginBottom: 8 }}>
                CREATOR OPPORTUNITY UNLOCKED
              </NuviaText>
              <NuviaText variant="body" color={NEO_THEME.colors.grey} style={{ textAlign: 'center', marginBottom: 12 }}>
                Post about this purchase on TikTok to earn a {rewardLabel}.
              </NuviaText>
              <NuviaButton onPress={handleCreatorOpportunity} variant="secondary" style={styles.button}>
                <NuviaText variant="label">SUBMIT TIKTOK POST</NuviaText>
              </NuviaButton>
            </View>
          ) : null}
        </View>

        <NuviaButton onPress={handleContinueShopping} variant="primary" style={styles.button}>
          <NuviaText variant="label" color={NEO_THEME.colors.white}>CONTINUE SHOPPING</NuviaText>
        </NuviaButton>
      </View>
    </AnimatedHeaderLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  card: {
    width: "100%",
    backgroundColor: NEO_THEME.colors.white,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  qrContainer: {
    padding: 16,
    backgroundColor: "white",
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: NEO_THEME.colors.black,
    borderRadius: 12,
  },
  message: {
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    width: "100%",
  },
  opportunityBox: {
    width: "100%",
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: NEO_THEME.colors.black,
    alignItems: "center",
  },
});
