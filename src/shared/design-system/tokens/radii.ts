/** Modest radii — not pill-default */
export const radii = {
  sm: 6,
  md: 10,
  lg: 16,
  /** Rare: chips only when interaction needs a capsule */
  pill: 9999,
} as const;

export type RadiusToken = keyof typeof radii;
