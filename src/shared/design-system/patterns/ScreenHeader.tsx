import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Text } from '../primitives/Text';
import { useDesignTokens } from '../theme/DesignTokensProvider';
import { space } from '../tokens/space';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export interface ScreenHeaderProps {
  /** `stack` = back + title (+ optional step counter). `brand` = emblem + wordmark for tab roots. */
  variant?: 'stack' | 'brand';
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  /** Renders `STEP n / total` on the trailing edge of a stack header. */
  step?: { current: number; total: number };
  right?: React.ReactNode;
  style?: ViewStyle;
  onBack?: () => void;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  variant = 'stack',
  title,
  subtitle,
  showBack = true,
  step,
  right,
  style,
  onBack,
}) => {
  const router = useRouter();
  const { colors } = useDesignTokens();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    if (router.canGoBack()) {
      router.back();
    }
  };

  const brand = variant === 'brand';

  return (
    <View
      style={[
        styles.wrap,
        {
          paddingTop: space.xs,
          backgroundColor: colors.canvas,
          borderBottomColor: colors.stroke,
        },
        style,
      ]}
    >
      <View style={styles.row}>
        {brand ? (
          <View style={styles.brand}>
            <View style={[styles.mark, { borderColor: colors.stroke }]}>
              <Image
                source={require('../../../../assets/adaptive-icon.png')}
                style={styles.emblem}
                contentFit="cover"
              />
            </View>
            <Text variant="h2">{title ?? 'Muse'}</Text>
          </View>
        ) : (
          <>
            {showBack ? (
              <Pressable
                onPress={handleBack}
                hitSlop={12}
                style={styles.back}
                accessibilityRole="button"
                accessibilityLabel="Go back"
              >
                <Ionicons name="chevron-back" size={24} color={colors.ink} />
              </Pressable>
            ) : (
              <View style={styles.backSpacer} />
            )}
            <View style={styles.titleBlock}>
              {title ? (
                <Text variant="h3" numberOfLines={1}>
                  {title}
                </Text>
              ) : null}
              {subtitle ? (
                <Text variant="caption" numberOfLines={1}>
                  {subtitle}
                </Text>
              ) : null}
            </View>
          </>
        )}
        <View style={styles.right}>
          {step ? (
            <Text variant="label" color={colors.inkMuted}>
              Step {step.current} / {step.total}
            </Text>
          ) : null}
          {right}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: space.md,
    paddingBottom: space.sm,
    borderBottomWidth: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
  },
  brand: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  mark: {
    width: 36,
    height: 36,
    borderWidth: 2,
    overflow: 'hidden',
  },
  // The emblem ships with built-in padding; crop to its centre so the mark fills the square.
  emblem: {
    width: 104,
    height: 104,
    marginLeft: -36,
    marginTop: -34,
  },
  back: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: space.xxs,
  },
  backSpacer: {
    width: 8,
  },
  titleBlock: {
    flex: 1,
  },
  right: {
    marginLeft: space.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
});
