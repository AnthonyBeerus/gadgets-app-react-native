import React from 'react';
import { Pressable, StyleSheet, type PressableProps } from 'react-native';
import { useDesignTokens } from '../theme/DesignTokensProvider';
export interface IconButtonProps extends PressableProps { children: React.ReactNode; accessibilityLabel: string; variant?: 'default' | 'payout' | 'quiet'; active?: boolean; }
export function IconButton({ children, variant = 'default', active, style, ...props }: IconButtonProps) {
  const t = useDesignTokens(); const tone = active ? 'payout' : variant;
  return <Pressable accessibilityRole="button" style={({ pressed }) => [styles.base, { borderColor: tone === 'quiet' ? t.colors.strokeDim : t.colors.stroke, backgroundColor: tone === 'payout' ? t.colors.payout : tone === 'quiet' ? 'transparent' : t.colors.surface, opacity: pressed ? .75 : 1, transform: [{ scale: pressed ? .98 : 1 }] }, style as any]} {...props}>{children}</Pressable>;
}
const styles = StyleSheet.create({ base: { width: 50, height: 50, borderWidth: 2, borderRadius: 0, alignItems: 'center', justifyContent: 'center' } });
