import React from 'react';
import { View, ViewStyle, StyleProp, StyleSheet } from 'react-native';
import { NEO_THEME } from '../../constants/neobrutalism';

interface NeoViewProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  shadowOffset?: number;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  hideShadow?: boolean;
}

export const NeoView = ({
  children,
  style,
  containerStyle,
  shadowOffset = 5,
  backgroundColor = NEO_THEME.colors.white,
  borderColor = NEO_THEME.colors.black,
  borderWidth = NEO_THEME.borders.width,
  hideShadow = false,
}: NeoViewProps) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {!hideShadow && (
        <View
          style={[
            styles.shadow,
            {
              top: shadowOffset,
              left: shadowOffset,
              backgroundColor: NEO_THEME.colors.black,
            },
          ]}
        />
      )}
      <View
        style={[
          styles.content,
          {
            backgroundColor,
            borderColor,
            borderWidth,
          },
          style,
        ]}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignSelf: 'flex-start', // KEY: Don't stretch to fill parent
  },
  shadow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  content: {
    zIndex: 1,
  },
});
