---
name: muse-ota-preview-update
description: Validate, publish, verify, and troubleshoot Muse Android Preview OTA updates. Use for EAS Update, preview-channel releases, JS-only partner-demo changes, update compatibility checks, OTA rollback, or avoiding unnecessary Muse native builds.
---

# Muse OTA Preview Update

## Safety gate

Allow JS/TS UI, client logic, styles, copy, existing routes, queries, and JS-bundled assets.

Reject app/EAS config, package manifests, native folders or dependencies, permissions, plugins, identifiers, schemes, icons, splash configuration, Expo SDK changes, or runtime-version changes. Use `$muse-eas-preview-build` instead.

Require the installed Preview binary to use package `com.kaizenicai.muse.preview`, channel `preview`, and the same runtime as the update. Consult Expo MCP documentation when update flags or compatibility behavior may have changed.

## Preflight

1. Inspect the complete diff against the commit installed on the phone.
2. Require a committed, pushed Git SHA and record it in the update message.
3. Run focused tests for changed code and block new failures.
4. Run an Android export into a disposable directory with `APP_VARIANT=preview` and `EXPO_NO_DEPLOY=1`.
5. Confirm Preview EAS variables exist without printing their values.

## Publish

1. Ask for explicit approval immediately before uploading.
2. Publish Android only with `npm run update:preview -- --message "<message including Git SHA>"`.
3. Never publish to Development or Production as a fallback.
4. Capture the update group ID, Android update ID, runtime, channel, Git SHA, and dashboard URL.

## Verify and recover

Force-close and reopen Muse Preview up to twice, then verify an identifiable changed behavior. Confirm Muse Dev did not receive the update. If verification fails, inspect runtime/channel mismatch before republishing.

Report the OTA-safety decision, validation results, identifiers, device verification, and the exact rollback command or Expo dashboard action. Do not call an uploaded update successful until it runs on the installed Preview app.
