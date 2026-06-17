---
name: muse-android-preview-build
description: Muse-specific workflow for refreshing Expo packages and validating Android EAS preview builds. Use when asked to update stale packages, upgrade the Muse Expo SDK, run Expo Doctor, prepare or troubleshoot Android preview builds, validate EAS preview readiness, or confirm whether this repo can run as a preview build.
---

# Muse Android Preview Build

## Overview

Use this workflow to update Muse through Expo-compatible package versions and validate Android EAS preview builds. This skill adds repo-specific guardrails; consult the Expo skills first for the general workflow.

Required skill order:
- SDK/package changes: `.agent/skills/upgrading-expo/SKILL.md`
- Preview/development build expectations: `.agent/skills/dev-client/SKILL.md`
- EAS build/deployment commands: `.agent/skills/deployment/SKILL.md`

## Upgrade Rules

- Check `node --version` before package work. Expo SDK 55 requires Node `^20.19.4`, `^22.13.0`, `^24.3.0`, or `^25.0.0`.
- Prefer Expo-managed versions:

```powershell
npx expo install expo@latest
npx expo install --fix
```

- Use `NPM_CONFIG_LEGACY_PEER_DEPS=true` when npm hits the known `@rneui/themed` peer dependency conflict.
- Do not chase unrelated package major versions unless Expo Doctor, SDK compatibility, or build errors require them.
- Keep the project in Continuous Native Generation mode. Do not commit generated `android/` or `ios/` directories.
- Do not run OTA publish commands from this workflow.

## Preflight Workflow

1. Inspect git status and confirm no unrelated native/generated changes are mixed in.
2. Verify Node satisfies the active Expo SDK requirement.
3. Run the Expo upgrade commands from the Expo skill workflow.
4. Run diagnostics:

```powershell
npx expo-doctor
npx expo install --check
```

Only run `expo install --check` when Doctor suggests dependency validation or the dependency state is unclear.

5. Run static and unit checks (report-only — the repo has a broad pre-existing TypeScript and Jest
   baseline, and EAS/Metro do not typecheck or test the bundle). Surface results and whether
   failures are new vs. baseline; do not treat baseline failures as a hard blocker for a preview
   build:

```powershell
npx tsc --noEmit
npm run test:ci -- --runInBand
```

6. Run the Android export preflight:

```powershell
npx expo export --platform android --clear --output-dir C:\tmp\muse-android-preview-export-check
```

## Choose Your Ship Path

After upgrading and validating, pick the ship path and follow that skill:
- **Native binary needed** (config/native/plugin/package/Expo-version/runtime changes) →
  `.agent/skills/muse-eas-preview-build/SKILL.md`.
- **JS-only change** (OTA-safe UI/client logic) →
  `.agent/skills/muse-ota-preview-update/SKILL.md`.

## Preview Build

Remote EAS builds upload code and consume build resources. Ask for explicit user approval before starting one.

Prefer `npm run build:preview:android` (runs the hardened preflight first). Build Android preview
only unless the user requests another target:

```powershell
npx eas-cli@latest build --profile preview --platform android
```

Use the existing `preview` profile in `eas.json`; do not switch to production, submit to stores, or publish OTA updates unless explicitly requested.

## Report Back

Report:
- Node version used and whether it satisfies the SDK requirement.
- Expo Doctor and dependency-check result.
- TypeScript result.
- Jest result, including whether failures look new or baseline.
- Export preflight result and output path.
- EAS preview build status when run: build ID, artifact URL if available, dashboard URL, profile, and platform.
- Exact blockers and required fixes when not build-ready.
