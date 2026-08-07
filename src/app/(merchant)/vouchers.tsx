import React, { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NEO_THEME } from '../../shared/constants/neobrutalism';
import { StaticHeader } from '../../shared/components/layout/StaticHeader';
import { useCreatePurchaseCode, useMerchantPurchaseCodes, useRedeemVoucher, useRewardVouchers } from '../../features/challenges/api/submissions';
import { getShopProducts } from '../../shared/api/api';
import { useAuth } from '../../shared/providers/auth-provider';
import { useNeoStyles } from '../../shared/hooks/useNeoStyles';
import { useTheme } from '../../shared/providers/theme-provider';

export default function MerchantVouchersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = useNeoStyles(createStyles);
  const { theme } = useTheme();
  const c = theme.colors;
  const [code, setCode] = useState('');
  const vouchers = useRewardVouchers();
  const redeem = useRedeemVoucher();
  const { merchantShopId } = useAuth();
  const products = getShopProducts(merchantShopId ?? 0);
  const purchaseCodes = useMerchantPurchaseCodes();
  const createCode = useCreatePurchaseCode();
  const [productId, setProductId] = useState<number | null>(null);
  const [amount, setAmount] = useState('0');

  const submit = () => redeem.mutate(code, {
    onSuccess: result => { setCode(''); Alert.alert(result.idempotent ? 'Already redeemed' : 'Voucher redeemed'); },
    onError: error => Alert.alert('Cannot redeem voucher', error.message),
  });

  return (
    <View style={styles.container}>
      <StaticHeader title="VOUCHERS" onBackPress={() => router.back()} />
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 24, gap: 16 }}>
        <View style={styles.card}>
          <Text style={styles.title}>REDEEM CUSTOMER VOUCHER</Text>
          <TextInput style={styles.input} autoCapitalize="characters" value={code} onChangeText={setCode} placeholder="Voucher code" placeholderTextColor={c.grey} />
          <TouchableOpacity style={styles.button} disabled={!code.trim() || redeem.isPending} onPress={submit}>
            <Text style={styles.buttonText}>REDEEM</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>ISSUE WALK-IN PURCHASE CODE</Text>
          <Text style={styles.detail}>Select the product purchased at your till. The code can be claimed once.</Text>
          {products.data?.map((product: any) => (
            <TouchableOpacity key={product.id} style={[styles.choice, productId === product.id && styles.choiceActive]} onPress={() => setProductId(product.id)}>
              <Text style={styles.detail}>{product.title}</Text>
            </TouchableOpacity>
          ))}
          <TextInput style={styles.input} keyboardType="numeric" value={amount} onChangeText={setAmount} placeholder="Purchase amount (BWP)" placeholderTextColor={c.grey} />
          <TouchableOpacity style={styles.button} disabled={!productId || createCode.isPending} onPress={() => productId && createCode.mutate({ productId, amount: Number(amount) || 0, expiresAt: new Date(Date.now() + 7 * 86400000).toISOString() })}>
            <Text style={styles.buttonText}>GENERATE ONE-TIME CODE</Text>
          </TouchableOpacity>
          {purchaseCodes.data?.slice(0, 5).map((item: any) => (
            <Text key={item.id} style={styles.code}>{item.code} · {item.claimed_at ? 'CLAIMED' : 'AVAILABLE'}</Text>
          ))}
        </View>
        <Text style={styles.title}>ISSUED BY YOUR SHOP</Text>
        {vouchers.data?.map((voucher: any) => (
          <View key={voucher.id} style={styles.card}>
            <Text style={styles.code}>{voucher.code}</Text>
            <Text style={styles.detail}>P{Number(voucher.value).toFixed(2)} · {voucher.redeemed_at ? 'REDEEMED' : 'AVAILABLE'}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function createStyles(c: {
  black: string;
  white: string;
  grey: string;
  greyLight: string;
  border: string;
  secondary: string;
}) {
  return {
    container: { flex: 1, backgroundColor: c.greyLight },
    card: {
      backgroundColor: c.white,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: NEO_THEME.borders.radius,
      padding: 16,
      gap: 10,
    },
    title: {
      fontFamily: NEO_THEME.fonts.black,
      fontSize: 15,
      color: c.black,
    },
    input: {
      minHeight: 50,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: NEO_THEME.borders.radius,
      paddingHorizontal: 12,
      fontFamily: NEO_THEME.fonts.bold,
      color: c.black,
      backgroundColor: c.white,
    },
    button: {
      minHeight: 48,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      backgroundColor: c.black,
      borderRadius: NEO_THEME.borders.radius,
    },
    buttonText: {
      color: c.white,
      fontFamily: NEO_THEME.fonts.black,
    },
    code: {
      fontFamily: NEO_THEME.fonts.black,
      fontSize: 18,
      color: c.black,
    },
    detail: {
      fontFamily: NEO_THEME.fonts.bold,
      color: c.grey,
    },
    choice: {
      padding: 10,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: NEO_THEME.borders.radius,
      backgroundColor: c.white,
    },
    choiceActive: {
      backgroundColor: c.secondary,
    },
  };
}
