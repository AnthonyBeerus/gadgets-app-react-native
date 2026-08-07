/**
 * @deprecated Import from `shared/design-system` instead.
 * Compat shim mapping legacy NEO_THEME shape onto quiet-commerce tokens.
 */
import { colors, fonts, radii, elevation } from '../design-system/tokens';

export const NEO_THEME = {
  colors: {
    primary: colors.ink,
    secondary: colors.accent,
    accent: colors.accent,
    mint: colors.success,
    sky: colors.info,

    dark: colors.darkCanvas,
    black: colors.ink,
    white: colors.surface,
    background: colors.canvas,
    backgroundLight: colors.surface,

    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,

    vibrantOrange: colors.accent,
    electricBlue: colors.info,
    gemGold: colors.warning,
    gemShine: '#FEF3C7',
    grey: colors.inkMuted,
    greyLight: colors.gray100,
    lightGray: colors.gray100,
    midGray: colors.gray400,
    /** Quiet hairline — prefer over black for chrome borders */
    border: colors.border,
    cardDark: colors.darkSurface,
    red: colors.error,
    yellow: colors.accent,
    blue: colors.info,
    pink: colors.accent,
  },
  pastels: [
    colors.accentMuted,
    colors.gray100,
    '#DCFCE7',
    '#DBEAFE',
    '#FEF3C7',
  ],
  borders: {
    width: 1,
    radius: radii.md,
    circle: radii.pill,
  },
  shadows: {
    /** @deprecated Hard neo shadows removed — soft only */
    hard: '0 2px 8px rgba(0,0,0,0.08)',
    hardSmall: '0 1px 4px rgba(0,0,0,0.06)',
    soft: '0 2px 8px rgba(0,0,0,0.08)',
    hardLegacy: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    },
    softLegacy: elevation.soft,
  },
  fonts: {
    regular: fonts.regular,
    medium: fonts.medium,
    semibold: fonts.semibold,
    bold: fonts.bold,
    black: fonts.bold,
    displaySemibold: fonts.displaySemibold,
    displayBold: fonts.displayBold,
    displayBlack: fonts.displayBlack,
  },
};
