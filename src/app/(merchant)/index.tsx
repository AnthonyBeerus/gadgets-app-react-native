import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NEO_THEME } from "../../shared/constants/neobrutalism";
import { useAuth } from "../../shared/providers/auth-provider";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import QRCode from 'react-native-qrcode-svg';

export default function MerchantDashboard() {
  const router = useRouter();
  const { isMerchant, createDevMerchant, user, switchRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [qrData, setQrData] = useState<string | null>(null);

  const handleCreateDevMerchant = async () => {
    try {
        setLoading(true);
        await createDevMerchant();
        Alert.alert("Success", "Dev Merchant Account Created! You are now a merchant.");
    } catch (error: any) {
        Alert.alert("Error", error.message || "Failed to create merchant account.");
    } finally {
        setLoading(false);
    }
  };

  const generateHandoverCode = () => {
      // In a real app, this would fetch the specific order to generate a code for.
      // For this demo, we generate a mock valid payload for testing.
      const payload = JSON.stringify({
          orderId: 1001,
          token: "fulfillment_secret_123",
          timestamp: Date.now()
      });
      setQrData(payload);
      setShowQR(true);
  };

  if (!isMerchant) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.card}>
            <MaterialIcons name="storefront" size={64} color={NEO_THEME.colors.black} style={{ marginBottom: 16 }} />
            <Text style={styles.title}>Merchant Mode</Text>
            <Text style={styles.description}>
              Manage your shop, inventory, and verify orders.
            </Text>
            <Text style={styles.warning}>
              *This is a Dev Environment. Creating an account will generate a test shop linked to your user.*
            </Text>
            
            <TouchableOpacity 
                style={[styles.button, loading && { opacity: 0.5 }]} 
                onPress={handleCreateDevMerchant}
                disabled={loading}
            >
              <Text style={styles.buttonText}>{loading ? "Creating..." : "Activate Dev Merchant Account"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                    <Text style={styles.greeting}>Welcome back,</Text>
                    <Text style={styles.username}>{user?.email?.split('@')[0] || 'Merchant'}</Text>
                </View>
                <TouchableOpacity 
                    style={[styles.miniButton, { backgroundColor: NEO_THEME.colors.sky }]} 
                    onPress={() => {
                        switchRole('shopper');
                        router.replace('/(shop)');
                    }}
                >
                    <MaterialIcons name="shopping-bag" size={20} color={NEO_THEME.colors.black} />
                    <Text style={styles.miniButtonText}>Exit</Text>
                </TouchableOpacity>
            </View>
        </View>

        <View style={styles.statsContainer}>
            <View style={styles.statCard}>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>Pending Orders</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: NEO_THEME.colors.yellow }]}>
                <Text style={styles.statValue}>$1,240</Text>
                <Text style={styles.statLabel}>Today's Sales</Text>
            </View>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionGrid}>
                <TouchableOpacity 
                  style={styles.actionCard}
                  onPress={() => router.push('/(merchant)/catalog')}
                >
                    <MaterialIcons name="inventory" size={32} color={NEO_THEME.colors.black} />
                    <Text style={styles.actionText}>Manage Catalog</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionCard}
                  onPress={generateHandoverCode}
                >
                    <MaterialIcons name="qr-code" size={32} color={NEO_THEME.colors.black} />
                    <Text style={styles.actionText}>Generate Handover Code</Text>
                </TouchableOpacity>
            </View>

             <View style={[styles.actionGrid, { marginTop: 16 }]}>
                 <TouchableOpacity 
                  style={styles.actionCard}
                  onPress={() => router.push('/scan-order')}
                >
                    <MaterialIcons name="qr-code-scanner" size={32} color={NEO_THEME.colors.black} />
                    <Text style={styles.actionText}>Scan (Debug)</Text>
                </TouchableOpacity>
             </View>
        </View>
      </ScrollView>

      {/* QR Code Modal */}
      <Modal visible={showQR} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>Handover QR</Text>
                      <TouchableOpacity onPress={() => setShowQR(false)}>
                          <MaterialIcons name="close" size={24} color={NEO_THEME.colors.black} />
                      </TouchableOpacity>
                  </View>
                  
                  <View style={styles.qrContainer}>
                      {qrData && (
                          <QRCode 
                              value={qrData}
                              size={200}
                              testID="handover-qr-code"
                          />
                      )}
                  </View>
                  
                  <Text style={styles.qrInstructions}>
                      Ask customer to scan to confirm receipt.
                  </Text>

                  <TouchableOpacity style={styles.closeButton} onPress={() => setShowQR(false)}>
                      <Text style={styles.closeButtonText}>Done</Text>
                  </TouchableOpacity>
              </View>
          </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    fontFamily: NEO_THEME.fonts.bold,
    color: NEO_THEME.colors.grey,
  },
  username: {
    fontSize: 32,
    fontFamily: NEO_THEME.fonts.bold,
    color: NEO_THEME.colors.black,
  },
  card: {
    backgroundColor: NEO_THEME.colors.white,
    padding: 24,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    alignItems: "center",
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontFamily: NEO_THEME.fonts.bold,
    marginBottom: 8,
    color: NEO_THEME.colors.black,
  },
  description: {
    fontSize: 14,
    fontFamily: NEO_THEME.fonts.regular,
    textAlign: "center",
    marginBottom: 24,
    color: NEO_THEME.colors.grey,
  },
  warning: {
    fontSize: 12,
    fontFamily: NEO_THEME.fonts.regular,
    textAlign: "center",
    marginBottom: 24,
    color: NEO_THEME.colors.primary,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: NEO_THEME.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  buttonText: {
    color: NEO_THEME.colors.white,
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: NEO_THEME.colors.white,
    padding: 16,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  statValue: {
    fontSize: 28,
    fontFamily: NEO_THEME.fonts.bold,
    color: NEO_THEME.colors.black,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: NEO_THEME.fonts.regular,
    color: NEO_THEME.colors.grey,
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
      fontSize: 20,
      fontFamily: NEO_THEME.fonts.bold,
      marginBottom: 16,
  },
  actionGrid: {
      flexDirection: 'row',
      gap: 16,
  },
  actionCard: {
      flex: 1,
      backgroundColor: NEO_THEME.colors.white,
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      borderRadius: NEO_THEME.borders.radius,
      borderWidth: NEO_THEME.borders.width,
      borderColor: NEO_THEME.colors.black,
      shadowColor: NEO_THEME.colors.black,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
  },
  actionText: {
      fontFamily: NEO_THEME.fonts.bold,
      fontSize: 14,
      textAlign: 'center',
  },
  miniButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
    gap: 4,
  },
  miniButtonText: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 12,
    color: NEO_THEME.colors.black,
  },
  modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20
  },
  modalContent: {
      backgroundColor: NEO_THEME.colors.white,
      width: '100%',
      maxWidth: 350,
      borderRadius: NEO_THEME.borders.radius,
      borderWidth: NEO_THEME.borders.width,
      borderColor: NEO_THEME.colors.black,
      padding: 24,
      alignItems: 'center',
      shadowColor: NEO_THEME.colors.black,
      shadowOffset: { width: 8, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 0,
  },
  modalHeader: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
  },
  modalTitle: {
      fontSize: 20,
      fontFamily: NEO_THEME.fonts.bold,
  },
  qrContainer: {
      padding: 16,
      backgroundColor: 'white',
      borderRadius: 12,
      marginBottom: 24,
  },
  qrInstructions: {
      fontFamily: NEO_THEME.fonts.regular,
      textAlign: 'center',
      marginBottom: 24,
      color: NEO_THEME.colors.grey,
  },
  closeButton: {
      backgroundColor: NEO_THEME.colors.black,
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: NEO_THEME.borders.radius,
  },
  closeButtonText: {
      color: 'white',
      fontFamily: NEO_THEME.fonts.bold,
  }
});
