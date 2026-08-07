import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NEO_THEME } from '../../constants/neobrutalism';
import { useNeoStyles } from '../../hooks/useNeoStyles';
import { useTheme } from '../../providers/theme-provider';

type InfoBoxType = 'info' | 'warning' | 'success' | 'error';

interface InfoBoxProps {
  message: string;
  type?: InfoBoxType;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function InfoBox({ message, type = 'info', icon }: InfoBoxProps) {
  const styles = useNeoStyles(createStyles);
  const { theme } = useTheme();
  const c = theme.colors;

  const getStyles = () => {
    switch (type) {
      case 'warning':
        return {
          container: styles.warningBox,
          icon: icon || 'information-circle',
        };
      case 'success':
        return {
          container: styles.successBox,
          icon: icon || 'checkmark-circle',
        };
      case 'error':
        return {
          container: styles.errorBox,
          icon: icon || 'alert-circle',
        };
      default:
        return {
          container: styles.infoBox,
          icon: icon || 'information-circle',
        };
    }
  };

  const boxStyles = getStyles();

  return (
    <View style={boxStyles.container}>
      <Ionicons name={boxStyles.icon} size={24} color={c.black} />
      <Text style={styles.infoText}>{message}</Text>
    </View>
  );
}

function createStyles(c: {
  black: string;
  greyLight: string;
  yellow: string;
  success: string;
  error: string;
  border: string;
}) {
  return {
    infoBox: {
      flexDirection: 'row' as const,
      alignItems: 'flex-start' as const,
      backgroundColor: c.greyLight,
      padding: 16,
      borderRadius: NEO_THEME.borders.radius,
      borderWidth: 1,
      borderColor: c.border,
      gap: 12,
    },
    warningBox: {
      flexDirection: 'row' as const,
      alignItems: 'flex-start' as const,
      backgroundColor: c.yellow,
      padding: 16,
      borderRadius: NEO_THEME.borders.radius,
      borderWidth: 1,
      borderColor: c.border,
      gap: 12,
    },
    successBox: {
      flexDirection: 'row' as const,
      alignItems: 'flex-start' as const,
      backgroundColor: c.success,
      padding: 16,
      borderRadius: NEO_THEME.borders.radius,
      borderWidth: 1,
      borderColor: c.border,
      gap: 12,
    },
    errorBox: {
      flexDirection: 'row' as const,
      alignItems: 'flex-start' as const,
      backgroundColor: c.error,
      padding: 16,
      borderRadius: NEO_THEME.borders.radius,
      borderWidth: 1,
      borderColor: c.border,
      gap: 12,
    },
    infoText: {
      flex: 1,
      fontFamily: NEO_THEME.fonts.regular,
      fontSize: 12,
      color: c.black,
      lineHeight: 18,
    },
  };
}
