import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NEO_THEME } from '../../shared/constants/neobrutalism';
import { StaticHeader } from '../../shared/components/layout/StaticHeader';
import { Ionicons } from '@expo/vector-icons';
import { useGemStore } from '../../features/gems/store/gem-store';

// Transaction history will be backed by a persistent gem ledger in a follow-up.
// Until that exists, show the real balance and an honest empty state rather than mock rows.
interface WalletTransaction {
  id: string;
  type: 'purchase' | 'spend' | 'reward';
  title: string;
  amount: string;
  date: string;
}

const TRANSACTIONS: WalletTransaction[] = [];

export default function WalletScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const headerHeight = insets.top + 60;
  const { balance, loading, fetchBalance } = useGemStore();

  useEffect(() => {
    fetchBalance();
  }, []);

  return (
    <View style={styles.container}>
      <StaticHeader title="MY WALLET" onBackPress={() => router.back()} />

      <View style={[styles.content, { paddingTop: headerHeight }]}>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>CURRENT BALANCE</Text>
          <View style={styles.balanceRow}>
            <Ionicons name="diamond" size={32} color={NEO_THEME.colors.white} />
            {loading ? (
              <ActivityIndicator size="large" color={NEO_THEME.colors.white} />
            ) : (
              <Text style={styles.balanceAmount}>{balance}</Text>
            )}
          </View>
        </View>

        <Text style={styles.sectionTitle}>TRANSACTION HISTORY</Text>

        <FlatList
          data={TRANSACTIONS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={40} color={NEO_THEME.colors.grey} />
              <Text style={styles.emptyTitle}>NO TRANSACTIONS YET</Text>
              <Text style={styles.emptyText}>Buy or spend gems and your history will appear here.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.transactionItem}>
              <View style={[styles.iconBox, { backgroundColor: item.type === 'purchase' || item.type === 'reward' ? NEO_THEME.colors.mint : NEO_THEME.colors.greyLight }]}>
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 8,
  },
  emptyTitle: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 16,
    color: NEO_THEME.colors.black,
    textTransform: 'uppercase',
    marginTop: 8,
  },
  emptyText: {
    fontFamily: NEO_THEME.fonts.regular,
    fontSize: 14,
    color: NEO_THEME.colors.grey,
    textAlign: 'center',
  },
});
