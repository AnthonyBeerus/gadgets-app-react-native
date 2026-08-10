import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (relative: string) => fs.readFileSync(path.join(root, relative), 'utf8');
const exists = (relative: string) => fs.existsSync(path.join(root, relative));

describe('Muse campaign route contract', () => {
  it.each([
    // Merchant: sign in -> open shop -> create -> dashboard -> review -> pick winners.
    'src/app/auth.tsx',
    'src/app/open-shop.tsx',
    'src/app/(merchant)/index.tsx',
    'src/app/(merchant)/campaigns/index.tsx',
    'src/app/(merchant)/campaigns/new.tsx',
    'src/app/(merchant)/campaigns/[id]/index.tsx',
    'src/app/(merchant)/campaigns/[id]/submissions.tsx',
    'src/app/(merchant)/campaigns/[id]/winners.tsx',
    // Creator: browse -> detail -> submit -> track.
    'src/app/(shop)/index.tsx',
    'src/app/opportunity/[id]/index.tsx',
    'src/app/opportunity/[id]/submit.tsx',
    'src/app/(shop)/entries.tsx',
  ])('provides %s', route => expect(exists(route)).toBe(true));

  // Muse screens draw their own ScreenHeader. A route that also gets the native
  // header renders two stacked headers and shoves the pinned action bar off-screen.
  it('defaults the native header off for the whole stack', () => {
    expect(read('src/app/_layout.tsx')).toMatch(
      /<Stack\s+screenOptions=\{\{\s*headerShown:\s*false\s*\}\}>/,
    );
  });

  it.each(['opportunity/[id]/index', 'opportunity/[id]/submit'])(
    'registers %s in the root stack',
    route => expect(read('src/app/_layout.tsx')).toContain(`name="${route}"`),
  );

  // The pivot deleted the commerce surface. These assertions stop it creeping back in
  // through a stray route file or a leftover push.
  it.each([
    'src/app/cart.tsx',
    'src/app/bag.tsx',
    'src/app/checkout.tsx',
    'src/app/order-success.tsx',
    'src/app/payment-processing.tsx',
    'src/app/create-product.tsx',
    'src/app/scan-order.tsx',
    'src/app/challenges/create.tsx',
    'src/app/challenges/leaderboard.tsx',
    'src/app/(merchant)/catalog/index.tsx',
    'src/app/(merchant)/orders.tsx',
    'src/app/(modal)/create.tsx',
    'src/shared/api/api.ts',
    'src/store/cart-store.ts',
    'src/shared/components/ui/UploadBox.tsx',
  ])('has retired %s', route => expect(exists(route)).toBe(false));

  it('routes discovery to the campaign detail, never the legacy challenges screen', () => {
    const source = read('src/features/discovery/screens/discover-screen.tsx');
    expect(source).toContain('/opportunity/${item.opportunity_id}');
    expect(source).not.toMatch(/`\/challenges\/\$\{item\.opportunity_id\}`/);
  });

  it('leaves no push to a retired commerce or challenge route anywhere in src', () => {
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(full);
          continue;
        }
        if (!/\.tsx?$/.test(entry.name) || entry.name.includes('.test.')) continue;
        const source = fs.readFileSync(full, 'utf8');
        if (/['"`]\/(challenges|checkout|bag|cart|orders)\//.test(source)) {
          offenders.push(path.relative(root, full));
        }
      }
    };
    walk(path.join(root, 'src'));
    expect(offenders).toEqual([]);
  });
});
