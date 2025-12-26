import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useLocalSearchParams, useRouter } from "expo-router";
import { NEO_THEME } from "../../../shared/constants/neobrutalism";
import { NeoButton } from "../../../shared/components/ui/neo-button";
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

  const renderSmallTitle = () => <Text style={styles.smallHeaderTitle}>SUCCESS</Text>;

  const renderLargeTitle = () => (
    <View>
      <Text style={styles.largeHeaderTitle}>ORDER PLACED</Text>
      <Text style={styles.largeHeaderSubtitle}>THANK YOU!</Text>
    </View>
  );

  return (
    <AnimatedHeaderLayout
      renderSmallTitle={renderSmallTitle}
      renderLargeTitle={renderLargeTitle}
    >
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.message}>
            Your order has been placed successfully!
          </Text>
          
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

          <Text style={styles.orderIdLabel}>ORDER ID</Text>
          <Text style={styles.orderId}>{orderId}</Text>
          
          <Text style={styles.instruction}>
            Show this QR code at the counter for pickup.
          </Text>
        </View>

        <NeoButton onPress={handleContinueShopping} style={styles.button}>
          <Text style={styles.buttonText}>CONTINUE SHOPPING</Text>
        </NeoButton>
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
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    ...NEO_THEME.shadows.soft,
  },
  qrContainer: {
    padding: 16,
    backgroundColor: "white",
    marginBottom: 24,
    borderWidth: 1, // Inner border for QR aesthetics
    borderColor: "#eee",
  },
  message: {
    fontSize: 18,
    fontFamily: NEO_THEME.fonts.bold,
    textAlign: "center",
    marginBottom: 24,
    color: NEO_THEME.colors.black,
  },
  orderIdLabel: {
    fontSize: 14,
    fontFamily: NEO_THEME.fonts.bold,
    color: NEO_THEME.colors.grey,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  orderId: {
    fontSize: 16,
    fontFamily: NEO_THEME.fonts.black,
    color: NEO_THEME.colors.black,
    marginBottom: 16,
  },
  instruction: {
    fontSize: 14,
    fontFamily: NEO_THEME.fonts.regular,
    textAlign: "center",
    color: NEO_THEME.colors.grey,
  },
  button: {
    width: "100%",
  },
  buttonText: {
    fontSize: 16,
    fontFamily: NEO_THEME.fonts.black,
    color: NEO_THEME.colors.white,
    textTransform: "uppercase",
  },
  smallHeaderTitle: {
    fontSize: 16,
    fontFamily: NEO_THEME.fonts.black,
    color: NEO_THEME.colors.black,
    textTransform: "uppercase",
  },
  largeHeaderTitle: {
    fontSize: 32,
    fontFamily: NEO_THEME.fonts.black,
    color: NEO_THEME.colors.black,
    textTransform: "uppercase",
  },
  largeHeaderSubtitle: {
    fontSize: 16,
    fontFamily: NEO_THEME.fonts.bold,
    color: NEO_THEME.colors.grey,
    marginTop: 4,
    textTransform: "uppercase",
  },
});
