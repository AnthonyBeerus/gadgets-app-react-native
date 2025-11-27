import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NEO_THEME } from '../../constants/neobrutalism';

type InfoBoxType = 'info' | 'warning' | 'success' | 'error';

interface InfoBoxProps {
  message: string;
  type?: InfoBoxType;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function InfoBox({ message, type = 'info', icon }: InfoBoxProps) {
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
      <Ionicons name={boxStyles.icon} size={24} color={NEO_THEME.colors.black} />
      <Text style={styles.infoText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: NEO_THEME.colors.greyLight,
    padding: 16,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    gap: 12,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: NEO_THEME.colors.yellow,
    padding: 16,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    gap: 12,
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: NEO_THEME.colors.success,
    padding: 16,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    gap: 12,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: NEO_THEME.colors.error,
    padding: 16,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontFamily: NEO_THEME.fonts.regular,
    fontSize: 12,
    color: NEO_THEME.colors.black,
    lineHeight: 18,
  },
});
