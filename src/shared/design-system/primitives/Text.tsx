import React from 'react';
import { Text as RNText, TextProps } from 'react-native';
import { useDesignTokens } from '../theme/DesignTokensProvider';
import type { TextVariant } from '../tokens/typography';

export interface MuseTextProps extends TextProps {
  variant?: TextVariant;
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  color?: string;
}

export const Text: React.FC<MuseTextProps> = ({
  variant = 'body',
  children,
  align = 'left',
  color,
  style,
  ...props
}) => {
  const { textVariants } = useDesignTokens();
  return (
    <RNText
      style={[
        textVariants[variant],
        { textAlign: align },
        color ? { color } : null,
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};
