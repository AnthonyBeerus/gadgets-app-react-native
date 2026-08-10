# Muse product direction (locked)

**Last updated:** 2026-08-10
**Status:** Direction locked — UGC campaign platform. This supersedes the cash-payout / purchase-proof revision below it.
**Branch snapshot:** `codex/muse-partner-prototype`

This is the memory doc for the finer details. Older research in `ugc-marketplace-audit-and-research.md` and `.codex-audit/` still has useful comps; **this file wins when they conflict**.

---

## One-line thesis

Muse is where **a local business launches a content campaign and gets content back**. Merchants brief, fund a prize, and pick winners. Creators browse, join, upload, and get paid.

---

## Who it is for

| Role | Job | Notes |
| --- | --- | --- |
| **Primary customer** | Merchant (Molapo / Gaborone SMEs: food, beauty, services) | Growth = reusable creative, cheaper than an agency, plus reach from creators posting |
| **Participant** | Anyone who will make content as a side hustle | Youth supply; **UB student was only an example** — do not over-index on campus |

---

## The canonical loop

1. Merchant signs up, opens a shop, and **creates a campaign**: title, brief, talking points, do's and don'ts, format and length, deliverable count, **brand assets**, prize pot, deadline, **usage rights**, revision policy, review SLA.
2. Merchant **publishes**. `publish_campaign` refuses a campaign with no funded pot, no brand assets, or a past deadline.
3. Creators **browse** the Discover deck, open a brief, and **join** — free, no purchase, no gate.
4. Creator **uploads** video or photos in-app. Muse hosts the file; the merchant gets a usable asset. An optional social link is accepted for creators who already posted.
5. Merchant **reviews** in a dashboard: approve, reject, or **request changes** (bounded by the campaign's revision allowance, note required).
6. Merchant **closes** the campaign, **ranks winners 1–5**, and settles. The pot pays out through `reward_vouchers`.

### Locked rules (do not casually change)

| Decision | Choice |
| --- | --- |
| Entry | **Open**. No purchase proof, no till code, no qualifying SKU |
| Submission | **Uploaded to Muse** (video/photo), optional social link. 200MB cap, private bucket |
| Winner | **Merchant picks manually**, ranked 1st–5th. No engagement formula |
| Pot split | Top 5 share **40 / 25 / 15 / 10 / 10**, **renormalised** over the ranks actually filled — a 3-winner campaign spends the whole pot |
| Usage rights | Explicit on every brief: none / organic 12m / paid ads 12m / perpetual |
| Revisions | Merchant sets an allowance per campaign; a revision request must carry a note |
| Review SLA | Merchant-set, 1–30 days, shown to creators. Industry norm is 3–7 |
| Discover | **Tinder swipe deck** — Save / Pass. Below 5 live campaigns it renders a list instead (`SWIPE_DECK_MIN`) |
| Commerce | **Deleted.** No cart, checkout, orders, products or storefront |

---

## What changed from the previous locked direction

The prior revision required a **qualifying purchase** to enter, ranked winners by `likes + 3×comments + 2×saves`, and deliberately **never hosted media** (creators pasted a TikTok link). All three are gone:

- Purchase proof was friction on the supply side and kept the whole commerce stack on the critical path.
- An engagement leaderboard rewards reach, not the creative the merchant is buying — and it cannot run without TikTok metrics.
- Link-only submission meant the merchant never actually received a reusable asset, which is the thing every comparable platform sells.

Retained: merchant growth first, creators as supply, cash prizes, the Molapo pilot framing.

---

## Competitive grounding

Feature set is deliberately conventional — Billo, Trend.io, Insense, Collabstr for the marketplace shape; Woobox, Gleam, Easypromos for contest mechanics. Standard brief fields, standard review states (pending → approved / rejected / revision-requested), standard winner-picking dashboard. **Muse's opening is the market, not the mechanic**: a Setswana-market, mobile-first campaign platform priced for Molapo-scale merchants.

---

## Implementation anchors (code / DB)

| Area | Where |
| --- | --- |
| Clerk identity repair | `supabase/migrations/20260811090000_clerk_campaign_identity.sql` |
| Campaign brief schema | `supabase/migrations/20260811100000_campaign_brief_and_assets.sql` |
| Storage + RLS | `supabase/migrations/20260811110000_campaign_storage.sql` |
| Review / winners / settle | `supabase/migrations/20260811120000_campaign_review_and_winners.sql` |
| Feed / join / submit | `supabase/migrations/20260811130000_campaign_feed_and_join.sql` |
| Commerce teardown | `supabase/migrations/20260811140000_commerce_teardown.sql` |
| Campaign feature | `src/features/campaigns/` (domain, media, api, screens, components) |
| Upload pipeline | `src/shared/lib/storage.ts`, `src/features/campaigns/media/` |
| Discovery deck | `src/features/discovery/` — deck mechanics unchanged, card fields now campaign-shaped |
| Route contract | `src/app/__tests__/handoff-routes.test.ts` |

Buckets: `challenge-submissions` (private, creator + reviewing merchant only) and `campaign-assets` (public brand material).

---

## Explicitly deferred

- Creator payouts beyond the voucher rail (Stripe Connect / Orange Money direct)
- Auto-metrics from any social platform
- Campus ambassador programme as the product
- Bringing back a catalogue

---

## If you only remember three things

1. **A business launches a campaign and gets content back.** That is the whole product.
2. **Open join, uploaded content, merchant-picked winners.**
3. **Usage rights and revisions are first-class**, because they are what the merchant is actually buying.
