import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NEO_THEME } from "../../shared/constants/neobrutalism";
import { useAuth } from "../../shared/providers/auth-provider";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { getMerchantDashboardStats } from "../../shared/api/api";

export default function MerchantDashboard() {
  const router = useRouter();
  const { isMerchant, createMerchantShop, merchantShopId, user, switchRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [shopName, setShopName] = useState("");
  const [shopLocation, setShopLocation] = useState("");
  const [shopDescription, setShopDescription] = useState("");
  const [enableDelivery, setEnableDelivery] = useState(false);
  const [enableCollection, setEnableCollection] = useState(true);
  const { data: stats } = getMerchantDashboardStats(merchantShopId);

  const handleCreateMerchant = async () => {
    if (!shopName.trim() || !shopLocation.trim()) {
      Alert.alert("Shop details needed", "Enter a shop name and display location to continue.");
      return;
    }

    try {
      setLoading(true);
      await createMerchantShop({
        shopName: shopName.trim(),
        shopLocation: shopLocation.trim(),
        shopDescription: shopDescription.trim() || undefined,
        enableDelivery,
        enableCollection,
      });
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to create merchant account.");
    } finally {
      setLoading(false);
    }
  };

  if (!isMerchant) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.card}>
            <MaterialIcons name="storefront" size={64} color={NEO_THEME.colors.black} style={{ marginBottom: 16 }} />
            <Text style={styles.title}>Open Your Shop</Text>
            <Text style={styles.description}>
              Create a storefront linked to your account, then add products and start accepting orders.
            </Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Shop name</Text>
              <TextInput
                style={styles.input}
                value={shopName}
                onChangeText={setShopName}
                placeholder="e.g. Neighbourhood Goods"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Display location</Text>
              <TextInput
                style={styles.input}
                value={shopLocation}
                onChangeText={setShopLocation}
                placeholder="Online, Johannesburg, or your pickup area"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Short description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={shopDescription}
                onChangeText={setShopDescription}
                placeholder="What do you sell?"
                multiline
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.label}>Delivery</Text>
              <Switch
                value={enableDelivery}
                onValueChange={setEnableDelivery}
                trackColor={{ false: "#767577", true: NEO_THEME.colors.primary }}
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.label}>Collection</Text>
              <Switch
                value={enableCollection}
                onValueChange={setEnableCollection}
                trackColor={{ false: "#767577", true: NEO_THEME.colors.primary }}
              />
            </View>
            
            <TouchableOpacity 
                style={[styles.button, loading && { opacity: 0.5 }]} 
                onPress={handleCreateMerchant}
                disabled={loading}
            >
              <Text style={styles.buttonText}>{loading ? "Creating..." : "Create Shop"}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const productCount = Number(stats?.product_count ?? 0);
  const pendingOrderCount = Number(stats?.pending_order_count ?? 0);
  const todaysSales = Number(stats?.todays_sales ?? 0);

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
                <Text style={styles.statValue}>{pendingOrderCount}</Text>
                <Text style={styles.statLabel}>Pending Orders</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: NEO_THEME.colors.yellow }]}>
                <Text style={styles.statValue}>${todaysSales.toFixed(0)}</Text>
                <Text style={styles.statLabel}>Today's Sales</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: NEO_THEME.colors.sky }]}>
                <Text style={styles.statValue}>{productCount}</Text>
                <Text style={styles.statLabel}>Products</Text>
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
                  onPress={() => router.push('/create-product')}
                >
                    <MaterialIcons name="add-box" size={32} color={NEO_THEME.colors.black} />
                    <Text style={styles.actionText}>Add Product</Text>
                </TouchableOpacity>
            </View>

             <View style={[styles.actionGrid, { marginTop: 16 }]}>
                 <TouchableOpacity 
                  style={styles.actionCard}
                  onPress={() => router.push('/scan-order')}
                >
                    <MaterialIcons name="qr-code-scanner" size={32} color={NEO_THEME.colors.black} />
                    <Text style={styles.actionText}>Scan Order</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(merchant)/vouchers')}>
                    <MaterialIcons name="redeem" size={32} color={NEO_THEME.colors.black} />
                    <Text style={styles.actionText}>Redeem Voucher</Text>
                </TouchableOpacity>
             </View>
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
  },
  content: {
    justifyContent: "center",
    padding: 20,
    minHeight: "100%",
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
  formGroup: {
    width: "100%",
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontFamily: NEO_THEME.fonts.bold,
    color: NEO_THEME.colors.black,
    marginBottom: 6,
  },
  input: {
    width: "100%",
    backgroundColor: NEO_THEME.colors.white,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    borderRadius: NEO_THEME.borders.radius,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: NEO_THEME.fonts.regular,
    fontSize: 14,
  },
  textArea: {
    minHeight: 88,
    textAlignVertical: "top",
  },
  switchRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
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
    flexWrap: 'wrap',
  },
  statCard: {
    flexGrow: 1,
    flexBasis: 140,
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
});
