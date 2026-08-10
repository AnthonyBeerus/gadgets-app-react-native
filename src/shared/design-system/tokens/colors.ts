export type ColorMode = 'light' | 'dark';

export type SemanticColors = {
  canvas: string;
  surface: string;
  surfaceSunken: string;
  ink: string;
  inkMuted: string;
  stroke: string;
  strokeQuiet: string;
  strokeDim: string;
  placeholder: string;
  creator: string;
  creatorDeep: string;
  payout: string;
  payoutSoft: string;
  commerce: string;
  commerceInk: string;
  success: string;
  successSoft: string;
  successText: string;
  warning: string;
  warningSoft: string;
  warningText: string;
  danger: string;
  dangerSoft: string;
  dangerText: string;
  onInk: string;
  onCreator: string;
  onPayout: string;
  onCommerce: string;
  /** Temporary compatibility roles for screens awaiting migration. */
  border: string;
  accent: string;
  accentMuted: string;
  error: string;
  info: string;
  gray50: string;
  gray100: string;
  gray200: string;
  gray300: string;
  gray400: string;
  gray500: string;
  gray700: string;
  gray900: string;
  darkCanvas: string;
  darkSurface: string;
  darkBorder: string;
  darkInk: string;
  darkInkMuted: string;
};

const light = {
  canvas: '#F7F4EC', surface: '#FFFFFF', surfaceSunken: '#E8E2D4',
  ink: '#101010', inkMuted: '#5F5C55', stroke: '#101010',
  strokeQuiet: 'rgba(16,16,16,0.18)', strokeDim: 'rgba(16,16,16,0.30)', placeholder: '#9A968D',
  creator: '#6C3FC5', creatorDeep: '#3A1F73', payout: '#FCC81E', payoutSoft: '#FFF6DA',
  commerce: '#4F86E8', commerceInk: '#0B1A33', success: '#1F8A4C', successSoft: '#E4F3EA',
  successText: '#14612F', warning: '#B87400', warningSoft: '#FBF0DC', warningText: '#7A4E00',
  danger: '#C22F2F', dangerSoft: '#FBE7E7', dangerText: '#8E2020',
  onInk: '#F7F4EC', onCreator: '#FFFFFF', onPayout: '#0E0E0D', onCommerce: '#0B1A33',
} as const;

const dark = {
  canvas: '#0E0E0D', surface: '#1A1A18', surfaceSunken: '#26251F',
  ink: '#F5F2EA', inkMuted: '#A8A49A', stroke: '#F5F2EA', strokeQuiet: '#35342F',
  strokeDim: '#4A4842', placeholder: '#6E6B64', creator: '#8B63E0', creatorDeep: '#3A1F73',
  payout: '#E8B923', payoutSoft: '#1A1A18', commerce: '#6F9EF0', commerceInk: '#0B1A33',
  success: '#3FA96B', successSoft: '#1A1A18', successText: '#3FA96B', warning: '#D9A63A',
  warningSoft: '#1A1A18', warningText: '#D9A63A', danger: '#E05656', dangerSoft: '#1A1A18',
  dangerText: '#E05656', onInk: '#0E0E0D', onCreator: '#FFFFFF', onPayout: '#0E0E0D', onCommerce: '#0B1A33',
} as const;

function withCompatibility(c: typeof light | typeof dark): SemanticColors {
  return {
    ...c,
    border: c.stroke,
    accent: c.creator,
    accentMuted: c.surfaceSunken,
    error: c.danger,
    info: c.commerce,
    gray50: c.canvas,
    gray100: c.surfaceSunken,
    gray200: c.strokeQuiet,
    gray300: c.strokeDim,
    gray400: c.placeholder,
    gray500: c.inkMuted,
    gray700: c.ink,
    gray900: c.ink,
    darkCanvas: dark.canvas,
    darkSurface: dark.surface,
    darkBorder: dark.stroke,
    darkInk: dark.ink,
    darkInkMuted: dark.inkMuted,
  };
}

export const colors = withCompatibility(light);

export function resolveSemanticColors(mode: ColorMode): SemanticColors {
  return withCompatibility(mode === 'dark' ? dark : light);
}

export type ColorToken = keyof SemanticColors;
