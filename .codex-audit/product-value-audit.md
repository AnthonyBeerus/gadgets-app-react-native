# Muse Product Value Audit

> **Direction update:** The earlier recommendation in this document to defer UGC is superseded by the companion research brief, `ugc-commerce-product-thesis.md`. UGC should remain core, but be rebuilt as a verified post-purchase growth loop rather than a separate challenge marketplace.

Date: 2026-07-15

## Executive verdict

Muse is currently a portfolio of product ideas presented as one MVP. It asks customers to understand shopping, services, challenges, events, gems, subscriptions, virtual try-on, and orders, while asking vendors to operate products, services, events, challenges, community, fulfillment, and analytics. This breadth weakens the core promise and creates several cold-start marketplaces at once.

The recommended launch wedge is **Molapo-first local commerce**:

- Customer promise: **See what is available at Molapo today, buy or reserve it, and collect it with confidence.**
- Vendor promise: **Turn Molapo foot traffic into measurable orders and repeat customers with a storefront that takes minutes to manage.**

This is narrower than the current PRD, but it creates one loop where customer and vendor value reinforce each other:

`vendor lists available product -> customer discovers it -> customer orders for collection -> vendor fulfills it -> customer returns`

## Where the project stopped

- Current branch: `mvp-refinement-gut-ugc-ai`.
- Latest commit: `87604cd MVP refinement: gut UGC AI, real submissions, streamline booking`.
- That commit removed the AI-tools marketplace and duplicate booking flows, but invested further in hosted challenge submissions.
- The following task implemented an empty-database launch pass and remains uncommitted: merchant setup, real dashboard metrics, empty shopper states, location fallback, product-image storage, checkout/order fixes, and commerce RLS migrations.
- The relevant live Supabase migrations were applied in the previous task, but the local migration files remain untracked and must not be discarded.
- A targeted merchant-dashboard test passes. The full combined test/type command did not complete within two minutes, so the broader baseline remains unverified.

## What is working in the current direction

- Removing mock merchant revenue and pending-order numbers is correct.
- Replacing developer merchant activation with a real shop-creation contract is correct.
- Requiring a real product image and owner-scoped storage paths is correct.
- Making payment cancellation and stock changes consistent is necessary.
- Empty states are better than blank screens and hard-coded fake inventory.
- Removing the AI-tools marketplace was a good scope cut.

These are foundations, not yet a customer or vendor value proposition.

## Critical product and flow findings

### 1. Merchant onboarding is unreachable

The Profile action sends a non-merchant to `/(merchant)`, but the merchant layout redirects anyone who is not already a merchant back to `/(shop)`. The new onboarding form inside the merchant dashboard therefore cannot be reached through the intended customer-facing path.

Action: move onboarding to a signed-in route outside the merchant-only group, then enter merchant mode only after shop creation succeeds.

### 2. The app launches several two-sided marketplaces at once

Shop, services, events, and challenges each require distinct supply, discovery, trust, moderation, and fulfillment. Gems and subscriptions add another economic system before the core transaction loop has proven repeat use.

Action: launch products plus collection orders. Treat services, events, challenges, gems, and subscriptions as experiments or later layers.

### 3. Navigation communicates breadth, not a job to be done

The customer tab bar gives equal status to Shop, Services, Challenges, Events, and Profile, with Challenges elevated as the floating primary action. The merchant bar similarly exposes Dashboard, Catalog, generic Create, Community, and Profile. The generic Create sheet asks a vendor to choose among Product, Service, Challenge, and Event.

Action: customer navigation should be `Discover`, `Orders`, `Profile`. Merchant navigation should be `Home`, `Catalog`, `Orders`, `Profile`. Make the primary vendor action `Add product`, not `Create New`.

### 4. Authentication arrives before value

The shopper group redirects every signed-out visitor to authentication. Public storefront data is already intended to be readable, so the app could demonstrate value before asking for an account.

Action: allow guest discovery, storefront, and product-detail browsing. Require sign-in only when saving state, ordering, or becoming a vendor.

### 5. The product's geographic identity is inconsistent

The PRD is Molapo/Botswana/Pula-led, while current forms mention Johannesburg, New York, dollar pricing, generic online shops, and Molapo-only rewards in different places.

Action: make the MVP deliberately Molapo/Botswana-led. Use BWP/Pula, Botswana locations, collection instructions, and one coherent local voice throughout.

### 6. Challenges have drifted from the PRD and introduce heavy operations

The PRD says content is posted externally and Muse never hosts it. The latest commit instead uploads image/video submissions into Muse storage. This creates moderation, storage, rights, safety, scoring, and payout obligations before the commerce loop is proven.

