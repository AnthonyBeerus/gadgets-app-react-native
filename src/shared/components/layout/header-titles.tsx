/**
 * Header Titles
 * 
 * Standardized Neubrutalist header titles to ensure consistency
 * across all screens.
 */
import React from 'react';
import { Text, View, ViewStyle, TextStyle } from 'react-native';
import { NEO_THEME } from '../../constants/neobrutalism';
import { useNeoStyles } from '../../hooks/useNeoStyles';

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
}) => {
  const styles = useNeoStyles(createStyles);
  return (
    <View style={[styles.smallContainer, containerStyle]}>
      <Text style={[styles.smallTitle, style]} numberOfLines={1}>
        {title}
      </Text>
      {children}
    </View>
  );
};

export const LargeHeaderTitle: React.FC<HeaderTitleProps> = ({ 
  title, 
  subtitle, 
  style, 
  containerStyle, 
  children 
}) => {
  const styles = useNeoStyles(createStyles);
  return (
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
};

function createStyles(c: { black: string; grey: string }) {
  return {
    smallContainer: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
    },
    smallTitle: {
      fontSize: 15,
      fontWeight: '600' as const,
      color: c.black,
      fontFamily: NEO_THEME.fonts.black,
      textTransform: 'uppercase' as const,
      letterSpacing: 2,
    },
    largeContainer: {
      flexDirection: 'column' as const,
      alignItems: 'flex-start' as const,
    },
    largeTitle: {
      fontFamily: NEO_THEME.fonts.black,
      fontSize: 28,
      color: c.black,
      fontWeight: '600' as const,
      textTransform: 'uppercase' as const,
      letterSpacing: 2,
      lineHeight: 34,
    },
    largeSubtitle: {
      fontFamily: NEO_THEME.fonts.bold,
      fontSize: 14,
      color: c.grey,
      marginTop: 4,
      fontWeight: '700' as const,
      letterSpacing: 0.5,
    },
  };
}
