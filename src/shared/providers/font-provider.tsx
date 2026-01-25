import React, { useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_900Black,
} from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import { NEO_THEME } from '../constants/neobrutalism';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

interface FontProviderProps {
  children: React.ReactNode;
}

/**
 * Font Provider - Loads Inter (body) and Poppins (display) fonts
 * per Brand Guidelines specification.
 * 
 * @see .agent/skills/brand-guidelines/SKILL.md
 */
export const FontProvider: React.FC<FontProviderProps> = ({ children }) => {
  const [fontsLoaded, fontError] = useFonts({
    // Inter - Body text (UI utility)
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    // Poppins - Display headlines (Personality areas)
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_900Black,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={NEO_THEME.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: NEO_THEME.colors.backgroundLight,
  },
});

export default FontProvider;
