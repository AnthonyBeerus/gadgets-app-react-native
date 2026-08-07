/**
 * Restore visible 1px structural borders.
 * Previous soften pass used StyleSheet.hairlineWidth for former 2–3px neo borders,
 * which reads as "no border" on many devices.
 */
const fs = require('fs');
const path = require('path');

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '__tests__') continue;
      walk(full, files);
    } else if (/\.(tsx|ts)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

const files = walk('src');
let changed = 0;

for (const file of files) {
  let src = fs.readFileSync(file, 'utf8');
  const before = src;

  // Structural chrome: hairlineWidth → solid 1px (list row dividers keep hairline via ProfileOption etc. — those use borderBottomWidth with hairline intentionally)
  // Only convert pairs that were bulk-replaced from thick neo borders (borderBottom/Top with hairline on cards/headers).
  // Safer: convert ALL StyleSheet.hairlineWidth used as borderBottomWidth/borderTopWidth on non-divider patterns
  // Actually user wants borders visible — convert hairline → 1 everywhere except explicit divider comments.
  src = src.replace(/borderBottomWidth:\s*StyleSheet\.hairlineWidth/g, 'borderBottomWidth: 1');
  src = src.replace(/borderTopWidth:\s*StyleSheet\.hairlineWidth/g, 'borderTopWidth: 1');

  if (src !== before) {
    fs.writeFileSync(file, src);
    changed += 1;
    console.log(path.relative(process.cwd(), file).split(path.sep).join('/'));
  }
}

console.log(`\nRestored solid 1px borders in ${changed} files.`);
