import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '../providers/theme-provider';
import type { Theme } from '../constants/theme';

type NeoColors = Theme['colors'];

/**
 * StyleSheet factory driven by remapped light/dark NEO theme colors.
 * Pass a module-level factory for a stable reference.
 */
export function useNeoStyles<T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>>(
  factory: (colors: NeoColors, theme: Theme) => T,
): T {
  const { theme } = useTheme();
  return useMemo(
    () => StyleSheet.create(factory(theme.colors, theme)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme],
  );
}
