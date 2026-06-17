---
name: muse-ota-preview-update
description: Muse-specific workflow for validating and publishing Android preview OTA updates with EAS Update. Use when asked to prepare, validate, preflight, publish, or troubleshoot an OTA update for this repo, especially preview-channel Android updates, Expo Router JS changes, or requests mentioning EAS Update, preview OTA, or avoiding EAS build quota.
---

# Muse OTA Preview Update

## Overview

Use this workflow to ship JS-only Android preview OTA updates for Muse safely. It is the companion
to `muse-eas-preview-build`: that skill handles native binaries; this one handles JS-only updates
delivered over the `preview` channel via EAS Update. Consult `.agent/skills/deployment/SKILL.md`
for general EAS Update concepts.

Prerequisite: a native preview build (`muse-eas-preview-build`) with `expo-updates`, `updates.url`,
and `runtimeVersion.policy = appVersion` must already be installed on the device. An OTA update only
reaches binaries built on the same runtime version.

## OTA Safety Gate

Before publishing, confirm the change is OTA-safe.

Safe:
- JS/TS UI and client-logic changes.
- Existing route, hook, query, styling, and copy changes.
- JS-bundled assets that do not require native config changes.

Not safe; requires a new APK via `muse-eas-preview-build` instead:
- `app.json`, `app.config.js`, `eas.json`, package files, native folders, permissions, plugins,
  schemes, icons, splash config, Expo version, or native dependency changes.
- Any runtime-version change intended for the current installed preview APK.
- Any new native module or native behavior not already in the installed binary.

## Environment

Run with a supported Node + Git on PATH (SDK 55 requires Node `^20.19.4`/`^22.13.0`/`^24.3.0`/`^25`):

```powershell
$env:Path = 'C:\Program Files\Git\cmd;C:\Users\morim\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;' + $env:Path
$env:NPM_CONFIG_LEGACY_PEER_DEPS = 'true'
```

## Preflight Workflow

1. Inspect the diff and confirm no native/runtime-sensitive files changed (see the safety gate).
2. Run focused Jest tests relevant to the changed area. Muse has a broad failing baseline; block
   only on failures newly introduced by the current change, and report pre-existing baseline
   failures clearly.
3. Run the Android export dry-run:
   ```powershell
   npx expo export --platform android --clear --output-dir C:\tmp\muse-ota-preview-check
   ```

## Publishing

Publishing uploads OTA artifacts/code to EAS. Get explicit user approval acknowledging the upload
before publishing.

Publish to the Android preview channel only:

```powershell
eas update --channel preview --platform android --message "<clear update message>"
```

(`npm run update:preview` runs the same command.) Use `preview` as the channel and `android` as the
platform unless the user explicitly requests otherwise. Do not make an EAS build from this workflow.

## Report Back

After the run, report:
- OTA-safety result.
- Focused Jest result, including whether failures are new or baseline.
- Export preflight result and output path.
- If published: EAS update group id, Android update id, runtime version, and dashboard URL.
- If not published: the exact blocker and what approval or fix is needed.
