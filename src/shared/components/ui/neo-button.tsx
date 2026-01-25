/**
 * NeoButton
 * 
 * Neubrutalist button with smooth, refined press animations.
 * Uses withTiming for controlled, predictable motion.
 */
import React from "react";
import {
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Pressable,
  PressableProps,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { NEO_THEME } from "../../constants/neobrutalism";
import { TIMING_CONFIG, SCALE } from "../../constants/animations";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface NeoButtonProps extends PressableProps {
  variant?: "primary" | "secondary" | "outline";
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const NeoButton: React.FC<NeoButtonProps> = ({
  variant = "primary",
  children,
  style,
  textStyle,
  onPress,
  ...props
}) => {
  const scale = useSharedValue<number>(SCALE.normal);

  const getBackgroundColor = () => {
    switch (variant) {
      case "primary":
        return NEO_THEME.colors.primary;
      case "secondary":
        return NEO_THEME.colors.vibrantOrange;
      case "outline":
        return NEO_THEME.colors.white;
      default:
        return NEO_THEME.colors.primary;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case "outline":
        return NEO_THEME.colors.black;
      default:
        return NEO_THEME.colors.white;
    }
  };

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(SCALE.pressed, TIMING_CONFIG.fast);
  };

  const handlePressOut = () => {
    scale.value = withTiming(SCALE.normal, TIMING_CONFIG.normal);
  };

  return (
    <AnimatedPressable
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        rStyle,
        style,
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      {...props}
    >
      {typeof children === "string" ? (
        <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    alignItems: "center",
    justifyContent: "center",
    // Neubrutalist hard shadow
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  text: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
});
