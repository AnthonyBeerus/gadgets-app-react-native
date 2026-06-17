---
name: muse-eas-preview-build
description: Muse-specific workflow for validating, triggering, and monitoring Android preview EAS native builds. Use when asked to prepare, preflight, run, or troubleshoot a preview APK build, especially after native config, plugin, splash/icon, package, Expo version, or runtime-sensitive changes.
---

# Muse EAS Preview Build

## Overview

Use this workflow to ship native Android preview builds for Muse safely. It is the companion to
`muse-ota-preview-update`: OTA handles JS-only preview updates; this skill handles changes that
require a new native binary. For SDK/package refreshes first consult
`.agent/skills/muse-android-preview-build/SKILL.md`, then return here to ship.

Consult the Expo skills for general concepts: `.agent/skills/dev-client/SKILL.md` (build
expectations) and `.agent/skills/deployment/SKILL.md` (EAS commands).

## Build-vs-OTA Gate

Use this build workflow when the diff touches:
- `app.json`, `app.config.js`, `eas.json`, package files, native folders, permissions, plugins,
  schemes, icons, splash config, Expo version, or native dependency changes.
- Any runtime-version change intended for the current installed preview APK.
- Any new native module or native behavior not already in the installed binary.

Use `muse-ota-preview-update` instead for JS-only UI/client-logic changes that are OTA-safe.

Humans use `npm run build:preview:android` (which runs the preflight first). Do not run a raw
`eas build` for preview without first passing the preflight and getting explicit approval.

## Environment

- Node must satisfy the active Expo SDK requirement (SDK 55: `^20.19.4`, `^22.13.0`, `^24.3.0`, or
  `^25.0.0`). System Node may be too low; run with a supported Node + Git on PATH:
  ```powershell
  $env:Path = 'C:\Program Files\Git\cmd;C:\Users\morim\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;' + $env:Path
  $env:NPM_CONFIG_LEGACY_PEER_DEPS = 'true'
  ```
- Keep the project in Continuous Native Generation mode. Do not commit generated `android/`/`ios/`.
- The Expo MCP is not available in this repo; use the `eas-cli` CLI.

## Local Preflight

Run the hardened preview preflight:

```powershell
npm run preflight:preview
```

It covers (see `scripts/preflight-preview.mjs`):
- **Config invariants (hard gate):** preview app name `Muse Preview`, Android package
  `com.kaizenicai.muse` (Firebase-matching, constant across variants), scheme `muse`, adaptive icon
  background `#ffffff`, splash background `#f8f6f8` (light + dark), `expo-notifications` plugin
  present, EAS `preview` channel + `APP_VARIANT=preview`, `updates.url` set, and
  `runtimeVersion.policy = appVersion`.
- **Android build concurrency guard (hard gate):** `eas build:list --platform android --limit 10
  --non-interactive --json`; refuses to queue if any Android build is `NEW`, `IN_QUEUE`,
  `IN_PROGRESS`, or `PENDING_CANCEL`.
- **Expo Doctor:** non-blocking only for ignored local-state checks (`.expo`/`android` gitignored).
- **Focused Jest (report-only):** Muse has a broad baseline of failing tests; failures are reported,
  not fatal. Review before shipping.
- **Android export dry-run (hard gate):** the primary "can it build" signal.

There is no `tsc` gate (the repo has a typecheck baseline; EAS/Metro do not typecheck the bundle).

## Build Workflow

After the preflight passes:

1. Ask for explicit user approval before triggering any EAS build — it uploads the repo and may
   consume EAS build quota.
2. Re-confirm the concurrency guard is clean (the preflight already checks; do not queue a second
   active Android build).
3. Trigger the build:
   ```powershell
   eas build --profile preview --platform android
   ```
   (`npm run build:preview:android` runs the preflight then this command.) Use the `preview` profile;
   do not switch to production, submit to stores, or publish OTA from this workflow.
4. Monitor with `eas build:list` / the build URL printed by the CLI.
5. If the build errors, read the failing task from the EAS logs and report the focused cause. Do not
   dump the full log.

## Report Back

Report:
- Build-vs-OTA decision.
- Preflight result for each gate (config invariants, concurrency guard, Doctor, Jest report, export).
- If triggered: build id, status, profile (`preview`), channel (`preview`), platform (`android`),
  git ref, artifact URL, and dashboard URL when available.
- If blocked or failed: the exact blocker and the next fix or approval needed.
