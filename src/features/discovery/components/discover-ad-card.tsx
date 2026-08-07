import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import {
  Text,
  useDesignTokens,
  useThemedStyles,
  fonts,
  radii,
  space,
  type DesignTokens,
  type SemanticColors,
} from '../../../shared/design-system';
import type { DiscoverAdVariant } from '../deck';

type Props = {
  ad: DiscoverAdVariant;
  reduceMotion: boolean;
  onPass: () => void;
  onCta: () => void;
};

function createStyles(c: SemanticColors, tokens: DesignTokens) {
  return {
    card: {
      flex: 1,
      justifyContent: 'center' as const,
      gap: space.md,
      borderRadius: radii.lg,
      backgroundColor: c.surface,
      padding: space.lg,
      ...tokens.elevation.soft,
    },
    eyebrow: {
      fontFamily: fonts.medium,
    },
    headline: {
      fontSize: 28,
      lineHeight: 34,
    },
    body: {
      fontSize: 15,
      lineHeight: 22,
    },
    metrics: {
      flexDirection: 'row' as const,
      alignItems: 'stretch' as const,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: c.border,
      paddingVertical: space.md,
    },
    metric: {
      flex: 1,
      gap: 4,
    },
    metricDivider: {
      width: 1,
      backgroundColor: c.border,
      marginHorizontal: space.md,
    },
    footer: {
      marginTop: 'auto' as const,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: space.sm,
    },
    iconButton: {
      width: 44,
      height: 44,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      borderRadius: radii.md,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
    },
    cta: {
      flex: 1,
      minHeight: 44,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      borderRadius: radii.md,
      backgroundColor: c.ink,
      paddingHorizontal: space.md,
    },
  };
}

export function DiscoverAdCard({ ad, reduceMotion, onPass, onCta }: Props) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useDesignTokens();
  const { width } = useWindowDimensions();
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const leaving = useSharedValue(false);
  const settled = useRef(false);
  const threshold = Math.min(110, width * 0.25);

  useEffect(() => {
    settled.current = false;
    leaving.value = false;
    translateX.value = 0;
    translateY.value = 0;
  }, [ad.id, leaving, translateX, translateY]);

  const finish = (action: 'pass' | 'cta') => {
    if (leaving.value || settled.current) return;
    leaving.value = true;
    settled.current = true;
    const run = () => (action === 'pass' ? onPass() : onCta());
    if (reduceMotion) {
      run();
      return;
    }
    translateX.value = withTiming(action === 'cta' ? width * 1.3 : -width * 1.3, { duration: 170 });
    setTimeout(run, 150);
  };

  const pan = Gesture.Pan()
    .runOnJS(true)
    .activeOffsetX([-12, 12])
    .failOffsetY([-20, 20])
    .onUpdate(event => {
      if (leaving.value) return;
      translateX.value = event.translationX;
      translateY.value = event.translationY * 0.08;
    })
    .onEnd(event => {
      if (event.translationX > threshold) finish('cta');
      else if (event.translationX < -threshold) finish('pass');
      else {
        translateX.value = withSpring(0, { damping: 18, stiffness: 200 });
        translateY.value = withSpring(0, { damping: 18, stiffness: 200 });
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${interpolate(translateX.value, [-width, 0, width], [-5, 0, 5])}deg` },
    ],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.card, cardStyle]} accessibilityLabel={ad.headline}>
        <Text variant="caption" color={colors.inkMuted} style={styles.eyebrow}>
          {ad.eyebrow}
        </Text>

        <Text variant="h1" style={styles.headline}>
          {ad.headline}
        </Text>
        <Text variant="body" color={colors.inkMuted} style={styles.body}>
          {ad.body}
        </Text>

        <View style={styles.metrics}>
          <View style={styles.metric}>
            <Text variant="h2">{ad.metricPrimary}</Text>
            <Text variant="caption" color={colors.inkMuted}>
              {ad.metricPrimaryLabel}
            </Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metric}>
            <Text variant="h2">{ad.metricSecondary}</Text>
            <Text variant="caption" color={colors.inkMuted}>
              {ad.metricSecondaryLabel}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Pass ad"
            onPress={() => finish('pass')}
            style={styles.iconButton}
          >
            <Ionicons name="close" size={22} color={colors.ink} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={ad.cta}
            onPress={() => finish('cta')}
            style={styles.cta}
          >
            <Text variant="bodyBold" color={colors.surface}>
              {ad.cta}
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}
