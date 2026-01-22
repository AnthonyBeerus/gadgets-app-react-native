import React from "react";
import { 
  TextInput, 
  View, 
  StyleSheet, 
  TextInputProps, 
  StyleProp, 
  ViewStyle, 
  TextStyle 
} from "react-native";
import { NEO_THEME } from "../../constants/neobrutalism";

interface NuviaInputProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const NuviaInput: React.FC<NuviaInputProps> = ({
  containerStyle,
  inputStyle,
  leftIcon,
  rightIcon,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
      <TextInput
        style={[styles.input, inputStyle]}
        placeholderTextColor={NEO_THEME.colors.grey}
        {...props}
      />
      {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: NEO_THEME.colors.white,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    borderRadius: 24, // Pill shape
    paddingHorizontal: 16,
    // Hard Shadow
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: NEO_THEME.fonts.regular,
    fontSize: 14,
    color: NEO_THEME.colors.black,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});
