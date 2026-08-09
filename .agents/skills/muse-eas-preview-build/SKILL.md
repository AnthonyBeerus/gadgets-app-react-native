---
name: muse-eas-preview-build
description: Validate, trigger, monitor, and diagnose Muse native EAS builds. Use for Muse development or preview APK builds, build-readiness checks, side-by-side app variants, native dependency or config changes, EAS build failures, and deciding whether a Muse change requires a new binary rather than OTA.
---

# Muse EAS Preview Build

## Decide build versus OTA

Use this workflow when the diff changes app config, EAS config, package manifests, native dependencies, permissions, plugins, schemes, identifiers, icons, splash assets, Expo SDK/native versions, or runtime version.

Use `$muse-ota-preview-update` for JS/TS, styling, copy, and bundled-asset changes that remain compatible with the installed Preview runtime.

## Preflight

1. Inspect the diff and state whether a native build is required.
2. Run `npm run preflight:preview`. Treat every failure as blocking.
3. Report broad TypeScript or Jest baselines separately; never waive a new failure in the changed area.
4. Confirm the intended Git commit is committed, pushed, and reachable from `origin`.
5. Use Expo MCP documentation when build flags, SDK behavior, or EAS policy may have changed.

Muse invariants:

- Development: `com.kaizenicai.muse.dev`, `muse-dev`, channel `development`.
- Preview: `com.kaizenicai.muse.preview`, `muse-preview`, channel `preview`.
- Production: `com.kaizenicai.muse`, `muse`, channel `production`.
- Runtime policy: `appVersion`; current native baseline: `1.1.0`.
- Android is the verified platform. Treat iOS configuration as static-only until an Apple build is explicitly requested.

## Trigger and monitor

1. Ask for explicit approval immediately before consuming an EAS build.
2. Call Expo MCP `build_list`. Stop if Android has a `NEW`, `IN_QUEUE`, `IN_PROGRESS`, or `PENDING_CANCEL` build.
3. Call Expo MCP `build_run` with the approved pushed Git SHA, platform `ANDROID`, and profile `development` or `preview`.
4. Poll with `build_info`; do not claim success while queued or running.
5. On failure, call `build_logs` and report the focused failing phase and cause.

## Verify and report

Install the APK without uninstalling the other Muse variant. For Development, start `npm run start:dev:mcp` and use Expo local MCP tools for route, screenshot, interaction, and log checks. A cloud build alone is not partner-ready.

Report the build-vs-OTA decision, every preflight gate, Git SHA, profile, channel, runtime, build ID/status, artifact URL, physical-device verification, and any backend blocker separately from native build health.
