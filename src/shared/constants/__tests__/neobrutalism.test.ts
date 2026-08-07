import { NEO_THEME } from '../neobrutalism';
import { colors } from '../../design-system/tokens';

/**
 * Compat shim tests — NEO_THEME maps onto quiet-commerce tokens.
 * Prefer importing from `shared/design-system` in new code.
 */
describe('NEO_THEME compat shim', () => {
  it('maps primary action to ink', () => {
    expect(NEO_THEME.colors.primary).toBe(colors.ink);
  });

  it('maps accent/yellow to single accent', () => {
    expect(NEO_THEME.colors.accent).toBe(colors.accent);
    expect(NEO_THEME.colors.yellow).toBe(colors.accent);
  });

  it('uses hairline border width', () => {
    expect(NEO_THEME.borders.width).toBe(1);
  });

  it('does not use hard offset legacy shadows', () => {
    expect(NEO_THEME.shadows.hardLegacy.shadowOffset).toEqual({
      width: 0,
      height: 2,
    });
    expect(NEO_THEME.shadows.hardLegacy.shadowRadius).toBe(8);
  });

  it('uses canvas background', () => {
    expect(NEO_THEME.colors.background).toBe(colors.canvas);
  });
});
