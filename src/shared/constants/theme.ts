import { NEO_THEME } from './neobrutalism';
import { resolveSemanticColors, type SemanticColors } from '../design-system/tokens';

type BaseColors = typeof NEO_THEME.colors;
type ThemeColors = BaseColors & {
  background: string;
  card: string;
  text: string;
  border: string;
};

export type Theme = Omit<typeof NEO_THEME, 'colors'> & {
  colors: ThemeColors;
  mode: 'light' | 'dark';
};

function neoColorsFromSemantic(c: SemanticColors): ThemeColors {
  return {
    ...NEO_THEME.colors,
    primary: c.ink,
    secondary: c.accent,
    accent: c.accent,
    mint: c.success,
    sky: c.info,
    dark: c.darkCanvas,
    black: c.ink,
    white: c.surface,
    background: c.canvas,
    backgroundLight: c.canvas,
    success: c.success,
    warning: c.warning,
    error: c.error,
    info: c.info,
    vibrantOrange: c.accent,
    electricBlue: c.info,
    gemGold: c.warning,
    gemShine: c.accentMuted,
    grey: c.inkMuted,
    greyLight: c.gray100,
    lightGray: c.gray100,
    midGray: c.gray400,
    border: c.border,
    cardDark: c.darkSurface,
    red: c.error,
    yellow: c.accent,
    blue: c.info,
    pink: c.accent,
    card: c.surface,
    text: c.ink,
  };
}

export const lightTheme: Theme = {
  ...NEO_THEME,
  mode: 'light',
  colors: neoColorsFromSemantic(resolveSemanticColors('light')),
};

export const darkTheme: Theme = {
  ...NEO_THEME,
  mode: 'dark',
  colors: neoColorsFromSemantic(resolveSemanticColors('dark')),
};
