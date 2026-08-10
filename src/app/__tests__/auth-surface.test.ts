import fs from 'node:fs';
import path from 'node:path';

describe('authentication surface', () => {
  it('uses the OTA-safe Clerk custom flow instead of native ClerkAuthView', () => {
    const source = [
      fs.readFileSync(path.join(process.cwd(), 'src/app/auth.tsx'), 'utf8'),
      fs.readFileSync(path.join(process.cwd(), 'src/app/account.tsx'), 'utf8'),
      fs.readFileSync(path.join(process.cwd(), 'src/shared/clerk/index.native.ts'), 'utf8'),
      fs.readFileSync(path.join(process.cwd(), 'src/shared/clerk/index.web.ts'), 'utf8'),
    ].join('\n');
    expect(source).not.toContain('@clerk/expo/native');
    expect(source).not.toContain('ClerkAuthView');
    expect(source).toContain("@clerk/expo/legacy");
    expect(source).toContain('safeReturnTo');
  });
});
