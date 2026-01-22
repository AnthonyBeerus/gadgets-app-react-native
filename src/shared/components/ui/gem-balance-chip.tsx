/**
 * GemBalanceChip
 * 
 * Displays current gem balance with smooth, refined animations.
 * Brand Guidelines: Gem Economy Visibility - balance always visible.
 * Animation: Smooth withTiming pulse on balance change.
 */
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSequence, 
  withTiming,
} from 'react-native-reanimated';

import { useGemStore } from '../../../features/gems/store/gem-store';
import { NEO_THEME } from '../../constants/neobrutalism';
import { DURATION, TIMING_CONFIG } from '../../constants/animations';

export const GemBalanceChip = () => {
  const router = useRouter();
  const { balance, fetchBalance } = useGemStore();
  
  const scale = useSharedValue(1);

  useEffect(() => {
    fetchBalance();
  }, []);

  // Smooth pulse animation on balance change
  useEffect(() => {
    scale.value = withSequence(
      withTiming(1.05, TIMING_CONFIG.fast),
      withTiming(1, TIMING_CONFIG.normal)
    );
  }, [balance]);

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    router.push('/gem-shop');
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Animated.View style={[styles.container, rStyle]}>
        <Ionicons name="diamond" size={16} color={NEO_THEME.colors.gemGold} />
        <Text style={styles.text}>{balance.toLocaleString()}</Text>
        <View style={styles.plusContainer}>
          <Ionicons name="add" size={12} color={NEO_THEME.colors.white} />
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NEO_THEME.colors.white,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
    // Neubrutalist hard shadow
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  text: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 14,
    fontWeight: '700',
    color: NEO_THEME.colors.black,
    fontVariant: ['tabular-nums'],
  },
  plusContainer: {
    backgroundColor: NEO_THEME.colors.success,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
  }
});
