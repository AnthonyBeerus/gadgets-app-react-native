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

export interface NuviaButtonProps extends PressableProps {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const NuviaButton: React.FC<NuviaButtonProps> = ({
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
        return NEO_THEME.colors.secondary; // Updated to use theme secondary (Yellow)
      case "outline":
      case "ghost":
        return NEO_THEME.colors.white;
      default:
        return NEO_THEME.colors.primary;
    }
  };

  const getBorderColor = () => {
     if (variant === 'ghost') return 'transparent';
     return NEO_THEME.colors.black;
  };

  const getTextColor = () => {
    switch (variant) {
      case "outline":
      case "ghost":
        return NEO_THEME.colors.black;
        case "secondary":
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
        { 
            backgroundColor: getBackgroundColor(),
            borderColor: getBorderColor(),
            // Remove hard shadow for ghost, keep for others
            elevation: variant === 'ghost' ? 0 : 4,
            shadowOpacity: variant === 'ghost' ? 0 : 1,
        },
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
    paddingVertical: 14, // Slightly tighter vertical padding for pills
    paddingHorizontal: 28,
    borderWidth: NEO_THEME.borders.width,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999, // Pill Shape
    // Neubrutalist hard shadow
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowRadius: 0,
  },
  text: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
});
