import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const exists = (relative: string) => fs.existsSync(path.join(root, relative));

/**
 * The handoff's consolidation list: nine deletions, no additions to the dependency tree.
 * These assertions stop the deleted surfaces creeping back.
 */
describe('Muse consolidation contract', () => {
  it.each([
    'src/components/atoms/nuvia-text.tsx',
    'src/shared/components/ui/nuvia-button.tsx',
    'src/shared/components/ui/nuvia-input.tsx',
    'src/shared/components/ui/nuvia-tag.tsx',
    'src/components/shop/ShopTabBar.tsx',
    'src/components/merchant/MerchantTabBar.tsx',
    'src/shared/design-system/patterns/TabBarShell.tsx',
    'src/features/cart/screens/CartScreen.tsx',
    'scripts/soften-brutalist-borders.js',
    'scripts/restore-visible-borders.js',
    'scripts/strip-brutalist-edges.js',
  ])('has retired %s', file => expect(exists(file)).toBe(false));

  it('keeps one canonical tab bar', () => {
    expect(exists('src/shared/design-system/patterns/TabBar.tsx')).toBe(true);
  });

  it('keeps one canonical bag route', () => {
    expect(fs.readFileSync(path.join(root, 'src/app/cart.tsx'), 'utf8')).toContain('Redirect');
    expect(exists('src/app/bag.tsx')).toBe(true);
  });
});
