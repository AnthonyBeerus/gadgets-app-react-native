import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { NuviaText } from '../../../components/atoms/nuvia-text';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';

export function ConsumerUtilityHeader() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.brand}>
        <NuviaText variant="h2">MUSE</NuviaText>
        <NuviaText variant="caption" style={styles.subtitle}>FIND IT. CREATE FOR IT.</NuviaText>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Creator activity"
        onPress={() => router.push('/(shop)/challenges/my-entries')}
        style={styles.utility}
      >
        <Ionicons name="sparkles" size={19} color={NEO_THEME.colors.black} />
        <NuviaText variant="caption" style={styles.utilityLabel}>ACTIVITY</NuviaText>
      </Pressable>
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
  utility: {
    minWidth: 52,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
    borderRadius: 12,
    backgroundColor: NEO_THEME.colors.white,
    paddingHorizontal: 8,
  },
  utilityLabel: { fontSize: 8, fontFamily: NEO_THEME.fonts.bold },
});
