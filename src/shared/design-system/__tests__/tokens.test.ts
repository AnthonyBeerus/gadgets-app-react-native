import { colors, resolveSemanticColors } from '../tokens/colors';
import { fonts } from '../tokens/typography';
import { space } from '../tokens/space';
import { radii } from '../tokens/radii';
import { elevation, resolveElevation } from '../tokens/elevation';
import { designTokens, resolveDesignTokens } from '../tokens';

describe('quiet commerce design tokens', () => {
  it('uses warm near-white canvas, not lilac', () => {
    expect(colors.canvas).toBe('#FAFAF8');
    expect(colors.canvas.toLowerCase()).not.toBe('#f5f3ff');
  });

  it('uses ink for primary action identity', () => {
    expect(colors.ink).toBe('#111111');
  });

  it('keeps a single accent for challenge energy', () => {
    expect(colors.accent).toBe('#E85D04');
  });

  it('uses visible hairline borders, not comic outlines', () => {
    expect(colors.border).toBe('#B0B6C0');
    expect(elevation.hairline.borderWidth).toBe(1);
  });

  it('has no hard neo offset shadows', () => {
    expect(elevation.none.shadowRadius).toBe(0);
    expect(elevation.soft.shadowOffset).toEqual({ width: 0, height: 2 });
    expect((elevation as Record<string, unknown>).hard).toBeUndefined();
  });

  it('exposes a calm spacing and radius scale', () => {
    expect(space.md).toBe(16);
    expect(radii.md).toBe(10);
    expect(radii.pill).toBe(9999);
  });

  it('uses Inter-based typography tokens', () => {
    expect(fonts.regular).toBe('Inter_400Regular');
    expect(fonts.bold).toBe('Inter_700Bold');
  });

  it('bundles tokens on designTokens root', () => {
    expect(designTokens.colors).toEqual(resolveSemanticColors('light'));
    expect(designTokens.space).toBe(space);
    expect(designTokens.mode).toBe('light');
  });

  it('resolves dark semantic colors under the same role keys', () => {
    const dark = resolveSemanticColors('dark');
    expect(dark.canvas).toBe(colors.darkCanvas);
    expect(dark.surface).toBe(colors.darkSurface);
    expect(dark.ink).toBe(colors.darkInk);
    expect(dark.inkMuted).toBe(colors.darkInkMuted);
    expect(dark.border).toBe(colors.darkBorder);
    expect(dark.accent).toBe(colors.accent);
    expect(dark.gray100).toBe('#27272A');
  });

  it('builds dark design tokens with remapped elevation borders', () => {
    const darkTokens = resolveDesignTokens('dark');
    expect(darkTokens.mode).toBe('dark');
    expect(darkTokens.colors.ink).toBe(colors.darkInk);
    expect(darkTokens.elevation.hairline.borderColor).toBe(colors.darkBorder);
    expect(darkTokens.textVariants.body.color).toBe(colors.darkInk);
    expect(resolveElevation(darkTokens.colors, 'dark').soft.shadowOpacity).toBeGreaterThan(
      resolveElevation(colors, 'light').soft.shadowOpacity as number,
    );
  });
});
