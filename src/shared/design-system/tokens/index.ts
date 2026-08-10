import {
  colors,
  resolveSemanticColors,
  type ColorMode,
  type SemanticColors,
} from './colors';
import { fonts, textVariants, resolveTextVariants, type TextVariant } from './typography';
import { space, layout } from './space';
import { radii } from './radii';
import { elevation, resolveElevation, type ElevationLevel } from './elevation';
import { strokes, targets, icons, layers } from './structure';
import {
  duration,
  settle,
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
    textVariants: resolveTextVariants(semantic, mode === 'dark'),
    typography: resolveTextVariants(semantic, mode === 'dark'),
    space,
    layout,
    radii,
    strokes,
    targets,
    icons,
    layers,
    elevation: resolveElevation(semantic, mode),
    mode,
    motion: {
      duration,
      settle,
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
  textVariants,
  resolveTextVariants,
  space,
  layout,
  radii,
  strokes,
  targets,
  icons,
  layers,
  elevation,
  resolveElevation,
  duration,
  settle,
  stagger,
  easing,
  timingConfig,
  scale,
  opacity,
  scrollThresholds,
};

export type { ColorMode, SemanticColors, TextVariant, ElevationLevel };
