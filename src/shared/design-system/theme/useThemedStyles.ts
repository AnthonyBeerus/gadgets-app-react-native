import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useDesignTokens } from './DesignTokensProvider';
import type { DesignTokens, SemanticColors } from '../tokens';

/**
 * Build StyleSheet from live design tokens so dark/light remaps apply.
 * Pass a module-level factory for a stable reference.
 */
export function useThemedStyles<T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>>(
  factory: (colors: SemanticColors, tokens: DesignTokens) => T,
): T {
  const tokens = useDesignTokens();
  return useMemo(
    () => StyleSheet.create(factory(tokens.colors, tokens)),
    // factory should be module-stable; tokens identity changes with mode
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tokens],
  );
}
