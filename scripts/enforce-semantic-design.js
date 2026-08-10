#!/usr/bin/env node
const { execFileSync }=require('child_process');
const checks=[
 {label:'raw brand colours',pattern:'#(?:6C3FC5|8B63E0|FCC81E|E8B923|4F86E8|6F9EF0|E85D04)',glob:'src/shared/design-system/**/*.{ts,tsx}',allow:['tokens/colors.ts','__tests__/tokens.test.ts']},
 {label:'shadow or elevation styles',pattern:'shadowColor|shadowOpacity|elevation\\s*:',glob:'src/shared/design-system/**/*.{ts,tsx}',allow:['tokens/elevation.ts','tokens/index.ts','primitives/Surface.tsx','__tests__/tokens.test.ts']},
];
let failed=false;
for(const check of checks){let output='';try{output=execFileSync('rg',['-n',check.pattern,'src/shared/design-system','--glob','*.ts','--glob','*.tsx'],{encoding:'utf8'})}catch(error){if(error.status!==1)throw error}
 const lines=output.split(/\r?\n/).filter(Boolean).filter(line=>!check.allow.some(item=>line.replace(/\\/g,'/').includes(item)));if(lines.length){failed=true;console.error(`Banned ${check.label}:`);lines.forEach(line=>console.error(` - ${line}`))}}
if(failed)process.exit(1);console.log('Semantic design-system checks passed.');
