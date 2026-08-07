import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NEO_THEME } from '../../shared/constants/neobrutalism';
import { StaticHeader } from '../../shared/components/layout/StaticHeader';
import { Ionicons } from '@expo/vector-icons';
import { useNeoStyles } from '../../shared/hooks/useNeoStyles';
import { useTheme } from '../../shared/providers/theme-provider';

export default function RewardsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = useNeoStyles(createStyles);
  const { theme } = useTheme();
  const headerHeight = insets.top + 60;

  const vouchers = useMemo(() => [
    { id: 'v1', title: 'P50 OFF @ Nike', cost: '200 GEMS', color: theme.colors.white, logo: 'shirt' },
    { id: 'v2', title: 'Free Coffee @ Mug & Bean', cost: '100 GEMS', color: theme.colors.white, logo: 'cafe' },
    { id: 'v3', title: '20% OFF @ iStore', cost: '500 GEMS', color: theme.colors.white, logo: 'phone-portrait' },
  ], [theme.colors.white]);

  return (
    <View style={styles.container}>
      <StaticHeader title="REWARDS" onBackPress={() => router.back()} />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: headerHeight + 20, paddingBottom: insets.bottom + 20 },
        ]}
      >
        <Text style={styles.description}>
          Exchange your gems for exclusive vouchers at Molapo Crossing stores.
        </Text>

        <View style={styles.grid}>
          {vouchers.map((voucher) => (
            <TouchableOpacity
              key={voucher.id}
              style={[styles.card, { backgroundColor: voucher.color }]}
              activeOpacity={0.9}
            >
              <View style={styles.cardHeader}>
                <View style={styles.logoBox}>
                  <Ionicons name={voucher.logo as any} size={24} color={theme.colors.black} />
                </View>
                <View style={styles.costTag}>
                  <Ionicons name="diamond" size={12} color={theme.colors.white} />
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

function createStyles(c: {
  backgroundLight: string;
  black: string;
  border: string;
  greyLight: string;
  white: string;
  grey: string;
  primary: string;
}) {
  return {
    container: {
      flex: 1,
      backgroundColor: c.backgroundLight,
    },
    content: {
      padding: 20,
    },
    description: {
      fontFamily: NEO_THEME.fonts.regular,
      fontSize: 16,
      color: c.black,
      marginBottom: 24,
      textAlign: 'center' as const,
    },
    grid: {
      gap: 16,
    },
    card: {
      padding: 20,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: NEO_THEME.borders.radius,
      shadowColor: c.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    },
    cardHeader: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      marginBottom: 16,
    },
    logoBox: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: c.greyLight,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      borderWidth: 1,
      borderColor: c.border,
    },
    costTag: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: c.black,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      gap: 6,
    },
    costText: {
      fontFamily: NEO_THEME.fonts.bold,
      fontSize: 12,
      color: c.white,
    },
    divider: {
      height: 1,
      backgroundColor: c.black,
      borderStyle: 'dashed' as const,
      borderWidth: 1,
      borderColor: c.grey,
      marginBottom: 16,
    },
    cardTitle: {
      fontFamily: NEO_THEME.fonts.black,
      fontSize: 20,
      color: c.black,
      marginBottom: 8,
    },
    redeemText: {
      fontFamily: NEO_THEME.fonts.bold,
      fontSize: 14,
      color: c.primary,
      textTransform: 'uppercase' as const,
    },
  };
}
