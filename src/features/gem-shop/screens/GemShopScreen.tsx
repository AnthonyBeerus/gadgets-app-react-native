import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Purchases, { PurchasesPackage } from 'react-native-purchases';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { StaticHeader } from '../../../shared/components/layout/StaticHeader';
import { Ionicons } from '@expo/vector-icons';
import { GemUseCases } from '../components/GemUseCases';
import { useGemStore } from '../../gems/store/gem-store';
import { initializeGemsForTesting } from '../../gems/api/test-gems';

// Fallback packs if RevenueCat offerings are not configured
const FALLBACK_PACKS = [
  { id: 'gems_100', amount: 100, price: 'P10', name: 'Handful of Gems', color: NEO_THEME.colors.yellow },
  { id: 'gems_500', amount: 500, price: 'P45', name: 'Sack of Gems', color: NEO_THEME.colors.blue },
  { id: 'gems_1200', amount: 1200, price: 'P99', name: 'Chest of Gems', color: NEO_THEME.colors.primary },
];

export default function GemShopScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const headerHeight = insets.top + 60; // Approximate header height
  const { balance, loading, fetchBalance, invalidateCache } = useGemStore();
  const [testLoading, setTestLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [offerings, setOfferings] = useState<PurchasesPackage[]>([]);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    fetchBalance();
    fetchOfferings();
  }, []);

  const fetchOfferings = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current && offerings.current.availablePackages.length > 0) {
        setOfferings(offerings.current.availablePackages);
      }
    } catch (e) {
      console.error('Error fetching offerings:', e);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    invalidateCache();
    await Promise.all([fetchBalance(), fetchOfferings()]);
    setRefreshing(false);
  }, []);

  const handleTestInitialize = async () => {
    Alert.alert(
      'Initialize Test Gems',
      'This will add 100 test gems to your account via the Edge Function. Make sure you have deployed the Edge Function first!',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Initialize',
          onPress: async () => {
            try {
              setTestLoading(true);
              await initializeGemsForTesting();
              invalidateCache();
              await fetchBalance();
              Alert.alert('Success!', 'Added 100 test gems. Check your balance!');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to initialize gems. Make sure the Edge Function is deployed.');
            } finally {
              setTestLoading(false);
            }
          },
        },
      ]
    );
  };

  const handlePurchase = async (pack: PurchasesPackage | typeof FALLBACK_PACKS[0]) => {
    if (purchasing) return;

    // Check if it's a real RevenueCat package
    if ('product' in pack) {
      try {
        setPurchasing(true);
        const { customerInfo } = await Purchases.purchasePackage(pack as PurchasesPackage);
        
        // Update balance from new customer info
        // @ts-ignore
        const virtualCurrencies = customerInfo.virtualCurrencies;
        if (virtualCurrencies && virtualCurrencies.GEM !== undefined) {
           // The store will update on next fetch, but we can try to force it
           invalidateCache();
           fetchBalance();
        }
        
        Alert.alert('Success', 'Gems purchased successfully!');
      } catch (e: any) {
        if (!e.userCancelled) {
          Alert.alert('Error', e.message || 'Failed to purchase gems');
        }
      } finally {
        setPurchasing(false);
      }
    } else {
      // Fallback/Mock purchase
      Alert.alert(
        'Sandbox Mode', 
        'This is a UI mockup because no RevenueCat offerings were found. To test real purchases:\n\n1. Create products in App Store Connect/Google Play\n2. Configure Offerings in RevenueCat\n3. Use a physical device with a sandbox account',
        [{ text: 'OK' }]
      );
    }
  };

  // Helper to get color for pack
  const getPackColor = (index: number) => {
    const colors = [NEO_THEME.colors.yellow, NEO_THEME.colors.blue, NEO_THEME.colors.primary];
    return colors[index % colors.length];
  };

  return (
    <View style={styles.container}>
      <StaticHeader title="GEM SHOP" onBackPress={() => router.back()} />
      
      <ScrollView 
        contentContainerStyle={[
          styles.content, 
          { paddingTop: headerHeight + 20, paddingBottom: insets.bottom + 20 }
        ]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={NEO_THEME.colors.black} />
        }
      >
        
        {/* Balance Section */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>YOUR BALANCE</Text>
          <View style={styles.balanceRow}>
            <Ionicons name="diamond" size={32} color={NEO_THEME.colors.primary} />
            <Text style={styles.balanceAmount}>{loading ? '...' : balance}</Text>
          </View>
          
          {/* Test Button - Remove this in production */}
          {balance === 0 && !loading && (
            <TouchableOpacity
              style={styles.testButton}
              onPress={handleTestInitialize}
              disabled={testLoading}
            >
              <Text style={styles.testButtonText}>
                {testLoading ? 'INITIALIZING...' : '🧪 TEST: ADD 100 GEM'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Subscription Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MEMBERSHIPS</Text>
          <TouchableOpacity 
            style={styles.subscriptionCard} 
            activeOpacity={0.9}
            onPress={() => router.push('/paywall')}
          >
            <View style={styles.subHeader}>
              <Text style={styles.subTitle}>MUSE PRO</Text>
            </View>
            <Text style={styles.subDescription}>
              Unlimited AI generation, exclusive gems & premium challenges.
            </Text>
            <View style={styles.subPriceRow}>
              <Text style={styles.subPrice}>Free Trial Available</Text>
              <TouchableOpacity 
                style={styles.buyButton}
                onPress={() => router.push('/paywall')}
              >
                <Text style={styles.buyButtonText}>VIEW PLANS</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>

        {/* Gem Use Cases */}
        <GemUseCases />

        {/* Gem Packs Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GEM PACKS</Text>
          <View style={styles.packsGrid}>
            {offerings.length > 0 ? (
              // Real RevenueCat Offerings
              offerings.map((pack, index) => (
                <TouchableOpacity 
                  key={pack.identifier} 
                  style={[styles.packCard, { backgroundColor: getPackColor(index) }]}
                  onPress={() => handlePurchase(pack)}
                  activeOpacity={0.8}
                  disabled={purchasing}
                >
                  <View style={styles.packIconContainer}>
                    <Ionicons name="diamond-outline" size={40} color={NEO_THEME.colors.black} />
                  </View>
                  <View style={styles.packInfo}>
                    <Text style={styles.packAmount}>{pack.product.title}</Text>
                    <Text style={styles.packName}>{pack.product.description}</Text>
                  </View>
                  <View style={styles.priceTag}>
                    <Text style={styles.priceText}>{pack.product.priceString}</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              // Fallback UI
              FALLBACK_PACKS.map((pack) => (
                <TouchableOpacity 
                  key={pack.id} 
                  style={[styles.packCard, { backgroundColor: pack.color }]}
                  onPress={() => handlePurchase(pack)}
                  activeOpacity={0.8}
                >
                  <View style={styles.packIconContainer}>
                    <Ionicons name="diamond-outline" size={40} color={NEO_THEME.colors.black} />
                  </View>
                  <View style={styles.packInfo}>
                    <Text style={styles.packAmount}>{pack.amount}</Text>
                    <Text style={styles.packName}>{pack.name}</Text>
                  </View>
                  <View style={styles.priceTag}>
                    <Text style={styles.priceText}>{pack.price}</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>

      </ScrollView>
      
      {purchasing && (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={NEO_THEME.colors.white} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEO_THEME.colors.backgroundLight,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  // Balance
  balanceCard: {
    backgroundColor: NEO_THEME.colors.white,
    padding: 20,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    borderRadius: NEO_THEME.borders.radius,
    alignItems: 'center',
    marginBottom: 30,
    // Hard shadow
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  balanceLabel: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 14,
    color: NEO_THEME.colors.grey,
    marginBottom: 8,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  balanceAmount: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 48,
    color: NEO_THEME.colors.black,
  },
  testButton: {
    marginTop: 16,
    backgroundColor: NEO_THEME.colors.yellow,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  testButtonText: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 12,
    color: NEO_THEME.colors.black,
  },
  // Sections
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 24,
    marginBottom: 16,
    color: NEO_THEME.colors.black,
    textTransform: 'uppercase',
  },
  // Subscription
  subscriptionCard: {
    backgroundColor: NEO_THEME.colors.black,
    padding: 20,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    borderRadius: NEO_THEME.borders.radius,
    // Hard shadow
    shadowColor: NEO_THEME.colors.grey,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subTitle: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 24,
    color: NEO_THEME.colors.white,
  },
  subDescription: {
    fontFamily: NEO_THEME.fonts.regular,
    fontSize: 14,
    color: NEO_THEME.colors.white,
    marginBottom: 20,
    lineHeight: 20,
  },
  subPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subPrice: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 20,
    color: NEO_THEME.colors.yellow,
  },
  buyButton: {
    backgroundColor: NEO_THEME.colors.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.white,
  },
  buyButtonText: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 14,
    color: NEO_THEME.colors.black,
  },
  // Packs
  packsGrid: {
    gap: 16,
  },
  packCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    borderRadius: NEO_THEME.borders.radius,
    // Hard shadow
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  packInfo: {
    flex: 1,
    marginRight: 8,
  },
  packIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
  },
  packAmount: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 24,
    color: NEO_THEME.colors.black,
  },
  packName: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 14,
    color: NEO_THEME.colors.black,
  },
  priceTag: {
    backgroundColor: NEO_THEME.colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
  },
  priceText: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 14,
    color: NEO_THEME.colors.black,
  },
});
