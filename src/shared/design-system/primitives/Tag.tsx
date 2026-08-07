import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useDesignTokens } from '../theme/DesignTokensProvider';
import { fonts } from '../tokens/typography';
import { radii } from '../tokens/radii';
import { space } from '../tokens/space';
import type { SemanticColors } from '../tokens/colors';

export type TagTone = 'neutral' | 'accent' | 'success' | 'warning' | 'error';

export interface TagProps {
  label: string;
  tone?: TagTone;
  /** @deprecated Prefer tone; kept for migration from NuviaTag color prop */
  color?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

function resolveToneBg(tone: TagTone, c: SemanticColors, isDark: boolean): string {
  switch (tone) {
    case 'neutral':
      return c.gray100;
    case 'accent':
      return c.accentMuted;
    case 'success':
      return isDark ? '#14532D' : '#DCFCE7';
    case 'warning':
      return isDark ? '#713F12' : '#FEF3C7';
    case 'error':
      return isDark ? '#7F1D1D' : '#FEE2E2';
    default:
      return c.gray100;
  }
}

function resolveToneText(tone: TagTone, c: SemanticColors): string {
  switch (tone) {
    case 'neutral':
      return c.ink;
    case 'accent':
      return c.accent;
    case 'success':
      return c.success;
    case 'warning':
      return c.warning;
    case 'error':
      return c.error;
    default:
      return c.ink;
  }
}

export const Tag: React.FC<TagProps> = ({
  label,
  tone = 'neutral',
  color,
  style,
  textStyle,
  testID,
}) => {
  const { colors, mode } = useDesignTokens();
  const backgroundColor = color ?? resolveToneBg(tone, colors, mode === 'dark');
  const textColor = color ? colors.ink : resolveToneText(tone, colors);

  return (
    <View
      testID={testID}
      style={[styles.container, { backgroundColor }, style]}
    >
      <Text style={[styles.text, { color: textColor }, textStyle]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
    borderRadius: radii.sm,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontFamily: fonts.medium,
    letterSpacing: 0.1,
  },
});
