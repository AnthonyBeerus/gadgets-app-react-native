import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useEffect, useRef } from 'react';
import { useWindowDimensions } from 'react-native';

import { NuviaText } from '../../../components/atoms/nuvia-text';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import type { DiscoverAdVariant } from '../deck';

type Props = {
  ad: DiscoverAdVariant;
  reduceMotion: boolean;
  onPass: () => void;
  onCta: () => void;
};

export function DiscoverAdCard({ ad, reduceMotion, onPass, onCta }: Props) {
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
      translateY.value = event.translationY * 0.12;
    })
    .onEnd(event => {
      if (event.translationX > threshold) finish('cta');
      else if (event.translationX < -threshold) finish('pass');
      else {
        translateX.value = withSpring(0, { damping: 16, stiffness: 180 });
        translateY.value = withSpring(0, { damping: 16, stiffness: 180 });
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${interpolate(translateX.value, [-width, 0, width], [-8, 0, 8])}deg` },
    ],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.card, cardStyle]} accessibilityLabel={ad.headline}>
        <View style={styles.glow} />
        <View style={styles.topRow}>
          <View style={styles.sponsored}>
            <Ionicons name="megaphone" size={14} color={NEO_THEME.colors.black} />
            <NuviaText variant="caption" style={styles.sponsoredText}>{ad.eyebrow}</NuviaText>
          </View>
          <View style={styles.valueBadge}>
            <NuviaText variant="caption" style={styles.valueText}>AD SLOT</NuviaText>
          </View>
        </View>

        <NuviaText variant="display" style={styles.headline}>{ad.headline}</NuviaText>
        <NuviaText variant="body" style={styles.body}>{ad.body}</NuviaText>

        <View style={styles.metrics}>
          <View style={styles.metric}>
            <NuviaText variant="h1" style={styles.metricValue}>{ad.metricPrimary}</NuviaText>
            <NuviaText variant="caption">{ad.metricPrimaryLabel}</NuviaText>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metric}>
            <NuviaText variant="h1" style={styles.metricValue}>{ad.metricSecondary}</NuviaText>
            <NuviaText variant="caption">{ad.metricSecondaryLabel}</NuviaText>
          </View>
        </View>

        <View style={styles.pitch}>
          <Ionicons name="flash" size={16} color={NEO_THEME.colors.black} />
          <NuviaText variant="caption" style={styles.pitchText}>
            Showcase: this card is what merchants buy — placement in the same deck as live pots.
          </NuviaText>
        </View>

        <View style={styles.actions}>
          <Pressable accessibilityRole="button" accessibilityLabel="Pass ad" onPress={() => finish('pass')} style={[styles.actionButton, styles.passButton]}>
            <Ionicons name="close" size={28} color={NEO_THEME.colors.black} />
            <NuviaText variant="caption">PASS</NuviaText>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel={ad.cta} onPress={() => finish('cta')} style={[styles.actionButton, styles.ctaButton]}>
            <Ionicons name="storefront" size={24} color={NEO_THEME.colors.black} />
            <NuviaText variant="caption">{ad.cta.toUpperCase()}</NuviaText>
          </Pressable>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 24,
    borderWidth: 3,
    borderColor: NEO_THEME.colors.black,
    backgroundColor: NEO_THEME.colors.secondary,
    padding: 18,
    gap: 14,
    boxShadow: '6px 6px 0px #000000',
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: NEO_THEME.colors.accent,
    opacity: 0.22,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  sponsored: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: NEO_THEME.colors.white,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  sponsoredText: { flex: 1, fontFamily: NEO_THEME.fonts.bold },
  valueBadge: {
    backgroundColor: NEO_THEME.colors.black,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  valueText: { color: NEO_THEME.colors.secondary, fontFamily: NEO_THEME.fonts.bold },
  headline: { fontSize: 34, lineHeight: 36, color: NEO_THEME.colors.black },
  body: { color: NEO_THEME.colors.dark },
  metrics: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: NEO_THEME.colors.white,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
    borderRadius: 18,
    paddingVertical: 14,
  },
  metric: { flex: 1, alignItems: 'center', gap: 4, paddingHorizontal: 8 },
  metricValue: { fontSize: 28, lineHeight: 30 },
  metricDivider: { width: 2, backgroundColor: NEO_THEME.colors.black },
  pitch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: NEO_THEME.colors.white,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
    borderRadius: 12,
    padding: 10,
  },
  pitchText: { flex: 1, fontFamily: NEO_THEME.fonts.bold },
  actions: { marginTop: 'auto', flexDirection: 'row', justifyContent: 'center', gap: 16 },
  actionButton: {
    minWidth: 120,
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
    borderRadius: 999,
  },
  passButton: { backgroundColor: NEO_THEME.colors.white },
  ctaButton: { backgroundColor: NEO_THEME.colors.mint },
});
