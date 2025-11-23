import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from "react-native";
import { NEO_THEME } from "../../constants/neobrutalism";

interface NeoButtonProps extends TouchableOpacityProps {
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
  ...props
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case "primary":
        return NEO_THEME.colors.primary;
      case "secondary":
        return NEO_THEME.colors.yellow;
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

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        style,
      ]}
      activeOpacity={0.8}
      {...props}
    >
      {typeof children === "string" ? (
        <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
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
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: {
      width: NEO_THEME.shadows.hard.offsetX,
      height: NEO_THEME.shadows.hard.offsetY,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  text: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 16,
    fontWeight: "900",
    textTransform: "uppercase",
  },
});
