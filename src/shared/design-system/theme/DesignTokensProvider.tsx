import React, { createContext, useContext, useMemo } from 'react';
import { useTheme } from '../../providers/theme-provider';
import {
  designTokens,
  resolveDesignTokens,
  type DesignTokens,
} from '../tokens';

const DesignTokensContext = createContext<DesignTokens>(designTokens);

export const DesignTokensProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isDark } = useTheme();
  const value = useMemo(
    () => resolveDesignTokens(isDark ? 'dark' : 'light'),
    [isDark],
  );
  return (
    <DesignTokensContext.Provider value={value}>
      {children}
    </DesignTokensContext.Provider>
  );
};

/** DIP: screens depend on tokens via this hook, not NEO_THEME literals. */
export function useDesignTokens(): DesignTokens {
  return useContext(DesignTokensContext);
}
