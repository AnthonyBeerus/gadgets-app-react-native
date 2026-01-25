import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, Alert, ActivityIndicator, TouchableOpacity } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as Clipboard from 'expo-clipboard';
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
        return;
    }

    setScanned(true);
    setVerifying(true);
    setLastScannedData(data);

    try {
        console.log(`Bar code scanned. Data len: ${data.length}`);
        
        let orderId: number;
        let token: string;

        try {
            const parsed = JSON.parse(data);
            orderId = parsed.orderId;
            token = parsed.token;
        } catch (e) {
             throw new Error("Invalid QR Format. Ensure customer is using the latest app version.");
        }

        if (!orderId || !token) {
            throw new Error("Incomplete QR data. Missing ID or Security Token.");
        }

        const { data: result, error } = await supabase.functions.invoke('verify-fulfillment', {
            body: { orderId, token }
        });

        if (error) {
            throw new Error(error.message || "Verification Failed");
        }

        if (result.verified) {
            Alert.alert(
                "✅ ORDER VERIFIED",
                `Payment Status: PAID\nAmount: $${result.amount}\nCustomer: ${result.customer_email}\n\nOrder #${orderId} is confirmed.`,
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

      {/* Dev Mode: Paste Scan */}
      {!scanned && !verifying && (
         <View style={[styles.buttonContainer, { bottom: 100 }]}>
             <Button title="Paste QR (Dev)" onPress={async () => {
                 const content = await Clipboard.getStringAsync();
                 if (content) {
                     Alert.alert("Simulate Scan?", `Process: ${content.substring(0, 20)}...`, [
                         { text: "Cancel", style: "cancel" },
                         { text: "Simulate", onPress: () => handleBarCodeScanned({ type: 'PASTE', data: content }) }
                     ]);
                 } else {
                     Alert.alert("Clipboard Empty");
                 }
             }} />
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
