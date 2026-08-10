# Muse

A UGC campaign platform for local businesses. A merchant briefs a campaign, funds a prize, and gets content back. A creator browses campaigns, joins, uploads, and gets paid.

Read `docs/product-strategy/muse-direction-locked.md` before changing product behaviour — it is the authoritative direction doc.

## The loop

**Merchant** — sign up → open a shop → create a campaign (brief, brand assets, prize, deadline, usage rights) → publish → review submissions → pick winners 1–5 → settle.

**Creator** — browse the Discover deck → open a brief → join (free, no purchase) → upload video or photos → track status through review to payout.

## Stack

- **Expo ~55 / React Native 0.83**, `expo-router` with routes in `src/app`
- **Clerk** for identity; **Supabase** for data, storage and edge functions
- **TanStack Query** for server state, **Zustand** for client state
- In-house design system at `src/shared/design-system` — build styles through `useThemedStyles(createStyles)` so dark mode works, and let each screen draw its own `ScreenHeader` (the native stack header is off globally)

## Layout

| Path | What lives there |
| --- | --- |
| `src/app/` | Expo Router routes; most are re-export stubs |
| `src/features/campaigns/` | The campaign primitive — domain, media pipeline, api, screens |
| `src/features/discovery/` | The Discover swipe deck and saved campaigns |
| `src/shared/lib/storage.ts` | Signed-URL upload that streams from disk, never through the JS heap |
| `supabase/migrations/` | Schema deltas only — **not** a full baseline; pull the remote schema before writing DDL |

## Running it

```bash
npm install
npm start            # Expo dev server
npm run test:ci      # jest
npx tsc --noEmit     # typecheck
```

`npm run lint:design-system` requires [ripgrep](https://github.com/BurntSushi/ripgrep) on PATH.

## Applying migrations

The `20260811*` migrations carry the pivot and are ordered — apply them in filename order. `20260811140000_commerce_teardown.sql` is **destructive** and must run last; back up first.
