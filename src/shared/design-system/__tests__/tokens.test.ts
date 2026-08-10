import { colors, resolveSemanticColors } from '../tokens/colors';
import { fonts } from '../tokens/typography';
import { radii } from '../tokens/radii';
import { space } from '../tokens/space';
import { resolveDesignTokens } from '../tokens';

describe('Muse semantic design tokens', () => {
  it('maps exact light roles', () => {
    expect(colors.canvas).toBe('#F7F4EC'); expect(colors.stroke).toBe('#101010');
    expect(colors.creator).toBe('#6C3FC5'); expect(colors.payout).toBe('#FCC81E'); expect(colors.commerce).toBe('#4F86E8');
  });
  it('maps dark structure separately from fill', () => {
    const dark=resolveSemanticColors('dark'); expect(dark.canvas).toBe('#0E0E0D'); expect(dark.surface).toBe('#1A1A18'); expect(dark.stroke).toBe('#F5F2EA'); expect(dark.ink).toBe('#F5F2EA');
  });
  it('uses square geometry and the 18px screen gutter', () => { expect(radii.md).toBe(0); expect(radii.badge).toBe(3); expect(space.lg).toBe(18); expect(resolveDesignTokens('light').layout.screenGutter).toBe(18); });
  it('uses Archivo and Space Grotesk roles', () => { expect(fonts.displayBlack).toBe('Archivo_900Black'); expect(fonts.regular).toBe('SpaceGrotesk_400Regular'); });
  it('exposes atomic structural contracts', () => { const t=resolveDesignTokens('light'); expect(t.strokes.structural).toBe(2); expect(t.targets.min).toBe(44); expect(t.layers.overlay).toBe(100); });
});
