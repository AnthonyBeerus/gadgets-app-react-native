import { TextStyle } from 'react-native';
import type { SemanticColors } from './colors';
import { colors } from './colors';

/**
 * Calm UI type scale. Inter for UI; display weight via Inter bold (no dual neo voice).
 */
export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  /** Display alias — same family, heavier weight role */
  displaySemibold: 'Inter_600SemiBold',
  displayBold: 'Inter_700Bold',
  displayBlack: 'Inter_700Bold',
} as const;

export type TextVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body'
  | 'bodyBold'
  | 'label'
  | 'caption';

export function resolveTextVariants(c: SemanticColors): Record<TextVariant, TextStyle> {
  return {
    display: {
      fontFamily: fonts.displayBold,
      fontSize: 40,
      lineHeight: 48,
      letterSpacing: -0.5,
      color: c.ink,
    },
    h1: {
      fontFamily: fonts.displayBold,
      fontSize: 28,
      lineHeight: 36,
      letterSpacing: -0.3,
      color: c.ink,
    },
    h2: {
      fontFamily: fonts.semibold,
      fontSize: 22,
      lineHeight: 28,
      letterSpacing: -0.2,
      color: c.ink,
    },
    h3: {
      fontFamily: fonts.semibold,
      fontSize: 18,
      lineHeight: 24,
      color: c.ink,
    },
    body: {
      fontFamily: fonts.regular,
      fontSize: 16,
      lineHeight: 24,
      color: c.ink,
    },
    bodyBold: {
      fontFamily: fonts.semibold,
      fontSize: 16,
      lineHeight: 24,
      color: c.ink,
    },
    label: {
      fontFamily: fonts.medium,
      fontSize: 14,
      lineHeight: 20,
      color: c.ink,
    },
    caption: {
      fontFamily: fonts.regular,
      fontSize: 12,
      lineHeight: 18,
      color: c.inkMuted,
    },
  };
}

/** @deprecated Prefer resolveTextVariants via DesignTokensProvider */
export const textVariants: Record<TextVariant, TextStyle> = resolveTextVariants(colors);
