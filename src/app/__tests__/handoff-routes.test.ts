import fs from 'node:fs';
import path from 'node:path';

describe('Muse handoff route contract', () => {
  it.each([
    'src/app/opportunity/[id].tsx', 'src/app/shop/[id].tsx', 'src/app/product/[slug].tsx',
    'src/app/bag.tsx', 'src/app/checkout.tsx', 'src/app/payment-processing.tsx',
    'src/app/payment-failure.tsx', 'src/app/order-confirmed/[id].tsx', 'src/app/orders/[slug].tsx',
    'src/app/auth.tsx', 'src/app/open-shop.tsx', 'src/app/(merchant)/index.tsx',
  ])('provides %s', route => expect(fs.existsSync(path.join(process.cwd(), route))).toBe(true));

  // Muse screens draw their own ScreenHeader. A route that also gets the native
  // header renders two stacked headers and shoves the pinned action bar off-screen.
  it('defaults the native header off for the whole stack', () => {
    const layout = fs.readFileSync(path.join(process.cwd(), 'src/app/_layout.tsx'), 'utf8');
    expect(layout).toMatch(/<Stack\s+screenOptions=\{\{\s*headerShown:\s*false\s*\}\}>/);
  });

  it.each(['opportunity/[id]', 'orders/[slug]'])('registers %s in the root stack', route => {
    const layout = fs.readFileSync(path.join(process.cwd(), 'src/app/_layout.tsx'), 'utf8');
    expect(layout).toContain(`name="${route}"`);
  });

  it('keeps legacy success and cart routes as redirects', () => {
    expect(fs.readFileSync(path.join(process.cwd(), 'src/app/order-success.tsx'), 'utf8')).toContain('Redirect');
    expect(fs.readFileSync(path.join(process.cwd(), 'src/app/cart.tsx'), 'utf8')).toContain('Redirect');
  });
});
