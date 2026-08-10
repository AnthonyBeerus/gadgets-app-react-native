import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text, useDesignTokens } from '../../../shared/design-system';
import { useShopStore } from '../../../store/shop-store';

export function ConsumerUtilityHeader() {
  const router = useRouter();
  const { colors } = useDesignTokens();
  const selectedMall = useShopStore(state => state.selectedMall);
  const malls = useShopStore(state => state.malls);
  const location = malls.find(mall => mall.id === selectedMall)?.name ?? 'Molapo';
  return <View style={[styles.header, { borderBottomColor: colors.stroke }]}>
    <View style={styles.brand}><View style={[styles.mark, { borderColor: colors.stroke }]}><Image source={require('../../../../assets/adaptive-icon.png')} style={styles.icon} contentFit="cover" /></View><Text variant="h2">Muse</Text></View>
    <Pressable onPress={() => router.push('/mall-selector')} accessibilityLabel="Change location" style={styles.location}><Text variant="label" color={colors.inkMuted}>{location.toUpperCase()} ▾</Text></Pressable>
  </View>;
}
const styles = StyleSheet.create({ header: { minHeight: 58, paddingHorizontal: 16, borderBottomWidth: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, brand: { flexDirection: 'row', alignItems: 'center', gap: 9 }, mark: { width: 36, height: 36, borderWidth: 2, overflow: 'hidden' }, icon: { width: 104, height: 104, marginLeft: -36, marginTop: -34 }, location: { minHeight: 44, justifyContent: 'center' } });
