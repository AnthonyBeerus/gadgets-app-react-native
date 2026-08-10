export const space = { xxs: 4, xs: 8, sm: 12, md: 16, lg: 18, xl: 24, xxl: 32, huge: 64 } as const;
export const layout = { screenGutter: 18, cardPadding: 16, safeBottom: 12 } as const;
export type SpaceToken = keyof typeof space;
