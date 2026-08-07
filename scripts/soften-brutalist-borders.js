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
  if (file.includes('design-system')) continue;
  let src = fs.readFileSync(file, 'utf8');
  const before = src;

  // Comic black borders → quiet hairline color
  src = src.replace(
    /borderColor:\s*NEO_THEME\.colors\.black\b/g,
    'borderColor: NEO_THEME.colors.greyLight'
  );
  // Where already on colors.* API
  src = src.replace(/borderColor:\s*colors\.ink\b/g, 'borderColor: colors.border');
  src = src.replace(/borderBottomColor:\s*colors\.ink\b/g, 'borderBottomColor: colors.border');
  src = src.replace(/borderTopColor:\s*colors\.ink\b/g, 'borderTopColor: colors.border');
  src = src.replace(/borderBottomColor:\s*NEO_THEME\.colors\.black\b/g, 'borderBottomColor: NEO_THEME.colors.greyLight');
  src = src.replace(/borderTopColor:\s*NEO_THEME\.colors\.black\b/g, 'borderTopColor: NEO_THEME.colors.greyLight');

  // Soften elevation: 8 comic stacks
  src = src.replace(/elevation:\s*8\b/g, 'elevation: 2');
  src = src.replace(/elevation:\s*6\b/g, 'elevation: 2');
  src = src.replace(/elevation:\s*5\b/g, 'elevation: 2');
  src = src.replace(/elevation:\s*4\b/g, 'elevation: 2');

  if (src !== before) {
    fs.writeFileSync(file, src);
    changed += 1;
    console.log('patched', path.relative(process.cwd(), file).split(path.sep).join('/'));
  }
}

console.log(`\nDone. ${changed} files updated.`);
