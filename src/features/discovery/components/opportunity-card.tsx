import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
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

import { NuviaText } from '../../../components/atoms/nuvia-text';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import type { CreatorOpportunityFeedItem, OpportunityPreferenceState } from '../types';

type Props = {
  item: CreatorOpportunityFeedItem;
  reduceMotion: boolean;
  onAction: (state: OpportunityPreferenceState) => void;
  onDetails: () => void;
  compact?: boolean;
};

function daysLeft(deadline: string) {
  const ms = new Date(deadline).getTime() - Date.now();
  if (!Number.isFinite(ms)) return null;
  return Math.max(0, Math.ceil(ms / 86400000));
}

export function OpportunityCard({ item, reduceMotion, onAction, onDetails, compact }: Props) {
  const { width } = useWindowDimensions();
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const leaving = useSharedValue(false);
  const settled = useRef(false);
  const threshold = Math.min(110, width * 0.25);
  const competitive = item.contest_mode === 'competitive_pot';
  const eligible = Boolean(item.eligibility_proof_id && !item.eligibility_consumed);
  const remaining = daysLeft(item.deadline);
  const potLabel = competitive && item.pot_value != null
    ? `P${Number(item.pot_value).toFixed(0)} POT · TOP 5`
    : `P${Number(item.reward_value).toFixed(0)} VOUCHER`;

  useEffect(() => {
    settled.current = false;
    leaving.value = false;
    translateX.value = 0;
    translateY.value = 0;
  }, [item.opportunity_id, leaving, translateX, translateY]);

  const finish = (state: OpportunityPreferenceState) => {
    if (leaving.value || settled.current) return;
    leaving.value = true;
    settled.current = true;
    if (reduceMotion) {
      onAction(state);
      return;
    }
    translateX.value = withTiming(state === 'saved' ? width * 1.3 : -width * 1.3, { duration: 170 });
    setTimeout(() => onAction(state), 150);
  };

  const pan = Gesture.Pan()
    .runOnJS(true)
    .enabled(!compact)
    .activeOffsetX([-12, 12])
    .failOffsetY([-20, 20])
    .onUpdate(event => {
      if (leaving.value) return;
      translateX.value = event.translationX;
      translateY.value = event.translationY * 0.12;
    })
    .onEnd(event => {
      if (event.translationX > threshold) finish('saved');
      else if (event.translationX < -threshold) finish('dismissed');
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
  const saveStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, threshold], [0, 1], 'clamp'),
  }));
  const passStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-threshold, 0], [1, 0], 'clamp'),
  }));

  const body = (
    <Animated.View
      style={[styles.card, compact && styles.compactCard, !compact && cardStyle]}
      accessibilityLabel={`${item.opportunity_title} from ${item.merchant_name}`}
    >
      <Image source={{ uri: item.hero_image }} style={styles.image} contentFit="cover" transition={150} />
      <View style={styles.imageShade} />
      {!compact && (
        <>
          <Animated.View style={[styles.decisionStamp, styles.saveStamp, saveStyle]}>
            <NuviaText variant="h2">SAVE</NuviaText>
          </Animated.View>
          <Animated.View style={[styles.decisionStamp, styles.passStamp, passStyle]}>
            <NuviaText variant="h2">PASS</NuviaText>
          </Animated.View>
        </>
      )}

      <View style={styles.topRow}>
        <View style={styles.merchantBadge}>
          <Ionicons name="storefront" size={14} color={NEO_THEME.colors.white} />
          <NuviaText variant="caption" color={NEO_THEME.colors.white} numberOfLines={1} style={styles.merchantText}>
            {item.merchant_name} · {item.merchant_location}
          </NuviaText>
        </View>
        <View style={[styles.statusBadge, eligible && styles.eligibleBadge]}>
          <NuviaText variant="caption" style={styles.statusText}>
            {eligible ? 'READY TO ENTER' : 'BUY TO ENTER'}
          </NuviaText>
        </View>
      </View>

      <View style={styles.content}>
        <NuviaText variant="display" color={NEO_THEME.colors.white} numberOfLines={2} style={styles.title}>
          {item.opportunity_title || item.product_title}
        </NuviaText>
        <View style={styles.economics}>
          <View style={[styles.priceBadge, competitive && styles.potBadge]}>
            <NuviaText variant="bodyBold">{potLabel}</NuviaText>
          </View>
          {remaining != null && (
            <View style={styles.deadlineBadge}>
              <NuviaText variant="caption">{remaining}D LEFT</NuviaText>
            </View>
          )}
          <View style={styles.priceBadge}>
            <NuviaText variant="caption">FROM P{item.price.toFixed(0)}</NuviaText>
          </View>
        </View>
        <NuviaText variant="bodyBold" color={NEO_THEME.colors.white} numberOfLines={2} style={styles.brief}>
          {item.opportunity_description}
        </NuviaText>
        <View style={styles.explainer}>
          <Ionicons name={competitive ? 'trophy' : 'lock-closed'} size={15} color={NEO_THEME.colors.black} />
          <NuviaText variant="caption" style={styles.explainerText}>
            {competitive
              ? 'Buy a qualifying item, post the visit, climb the board. Saving does not enter you.'
              : 'Buying unlocks the TikTok opportunity. Saving does not.'}
          </NuviaText>
        </View>
        <Pressable accessibilityRole="button" onPress={onDetails} style={styles.detailsButton}>
          <NuviaText variant="bodyBold">{competitive ? 'VIEW CHALLENGE' : 'VIEW PRODUCT + BRIEF'}</NuviaText>
          <Ionicons name="arrow-forward" size={18} color={NEO_THEME.colors.black} />
        </Pressable>
        {!compact && (
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Pass for 30 days"
              onPress={() => finish('dismissed')}
              style={[styles.actionButton, styles.passButton]}
            >
              <Ionicons name="close" size={28} color={NEO_THEME.colors.black} />
              <NuviaText variant="caption">PASS 30D</NuviaText>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Save opportunity"
              onPress={() => finish('saved')}
              style={[styles.actionButton, styles.saveButton]}
            >
              <Ionicons name="heart" size={28} color={NEO_THEME.colors.black} />
              <NuviaText variant="caption">SAVE</NuviaText>
            </Pressable>
          </View>
        )}
      </View>
    </Animated.View>
  );

  if (compact) return body;
  return <GestureDetector gesture={pan}>{body}</GestureDetector>;
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 24,
    borderWidth: 3,
    borderColor: NEO_THEME.colors.black,
    backgroundColor: NEO_THEME.colors.black,
    boxShadow: '6px 6px 0px #000000',
  },
  compactCard: { flex: 0, minHeight: 420, marginBottom: 14 },
  image: { ...StyleSheet.absoluteFillObject },
  imageShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.36)' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, padding: 14 },
  merchantBadge: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: NEO_THEME.colors.black, borderWidth: 2, borderColor: NEO_THEME.colors.white, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 7 },
  merchantText: { flex: 1, fontFamily: NEO_THEME.fonts.bold },
  statusBadge: { backgroundColor: NEO_THEME.colors.secondary, borderWidth: 2, borderColor: NEO_THEME.colors.black, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 7 },
  eligibleBadge: { backgroundColor: NEO_THEME.colors.success },
  statusText: { fontFamily: NEO_THEME.fonts.bold, fontSize: 9 },
  content: { marginTop: 'auto', gap: 10, padding: 16 },
  title: { fontSize: 34, lineHeight: 37, textShadowColor: NEO_THEME.colors.black, textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 0 },
  economics: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  priceBadge: { backgroundColor: NEO_THEME.colors.white, borderWidth: 2, borderColor: NEO_THEME.colors.black, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 7 },
  potBadge: { backgroundColor: NEO_THEME.colors.secondary },
  deadlineBadge: { backgroundColor: NEO_THEME.colors.accent, borderWidth: 2, borderColor: NEO_THEME.colors.black, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 7 },
  brief: { textShadowColor: NEO_THEME.colors.black, textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 0 },
  explainer: { flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: NEO_THEME.colors.white, borderRadius: 10, borderWidth: 2, borderColor: NEO_THEME.colors.black, padding: 9 },
  explainerText: { flex: 1, fontFamily: NEO_THEME.fonts.bold },
  detailsButton: { minHeight: 46, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: NEO_THEME.colors.white, borderWidth: 2, borderColor: NEO_THEME.colors.black, borderRadius: 14, paddingHorizontal: 14 },
  actions: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
  actionButton: { minWidth: 108, minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, borderWidth: 2, borderColor: NEO_THEME.colors.black, borderRadius: 999 },
  passButton: { backgroundColor: NEO_THEME.colors.white },
  saveButton: { backgroundColor: NEO_THEME.colors.accent },
  decisionStamp: { position: 'absolute', top: 88, zIndex: 5, borderWidth: 4, borderColor: NEO_THEME.colors.black, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 },
  saveStamp: { left: 20, backgroundColor: NEO_THEME.colors.success, transform: [{ rotate: '-8deg' }] },
  passStamp: { right: 20, backgroundColor: NEO_THEME.colors.error, transform: [{ rotate: '8deg' }] },
});
