import React, { useMemo } from 'react';
import {
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Pressable,
  PressableProps,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useDesignTokens } from '../theme/DesignTokensProvider';
import { fonts } from '../tokens/typography';
import { radii } from '../tokens/radii';
import { space } from '../tokens/space';
import { scale, timingConfig } from '../tokens/motion';
import type { SemanticColors } from '../tokens/colors';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';

export interface ButtonProps extends PressableProps {
  variant?: ButtonVariant;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

function backgroundFor(variant: ButtonVariant, c: SemanticColors): string {
  switch (variant) {
    case 'primary':
      return c.ink;
    case 'secondary':
      return c.gray100;
    case 'accent':
      return c.accent;
    case 'outline':
    case 'ghost':
      return 'transparent';
    default:
      return c.ink;
  }
}

function borderFor(variant: ButtonVariant, c: SemanticColors): string {
  switch (variant) {
    case 'ghost':
      return 'transparent';
    case 'outline':
    case 'secondary':
      return c.border;
    default:
      return 'transparent';
  }
}

function textFor(variant: ButtonVariant, c: SemanticColors): string {
  switch (variant) {
    case 'primary':
    case 'accent':
      return c.surface;
    default:
      return c.ink;
  }
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  style,
  textStyle,
  onPress,
  ...props
}) => {
  const { colors } = useDesignTokens();
  const pressScale = useSharedValue(scale.normal);

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  const styles = useMemo(
    () =>
      StyleSheet.create({
        button: {
          paddingVertical: space.sm + 2,
          paddingHorizontal: space.lg,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: radii.md,
          minHeight: 48,
        },
        text: {
          fontFamily: fonts.semibold,
          fontSize: 16,
          letterSpacing: -0.1,
        },
      }),
    [],
  );

  return (
    <AnimatedPressable
      style={[
        styles.button,
        {
          backgroundColor: backgroundFor(variant, colors),
          borderColor: borderFor(variant, colors),
          borderWidth: variant === 'ghost' ? 0 : 1,
        },
        rStyle,
        style,
      ]}
      onPressIn={() => {
        pressScale.value = withTiming(scale.pressed, timingConfig.fast);
      }}
      onPressOut={() => {
        pressScale.value = withTiming(scale.normal, timingConfig.normal);
      }}
      onPress={onPress}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text style={[styles.text, { color: textFor(variant, colors) }, textStyle]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </AnimatedPressable>
  );
};
