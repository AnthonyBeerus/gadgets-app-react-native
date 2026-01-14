import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, Alert, ActivityIndicator, TouchableOpacity } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { NEO_THEME } from "../shared/constants/neobrutalism";
import { supabase } from "../shared/lib/supabase";
import { MaterialIcons } from "@expo/vector-icons";

export default function MerchantScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [lastScannedData, setLastScannedData] = useState<string | null>(null);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned || verifying) return;
    
    // Prevent duplicate scans of the same code immediately
    if (data === lastScannedData) {
        // Debounce??
    }

    setScanned(true);
    setVerifying(true);
    setLastScannedData(data);

    try {
        console.log(`Bar code with type ${type} and data ${data} has been scanned!`);
        
        // Parse order ID. QR code value is just the order ID (number).
        const orderId = parseInt(data, 10);

        if (isNaN(orderId)) {
            throw new Error("Invalid QR Code content. Expected numeric Order ID.");
        }

        const { data: result, error } = await supabase.functions.invoke('verify-fulfillment', {
            body: { orderId }
        });

        if (error) {
            throw new Error(error.message || "Verification Failed");
        }

        if (result.verified) {
            Alert.alert(
                "✅ ORDER VERIFIED",
                `Payment Status: PAID\nAmount: $${result.amount}\n\nOrder #${orderId} is confirmed.`,
                [{ text: "Scan Next", onPress: () => {
                    setScanned(false);
                    setVerifying(false);
                }}]
            );
        } else {
             Alert.alert(
                "❌ VERIFICATION FAILED",
                `Reason: ${result.message}`,
                [{ text: "Try Again", onPress: () => {
                    setScanned(false);
                    setVerifying(false);
                }}]
            );
        }

    } catch (e: any) {
        Alert.alert("Error", e.message, [
            { text: "OK", onPress: () => {
                setScanned(false);
                setVerifying(false);
            }}
        ]);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
            barcodeTypes: ["qr"],
        }}
      >
        <View style={styles.overlay}>
            <View style={styles.scanBox} />
            <Text style={styles.overlayText}>
                {verifying ? "VERIFYING..." : "Scan Customer QR Code"}
            </Text>
            {verifying && <ActivityIndicator size="large" color={NEO_THEME.colors.primary} style={{ marginTop: 20 }} />}
        </View>
      </CameraView>
      
      {scanned && !verifying && (
        <View style={styles.buttonContainer}>
            <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanBox: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.primary,
    backgroundColor: 'transparent',
    borderRadius: 20,
  },
  overlayText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    fontFamily: NEO_THEME.fonts.bold,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
  }
});
