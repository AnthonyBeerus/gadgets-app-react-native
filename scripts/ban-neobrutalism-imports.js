#!/usr/bin/env node
/**
 * Fails if new production files import the deprecated neobrutalism path
 * outside the allowlist (shim + tests + wrappers).
 */
const { execSync } = require('child_process');
const path = require('path');

const root = path.join(__dirname, '..');
const allow = new Set([
  'src/shared/constants/neobrutalism.ts',
  'src/shared/constants/theme.ts',
  'src/shared/constants/__tests__/neobrutalism.test.ts',
  'src/shared/constants/__tests__/theme.test.ts',
  'src/shared/theme/text-variants.ts',
]);

let out = '';
try {
  out = execSync(
    'rg -l "shared/constants/neobrutalism|constants/neobrutalism" src --glob "*.ts" --glob "*.tsx"',
    { cwd: root, encoding: 'utf8' }
  );
} catch (e) {
  if (e.status === 1) {
    console.log('No neobrutalism imports found.');
    process.exit(0);
  }
  throw e;
}

const files = out
  .split(/\r?\n/)
  .map(f => f.trim().replace(/\\/g, '/'))
  .filter(Boolean);

const offenders = files.filter(f => {
  if (allow.has(f)) return false;
  if (f.includes('__tests__') || f.endsWith('.test.ts') || f.endsWith('.test.tsx')) return false;
  // Compat wrappers may still re-export through design-system; ban direct NEO_THEME consumers over time
  return true;
});

// Soft ban: warn on remaining consumers (strangler). Exit 0 until sweep complete enough.
// Hard-fail only on brand-new style of import from design-system sibling paths.
const hardFail = offenders.filter(f =>
  f.startsWith('src/shared/design-system/')
);

if (hardFail.length) {
  console.error('Banned: design-system must not import neobrutalism:');
  hardFail.forEach(f => console.error(' -', f));
  process.exit(1);
}

console.log(
  `neobrutalism compat consumers remaining: ${offenders.length} (migrate toward shared/design-system)`
);
process.exit(0);
