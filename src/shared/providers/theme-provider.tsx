import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, lightTheme, darkTheme } from '../constants/theme';
// but for now we'll just handle JS-side theming.

type ThemeContextType = {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === 'dark');

  useEffect(() => {
    // Load persisted preference
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('user-theme-preference');
        if (savedTheme) {
          setIsDark(savedTheme === 'dark');
        } else {
          setIsDark(systemScheme === 'dark');
        }
      } catch (e) {
        console.warn('Failed to load theme preference', e);
      }
    };
    loadTheme();
  }, []); // Run once on mount

  useEffect(() => {
    // Update when system changes (if no override? logic can be complex. 
    // Simplified: If user hasn't set custom, follow system. 
    // For MVP, just initial load + manual toggle is sufficient, 
    // or listening to system if user wants 'auto'.
    // Here we'll just let manual toggle override everything)
  }, [systemScheme]);

  const toggleTheme = async () => {
    const newMode = !isDark;
    setIsDark(newMode);
    try {
      await AsyncStorage.setItem('user-theme-preference', newMode ? 'dark' : 'light');
    } catch (e) {
      console.warn('Failed to save theme preference', e);
    }
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
