/** Muse Quiet Commerce Design System — public barrel for features */

export {
  designTokens,
  resolveDesignTokens,
  colors,
  resolveSemanticColors,
  fonts,
  textVariants,
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
  type DesignTokens,
  type ColorMode,
  type SemanticColors,
  type TextVariant,
  type ElevationLevel,
} from './tokens';

export {
  Button,
  Text,
  Input,
  Surface,
  Tag,
  IconButton,
  type ButtonProps,
  type ButtonVariant,
  type MuseTextProps,
  type InputProps,
  type SurfaceProps,
  type TagProps,
  type TagTone,
  type IconButtonProps,
} from './primitives';

export {
  ScreenHeader,
  TabBarShell,
  type ScreenHeaderProps,
  type TabBarShellProps,
  type TabBarItem,
} from './patterns';

export {
  DesignTokensProvider,
  useDesignTokens,
} from './theme/DesignTokensProvider';

export { useThemedStyles } from './theme/useThemedStyles';
