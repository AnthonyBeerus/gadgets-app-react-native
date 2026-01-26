import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { NEO_THEME } from '../../constants/neobrutalism';

export interface NuviaTagProps {
  label: string;
  color?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

/**
 * NuviaTag
 * A small, sticker-like pill tag for categories, status, or price labels.
 */
export const NuviaTag: React.FC<NuviaTagProps> = ({
  label,
  color = NEO_THEME.colors.primary,
  style,
  textStyle,
  testID,
}) => {
  return (
    <View 
      testID={testID}
      style={[
        styles.container, 
        { backgroundColor: color }, 
        style
      ]}
    >
      <Text style={[styles.text, textStyle]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    borderWidth: 1.5, // Thinner than buttons for a "sticker" feel
    borderColor: NEO_THEME.colors.black,
    alignSelf: 'flex-start',
    // Minimal shadow for tags
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 1.5, height: 1.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  text: {
    fontSize: 12,
    fontWeight: '800',
    fontFamily: NEO_THEME.fonts.bold,
    color: NEO_THEME.colors.black, // Stickers usually have black text
    letterSpacing: 0.2,
  },
});
