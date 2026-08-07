import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useDesignTokens } from '../theme/DesignTokensProvider';
import { radii } from '../tokens/radii';
import { scale, timingConfig } from '../tokens/motion';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface IconButtonProps extends PressableProps {
  children: React.ReactNode;
  style?: ViewStyle;
  active?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  style,
  active = false,
  onPress,
  ...props
}) => {
  const { colors, elevation } = useDesignTokens();
  const pressScale = useSharedValue(scale.normal);
  const rStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  return (
    <AnimatedPressable
      style={[
        styles.button,
        {
          backgroundColor: colors.surface,
          ...elevation.hairline,
        },
        active && {
          backgroundColor: colors.accentMuted,
          borderColor: colors.accent,
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
      {children}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
  },
});
