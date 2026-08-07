import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, lightTheme, darkTheme } from '../constants/theme';

const STORAGE_KEY = 'user-theme-preference';

export type ThemePreference = 'system' | 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  isDark: boolean;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  /** Cycles light → dark → system for quick toggles */
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDark: false,
  preference: 'system',
  setPreference: () => {},
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

function resolveIsDark(preference: ThemePreference, systemScheme: string | null | undefined) {
  if (preference === 'light') return false;
  if (preference === 'dark') return true;
  return systemScheme === 'dark';
}

/** Exported for unit tests */
export { resolveIsDark };

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved === 'light' || saved === 'dark' || saved === 'system') {
          setPreferenceState(saved);
        } else if (saved === 'true' || saved === 'false') {
          // Legacy boolean-ish values from earlier toggleTheme
          setPreferenceState(saved === 'true' ? 'dark' : 'light');
        }
      } catch (e) {
        console.warn('Failed to load theme preference', e);
      } finally {
        setHydrated(true);
      }
    };
    loadTheme();
  }, []);

  const setPreference = useCallback(async (next: ThemePreference) => {
    setPreferenceState(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, next);
    } catch (e) {
      console.warn('Failed to save theme preference', e);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const order: ThemePreference[] = ['light', 'dark', 'system'];
    const idx = order.indexOf(preference);
    const next = order[(idx + 1) % order.length];
    setPreference(next);
  }, [preference, setPreference]);

  const isDark = resolveIsDark(preference, systemScheme);
  const theme = useMemo(() => (isDark ? darkTheme : lightTheme), [isDark]);

  const value = useMemo(
    () => ({
      theme,
      isDark,
      preference: hydrated ? preference : 'system',
      setPreference,
      toggleTheme,
    }),
    [theme, isDark, preference, hydrated, setPreference, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
