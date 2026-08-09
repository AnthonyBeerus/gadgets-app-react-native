# Muse product direction (locked)

**Last updated:** 2026-08-09
**Status:** Direction locked for partner prototype — this cash-payout revision supersedes voucher framing
**Branch snapshot:** `mvp-refinement-gut-ugc-ai`

This is the memory doc for the finer details. Older research in `ugc-marketplace-audit-and-research.md` and `.codex-audit/` still has useful comps; **this file wins when they conflict**.

---

## One-line thesis

Muse helps **local businesses and institutions turn creator participation into measurable commerce and funding** through cash-paid content competitions, sponsored discovery and shoppable local experiences.

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

1. Merchant funds the **accepted-entry fees and ranked cash prize pot** and picks qualifying products/services
2. User **buys** a qualifying SKU in Muse **or** claims a **till purchase code**  
3. User posts a **public TikTok** and submits (with rights)  
4. Merchant/admin **approves** (quality + rights gate)  
5. Live **leaderboard**; at deadline merchant hits **Settle**  
6. Every accepted entry earns the disclosed cash fee; top placers additionally share the ranked cash prize pot

### Locked rules (do not casually change)

| Decision | Choice |
| --- | --- |
| Pot split | Top **5** share **40 / 25 / 15 / 10 / 10** |
| Score | `likes + 3×comments + 2×saves` — **views are vanity only**, not ranking |
| Prize | Merchant-funded cash pot paid through Stripe; Orange Money is the second payout adapter |
| Accepted-entry fee | Fixed cash fee for every approved, compliant entry; the merchant pre-funds the maximum liability |
| Entry | Purchase proof required (Muse order **or** till code) |
| Qualifying SKUs | **Multi-product** allowed (“any meal”, “any nail set”) |
| Discover swipe | **Save / Pass only** — Buy/Enter live on details, not on the card |
| Thin inventory | If active challenges **&lt; 5** → **list**, not Tinder deck |
| Pilot metrics | **Manual** paste of likes/comments/saves (TikTok API later) |

**Pitch template:**  
“Post while dining here this weekend. Buy any meal through Muse (or claim till code) to enter. Every accepted post earns P50, and the top five share an additional P1,000 cash prize pot.”

---

## Discover + Shops

- **Discover** = swipe deck of live challenge cards (pot, deadline, buy-to-enter, Save/Pass)  
- **Shops** = merchant-first browsing for businesses funding creators; products appear as qualifying conversion rails within each business
- **Saved** = shortlist from right-swipes; saving does **not** enter you  
- Showcase builds inject clearly labelled **generated sponsored-demo slots** every four opportunity cards to demonstrate merchant placement value and open the revenue model.
- When the live feed is unavailable or empty, the partner prototype uses clearly labelled, locally researched fixture campaigns. These never enter live payment or settlement paths.
- The partner prototype centers Molapo merchants, creator briefs, illustrative external-social outcomes and qualifying commerce. It does not claim to be an all-in-one directory, booking platform or national local-business catalogue.
- Browse Botswana is treated as a broad directory/storefront competitor. Muse differentiates on the measurable loop: **merchant funding → creator brief → external social content → qualifying commerce → merchant growth**.

---

## Competitive wedge (why this, not comps alone)

Pieces already exist elsewhere (FanBitz, Idukki, Euka/Growi TikTok Shop contests, CollabSwipe, ShoutOut, GYG burrito contest).  

**Muse opening:** one local consumer app that combines **products + pot + swipe + purchase proof + board + rights** for Molapo-scale merchants — not Shopify SaaS contests and not views-only restaurant campaigns.

---

## Pilot success (what “working” means)

- Merchants fund pots and settle without Muse ops heroics  
- Entrants understand: buy → post → earn an acceptance fee → compete for cash prizes
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
| Open a shop | `/open-shop` → `src/features/merchant/screens/OpenShopScreen.tsx` (outside merchant guard); Profile + auth intent; dashboard launch checklist |
| Types | `src/shared/types/database.types.ts` |

Remote project used in this phase: **project-muse-rebuild**. Showcase seed data (100+ pots, Molapo mall) may exist in that DB for demos — **trim before real pilot**.

---

## Explicitly deferred

- TikTok API auto-metrics  
- An internal Muse stored-value wallet; payouts go directly through Stripe or Orange Money
- Campus ambassador programme as the product  
- Killing the product catalog  
- Views-only leaderboards  

---

## If you only remember three things

1. **Merchant growth first**; youth creators are supply.  
2. **Accepted-entry fee + ranked cash pot + purchase proof** is the product.
3. **Shops keeps commerce as rails**; merchant-funded creator growth is the identity, not catalogue breadth.
