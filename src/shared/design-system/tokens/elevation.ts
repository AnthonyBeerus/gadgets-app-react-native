import type { SemanticColors } from './colors';
export type ElevationLevel = 'none' | 'hairline' | 'soft';
/** @deprecated Compatibility only. Muse has no shadows; migrate to Plate/OffsetPlane. */
export const resolveElevation = (c: SemanticColors, _mode?: 'light' | 'dark') => ({
  none: { borderWidth: 0, shadowOpacity: 0, shadowRadius: 0, shadowOffset: { width: 0, height: 0 }, elevation: 0 },
  hairline: { borderWidth: 2, borderColor: c.stroke, shadowOpacity: 0, shadowRadius: 0, shadowOffset: { width: 0, height: 0 }, elevation: 0 },
  soft: { borderWidth: 2, borderColor: c.stroke, shadowOpacity: 0, shadowRadius: 0, shadowOffset: { width: 0, height: 0 }, elevation: 0 },
} as const);
export const elevation = resolveElevation({ stroke: '#101010' } as SemanticColors);
