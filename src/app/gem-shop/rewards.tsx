import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NEO_THEME } from '../../shared/constants/neobrutalism';
import { StaticHeader } from '../../shared/components/layout/StaticHeader';
import { Ionicons } from '@expo/vector-icons';

const VOUCHERS = [
  {
    id: 'v1',
    title: 'P50 OFF @ Nike',
    cost: '200 GEMS',
    color: NEO_THEME.colors.white,
    logo: 'shirt', // Placeholder icon
  },
  {
    id: 'v2',
    title: 'Free Coffee @ Mug & Bean',
    cost: '100 GEMS',
    color: NEO_THEME.colors.white,
    logo: 'cafe',
  },
  {
    id: 'v3',
    title: '20% OFF @ iStore',
    cost: '500 GEMS',
    color: NEO_THEME.colors.white,
    logo: 'phone-portrait',
  },
];

export default function RewardsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const headerHeight = insets.top + 60;

  return (
    <View style={styles.container}>
      <StaticHeader title="REWARDS" onBackPress={() => router.back()} />
      
      <ScrollView 
        contentContainerStyle={[
          styles.content, 
          { paddingTop: headerHeight + 20, paddingBottom: insets.bottom + 20 }
        ]}
      >
        <Text style={styles.description}>
          Exchange your gems for exclusive vouchers at Molapo Crossing stores.
        </Text>

        <View style={styles.grid}>
          {VOUCHERS.map((voucher) => (
            <TouchableOpacity 
              key={voucher.id} 
              style={[styles.card, { backgroundColor: voucher.color }]}
              activeOpacity={0.9}
            >
              <View style={styles.cardHeader}>
                <View style={styles.logoBox}>
                  <Ionicons name={voucher.logo as any} size={24} color={NEO_THEME.colors.black} />
                </View>
                <View style={styles.costTag}>
                  <Ionicons name="diamond" size={12} color={NEO_THEME.colors.white} />
                  <Text style={styles.costText}>{voucher.cost}</Text>
                </View>
              </View>
              
              <View style={styles.divider} />
              
              <Text style={styles.cardTitle}>{voucher.title}</Text>
              <Text style={styles.redeemText}>Tap to Redeem</Text>
            </TouchableOpacity>
          ))}
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
  },
  description: {
    fontFamily: NEO_THEME.fonts.regular,
    fontSize: 16,
    color: NEO_THEME.colors.black,
    marginBottom: 24,
    textAlign: 'center',
  },
  grid: {
    gap: 16,
  },
  card: {
    padding: 20,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: NEO_THEME.colors.greyLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: NEO_THEME.colors.black,
  },
  costTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NEO_THEME.colors.black,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  costText: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 12,
    color: NEO_THEME.colors.white,
  },
  divider: {
    height: 1,
    backgroundColor: NEO_THEME.colors.black,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: NEO_THEME.colors.grey,
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 20,
    color: NEO_THEME.colors.black,
    marginBottom: 8,
  },
  redeemText: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 14,
    color: NEO_THEME.colors.primary,
    textTransform: 'uppercase',
  },
});
