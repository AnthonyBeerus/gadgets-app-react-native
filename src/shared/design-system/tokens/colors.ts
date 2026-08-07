/**
 * Quiet commerce color tokens (v1).
 * Primary CTA = ink. Accent = challenge energy only.
 *
 * Static `colors` = light reference + raw dark* keys.
 * Runtime UI should use `resolveSemanticColors(mode)` via DesignTokensProvider.
 */

export type ColorMode = 'light' | 'dark';

/** Light reference palette (+ dark* raw keys for docs/tests) */
export const colors = {
  canvas: '#FAFAF8',
  surface: '#FFFFFF',
  ink: '#111111',
  inkMuted: '#6B7280',
  /** Visible structural edge — denser than gray-300, not comic black */
  border: '#B0B6C0',
  accent: '#E85D04',
  accentMuted: '#FFF4ED',

  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray700: '#374151',
  gray900: '#111111',

  success: '#16A34A',
  warning: '#D97706',
  error: '#DC2626',
  info: '#2563EB',

  /** Raw dark swatches (prefer resolveSemanticColors for UI) */
  darkCanvas: '#111111',
  darkSurface: '#1C1C1A',
  darkBorder: '#3F3F46',
  darkInk: '#F4F4F2',
  darkInkMuted: '#A1A1AA',
} as const;

export type ColorToken = keyof typeof colors;

/** Semantic roles shared by light and dark (same key names). */
export type SemanticColors = {
  canvas: string;
  surface: string;
  ink: string;
  inkMuted: string;
  border: string;
  accent: string;
  accentMuted: string;
  gray50: string;
  gray100: string;
  gray200: string;
  gray300: string;
  gray400: string;
  gray500: string;
  gray700: string;
  gray900: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  darkCanvas: string;
  darkSurface: string;
  darkBorder: string;
  darkInk: string;
  darkInkMuted: string;
};

export function resolveSemanticColors(mode: ColorMode): SemanticColors {
  if (mode === 'light') {
    return { ...colors };
  }

  return {
    canvas: colors.darkCanvas,
    surface: colors.darkSurface,
    ink: colors.darkInk,
    inkMuted: colors.darkInkMuted,
    border: colors.darkBorder,
    accent: colors.accent,
    accentMuted: '#3D2314',
    gray50: '#18181B',
    gray100: '#27272A',
    gray200: '#3F3F46',
    gray300: '#52525B',
    gray400: '#A1A1AA',
    gray500: '#A1A1AA',
    gray700: '#D4D4D8',
    gray900: colors.darkInk,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    darkCanvas: colors.darkCanvas,
    darkSurface: colors.darkSurface,
    darkBorder: colors.darkBorder,
    darkInk: colors.darkInk,
    darkInkMuted: colors.darkInkMuted,
  };
}
