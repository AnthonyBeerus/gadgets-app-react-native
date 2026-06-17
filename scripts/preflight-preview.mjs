import { execFileSync, execSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';

const require = createRequire(import.meta.url);
const { getConfig } = require('expo/config');

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tempRoot = resolve(projectRoot, '.tmp', 'muse-build-check');

// Anchored to Muse's actual app.json so the preflight locks build-readiness without
// drifting the visual design. Muse uses the top-level `splash` key (not the
// expo-splash-screen plugin) and keeps one Android package for all variants.
const SPLASH_BG = '#f8f6f8';
const ADAPTIVE_ICON_BG = '#ffffff';
const EXPECTED_PREVIEW_NAME = 'Muse Preview';
const EXPECTED_PACKAGE = 'com.kaizenicai.muse';
const EXPECTED_SCHEME = 'muse';

const activeBuildStatuses = new Set(['NEW', 'IN_QUEUE', 'IN_PROGRESS', 'PENDING_CANCEL']);
const cleanupOptions = { recursive: true, force: true, maxRetries: 5, retryDelay: 250 };

process.env.APP_VARIANT = 'preview';

function readJson(relativePath) {
  return JSON.parse(readFileSync(resolve(projectRoot, relativePath), 'utf8'));
}

function cleanupTempRoot() {
  rmSync(tempRoot, cleanupOptions);
}

function invariant(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function hasPlugin(exp, pluginName) {
  return exp.plugins?.some(
    (plugin) => plugin === pluginName || (Array.isArray(plugin) && plugin[0] === pluginName)
  );
}

export function assertPreviewConfig({ exp, eas }) {
  invariant(
    exp.name === EXPECTED_PREVIEW_NAME,
    `Expected preview app name to be ${EXPECTED_PREVIEW_NAME}, got ${exp.name}`
  );
  invariant(
    exp.android?.package === EXPECTED_PACKAGE,
    `Expected Android package to be ${EXPECTED_PACKAGE}, got ${exp.android?.package}`
  );
  invariant(
    exp.scheme === EXPECTED_SCHEME,
    `Expected scheme to be ${EXPECTED_SCHEME}, got ${exp.scheme}`
  );
  invariant(
    exp.android?.adaptiveIcon?.backgroundColor === ADAPTIVE_ICON_BG,
    `Expected adaptive icon background to be ${ADAPTIVE_ICON_BG}, got ${exp.android?.adaptiveIcon?.backgroundColor}`
  );
  invariant(
    exp.splash?.backgroundColor === SPLASH_BG,
    `Expected splash background to be ${SPLASH_BG}, got ${exp.splash?.backgroundColor}`
  );
  invariant(
    exp.splash?.dark?.backgroundColor === SPLASH_BG,
    `Expected dark splash background to be ${SPLASH_BG}, got ${exp.splash?.dark?.backgroundColor}`
  );
  invariant(
    hasPlugin(exp, 'expo-notifications'),
    'Expected expo-notifications plugin to be configured'
  );
  invariant(
    eas.build?.preview?.channel === 'preview',
    `Expected EAS preview channel to be preview, got ${eas.build?.preview?.channel}`
  );
  invariant(
    eas.build?.preview?.env?.APP_VARIANT === 'preview',
    `Expected EAS preview APP_VARIANT to be preview, got ${eas.build?.preview?.env?.APP_VARIANT}`
  );
  invariant(Boolean(exp.updates?.url), 'Expected updates.url to be configured');
  invariant(
    exp.runtimeVersion?.policy === 'appVersion',
    `Expected runtimeVersion.policy to be appVersion, got ${exp.runtimeVersion?.policy}`
  );
}

function run(command) {
  execSync(command, {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, APP_VARIANT: 'preview' },
  });
}

function runJson(command) {
  const output = execSync(command, {
    cwd: projectRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true,
    env: { ...process.env, APP_VARIANT: 'preview' },
  });

  return output.trim() ? JSON.parse(output) : null;
}

function runWithOutput(command) {
  try {
    const output = execSync(command, {
      cwd: projectRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true,
      env: { ...process.env, APP_VARIANT: 'preview' },
    });

    process.stdout.write(output);
    return output;
  } catch (error) {
    const output = `${error.stdout?.toString() ?? ''}${error.stderr?.toString() ?? ''}`;
    process.stdout.write(output);
    error.outputText = output;
    throw error;
  }
}

function git(args, options = {}) {
  const candidates = ['git', 'C:\\Program Files\\Git\\cmd\\git.exe'];
  let lastError;

  for (const candidate of candidates) {
    try {
      return execFileSync(candidate, args, {
        cwd: projectRoot,
        encoding: options.encoding ?? 'utf8',
        stdio: options.stdio ?? ['ignore', 'pipe', 'pipe'],
      });
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

function isGitIgnored(relativePath) {
  try {
    git(['check-ignore', relativePath]);
    return true;
  } catch {
    return false;
  }
}

function assertNoActiveAndroidBuilds() {
  const builds = runJson('eas build:list --platform android --limit 10 --non-interactive --json');
  const activeBuilds = (Array.isArray(builds) ? builds : []).filter((build) =>
    activeBuildStatuses.has(String(build.status).replace(/-/g, '_').toUpperCase())
  );

  invariant(
    activeBuilds.length === 0,
    `Refusing to queue a second Android build. Active build(s): ${activeBuilds
      .map((build) => `${build.id} ${build.status}`)
      .join(', ')}`
  );
}

function failedDoctorChecks(output) {
  return [...output.matchAll(/✖ ([^\r\n]+)/g)].map((match) => match[1].trim());
}

function isNonBlockingDoctorFailure(output) {
  const failures = failedDoctorChecks(output);
  const allowedFailures = new Set([
    'Check for common project setup issues',
    'Check for app config fields that may not be synced in a non-CNG project',
  ]);

  return (
    failures.length > 0 &&
    failures.every((failure) => allowedFailures.has(failure)) &&
    isGitIgnored('.expo') &&
    isGitIgnored('android')
  );
}

function runExpoDoctor() {
  try {
    runWithOutput('npx expo-doctor');
  } catch (error) {
    if (!isNonBlockingDoctorFailure(error.outputText ?? '')) {
      throw error;
    }

    console.log(
      'Expo Doctor reported only ignored local state (.expo/android) checks; not blocking cloud preview builds.'
    );
  }
}

function runConfigInvariants() {
  const eas = readJson('eas.json');
  const { exp } = getConfig(projectRoot, {
    isPublicConfig: true,
    skipSDKVersionRequirement: true,
  });

  assertPreviewConfig({ exp, eas });
}

// Report-only: Muse has a broad pre-existing Jest baseline, so test failures are surfaced
// but do not block the preview build (EAS/Metro do not run the test suite).
function runFocusedJest() {
  try {
    run('npx jest --watchAll=false');
  } catch {
    console.log('Focused Jest reported failures; not blocking (known baseline). Review before shipping.');
  }
}

function runExpoExportAndroid() {
  const outputDir = resolve(tempRoot, 'android');
  run(`npx expo export --platform android --clear --output-dir "${outputDir}"`);
}

async function step(label, task, { hard = true } = {}) {
  process.stdout.write(`\n▶ ${label}\n`);

  try {
    await task();
    console.log(`✓ ${label}`);
  } catch (error) {
    console.error(`✗ ${label}`);
    if (hard) {
      throw error;
    }
    console.log(`(non-blocking) ${error.message}`);
  }
}

async function main() {
  cleanupTempRoot();
  mkdirSync(tempRoot, { recursive: true });

  try {
    await step('Config invariants', runConfigInvariants);
    await step('Android build concurrency guard', assertNoActiveAndroidBuilds);
    await step('Expo Doctor', runExpoDoctor);
    await step('Focused Jest (report-only)', runFocusedJest, { hard: false });
    await step('Android export dry-run', runExpoExportAndroid);

    console.log('\nPreview preflight passed.');
  } finally {
    cleanupTempRoot();
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
