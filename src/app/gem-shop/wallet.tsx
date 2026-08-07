import React, { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NEO_THEME } from '../../shared/constants/neobrutalism';
import { StaticHeader } from '../../shared/components/layout/StaticHeader';
import { Ionicons } from '@expo/vector-icons';
import { useGemStore } from '../../features/gems/store/gem-store';
import { useNeoStyles } from '../../shared/hooks/useNeoStyles';
import { useTheme } from '../../shared/providers/theme-provider';

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
  const styles = useNeoStyles(createStyles);
  const { theme } = useTheme();
  const headerHeight = insets.top + 60;
  const { balance, loading, fetchBalance } = useGemStore();

  useEffect(() => {
    fetchBalance();
  }, []);

  return (
    <View style={styles.container}>
      <StaticHeader title="MY WALLET" onBackPress={() => router.back()} />

      <View style={[styles.content, { paddingTop: headerHeight }]}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>CURRENT BALANCE</Text>
          <View style={styles.balanceRow}>
            <Ionicons name="diamond" size={32} color={theme.colors.white} />
            {loading ? (
              <ActivityIndicator size="large" color={theme.colors.white} />
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
              <Ionicons name="receipt-outline" size={40} color={theme.colors.grey} />
              <Text style={styles.emptyTitle}>NO TRANSACTIONS YET</Text>
              <Text style={styles.emptyText}>Buy or spend gems and your history will appear here.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.transactionItem}>
              <View style={[styles.iconBox, { backgroundColor: item.type === 'purchase' || item.type === 'reward' ? theme.colors.mint : theme.colors.greyLight }]}>
                <Ionicons
                  name={item.type === 'purchase' ? 'add' : item.type === 'reward' ? 'gift' : 'remove'}
                  size={20}
                  color={theme.colors.black}
                />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>{item.title}</Text>
                <Text style={styles.transactionDate}>{item.date}</Text>
              </View>
              <Text style={[styles.transactionAmount, { color: item.type === 'spend' ? theme.colors.error : theme.colors.success }]}>
                {item.amount}
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

function createStyles(c: {
  backgroundLight: string;
  black: string;
  grey: string;
  white: string;
  border: string;
}) {
  return {
    container: {
      flex: 1,
      backgroundColor: c.backgroundLight,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    balanceCard: {
      backgroundColor: c.black,
      padding: 24,
      borderRadius: NEO_THEME.borders.radius,
      alignItems: 'center' as const,
      marginBottom: 30,
      shadowColor: c.grey,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    },
    balanceLabel: {
      fontFamily: NEO_THEME.fonts.bold,
      fontSize: 14,
      color: c.white,
      marginBottom: 8,
      opacity: 0.8,
    },
    balanceRow: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 12,
    },
    balanceAmount: {
      fontFamily: NEO_THEME.fonts.black,
      fontSize: 48,
      color: c.white,
    },
    sectionTitle: {
      fontFamily: NEO_THEME.fonts.black,
      fontSize: 18,
      color: c.black,
      marginBottom: 16,
      textTransform: 'uppercase' as const,
    },
    transactionItem: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: c.white,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: NEO_THEME.borders.radius,
    },
    iconBox: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginRight: 16,
      borderWidth: 1,
      borderColor: c.border,
    },
    transactionInfo: {
      flex: 1,
    },
    transactionTitle: {
      fontFamily: NEO_THEME.fonts.bold,
      fontSize: 16,
      color: c.black,
      marginBottom: 4,
    },
    transactionDate: {
      fontFamily: NEO_THEME.fonts.regular,
      fontSize: 12,
      color: c.grey,
    },
    transactionAmount: {
      fontFamily: NEO_THEME.fonts.black,
      fontSize: 18,
    },
    emptyState: {
      flex: 1,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      paddingHorizontal: 32,
      gap: 8,
    },
    emptyTitle: {
      fontFamily: NEO_THEME.fonts.black,
      fontSize: 16,
      color: c.black,
      textTransform: 'uppercase' as const,
      marginTop: 8,
    },
    emptyText: {
      fontFamily: NEO_THEME.fonts.regular,
      fontSize: 14,
      color: c.grey,
      textAlign: 'center' as const,
    },
  };
}
