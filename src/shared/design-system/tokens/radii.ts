export const radii = { none: 0, badge: 3, sm: 3, md: 0, lg: 0, pill: 999 } as const;
export type RadiusToken = keyof typeof radii;
