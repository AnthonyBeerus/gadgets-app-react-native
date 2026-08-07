/**
 * @deprecated Use `Surface` from `shared/design-system`.
 */
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Surface } from '../../design-system';

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
  backgroundColor,
  hideShadow = false,
}: NeoViewProps) => {
  return (
    <Surface
      elevation={hideShadow ? 'none' : 'hairline'}
      backgroundColor={backgroundColor}
      style={[containerStyle, style]}
    >
      {children}
    </Surface>
  );
};
