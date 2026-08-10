import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useFonts } from 'expo-font';
import { Archivo_700Bold, Archivo_800ExtraBold, Archivo_900Black } from '@expo-google-fonts/archivo';
import { SpaceGrotesk_400Regular, SpaceGrotesk_500Medium, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import * as SplashScreen from 'expo-splash-screen';
import { useDesignTokens } from '../design-system';

void SplashScreen.preventAutoHideAsync();
export function FontProvider({ children }: { children: React.ReactNode }) {
  const { colors } = useDesignTokens();
  const [loaded, error] = useFonts({ Archivo_700Bold, Archivo_800ExtraBold, Archivo_900Black, SpaceGrotesk_400Regular, SpaceGrotesk_500Medium, SpaceGrotesk_700Bold });
  useEffect(() => {
    if (loaded || error) void SplashScreen.hideAsync();
  }, [loaded, error]);
  if (!loaded && !error) return <View style={[styles.loading,{backgroundColor:colors.canvas}]}><ActivityIndicator color={colors.ink}/></View>;
  return <View style={styles.root}>{children}</View>;
}
const styles=StyleSheet.create({root:{flex:1},loading:{flex:1,alignItems:'center',justifyContent:'center'}});
