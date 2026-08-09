import { execSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { getConfig } = require('expo/config');
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tempRoot = resolve(projectRoot, '.tmp', 'muse-preview-check');
const ACTIVE_BUILD_STATUSES = new Set(['NEW', 'IN_QUEUE', 'IN_PROGRESS', 'PENDING_CANCEL']);
const REQUIRED_ENV_NAMES = [
  'EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'EXPO_PUBLIC_SENTRY_DSN',
  'EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'EXPO_PUBLIC_SUPABASE_ANON_KEY',
  'EXPO_PUBLIC_SUPABASE_URL',
];
const VARIANTS = {
  development: { name: 'Muse Dev', id: 'com.kaizenicai.muse.dev', scheme: 'muse-dev' },
  preview: { name: 'Muse Preview', id: 'com.kaizenicai.muse.preview', scheme: 'muse-preview' },
  production: { name: 'Muse', id: 'com.kaizenicai.muse', scheme: 'muse' },
};

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

function run(command, { capture = false } = {}) {
  return execSync(command, {
    cwd: projectRoot,
    encoding: capture ? 'utf8' : undefined,
    stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
    shell: true,
    env: { ...process.env, APP_VARIANT: 'preview', EXPO_NO_DEPLOY: '1' },
  });
}

function readJson(path) {
  return JSON.parse(readFileSync(resolve(projectRoot, path), 'utf8'));
}

function pluginConfig(exp, name) {
  return exp.plugins?.find(plugin => (Array.isArray(plugin) ? plugin[0] : plugin) === name);
}

export function assertVariantConfigs() {
  const eas = readJson('eas.json');
  const identifiers = new Set();
  const schemes = new Set();

  for (const [variantName, expected] of Object.entries(VARIANTS)) {
    process.env.APP_VARIANT = variantName;
    const { exp } = getConfig(projectRoot, { isPublicConfig: true, skipSDKVersionRequirement: true });
    invariant(exp.name === expected.name, `${variantName}: expected name ${expected.name}, got ${exp.name}`);
    invariant(exp.android?.package === expected.id, `${variantName}: incorrect Android package`);
    invariant(exp.ios?.bundleIdentifier === expected.id, `${variantName}: incorrect iOS bundle identifier`);
    invariant(exp.scheme === expected.scheme, `${variantName}: incorrect scheme`);
    invariant(exp.version === '1.1.0', `${variantName}: expected native baseline 1.1.0`);
    invariant(exp.runtimeVersion?.policy === 'appVersion', `${variantName}: runtime policy must be appVersion`);
    invariant(Boolean(exp.updates?.url), `${variantName}: updates URL is missing`);
    invariant(Boolean(pluginConfig(exp, '@clerk/expo')), `${variantName}: Clerk plugin is missing`);
    invariant(Boolean(pluginConfig(exp, '@stripe/stripe-react-native')), `${variantName}: Stripe plugin is missing`);
    const devClient = pluginConfig(exp, 'expo-dev-client');
    invariant(Array.isArray(devClient), `${variantName}: expo-dev-client plugin config is missing`);
    invariant(devClient[1]?.addGeneratedScheme === (variantName === 'development'), `${variantName}: invalid dev-client scheme policy`);
    invariant(eas.build?.[variantName]?.channel === variantName, `${variantName}: EAS channel mismatch`);
    invariant(eas.build?.[variantName]?.env?.APP_VARIANT === variantName, `${variantName}: EAS APP_VARIANT mismatch`);
    identifiers.add(expected.id);
    schemes.add(expected.scheme);
  }

  invariant(identifiers.size === 3, 'Variant application identifiers must be unique');
  invariant(schemes.size === 3, 'Variant schemes must be unique');
}

function assertCloudEnvironment(environment) {
  const output = run(`eas env:list ${environment} --format short`, { capture: true });
  const names = new Set(String(output).split(/\r?\n/).map(line => line.match(/^([A-Z0-9_]+)=/)?.[1]).filter(Boolean));
  const missing = REQUIRED_ENV_NAMES.filter(name => !names.has(name));
  invariant(missing.length === 0, `${environment}: missing EAS variables: ${missing.join(', ')}`);
}

function assertNoActiveAndroidBuilds() {
  const builds = JSON.parse(run('eas build:list --platform android --limit 10 --non-interactive --json', { capture: true }) || '[]');
  const active = builds.filter(build => ACTIVE_BUILD_STATUSES.has(String(build.status).replaceAll('-', '_').toUpperCase()));
  invariant(active.length === 0, `Active Android build exists: ${active.map(build => `${build.id} ${build.status}`).join(', ')}`);
}

function runDoctor() {
  run('npx --yes expo-doctor@latest');
}

function runFocusedTests() {
  run('npx jest src/features/discovery src/features/opportunities --runInBand');
}

function runAndroidExport() {
  rmSync(tempRoot, { recursive: true, force: true });
  mkdirSync(tempRoot, { recursive: true });
  try {
    run(`npx expo export --platform android --clear --output-dir "${resolve(tempRoot, 'android')}"`);
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
}

async function step(label, task) {
  process.stdout.write(`\n> ${label}\n`);
  await task();
  console.log(`PASS: ${label}`);
}

async function main() {
  const [major, minor] = process.versions.node.split('.').map(Number);
  invariant(major > 20 || (major === 20 && minor >= 19), `Node ${process.versions.node} is unsupported; use Node >=20.19.4`);
  await step('Variant configuration invariants', assertVariantConfigs);
  await step('Development EAS environment', () => assertCloudEnvironment('development'));
  await step('Preview EAS environment', () => assertCloudEnvironment('preview'));
  await step('Android build concurrency guard', assertNoActiveAndroidBuilds);
  await step('Expo Doctor', runDoctor);
  await step('Focused Jest', runFocusedTests);
  await step('Android export', runAndroidExport);
  console.log('\nMuse preview preflight passed.');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    console.error(`\nPREVIEW PREFLIGHT FAILED: ${error.message}`);
    process.exit(1);
  });
}
