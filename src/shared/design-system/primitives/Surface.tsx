import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useDesignTokens } from '../theme/DesignTokensProvider';
import { radii } from '../tokens/radii';
import type { ElevationLevel } from '../tokens/elevation';

export interface SurfaceProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  elevation?: ElevationLevel;
  backgroundColor?: string;
}

/** Flat surface — replaces NeoView hard-shadow boxes */
export const Surface: React.FC<SurfaceProps> = ({
  children,
  style,
  elevation: level = 'hairline',
  backgroundColor,
}) => {
  const { colors, elevation } = useDesignTokens();
  return (
    <View
      style={[
        styles.base,
        { backgroundColor: backgroundColor ?? colors.surface },
        elevation[level],
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.lg,
    overflow: 'hidden',
  },
});
