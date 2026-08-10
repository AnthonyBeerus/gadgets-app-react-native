import { Easing } from 'react-native-reanimated';

export const duration = { instant: 90, quick: 170, base: 240, fast: 90, normal: 240, slow: 240, header: 240 } as const;
export const settle = { damping: 18, stiffness: 200 } as const;
export const stagger = { fast: 30, normal: 50, slow: 80 } as const;
export const easing = { out: Easing.out(Easing.cubic), inOut: Easing.inOut(Easing.cubic), linear: Easing.linear } as const;
export const timingConfig = { fast: { duration: 90, easing: easing.out }, normal: { duration: 240, easing: easing.out }, slow: { duration: 240, easing: easing.out }, header: { duration: 240, easing: easing.out } } as const;
export const scale = { pressed: 0.98, normal: 1, active: 1 } as const;
export const opacity = { hidden: 0, dimmed: 0.4, disabled: 0.4, visible: 1 } as const;
export const scrollThresholds = { largeTitleFadeStart: 0, largeTitleFadeEnd: 60, smallHeaderFadeStart: 40, smallHeaderFadeEnd: 80, shadowStart: 60, shadowEnd: 100 } as const;
