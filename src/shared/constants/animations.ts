/**
 * Animation Constants
 * 
 * Centralized animation configuration for smooth, refined Neubrutalist motion.
 * Brand Guidelines: 200-300ms timing, Easing.out for elegant deceleration.
 */

import { Easing } from 'react-native-reanimated';

/**
 * Duration presets (milliseconds)
 */
export const DURATION = {
  /** Quick micro-interactions (150ms) */
  fast: 150,
  /** Standard transitions (250ms) */
  normal: 250,
  /** Deliberate, elegant transitions (400ms) */
  slow: 400,
  /** Header scroll transitions (200ms) */
  header: 200,
} as const;

/**
 * Stagger delays for sequential animations (milliseconds)
 */
export const STAGGER = {
  /** Quick stagger for small items (30ms) */
  fast: 30,
  /** Standard list item stagger (50ms) */
  normal: 50,
  /** Slower stagger for emphasis (80ms) */
  slow: 80,
} as const;

/**
 * Easing curves for smooth, refined motion
 * Uses cubic easing for natural deceleration
 */
export const EASING = {
  /** Standard easeOut for most animations */
  out: Easing.out(Easing.cubic),
  /** EaseInOut for symmetrical animations */
  inOut: Easing.inOut(Easing.cubic),
  /** Linear for scroll-driven animations */
  linear: Easing.linear,
} as const;

/**
 * Shared animation config object for withTiming
 */
export const TIMING_CONFIG = {
  fast: { duration: DURATION.fast, easing: EASING.out },
  normal: { duration: DURATION.normal, easing: EASING.out },
  slow: { duration: DURATION.slow, easing: EASING.out },
  header: { duration: DURATION.header, easing: EASING.out },
} as const;

/**
 * Scroll thresholds for header animations
 */
export const SCROLL_THRESHOLDS = {
  /** Point where large title starts fading */
  largeTitleFadeStart: 0,
  /** Point where large title is fully hidden */
  largeTitleFadeEnd: 60,
  /** Point where small header starts appearing */
  smallHeaderFadeStart: 40,
  /** Point where small header is fully visible */
  smallHeaderFadeEnd: 80,
  /** Point where header shadow appears */
  shadowStart: 60,
  /** Point where header shadow is fully visible */
  shadowEnd: 100,
} as const;

/**
 * Scale values for press/tap animations
 */
export const SCALE = {
  /** Pressed state */
  pressed: 0.97,
  /** Normal state */
  normal: 1,
  /** Highlighted/active state */
  active: 1.02,
} as const;

/**
 * Opacity values
 */
export const OPACITY = {
  hidden: 0,
  dimmed: 0.5,
  visible: 1,
} as const;
