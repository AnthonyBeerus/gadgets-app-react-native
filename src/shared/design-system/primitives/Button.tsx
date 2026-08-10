import React from 'react';
import { ActivityIndicator, Pressable, type PressableProps, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useDesignTokens } from '../theme/DesignTokensProvider';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
export type ButtonVariant = 'primary' | 'commerce' | 'secondary' | 'outline' | 'ghost' | 'accent';
export interface ButtonProps extends PressableProps { variant?: ButtonVariant; children: React.ReactNode; loading?: boolean; disabledReason?: string; }

/**
 * A Button is two boxes: an outer wrapper that also carries the disabled reason,
 * and the key itself. Callers style the *button*, so anything that positions the
 * component in its parent (`flex`, `alignSelf`, margins, absolute placement) has
 * to move to the wrapper — otherwise `style={{flex:1}}` in a pinned bar lands on
 * the inner pressable and the key collapses to its label width.
 */
const LAYOUT_KEYS = [
  'flex', 'flexGrow', 'flexShrink', 'flexBasis', 'alignSelf', 'width', 'maxWidth', 'minWidth',
  'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight',
  'marginHorizontal', 'marginVertical', 'marginStart', 'marginEnd',
  'position', 'top', 'bottom', 'left', 'right', 'start', 'end', 'zIndex',
] as const;

function splitLayout(style: ButtonProps['style']): { outer: ViewStyle; inner: ViewStyle } {
  const flat = (StyleSheet.flatten(style as ViewStyle) ?? {}) as Record<string, unknown>;
  const outer: Record<string, unknown> = {};
  const inner: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(flat)) {
    if ((LAYOUT_KEYS as readonly string[]).includes(key)) outer[key] = value;
    else inner[key] = value;
  }
  return { outer: outer as ViewStyle, inner: inner as ViewStyle };
}

export function Button({ variant = 'primary', children, loading = false, disabled, disabledReason, style, ...props }: ButtonProps) {
  const t = useDesignTokens();
  const pressed = useSharedValue(1);
  const [down, setDown] = React.useState(false);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: pressed.value }] }));
  const semantic = variant === 'outline' ? 'secondary' : variant === 'accent' ? 'primary' : variant;
  const filled = semantic === 'primary' || semantic === 'commerce';
  const backgroundColor = semantic === 'primary' ? t.colors.ink : semantic === 'commerce' ? t.colors.commerce : semantic === 'ghost' ? 'transparent' : t.colors.surface;
  const color = semantic === 'primary' ? t.colors.onInk : semantic === 'commerce' ? t.colors.onCommerce : t.colors.ink;
  // No shadow to collapse, so press is a fill swap: filled keys darken, light keys sink to surfaceSunken.
  const pressedBackground = semantic === 'ghost' ? 'transparent' : filled ? '#000000' : t.colors.surfaceSunken;
  const unavailable = Boolean(disabled || loading);
  const { outer, inner } = React.useMemo(() => splitLayout(style), [style]);
  return <View style={[styles.wrapper, outer]}>
    <AnimatedPressable
      accessibilityRole="button" accessibilityState={{ disabled: unavailable, busy: loading }} disabled={unavailable}
      onPressIn={() => { setDown(true); pressed.value = withTiming(0.98, { duration: 90 }); }}
      onPressOut={() => { setDown(false); pressed.value = withTiming(1, { duration: 90 }); }}
      style={[styles.button, { backgroundColor: down ? pressedBackground : backgroundColor, borderColor: semantic === 'ghost' ? 'transparent' : t.colors.stroke, opacity: unavailable ? .4 : 1 }, animated, inner]}
      {...props}
    >
      {loading ? <ActivityIndicator color={color} /> : typeof children === 'string' ? <Text numberOfLines={1} style={[styles.label, { color, opacity: down && filled ? .75 : 1 }, semantic === 'secondary' && styles.secondaryLabel]}>{children}</Text> : children}
    </AnimatedPressable>
    {unavailable && disabledReason ? <Text style={[styles.reason, { color: t.colors.inkMuted }]}>{disabledReason}</Text> : null}
  </View>;
}

const styles = StyleSheet.create({
  // `stretch` is what lets the key fill a wrapper that a caller has flexed.
  wrapper: { gap: 4, alignItems: 'stretch' },
  button: { minHeight: 50, paddingHorizontal: 16, borderWidth: 2, borderRadius: 0, alignItems: 'center', justifyContent: 'center' },
  label: { fontFamily: 'Archivo_900Black', fontSize: 15, textTransform: 'uppercase' }, secondaryLabel: { fontFamily: 'SpaceGrotesk_700Bold', textTransform: 'none' },
  reason: { fontFamily: 'SpaceGrotesk_400Regular', fontSize: 12, lineHeight: 18 },
});
