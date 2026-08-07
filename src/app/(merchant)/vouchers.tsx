import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NEO_THEME } from '../../shared/constants/neobrutalism';
import { StaticHeader } from '../../shared/components/layout/StaticHeader';
import { useCreatePurchaseCode, useMerchantPurchaseCodes, useRedeemVoucher, useRewardVouchers } from '../../features/challenges/api/submissions';
import { getShopProducts } from '../../shared/api/api';
import { useAuth } from '../../shared/providers/auth-provider';

export default function MerchantVouchersScreen() {
  const router = useRouter(); const insets = useSafeAreaInsets();
  const [code, setCode] = useState(''); const vouchers = useRewardVouchers(); const redeem = useRedeemVoucher();
  const { merchantShopId } = useAuth(); const products = getShopProducts(merchantShopId ?? 0);
  const purchaseCodes = useMerchantPurchaseCodes(); const createCode = useCreatePurchaseCode();
  const [productId, setProductId] = useState<number | null>(null); const [amount, setAmount] = useState('0');
  const submit = () => redeem.mutate(code, {
    onSuccess: result => { setCode(''); Alert.alert(result.idempotent ? 'Already redeemed' : 'Voucher redeemed'); },
    onError: error => Alert.alert('Cannot redeem voucher', error.message),
  });
  return <View style={styles.container}>
    <StaticHeader title="VOUCHERS" onBackPress={() => router.back()} />
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 24, gap: 16 }}>
      <View style={styles.card}><Text style={styles.title}>REDEEM CUSTOMER VOUCHER</Text>
        <TextInput style={styles.input} autoCapitalize="characters" value={code} onChangeText={setCode} placeholder="Voucher code" />
        <TouchableOpacity style={styles.button} disabled={!code.trim() || redeem.isPending} onPress={submit}><Text style={styles.buttonText}>REDEEM</Text></TouchableOpacity>
      </View>
      <View style={styles.card}><Text style={styles.title}>ISSUE WALK-IN PURCHASE CODE</Text>
        <Text style={styles.detail}>Select the product purchased at your till. The code can be claimed once.</Text>
        {products.data?.map((product: any) => <TouchableOpacity key={product.id} style={[styles.choice, productId === product.id && styles.choiceActive]} onPress={() => setProductId(product.id)}><Text style={styles.detail}>{product.title}</Text></TouchableOpacity>)}
        <TextInput style={styles.input} keyboardType="numeric" value={amount} onChangeText={setAmount} placeholder="Purchase amount (BWP)" />
        <TouchableOpacity style={styles.button} disabled={!productId || createCode.isPending} onPress={() => productId && createCode.mutate({ productId, amount: Number(amount) || 0, expiresAt: new Date(Date.now() + 7 * 86400000).toISOString() })}><Text style={styles.buttonText}>GENERATE ONE-TIME CODE</Text></TouchableOpacity>
        {purchaseCodes.data?.slice(0, 5).map((item: any) => <Text key={item.id} style={styles.code}>{item.code} · {item.claimed_at ? 'CLAIMED' : 'AVAILABLE'}</Text>)}
      </View>
      <Text style={styles.title}>ISSUED BY YOUR SHOP</Text>
      {vouchers.data?.map((voucher: any) => <View key={voucher.id} style={styles.card}>
        <Text style={styles.code}>{voucher.code}</Text><Text style={styles.detail}>P{Number(voucher.value).toFixed(2)} · {voucher.redeemed_at ? 'REDEEMED' : 'AVAILABLE'}</Text>
      </View>)}
    </ScrollView>
  </View>;
}
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: NEO_THEME.colors.greyLight }, card: { backgroundColor: NEO_THEME.colors.white, borderWidth: 2, borderColor: NEO_THEME.colors.black, borderRadius: NEO_THEME.borders.radius, padding: 16, gap: 10 }, title: { fontFamily: NEO_THEME.fonts.black, fontSize: 15, color: NEO_THEME.colors.black }, input: { minHeight: 50, borderWidth: 2, borderColor: NEO_THEME.colors.black, borderRadius: NEO_THEME.borders.radius, paddingHorizontal: 12, fontFamily: NEO_THEME.fonts.bold }, button: { minHeight: 48, alignItems: 'center', justifyContent: 'center', backgroundColor: NEO_THEME.colors.black, borderRadius: NEO_THEME.borders.radius }, buttonText: { color: NEO_THEME.colors.white, fontFamily: NEO_THEME.fonts.black }, code: { fontFamily: NEO_THEME.fonts.black, fontSize: 18 }, detail: { fontFamily: NEO_THEME.fonts.bold, color: NEO_THEME.colors.grey }, choice: { padding: 10, borderWidth: 2, borderColor: NEO_THEME.colors.black, borderRadius: NEO_THEME.borders.radius }, choiceActive: { backgroundColor: NEO_THEME.colors.secondary } });
