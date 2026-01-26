import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { TextVariant, TEXT_VARIANTS } from '../../shared/theme/text-variants';

interface NuviaTextProps extends TextProps {
  variant?: TextVariant;
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  color?: string;
}

/**
 * NuviaText Atom
 * Strictly typed text component for the Nuvia design system.
 */
export const NuviaText: React.FC<NuviaTextProps> = ({
  variant = 'body',
  children,
  align = 'left',
  color,
  style,
  ...props
}) => {
  return (
    <RNText
      style={[
        TEXT_VARIANTS[variant],
        { textAlign: align },
        color ? { color } : {},
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};
