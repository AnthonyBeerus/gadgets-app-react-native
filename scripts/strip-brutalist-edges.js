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
  if (file.includes('design-system') || file.includes('neobrutalism.test')) continue;
  let src = fs.readFileSync(file, 'utf8');
  const before = src;

  src = src.replace(
    /shadowOffset:\s*\{\s*width:\s*[3-9]\d*\s*,\s*height:\s*[3-9]\d*\s*\}/g,
    'shadowOffset: { width: 0, height: 2 }'
  );

  src = src.replace(
    /boxShadow:\s*['"`]\d+px\s+\d+px\s+0(?:px)?\s+#[0-9A-Fa-f]{3,8}['"`]/g,
    "boxShadow: '0px 2px 8px rgba(0,0,0,0.08)'"
  );

  src = src.replace(/\bborderWidth:\s*3\b/g, 'borderWidth: 1');
  src = src.replace(/\bborderWidth:\s*2\b/g, 'borderWidth: 1');
  src = src.replace(/\bborderBottomWidth:\s*[23]\b/g, 'borderBottomWidth: StyleSheet.hairlineWidth');
  src = src.replace(/\bborderTopWidth:\s*[23]\b/g, 'borderTopWidth: StyleSheet.hairlineWidth');
  src = src.replace(/\bborderLeftWidth:\s*[23]\b/g, 'borderLeftWidth: 1');

  src = src.replace(/shadowOpacity:\s*1\b/g, 'shadowOpacity: 0.08');
  src = src.replace(/shadowRadius:\s*0\b/g, 'shadowRadius: 8');
  src = src.replace(/NEO_THEME\.borders\.width/g, '1');

  if (src !== before) {
    fs.writeFileSync(file, src);
    changed += 1;
    console.log('patched', path.relative(process.cwd(), file).split(path.sep).join('/'));
  }
}

console.log(`\nDone. ${changed} files updated.`);
