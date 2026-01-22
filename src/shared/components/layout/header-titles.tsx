/**
 * Header Titles
 * 
 * Standardized Neubrutalist header titles to ensure consistency
 * across all screens.
 */
import React from 'react';
import { Text, StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import { NEO_THEME } from '../../constants/neobrutalism';

interface HeaderTitleProps {
  title: string;
  subtitle?: string;
  style?: TextStyle;
  containerStyle?: ViewStyle;
  children?: React.ReactNode;
}

export const SmallHeaderTitle: React.FC<HeaderTitleProps> = ({ 
  title, 
  style, 
  containerStyle, 
  children 
}) => (
  <View style={[styles.smallContainer, containerStyle]}>
    <Text style={[styles.smallTitle, style]} numberOfLines={1}>
      {title}
    </Text>
    {children}
  </View>
);

export const LargeHeaderTitle: React.FC<HeaderTitleProps> = ({ 
  title, 
  subtitle, 
  style, 
  containerStyle, 
  children 
}) => (
  <View style={[styles.largeContainer, containerStyle]}>
    <Text style={[styles.largeTitle, style]}>
      {title}
    </Text>
    {subtitle && (
      <Text style={styles.largeSubtitle}>
        {subtitle}
      </Text>
    )}
    {children}
  </View>
);

const styles = StyleSheet.create({
  smallContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  
  largeContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  largeTitle: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 28,
    color: NEO_THEME.colors.black,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 2,
    lineHeight: 34,
  },
  largeSubtitle: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 14,
    color: NEO_THEME.colors.grey,
    marginTop: 4,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
