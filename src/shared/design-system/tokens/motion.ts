import { Easing } from 'react-native-reanimated';

export const duration = {
  fast: 150,
  normal: 250,
  slow: 400,
  header: 200,
} as const;

export const stagger = {
  fast: 30,
  normal: 50,
  slow: 80,
} as const;

export const easing = {
  out: Easing.out(Easing.cubic),
  inOut: Easing.inOut(Easing.cubic),
  linear: Easing.linear,
} as const;

export const timingConfig = {
  fast: { duration: duration.fast, easing: easing.out },
  normal: { duration: duration.normal, easing: easing.out },
  slow: { duration: duration.slow, easing: easing.out },
  header: { duration: duration.header, easing: easing.out },
} as const;

export const scale = {
  pressed: 0.98,
  normal: 1,
  active: 1.01,
} as const;

export const opacity = {
  hidden: 0,
  dimmed: 0.5,
  visible: 1,
} as const;

export const scrollThresholds = {
  largeTitleFadeStart: 0,
  largeTitleFadeEnd: 60,
  smallHeaderFadeStart: 40,
  smallHeaderFadeEnd: 80,
  shadowStart: 60,
  shadowEnd: 100,
} as const;
