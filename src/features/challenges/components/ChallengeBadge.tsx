import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';

type BadgeType = 'premium' | 'fee' | 'status' | 'ai';

interface ChallengeBadgeProps {
  type: BadgeType;
  text: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function ChallengeBadge({ type, text, icon }: ChallengeBadgeProps) {
  const getStyles = () => {
    switch (type) {
      case 'premium':
        return {
          container: styles.premiumBadge,
          text: styles.premiumText,
          iconColor: NEO_THEME.colors.black,
        };
      case 'fee':
        return {
          container: styles.feeBadge,
          text: styles.feeText,
          iconColor: NEO_THEME.colors.white,
        };
      case 'ai':
        return {
          container: styles.aiBadge,
          text: styles.aiText,
          iconColor: NEO_THEME.colors.white,
        };
      default: // status
        return {
          container: styles.statusBadge,
          text: styles.statusText,
          iconColor: NEO_THEME.colors.black,
        };
    }
  };

  const badgeStyles = getStyles();

  return (
    <View style={badgeStyles.container}>
      {icon && <Ionicons name={icon} size={12} color={badgeStyles.iconColor} />}
      <Text style={badgeStyles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NEO_THEME.colors.yellow,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: NEO_THEME.borders.radius,
    gap: 4,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
  },
  premiumText: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 10,
    color: NEO_THEME.colors.black,
  },
  feeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NEO_THEME.colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: NEO_THEME.borders.radius,
    gap: 4,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
  },
  feeText: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 10,
    color: NEO_THEME.colors.white,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NEO_THEME.colors.greyLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: NEO_THEME.borders.radius,
    gap: 4,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
  },
  statusText: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 10,
    color: NEO_THEME.colors.black,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NEO_THEME.colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: NEO_THEME.borders.radius,
    gap: 4,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
  },
  aiText: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 10,
    color: NEO_THEME.colors.white,
  },
});
