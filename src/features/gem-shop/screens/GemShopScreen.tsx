import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { StaticHeader } from '../../../shared/components/layout/StaticHeader';
import { Ionicons } from '@expo/vector-icons';
import { GemUseCases } from '../components/GemUseCases';

const GEM_PACKS = [
  { id: 'gems_100', amount: 100, price: 'P10', name: 'Handful of Gems', color: NEO_THEME.colors.yellow },
  { id: 'gems_500', amount: 500, price: 'P45', name: 'Sack of Gems', color: NEO_THEME.colors.blue },
  { id: 'gems_1200', amount: 1200, price: 'P99', name: 'Chest of Gems', color: NEO_THEME.colors.primary },
];

export default function GemShopScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const headerHeight = insets.top + 60; // Approximate header height

  const handlePurchase = (packId: string) => {
    console.log('Purchase pack:', packId);
    // TODO: Implement RevenueCat purchase logic
  };

  return (
    <View style={styles.container}>
      <StaticHeader title="GEM SHOP" onBackPress={() => router.back()} />
      
      <ScrollView 
        contentContainerStyle={[
          styles.content, 
          { paddingTop: headerHeight + 20, paddingBottom: insets.bottom + 20 }
        ]}
      >
        
        {/* Balance Section */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>YOUR BALANCE</Text>
          <View style={styles.balanceRow}>
            <Ionicons name="diamond" size={32} color={NEO_THEME.colors.primary} />
            <Text style={styles.balanceAmount}>150</Text>
          </View>
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

        {/* Gem Packs Section */}
        {/* Gem Use Cases */}
        <GemUseCases />

        {/* Gem Packs Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GEM PACKS</Text>
          <View style={styles.packsGrid}>
            {GEM_PACKS.map((pack) => (
              <TouchableOpacity 
                key={pack.id} 
                style={[styles.packCard, { backgroundColor: pack.color }]}
                onPress={() => router.push(`/gem-shop/pack/${pack.id}`)}
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
            ))}
          </View>
        </View>

      </ScrollView>
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
