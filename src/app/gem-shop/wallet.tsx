import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NEO_THEME } from '../../shared/constants/neobrutalism';
import { StaticHeader } from '../../shared/components/layout/StaticHeader';
import { Ionicons } from '@expo/vector-icons';

const TRANSACTIONS = [
  { id: '1', type: 'purchase', title: 'Sack of Gems', amount: '+500', date: 'Today, 10:23 AM', color: NEO_THEME.colors.success },
  { id: '2', type: 'spend', title: 'Image Generator', amount: '-5', date: 'Yesterday, 2:15 PM', color: NEO_THEME.colors.black },
  { id: '3', type: 'spend', title: 'Challenge Entry', amount: '-50', date: 'Nov 22, 9:00 AM', color: NEO_THEME.colors.black },
  { id: '4', type: 'reward', title: 'Ride Reward', amount: '+3', date: 'Nov 20, 6:45 PM', color: NEO_THEME.colors.primary },
];

export default function WalletScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const headerHeight = insets.top + 60;

  return (
    <View style={styles.container}>
      <StaticHeader title="MY WALLET" onBackPress={() => router.back()} />
      
      <View style={[styles.content, { paddingTop: headerHeight }]}>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>CURRENT BALANCE</Text>
          <View style={styles.balanceRow}>
            <Ionicons name="diamond" size={32} color={NEO_THEME.colors.white} />
            <Text style={styles.balanceAmount}>150</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>TRANSACTION HISTORY</Text>

        <FlatList
          data={TRANSACTIONS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.transactionItem}>
              <View style={[styles.iconBox, { backgroundColor: item.type === 'purchase' || item.type === 'reward' ? NEO_THEME.colors.successLight : NEO_THEME.colors.greyLight }]}>
                <Ionicons 
                  name={item.type === 'purchase' ? 'add' : item.type === 'reward' ? 'gift' : 'remove'} 
                  size={20} 
                  color={NEO_THEME.colors.black} 
                />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>{item.title}</Text>
                <Text style={styles.transactionDate}>{item.date}</Text>
              </View>
              <Text style={[styles.transactionAmount, { color: item.type === 'spend' ? NEO_THEME.colors.error : NEO_THEME.colors.success }]}>
                {item.amount}
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEO_THEME.colors.backgroundLight,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  balanceCard: {
    backgroundColor: NEO_THEME.colors.black,
    padding: 24,
    borderRadius: NEO_THEME.borders.radius,
    alignItems: 'center',
    marginBottom: 30,
    // Hard shadow
    shadowColor: NEO_THEME.colors.grey,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  balanceLabel: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 14,
    color: NEO_THEME.colors.white,
    marginBottom: 8,
    opacity: 0.8,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  balanceAmount: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 48,
    color: NEO_THEME.colors.white,
  },
  sectionTitle: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 18,
    color: NEO_THEME.colors.black,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NEO_THEME.colors.white,
    padding: 16,
    marginBottom: 12,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    borderRadius: NEO_THEME.borders.radius,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: NEO_THEME.colors.black,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 16,
    color: NEO_THEME.colors.black,
    marginBottom: 4,
  },
  transactionDate: {
    fontFamily: NEO_THEME.fonts.regular,
    fontSize: 12,
    color: NEO_THEME.colors.grey,
  },
  transactionAmount: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 18,
  },
});
