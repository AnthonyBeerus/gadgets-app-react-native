import React, { useState } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import { useDesignTokens } from '../theme/DesignTokensProvider';
import { Text } from './Text';

export interface InputProps extends TextInputProps { label?: string; error?: string; leftIcon?: React.ReactNode; rightIcon?: React.ReactNode; containerStyle?: any; inputStyle?: any; }
export function Input({ label, error, leftIcon, rightIcon, containerStyle, inputStyle, onFocus, onBlur, ...props }: InputProps) {
  const t = useDesignTokens(); const [focused, setFocused] = useState(false);
  return <View style={[styles.group, containerStyle]}>
    {label ? <Text variant="label">{label}</Text> : null}
    <View style={[styles.field, { backgroundColor: t.colors.surface, borderColor: error ? t.colors.danger : t.colors.stroke }, focused && { borderWidth: 3, borderColor: t.colors.creator }]}>
      {leftIcon}<TextInput {...props} placeholderTextColor={t.colors.placeholder} style={[styles.input, { color: t.colors.ink }, inputStyle]}
        onFocus={e => { setFocused(true); onFocus?.(e); }} onBlur={e => { setFocused(false); onBlur?.(e); }} />{rightIcon}
    </View>
    {error ? <Text variant="caption" color={t.colors.danger}>{error}</Text> : null}
  </View>;
}
const styles = StyleSheet.create({ group: { gap: 6 }, field: { minHeight: 50, borderWidth: 2, borderRadius: 0, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 8 }, input: { flex: 1, height: 48, fontFamily: 'SpaceGrotesk_400Regular', fontSize: 15 } });