Action: remove Challenges from primary navigation. If retained as an experiment, use external post links and manual campaign operations for a small set of partner vendors; do not launch a general hosted UGC platform.

### 7. Monetization copy promises removed or unproven value

Gem Shop and Paywall still promise unlimited AI generation, thousands of premium members, 1000+ members, premium challenges, and fallback gem purchases. The Gem Shop exposes a test-credit button when balance is zero.

Action: hide Gems and subscriptions from launch. Monetize through completed commerce first; add loyalty only after repeat-purchase behavior exists.

### 8. Services and events are not launch-complete

Service creation still uses `merchantShopId` as a provider ID even though the auth layer now tracks a distinct `merchantProviderId`. Event detail navigation is a TODO, and event check-in awards gems through a client-triggered action.

Action: defer service booking and event check-in. If physical events are a real Molapo acquisition channel, show them as curated cards inside Discover without launching a separate ticket/reward marketplace.

### 9. Empty-state language leaks marketplace weakness

Shopper copy currently tells customers that merchants are still setting up and suggests opening their own shop. That explains the platform's supply problem instead of helping the shopper accomplish something.

Action: provide a useful fallback such as featured Molapo destinations, opening hours, upcoming programming, or a concise notification opt-in. Keep vendor acquisition prompts out of shopper empty states.

### 10. Accessibility and discoverability risks remain

Both custom tab bars are icon-only. They set button roles and selected state but do not expose visible labels or explicit accessibility labels. The meaning of the icons must be learned, and Challenge receives unexplained visual priority.

Action: use labeled tabs, standard hit targets, and explicit accessibility labels. Confirm contrast, focus, text scaling, and screen-reader order on a working native build.

## Recommended scope decision

| Capability | Decision | Reason |
| --- | --- | --- |
| Shop discovery and search | Keep | First customer value moment |
| Storefront and product details | Keep | Builds trust and purchase intent |
| Cart, Stripe checkout, collection orders | Keep | Proves transaction value |
| Customer order tracking and collection QR | Keep | Completes the customer loop |
| Merchant onboarding | Keep and repair | Required supply-side activation |
| Merchant catalog and order management | Keep | Core vendor utility |
| Delivery | Defer | Operationally heavier than collection |
| Services marketplace and booking | Defer | Separate supply model; provider identity is unfinished |
| Events marketplace/check-in rewards | Defer | Separate operational loop; details are incomplete |
| Challenges/leaderboards/hosted submissions | Hide from MVP | Moderation and campaign operations outweigh proven value |
| Gems | Hide from MVP | Currency before utility creates confusion |
| Subscriptions/paywall | Hide from MVP | Monetizes unproven benefits and contains false/stale claims |
| Virtual try-on and AI endpoints | Remove from launch surface | High cost and complexity outside the core loop |
| Ride-hailing | Remove from scope | No direct role in the launch transaction loop |

## Code adjustment sequence

### Phase 0: preserve and stabilize the unfinished launch work

1. Keep the four untracked commerce/security migration files; reconcile their applied live state before renaming or squashing anything.
2. Move shop onboarding out of the guarded merchant route.
3. Install a fresh SDK 55 native development/preview build. The installed build is SDK 54-era and cannot render the current bundle.
4. Re-run the full targeted commerce test set and native smoke test.

### Phase 1: make the value proposition visible in code

1. Reduce customer tabs to Discover, Orders, and Profile.
2. Reduce merchant tabs to Home, Catalog, Orders, and Profile.
3. Change the merchant primary action to Add Product.
4. Permit guest discovery; gate checkout and merchant onboarding.
5. Make collection the default fulfillment path and hide delivery until operationally supported.
6. Rewrite launch copy for Molapo/Botswana/Pula consistency.

### Phase 2: hide scope without destroying optional future work

1. Remove challenge, service, event, gem, paywall, and virtual-try-on entry points from primary navigation.
2. Put experimental routes behind feature flags or internal-only access instead of deleting database history immediately.
3. Remove test gem actions, fallback purchase UI, and unsubstantiated member/AI claims from customer builds.
4. Replace the generic merchant Create sheet with contextual creation from Catalog.

### Phase 3: validate the wedge before restoring features

Measure:

- vendor onboarding completion;
- time to first published product;
- storefront-to-cart conversion;
- checkout completion;
- collection completion;
- repeat customer rate;
- weekly active vendors with at least one current product.

Do not restore a deferred domain until it improves one of those measures for a clearly defined cohort.

## Native audit limitation

The installed Android development build could not render the current app bundle because its native React Native and Worklets versions predate the SDK 55 JavaScript packages, and it is missing a native Expo module required by the current source. A fresh native build is required before the screen-by-screen visual, interaction, and accessibility audit can be completed. Blank/loading screenshots were rejected as UX evidence.
