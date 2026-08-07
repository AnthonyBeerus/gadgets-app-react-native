/**
 * GemBalanceChip
 *
 * Displays current gem balance with quiet-commerce chrome.
 */
import React, { useEffect } from 'react';
import { Text, TouchableOpacity, View, type TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { useGemStore } from '../../../features/gems/store/gem-store';
import { useDesignTokens, useThemedStyles, fonts, radii, type DesignTokens, type SemanticColors } from '../../design-system';
import { TIMING_CONFIG } from '../../constants/animations';

function createStyles(c: SemanticColors, tokens: DesignTokens) {
  return {
    container: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: c.surface,
      borderRadius: radii.md,
      paddingHorizontal: 10,
      paddingVertical: 6,
      gap: 6,
      ...tokens.elevation.hairline,
    },
    text: {
      fontFamily: fonts.semibold,
      fontSize: 14,
      fontWeight: '600' as const,
      color: c.ink,
      fontVariant: ['tabular-nums'] as TextStyle['fontVariant'],
    },
    plusContainer: {
      backgroundColor: c.success,
      width: 18,
      height: 18,
      borderRadius: 4,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    },
  };
}

export const GemBalanceChip = () => {
  const styles = useThemedStyles(createStyles);
  const { colors } = useDesignTokens();
  const router = useRouter();
  const { balance, fetchBalance } = useGemStore();

  const scale = useSharedValue(1);

  useEffect(() => {
    fetchBalance();
  }, []);

  useEffect(() => {
    scale.value = withSequence(
      withTiming(1.05, TIMING_CONFIG.fast),
      withTiming(1, TIMING_CONFIG.normal)
    );
  }, [balance]);

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <TouchableOpacity onPress={() => router.push('/gem-shop')} activeOpacity={0.8}>
      <Animated.View style={[styles.container, rStyle]}>
        <Ionicons name="diamond" size={16} color={colors.warning} />
        <Text style={styles.text}>{balance.toLocaleString()}</Text>
        <View style={styles.plusContainer}>
          <Ionicons name="add" size={12} color={colors.surface} />
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};
