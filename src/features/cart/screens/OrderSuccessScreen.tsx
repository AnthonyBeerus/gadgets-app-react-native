import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useLocalSearchParams, useRouter } from "expo-router";
import { NEO_THEME } from "../../../shared/constants/neobrutalism";
import { NuviaButton } from "../../../shared/components/ui/nuvia-button";
import { NuviaText } from "../../../components/atoms/nuvia-text";
import { AnimatedHeaderLayout } from "../../../shared/components/layout/AnimatedHeaderLayout";

export default function OrderSuccessScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const [showQR, setShowQR] = useState(false);

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

  const renderSmallTitle = () => <NuviaText variant="label">SUCCESS</NuviaText>;

  const renderLargeTitle = () => (
    <View>
      <NuviaText variant="display">ORDER PLACED</NuviaText>
      <NuviaText variant="label" color={NEO_THEME.colors.grey}>THANK YOU!</NuviaText>
    </View>
  );

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
            {orderId && showQR ? (
              <QRCode
                value={typeof orderId === 'string' ? orderId : orderId[0]}
                size={200}
                color="black"
                backgroundColor="white"
              />
            ) : (
              <View style={{ height: 200, width: 200, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color={NEO_THEME.colors.primary} />
              </View>
            )}
          </View>

          <NuviaText variant="label" color={NEO_THEME.colors.grey}>ORDER ID</NuviaText>
          <NuviaText variant="h3" style={{ marginBottom: 16 }}>{orderId}</NuviaText>
          
          <NuviaText variant="body" color={NEO_THEME.colors.grey} style={{ textAlign: "center" }}>
            Show this QR code at the counter for pickup.
          </NuviaText>
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
    // Nuvia Shadow
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
});
