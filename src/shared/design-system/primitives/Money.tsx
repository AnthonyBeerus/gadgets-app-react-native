import React from 'react';
import { Text, type TextProps } from 'react-native';
import { useDesignTokens } from '../theme/DesignTokensProvider';
import { formatMoney, type MoneyFormat } from '../utils/money';
export interface MoneyProps extends TextProps { amount: number; format?: MoneyFormat; emphasis?: 'hero' | 'strong' | 'body'; }
export function Money({ amount, format = 'charge', emphasis = 'body', style, ...props }: MoneyProps) {
  const t = useDesignTokens();
  const typography = emphasis === 'hero' ? { fontFamily: t.fonts.displayBlack, fontSize: 30 } : emphasis === 'strong' ? { fontFamily: t.fonts.bold, fontSize: 16 } : { fontFamily: t.fonts.medium, fontSize: 14 };
  return <Text selectable style={[typography, { color: t.colors.ink, fontVariant: ['tabular-nums'] }, style]} {...props}>{formatMoney(amount, format)}</Text>;
}
