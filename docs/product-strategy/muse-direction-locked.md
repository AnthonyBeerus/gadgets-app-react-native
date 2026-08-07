# Muse product direction (locked)

**Last updated:** 2026-08-07  
**Status:** Direction locked for pilot — implement against this, not older “marketplace company” framing  
**Branch snapshot:** `mvp-refinement-gut-ugc-ai`

This is the memory doc for the finer details. Older research in `ugc-marketplace-audit-and-research.md` and `.codex-audit/` still has useful comps; **this file wins when they conflict**.

---

## One-line thesis

Muse helps **local merchants grow** by funding competitive, purchase-gated content challenges — not by becoming “another Botswana marketplace.”

---

## Who it is for

| Role | Job | Notes |
| --- | --- | --- |
| **Primary customer** | Merchant (Molapo / Gaborone SMEs: food, beauty, services) | Growth = foot traffic, WhatsApp closes, reusable creative cheaper than agencies |
| **Participant** | Anyone who will make content as a side hustle | Youth supply; **UB student was only an example** — do not over-index on campus |

---

## What Muse is / is not

| Keep | Kill (as identity) |
| --- | --- |
| Product catalog, buy/cart, till proof | “We are a marketplace company” competing on selection + logistics + GMV |
| Commerce ↔ social loop | Pure creator marketplace / DM collab board |
| WhatsApp still closing sales | Replacing WhatsApp as the close channel in pilot |

**Products stay** as inventory + conversion rails. Differentiator is the loop: **buy/till proof → post → rights/rewards**, not catalogue density.

---

## Canonical product: competitive challenge pots

Restaurant-shaped loop (applies to salons, braai, lunch boxes, etc.):

1. Merchant funds a **voucher pot** and picks qualifying products/services  
2. User **buys** a qualifying SKU in Muse **or** claims a **till purchase code**  
3. User posts a **public TikTok** and submits (with rights)  
4. Merchant/admin **approves** (quality + rights gate)  
5. Live **leaderboard**; at deadline merchant hits **Settle**  
6. Top placers get tier vouchers; other approved entries get a small **consolation** voucher  

### Locked rules (do not casually change)

| Decision | Choice |
| --- | --- |
| Pot split | Top **5** share **40 / 25 / 15 / 10 / 10** |
| Score | `likes + 3×comments + 2×saves` — **views are vanity only**, not ranking |
| Prize | **Merchant vouchers only** (shop credit) — no Muse cash wallet |
| Consolation | Fixed small voucher for approved non-placers (merchant-set, ~P20–P50 default) |
| Entry | Purchase proof required (Muse order **or** till code) |
| Qualifying SKUs | **Multi-product** allowed (“any meal”, “any nail set”) |
| Discover swipe | **Save / Pass only** — Buy/Enter live on details, not on the card |
| Thin inventory | If active challenges **&lt; 5** → **list**, not Tinder deck |
| Pilot metrics | **Manual** paste of likes/comments/saves (TikTok API later) |

**Pitch template:**  
“Post while dining here this weekend. Buy any meal through Muse (or claim till code) to enter. Top 5 engagement share a P1,000 voucher pot; every approved post still gets a small voucher.”

---

## Discover + marketplace

- **Discover** = swipe deck of live challenge cards (pot, deadline, buy-to-enter, Save/Pass)  
- **Marketplace** = search/browse products + merchants when you already know what you want  
- **Saved** = shortlist from right-swipes; saving does **not** enter you  
- Showcase builds may inject **ad slots** every N cards to stress merchant placement value — not required for pilot economics

---

## Competitive wedge (why this, not comps alone)

Pieces already exist elsewhere (FanBitz, Idukki, Euka/Growi TikTok Shop contests, CollabSwipe, ShoutOut, GYG burrito contest).  

**Muse opening:** one local consumer app that combines **products + pot + swipe + purchase proof + board + rights** for Molapo-scale merchants — not Shopify SaaS contests and not views-only restaurant campaigns.

---

## Pilot success (what “working” means)

- Merchants fund pots and settle without Muse ops heroics  
- Entrants understand: buy → post → compete → voucher  
- Approved posts are reusable creative the merchant would otherwise pay for  
- WhatsApp can still close; Muse owns brief → proof → board → settle  

Not success: raw GMV as marketplace, content volume without merchant reuse, or campus-only positioning.

---

## Implementation anchors (code / DB)

| Area | Where |
| --- | --- |
| Schema / RPCs | `supabase/migrations/20260807171427_competitive_challenge_pots.sql` (+ feed fix / limit migrations dated 20260807) |
| Discover | `src/features/discovery/` |
| Entry / review / settle | challenges screens + `CampaignReviewScreen`, merchant community challenges |
| Types | `src/shared/types/database.types.ts` |

Remote project used in this phase: **project-muse-rebuild**. Showcase seed data (100+ pots, Molapo mall) may exist in that DB for demos — **trim before real pilot**.

---

## Explicitly deferred

- TikTok API auto-metrics  
- Muse cash wallet / payouts  
- Campus ambassador programme as the product  
- Killing the product catalog  
- Views-only leaderboards  

---

## If you only remember three things

1. **Merchant growth first**; youth creators are supply.  
2. **Competitive pot + purchase proof + voucher settle** is the product.  
3. **Marketplace stays as rails**; Discover is challenges, not “shop the mall.”
