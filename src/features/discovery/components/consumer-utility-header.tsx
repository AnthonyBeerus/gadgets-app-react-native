import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  Text,
  space,
  radii,
  useDesignTokens,
  useThemedStyles,
  type DesignTokens,
  type SemanticColors,
} from '../../../shared/design-system';

export function ConsumerUtilityHeader() {
  const router = useRouter();
  const { colors, elevation } = useDesignTokens();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <View style={styles.brand}>
        <Text variant="h2">Muse</Text>
        <Text variant="caption" style={styles.subtitle}>
          Find it. Create for it.
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Creator activity"
        onPress={() => router.push('/(shop)/challenges/my-entries')}
        style={[styles.utility, elevation.hairline]}
      >
        <Ionicons name="sparkles-outline" size={18} color={colors.ink} />
        <Text variant="caption" style={styles.utilityLabel}>
          Activity
        </Text>
      </Pressable>
    </View>
  );
}

function createStyles(c: SemanticColors, _tokens: DesignTokens) {
  return {
    container: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      gap: space.xs,
      paddingHorizontal: space.md,
      paddingVertical: space.sm,
      backgroundColor: c.canvas,
    },
    brand: { flex: 1 },
    subtitle: {
      marginTop: 2,
      color: c.inkMuted,
    },
    utility: {
      minWidth: 52,
      minHeight: 44,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      gap: 2,
      borderRadius: radii.md,
      backgroundColor: c.surface,
      paddingHorizontal: space.sm,
    },
    utilityLabel: {
      fontSize: 10,
      color: c.inkMuted,
    },
  };
}
