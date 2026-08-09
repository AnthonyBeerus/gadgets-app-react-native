import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, View } from 'react-native';

import { Text, fonts, radii, space, useDesignTokens, useThemedStyles, type SemanticColors } from '../../../shared/design-system';
import type { MerchantGrowthProfile } from '../shops-model';

type Props = { profile: MerchantGrowthProfile; onPress: () => void; compact?: boolean };

export function MerchantGrowthCard({ profile, onPress, compact }: Props) {
  const styles = useThemedStyles(createStyles);
  const { colors, elevation } = useDesignTokens();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`Open ${profile.name}`} onPress={onPress} style={[styles.card, elevation.hairline, compact && styles.compact]}>
      <View style={[styles.imageWrap, compact && styles.compactImage]}>
        <Image source={{ uri: profile.imageUrl }} style={styles.image} contentFit="cover" transition={120} />
        {profile.isSponsored && <View style={styles.sponsored}><Text variant="caption" style={styles.sponsoredText}>SPONSORED CONCEPT</Text></View>}
        {profile.opportunity && <View style={styles.pot}><Text variant="caption" color={colors.surface}>P{profile.opportunity.pot_value} POT</Text></View>}
      </View>
      <View style={styles.content}>
        <Text variant="caption" color={colors.inkMuted}>{profile.intent} · {profile.location}</Text>
        <Text variant="h2" numberOfLines={1}>{profile.name}</Text>
        <Text variant="body" color={colors.inkMuted} numberOfLines={compact ? 2 : 3}>{profile.story}</Text>
        {profile.opportunity && (
          <View style={styles.opportunity}>
            <Ionicons name="sparkles" size={16} color={colors.accent} />
            <Text variant="caption" style={styles.opportunityText} numberOfLines={1}>{profile.opportunity.opportunity_title} · P{profile.opportunity.accepted_entry_fee} accepted</Text>
          </View>
        )}
        <View style={styles.footer}><Text variant="bodyBold">Explore business</Text><Ionicons name="arrow-forward" size={18} color={colors.ink} /></View>
      </View>
    </Pressable>
  );
}

function createStyles(c: SemanticColors) {
  return {
    card: { overflow: 'hidden' as const, borderRadius: radii.lg, backgroundColor: c.surface, borderWidth: 1, borderColor: c.border },
    compact: { width: 286 },
    imageWrap: { height: 210, backgroundColor: c.gray100 }, compactImage: { height: 150 }, image: { width: '100%' as const, height: '100%' as const },
    sponsored: { position: 'absolute' as const, left: space.sm, top: space.sm, borderRadius: radii.sm, backgroundColor: c.surface, paddingHorizontal: space.sm, paddingVertical: 5 },
    sponsoredText: { fontFamily: fonts.semibold },
    pot: { position: 'absolute' as const, right: space.sm, bottom: space.sm, borderRadius: radii.sm, backgroundColor: c.ink, paddingHorizontal: space.sm, paddingVertical: 5 },
    content: { padding: space.md, gap: space.xs },
    opportunity: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 6, borderRadius: radii.sm, backgroundColor: c.accentMuted, padding: space.sm },
    opportunityText: { flex: 1, fontFamily: fonts.semibold },
    footer: { minHeight: 40, flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'space-between' as const },
  };
}
