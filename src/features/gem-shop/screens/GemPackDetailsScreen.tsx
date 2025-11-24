import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { StaticHeader } from '../../../shared/components/layout/StaticHeader';
import { Ionicons } from '@expo/vector-icons';

export default function GemPackDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const headerHeight = insets.top + 60;
  const [isPurchasing, setIsPurchasing] = React.useState(false);

  // Mock data lookup based on ID
  const pack = {
    amount: id === 'gems_100' ? 100 : id === 'gems_500' ? 500 : 1200,
    price: id === 'gems_100' ? 'P10' : id === 'gems_500' ? 'P45' : 'P99',
    name: id === 'gems_100' ? 'Handful of Gems' : id === 'gems_500' ? 'Sack of Gems' : 'Chest of Gems',
    color: id === 'gems_100' ? NEO_THEME.colors.yellow : id === 'gems_500' ? NEO_THEME.colors.blue : NEO_THEME.colors.primary,
  };

  const handlePurchase = () => {
    setIsPurchasing(true);
    // Mock API call
    setTimeout(() => {
      setIsPurchasing(false);
      alert('Purchase Successful! Gems added to your wallet.');
      router.back();
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <StaticHeader title="CONFIRM PURCHASE" onBackPress={() => router.back()} />
      
      <View style={[styles.content, { paddingTop: headerHeight }]}>
        <View style={[styles.card, { backgroundColor: pack.color }]}>
          <View style={styles.iconContainer}>
            <Ionicons name="diamond" size={64} color={NEO_THEME.colors.black} />
          </View>
          <Text style={styles.amount}>{pack.amount} GEMS</Text>
          <Text style={styles.name}>{pack.name}</Text>
        </View>

        <View style={styles.receiptContainer}>
          <View style={styles.receiptHeader}>
            <Text style={styles.receiptTitle}>RECEIPT</Text>
            <Text style={styles.receiptDate}>{new Date().toLocaleDateString()}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.row}>
            <Text style={styles.label}>Item</Text>
            <Text style={styles.value}>{pack.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Amount</Text>
            <Text style={styles.value}>{pack.amount} Gems</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.row}>
            <Text style={styles.totalLabel}>TOTAL</Text>
            <Text style={styles.totalPrice}>{pack.price}</Text>
          </View>

          {/* Zigzag bottom border effect would go here */}
        </View>

        <TouchableOpacity 
          style={[styles.confirmButton, isPurchasing && styles.confirmButtonDisabled]} 
          activeOpacity={0.8}
          onPress={handlePurchase}
          disabled={isPurchasing}
        >
          <Text style={styles.confirmText}>
            {isPurchasing ? 'PROCESSING...' : 'CONFIRM PURCHASE'}
          </Text>
        </TouchableOpacity>
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
    justifyContent: 'center',
  },
  card: {
    alignItems: 'center',
    padding: 40,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    borderRadius: NEO_THEME.borders.radius,
    marginBottom: 40,
    // Hard shadow
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  iconContainer: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: NEO_THEME.colors.black,
  },
  amount: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 40,
    color: NEO_THEME.colors.black,
    marginBottom: 8,
    textAlign: 'center',
  },
  name: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 20,
    color: NEO_THEME.colors.black,
    opacity: 0.7,
  },
  receiptContainer: {
    backgroundColor: NEO_THEME.colors.white,
    padding: 24,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    marginBottom: 30,
    // Receipt styling
    borderStyle: 'dashed', // Fallback, though we use solid border usually
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  receiptTitle: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 18,
    color: NEO_THEME.colors.black,
    letterSpacing: 1,
  },
  receiptDate: {
    fontFamily: NEO_THEME.fonts.regular,
    fontSize: 12,
    color: NEO_THEME.colors.grey,
  },
  divider: {
    height: 1,
    backgroundColor: NEO_THEME.colors.black,
    marginVertical: 16,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: NEO_THEME.colors.grey,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontFamily: NEO_THEME.fonts.regular,
    fontSize: 16,
    color: NEO_THEME.colors.grey,
  },
  value: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 16,
    color: NEO_THEME.colors.black,
  },
  totalLabel: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 20,
    color: NEO_THEME.colors.black,
  },
  totalPrice: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 24,
    color: NEO_THEME.colors.primary,
  },
  confirmButtonDisabled: {
    opacity: 0.7,
    backgroundColor: NEO_THEME.colors.grey,
  },
  confirmButton: {
    backgroundColor: NEO_THEME.colors.black,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    // Hard shadow
    shadowColor: NEO_THEME.colors.grey,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  confirmText: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 18,
    color: NEO_THEME.colors.white,
  },
});
