import {
  colors,
  resolveSemanticColors,
  type ColorMode,
  type SemanticColors,
} from './colors';
import { fonts, resolveTextVariants, type TextVariant } from './typography';
import { space } from './space';
import { radii } from './radii';
import { elevation, resolveElevation, type ElevationLevel } from './elevation';
import {
  duration,
  stagger,
  easing,
  timingConfig,
  scale,
  opacity,
  scrollThresholds,
} from './motion';

export function resolveDesignTokens(mode: ColorMode) {
  const semantic = resolveSemanticColors(mode);
  return {
    colors: semantic,
    fonts,
    textVariants: resolveTextVariants(semantic),
    space,
    radii,
    elevation: resolveElevation(semantic, mode),
    mode,
    motion: {
      duration,
      stagger,
      easing,
      timingConfig,
      scale,
      opacity,
      scrollThresholds,
    },
  };
}

export const designTokens = resolveDesignTokens('light');

export type DesignTokens = ReturnType<typeof resolveDesignTokens>;

export {
  colors,
  resolveSemanticColors,
  fonts,
  resolveTextVariants,
  space,
  radii,
  elevation,
  resolveElevation,
  duration,
  stagger,
  easing,
  timingConfig,
  scale,
  opacity,
  scrollThresholds,
};

export type { ColorMode, SemanticColors, TextVariant, ElevationLevel };
