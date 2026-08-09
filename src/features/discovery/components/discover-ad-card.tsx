import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, View } from 'react-native';

import { Text, fonts, radii, space, useDesignTokens, useThemedStyles, type SemanticColors } from '../../../shared/design-system';
import type { SponsoredDemo } from '../types';

type Props = { item: SponsoredDemo; onContinue: () => void; onLearnMore: () => void };

export function DiscoverAdCard({ item, onContinue, onLearnMore }: Props) {
  const styles = useThemedStyles(createStyles);
  const { colors, elevation } = useDesignTokens();
  return (
    <View style={[styles.card, elevation.soft]}>
      <LinearGradient colors={['#20113B', '#6227A8', '#FF5C7A']} style={styles.creative}>
        <View style={styles.badge}><Text variant="caption" style={styles.badgeText}>{item.badge}</Text></View>
        <View style={styles.mockProduct}><Ionicons name="sparkles" size={42} color="#20113B" /></View>
        <Text variant="caption" color="#FFFFFF">{item.advertiser}</Text>
        <Text variant="h1" color="#FFFFFF" style={styles.headline}>{item.headline}</Text>
      </LinearGradient>
      <View style={styles.content}>
        <Text variant="body" color={colors.inkMuted}>{item.body}</Text>
        <View style={styles.flow}>
          {['Brief', 'Creators', 'Content', 'Sales'].map((label, index) => (
            <View key={label} style={styles.flowItem}>
              <Text variant="caption" style={styles.flowText}>{label}</Text>
              {index < 3 && <Ionicons name="arrow-forward" size={12} color={colors.inkMuted} />}
            </View>
          ))}
        </View>
        <Pressable accessibilityRole="button" onPress={onLearnMore} style={styles.primary}>
          <Text variant="bodyBold" color={colors.surface}>See how Muse makes money</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.surface} />
        </Pressable>
        <Pressable accessibilityRole="button" onPress={onContinue} style={styles.secondary}>
          <Text variant="bodyBold">Keep discovering</Text>
        </Pressable>
      </View>
    </View>
  );
}

function createStyles(c: SemanticColors) {
  return {
    card: { flex: 1, overflow: 'hidden' as const, borderRadius: radii.lg, backgroundColor: c.surface },
    creative: { flex: 1.15, minHeight: 250, padding: space.lg, justifyContent: 'flex-end' as const, gap: space.sm },
    badge: { position: 'absolute' as const, top: space.md, left: space.md, backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: radii.sm, paddingHorizontal: space.sm, paddingVertical: 6 },
    badgeText: { color: '#20113B', fontFamily: fonts.semibold },
    mockProduct: { width: 88, height: 88, borderRadius: 24, backgroundColor: '#FFFFFF', alignItems: 'center' as const, justifyContent: 'center' as const, transform: [{ rotate: '-7deg' }] },
    headline: { fontSize: 28, lineHeight: 34 },
    content: { padding: space.md, gap: space.md },
    flow: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'space-between' as const },
    flowItem: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 3 },
    flowText: { fontFamily: fonts.semibold },
    primary: { minHeight: 48, borderRadius: radii.md, backgroundColor: c.ink, paddingHorizontal: space.md, flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'space-between' as const },
    secondary: { minHeight: 44, alignItems: 'center' as const, justifyContent: 'center' as const },
  };
}
