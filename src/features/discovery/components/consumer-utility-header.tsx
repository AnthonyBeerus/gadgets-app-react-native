import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { NuviaText } from '../../../components/atoms/nuvia-text';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { useCartStore } from '../../../store/cart-store';

const utilities = [
  { label: 'Saved', icon: 'heart' as const, route: '/saved-opportunities' as const },
  { label: 'Activity', icon: 'sparkles' as const, route: '/(shop)/challenges/my-entries' as const },
  { label: 'Me', icon: 'person' as const, route: '/(shop)/profile' as const },
];

export function ConsumerUtilityHeader() {
  const router = useRouter();
  const itemCount = useCartStore(state => state.getItemCount());

  return (
    <View style={styles.container}>
      <View style={styles.brand}>
        <NuviaText variant="h2">MUSE</NuviaText>
        <NuviaText variant="caption" style={styles.subtitle}>FIND IT. CREATE FOR IT.</NuviaText>
      </View>
      <View style={styles.utilities}>
        {utilities.map(item => (
          <Pressable
            key={item.label}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            onPress={() => router.push(item.route)}
            style={styles.utility}
          >
            <Ionicons name={item.icon} size={19} color={NEO_THEME.colors.black} />
            <NuviaText variant="caption" style={styles.utilityLabel}>{item.label}</NuviaText>
          </Pressable>
        ))}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Cart, ${itemCount} items`}
          onPress={() => router.push('/cart')}
          style={[styles.utility, styles.cartUtility]}
        >
          <Ionicons name="bag-handle" size={19} color={NEO_THEME.colors.black} />
          <NuviaText variant="caption" style={styles.utilityLabel}>{itemCount > 0 ? String(itemCount) : 'Cart'}</NuviaText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  brand: { flex: 1 },
  subtitle: { fontSize: 8, color: NEO_THEME.colors.grey, letterSpacing: 0.5 },
  utilities: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  utility: {
    minWidth: 42,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
    borderRadius: 12,
    backgroundColor: NEO_THEME.colors.white,
  },
  cartUtility: { backgroundColor: NEO_THEME.colors.secondary },
  utilityLabel: { fontSize: 8, fontFamily: NEO_THEME.fonts.bold },
});
