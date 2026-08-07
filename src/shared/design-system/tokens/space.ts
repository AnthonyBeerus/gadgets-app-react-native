/** 4px base spacing scale */
export const space = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  huge: 64,
} as const;

export type SpaceToken = keyof typeof space;
