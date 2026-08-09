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

import {
  Text,
  fonts,
  radii,
  space,
  useDesignTokens,
  useThemedStyles,
  type DesignTokens,
  type SemanticColors,
} from '../../../shared/design-system';
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
  const { colors, elevation } = useDesignTokens();
  const styles = useThemedStyles(createStyles);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const leaving = useSharedValue(false);
  const settled = useRef(false);
  const threshold = Math.min(110, width * 0.25);
  const eligible = Boolean(item.eligibility_proof_id && !item.eligibility_consumed);
  const remaining = daysLeft(item.deadline);

  const potLine = `P${Number(item.pot_value ?? 0).toFixed(0)} prize pot`;

  const metaParts = [
    potLine,
    `P${Number(item.accepted_entry_fee).toFixed(0)} per accepted entry`,
    'Top 5 paid',
    remaining != null ? `${remaining}d left` : null,
    `From P${item.price.toFixed(0)}`,
  ].filter(Boolean);

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
      translateY.value = event.translationY * 0.08;
    })
    .onEnd(event => {
      if (event.translationX > threshold) finish('saved');
      else if (event.translationX < -threshold) finish('dismissed');
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
  const saveStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, threshold], [0, 1], 'clamp'),
  }));
  const passStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-threshold, 0], [1, 0], 'clamp'),
  }));

  const body = (
    <Animated.View
      style={[
        styles.card,
        elevation.soft,
        compact && styles.compactCard,
        !compact && cardStyle,
      ]}
      accessibilityLabel={`${item.opportunity_title} from ${item.merchant_name}`}
    >
      <View style={[styles.media, compact && styles.compactMedia]}>
        <Image source={{ uri: item.hero_image }} style={styles.image} contentFit="cover" transition={150} />
        {!compact && (
          <>
            <Animated.View style={[styles.decisionHint, styles.saveHint, saveStyle]}>
              <Text variant="caption" color={colors.ink} style={styles.decisionLabel}>
                Save
              </Text>
            </Animated.View>
            <Animated.View style={[styles.decisionHint, styles.passHint, passStyle]}>
              <Text variant="caption" color={colors.ink} style={styles.decisionLabel}>
                Pass
              </Text>
            </Animated.View>
          </>
        )}
      </View>

      <View style={styles.content}>
        <Text variant="caption" color={colors.inkMuted} numberOfLines={1}>
          {item.merchant_name}
          {item.merchant_location ? ` · ${item.merchant_location}` : ''}
        </Text>

        <Text variant="h2" numberOfLines={2} style={styles.title}>
          {item.opportunity_title || item.product_title}
        </Text>

        <View style={styles.metaRow}>
          <Text variant="caption" style={styles.potMeta} numberOfLines={1}>
            {metaParts.join(' · ')}
          </Text>
          <Text
            variant="caption"
            color={eligible ? colors.success : colors.inkMuted}
            style={styles.status}
          >
            {eligible ? 'Ready' : 'Buy to enter'}
          </Text>
        </View>

        {!!item.opportunity_description && (
          <Text variant="body" color={colors.inkMuted} numberOfLines={2} style={styles.brief}>
            {item.opportunity_description}
          </Text>
        )}

        <View style={styles.footer}>
          <Pressable
            accessibilityRole="button"
            onPress={onDetails}
            hitSlop={8}
            style={styles.detailsLink}
          >
            <Text variant="bodyBold">View opportunity</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.ink} />
          </Pressable>

          {!compact && (
            <View style={styles.actions}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Pass for 30 days"
                onPress={() => finish('dismissed')}
                style={styles.iconButton}
              >
                <Ionicons name="close" size={22} color={colors.ink} />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Save opportunity"
                onPress={() => finish('saved')}
                style={[styles.iconButton, styles.saveButton]}
              >
                <Ionicons name="bookmark-outline" size={20} color={colors.surface} />
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  );

  if (compact) return body;
  return <GestureDetector gesture={pan}>{body}</GestureDetector>;
}

function createStyles(c: SemanticColors, _tokens: DesignTokens) {
  return {
    card: {
      flex: 1,
      overflow: 'hidden' as const,
      borderRadius: radii.lg,
      backgroundColor: c.surface,
    },
    compactCard: {
      flex: 0,
      minHeight: 440,
      marginBottom: space.md,
    },
    media: {
      flex: 1.15,
      backgroundColor: c.gray100,
      minHeight: 180,
    },
    compactMedia: {
      flex: 0,
      height: 220,
    },
    image: {
      ...StyleSheet.absoluteFillObject,
    },
    content: {
      gap: space.xs,
      paddingHorizontal: space.md,
      paddingTop: space.md,
      paddingBottom: space.md,
    },
    title: {
      fontSize: 22,
      lineHeight: 28,
    },
    metaRow: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      gap: space.sm,
    },
    potMeta: {
      flex: 1,
      fontFamily: fonts.medium,
      color: c.ink,
    },
    status: {
      fontFamily: fonts.medium,
    },
    brief: {
      fontSize: 14,
      lineHeight: 20,
    },
    footer: {
      marginTop: space.xs,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      gap: space.md,
    },
    detailsLink: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 6,
      minHeight: 44,
    },
    actions: {
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
    saveButton: {
      backgroundColor: c.ink,
      borderColor: c.ink,
    },
    decisionHint: {
      position: 'absolute' as const,
      top: space.md,
      zIndex: 5,
      borderWidth: 1,
      borderColor: c.ink,
      backgroundColor: c.surface,
      borderRadius: radii.sm,
      paddingHorizontal: space.sm,
      paddingVertical: 6,
    },
    saveHint: {
      left: space.md,
    },
    passHint: {
      right: space.md,
    },
    decisionLabel: {
      fontFamily: fonts.semibold,
      letterSpacing: 0.4,
    },
  };
}
