import { ViewStyle } from 'react-native';
import type { SemanticColors } from './colors';
import { colors } from './colors';

export type ElevationLevel = 'none' | 'hairline' | 'soft';

export function resolveElevation(
  c: SemanticColors,
  mode: 'light' | 'dark' = 'light',
): Record<ElevationLevel, ViewStyle> {
  return {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
      borderWidth: 0,
    },
    hairline: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
      borderWidth: 1,
      borderColor: c.border,
    },
    soft: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: mode === 'dark' ? 0.35 : 0.08,
      shadowRadius: mode === 'dark' ? 6 : 8,
      elevation: 2,
      borderWidth: 1,
      borderColor: c.border,
    },
  };
}

/** @deprecated Prefer resolveElevation via DesignTokensProvider */
export const elevation: Record<ElevationLevel, ViewStyle> = resolveElevation(colors, 'light');
