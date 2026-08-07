import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { useNeoStyles } from '../../../shared/hooks/useNeoStyles';
import { useTheme } from '../../../shared/providers/theme-provider';

type BadgeType = 'premium' | 'fee' | 'status';

interface ChallengeBadgeProps {
  type: BadgeType;
  text: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function ChallengeBadge({ type, text, icon }: ChallengeBadgeProps) {
  const styles = useNeoStyles(createStyles);
  const { theme } = useTheme();

  const getStyles = () => {
    switch (type) {
      case 'premium':
        return {
          container: styles.premiumBadge,
          text: styles.premiumText,
          iconColor: theme.colors.black,
        };
      case 'fee':
        return {
          container: styles.feeBadge,
          text: styles.feeText,
          iconColor: theme.colors.white,
        };
      default:
        return {
          container: styles.statusBadge,
          text: styles.statusText,
          iconColor: theme.colors.black,
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

function createStyles(c: {
  yellow: string;
  border: string;
  black: string;
  primary: string;
  white: string;
  greyLight: string;
}) {
  return {
    premiumBadge: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: c.yellow,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: NEO_THEME.borders.radius,
      gap: 4,
      borderWidth: 1,
      borderColor: c.border,
    },
    premiumText: {
      fontFamily: NEO_THEME.fonts.black,
      fontSize: 10,
      color: c.black,
    },
    feeBadge: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: c.primary,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: NEO_THEME.borders.radius,
      gap: 4,
      borderWidth: 1,
      borderColor: c.border,
    },
    feeText: {
      fontFamily: NEO_THEME.fonts.black,
      fontSize: 10,
      color: c.white,
    },
    statusBadge: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: c.greyLight,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: NEO_THEME.borders.radius,
      gap: 4,
      borderWidth: 1,
      borderColor: c.border,
    },
    statusText: {
      fontFamily: NEO_THEME.fonts.bold,
      fontSize: 10,
      color: c.black,
    },
  };
}
