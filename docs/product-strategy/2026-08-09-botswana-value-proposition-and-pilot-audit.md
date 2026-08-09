# Muse Botswana value proposition and pilot audit

**Date:** 2026-08-09
**Status:** Recommendation for founder validation before the prototype is frozen
**Scope:** Botswana, Molapo Crossing / Gaborone pilot, Miss World Botswana relationship, Android phone prototype

## Executive decision

Muse is worth prototyping, but only as a **merchant-funded local content activation system**. It is not yet justified as a marketplace, creator economy, mall super-app, AI suite, subscription product, or social network.

The strongest version is:

> **Muse helps local merchants fund useful customer-made content: every accepted entry earns cash, and the strongest posts compete for a ranked cash prize pot.**

The defensibility is initially distribution and operations, not software: access to Molapo merchants and physical events, plus Miss World Botswana's cultural credibility and creator network. The app should make that real-world activation measurable and repeatable.

This is a **conditional yes**:

- **Yes** if the relationships can secure 3-5 committed merchants, funded rewards, a launch activation, and permission to recruit participants.
- **No** if the app is expected to manufacture merchant demand, creator supply, ecommerce behavior, and social-platform integration by itself.

## What the evidence says

### Botswana is socially reachable, but not yet an app-first ecommerce market

- Botswana had an estimated 2.07 million internet users and 1.30 million social-media user identities in January 2025. Internet penetration was 81.4%; social identities were equivalent to 51.1% of the population. This makes social distribution plausible, although these identity counts are not unique-user counts. [DataReportal](https://datareportal.com/reports/digital-2025-botswana)
- Statistics Botswana reported that 142,721 individuals used ecommerce in 2024, 7.9% of the measured 1.81 million individuals. Clothing and footwear were the leading reported category. That is meaningful growth from 2014, but still too thin to make end-to-end marketplace checkout the pilot's main behavior. [Statistics Botswana ICT brief](https://www.statsbots.org.bw/sites/default/files/Botswana%20Household%20Access%20and%20Individual%20Use%20of%20ICT%27s%20Stats%20Brief%202024.pdf)
- Botswana's country commerce guide notes high mobile-internet and e-wallet use as an ecommerce opportunity. This supports mobile participation, but not the assumption that users want another broad catalogue or delivery network. [International Trade Administration](https://www.trade.gov/index.php/country-commercial-guides/botswana-ecommerce)

**Product implication:** support purchases made at the till from day one. Muse checkout can remain as a secondary rail and a test surface, not an adoption prerequisite.

### Molapo is a credible pilot venue, not merely a name-drop

- Molapo Crossing publicly positions itself as a community venue, invites event hosting, and has a theatre/piazza and tenant network. [Molapo Crossing](https://www.molapocrossingmall.co.bw/) and [shops / venue page](https://molapocrossingmall.co.bw/shops)
- Miss Botswana's official site says the 2026 crowning was held at Molapo Creative Hub, while Botswana Daily News reported that the final national audition was held at Molapo Crossing. This verifies an active connection between the pageant organisation and the venue. It does **not** independently verify the exact private relationship or authority available to Muse. [Miss Botswana](https://missbotswana.co.bw/) and [Botswana Daily News](https://dailynews.gov.bw/news-detail/89504)

**Product implication:** the relationship is valuable if converted into concrete assets: merchant introductions, a named launch event, campaign promotion, credible judges/hosts, and participant recruitment. A logo endorsement alone is weak.

### Platform integration is not the pilot wedge

- TikTok's current Display API requires approval for Login Kit and TikTok API products plus `user.info.basic` and `video.list` scopes. [TikTok Display API](https://developers.tiktok.com/doc/display-api-get-started)
- TikTok requires a current end-to-end demo video for app review, and first-time integrations use its sandbox during review. [TikTok app review](https://developers.tiktok.com/doc/app-review-guidelines?enter_method=left_navigation)
- User tokens should be stored and managed server-side. [TikTok token management](https://developers.tiktok.com/doc/login-kit-manage-user-access-tokens)

**Product implication:** keep public-post URL submission and manual metric review for the first activation. Build the data model so TikTok verification can replace manual review later, but do not make platform approval a launch dependency.

### Trust and rules are product features

Botswana's Competition and Consumer Authority highlights false or misleading conduct, price information, direct marketing, contracts, complaints, and fair advertising as consumer-protection areas. [CCA](https://www.competitionauthority.co.bw/index.php/consumer-protection-0) The customer flow must therefore show clear Pula values, eligibility, deadlines, judging rules, payout conditions, sponsored-content disclosure, content rights, complaint/appeal handling, and what happens if a campaign is cancelled.

This audit is not legal advice. Promotional-competition structure, advertising disclosure, content licensing, privacy, tax, and merchant-of-record responsibilities require Botswana legal review before a public paid campaign.

## Idea audit

| Test | Verdict | Reason |
| --- | --- | --- |
| Real merchant pain | **Plausible** | SMEs need affordable content and foot traffic, but interviews and paid commitments are still missing. |
| User motivation | **Strong if funded** | A guaranteed accepted-entry cash fee plus a ranked prize gives creators a credible UGC earning proposition; requiring a purchase still raises friction. |
| Local advantage | **Strong if activated** | Molapo and Miss World Botswana can compress both sides of the market and add cultural relevance. |
| Software differentiation | **Moderate** | Purchase proof + brief + public post + moderation + hybrid judging + payout settlement is coherent, but replicable. |
| Cold-start risk | **High** | Empty opportunities, weak pots, or unknown merchants make the app immediately uninteresting. |
| Operational burden | **High but acceptable for pilot** | Till codes, moderation, manual metrics, disputes, and payout exceptions require hands-on operations. |
| Marketplace thesis | **Weak for pilot** | Current ecommerce adoption does not justify catalogue/logistics breadth as the wedge. |
| Competitive pot mechanic | **Test, do not canonize** | A leaderboard creates spectacle, but engagement scores can be gamed and may reward existing reach over useful content. |
| Venture-scale proof | **Not established** | One mall activation can prove a repeatable merchant tool, not a national platform or network effect. |

## The key strategic correction

The locked direction says “competitive challenge pots” are the canonical product. That is a good **pilot format**, but it is too early to lock the exact top-five split and engagement formula as product truth.

`likes + 3×comments + 2×saves` has four problems:

1. manual saves may not be publicly verifiable;
2. engagement is easy to manipulate;
3. creators with existing audiences have an advantage unrelated to content usefulness;
4. merchants primarily need usable creative and business results, not a popularity contest.

For the first activation, preserve excitement with two components:

- **Accepted-entry fee:** every approved, compliant entrant earns a fixed cash amount disclosed before entry.
- **Judged awards:** 3-5 winners selected using a published rubric: brief compliance, originality, product clarity, brand safety, and engagement as only one signal.

The app can still display engagement and a provisional leaderboard, but final settlement should require an explicit review. The current fixed split can remain configurable pilot data, not hard-coded identity.

## Recommended first pilot

### One bounded activation

- One venue: Molapo Crossing.
- Three to five visual, consumer-friendly merchants: food, beauty, fashion, or an experience.
- One shared two-week activation with an in-person launch/content day.
- One qualifying purchase per entry, proven by a single-use till code or Muse order.
- Public TikTok or Instagram post; URL submitted to Muse.
- Clear sponsored/rewarded disclosure template.
- Manual Muse moderation and manual metric snapshots.
- A stored-value Muse wallet; payouts should leave Muse through Stripe or Orange Money.
- A public closing moment or winner announcement using the partner network.

Do not start with 100 seeded campaigns. Five real campaigns with real people and real redemption are more valuable than a visually full but synthetic feed.

### Participant promise

> Buy something you already want at Molapo, make a public post from a clear brief, and earn a real store reward—with a chance to win more.

### Merchant promise

> Fund one activation and get measurable visits, disclosed customer posts, and reusable content rights without managing creators in DMs.

### Partner promise

> Turn the Molapo / Miss World Botswana cultural network into visible opportunities for local creators and measurable exposure for local businesses.

## Phone prototype: feature boundary

### Must work end to end

**Participant**

1. Browse live opportunities without signing in.
2. Open an opportunity and understand merchant, product, reward, deadline, requirements, disclosure, and judging.
3. Sign in only when saving, claiming a till code, or entering.
4. Claim a single-use till code or select an eligible Muse order.
5. Submit a public post URL and consent separately to in-app display and merchant reuse.
6. See review status, reason for rejection, provisional score/rank, accepted-entry fee, prize, and payout status.

**Merchant / Muse operator**

1. Create/edit one merchant, products, and an opportunity.
2. Issue purchase codes at the till.
3. Review submissions against a fixed checklist.
4. Enter metric snapshots and judged scores.
5. Settle once, creating an accepted-entry payout and any ranked-prize payout without duplication.
6. Retry or reroute a failed payout without paying the creator twice.
7. View a simple results page: entries, approved posts, payout status, estimated reach/engagement, and reusable-rights count.

### Keep behind flags or remove from pilot navigation

- AI creation tools
- Gems and gem purchases
- subscriptions/paywall
- services and appointments
- events as a general marketplace
- ride hailing and delivery network
- virtual try-on
- an internal creator cash wallet; direct Stripe and Orange Money payout adapters are in scope
- automated TikTok OAuth/metrics until approval
- broad multi-merchant marketplace positioning
- ads inserted into a synthetic swipe feed

## Native-build freeze before the installable preview

The repo already has appropriate EAS channels and an Android internal-distribution APK profile. It uses Expo Updates with `runtimeVersion.policy = appVersion` and version `1.0.0`.

Before producing the durable preview APK, decide and include every native capability that the pilot is likely to need:

- `expo-updates` and `expo-dev-client`
- notifications
- secure storage
- deep links through the existing `muse` scheme
- camera only if QR scanning is genuinely part of till-code redemption
- image/media access only if the prototype will attach proof or profile media
- Sentry
- Stripe only if real in-app checkout will be tested in this pilot
- any future TikTok native SDK only if an approved integration is actually ready; the manual URL flow does not need it

Then freeze native dependencies and app configuration for the pilot. UI, copy, routes, validation, Supabase queries, feature flags, and most assets can ship through OTA as long as they remain compatible with the installed runtime. Adding/upgrading native libraries or changing native app configuration requires a new build. [Expo runtime versions](https://docs.expo.dev/eas-update/runtime-versions/) and [Expo build/update compatibility](https://docs.expo.dev/build/updates/)

### Configuration risk to fix before relying on OTA

With the current `appVersion` runtime policy, native changes are unsafe unless `expo.version` is bumped before the new build and its updates. The preview workflow needs a written rule: **native change = bump app version + new APK; JS-only change = preview-channel OTA**.

Also verify preview environment variables separately. Expo notes that environment variables in an EAS Build profile are not automatically available to `eas update`. The OTA command must use the correct EAS environment or explicitly supplied variables.

## Validation plan and kill criteria

### Before more feature work

Get written or recorded commitments from:

- at least 3 merchants;
- one Molapo activation owner;
- the Miss World Botswana contact, stating the specific promotional/recruitment contribution;
- at least 15 likely participants shown the actual offer.

### Pilot targets

These are learning thresholds, not forecasts:

- 3-5 merchants launch without developer intervention.
- At least 30 people claim purchase eligibility.
- At least 15 valid posts are submitted.
- At least 70% of starters complete submission.
- At least 95% of approved creator payouts reach a paid state without manual correction.
- At least 2 merchants say the usable content and/or attributed visits justify repeating at a stated price.
- Moderation and settlement take under 10 minutes per valid entry on average.

### Stop or pivot if

- merchants like the concept but will not fund even a small pot;
- most users will post only for cash, not store value;
- purchase gating collapses participation;
- disputes about judging or fake engagement dominate operations;
- merchants do not value or reuse the approved content;
- the partner relationship cannot deliver real access or promotion.

## Recommended sequence

1. Validate the concrete Molapo/Miss World Botswana commitments and recruit 3-5 merchants.
2. Freeze the above pilot contract and remove conflicting super-app surfaces from the active navigation.
3. Verify the remote Supabase schema and replace all synthetic opportunity data with controlled pilot fixtures or real records.
4. Complete the end-to-end operator and participant loop with manual social verification.
5. Lock native dependencies, bump the app/runtime version if necessary, and create an Android preview APK.
6. Install and verify the APK on the actual phone.
7. Use preview-channel OTA updates for the remaining JS/UI fixes.
8. Run the activation and decide from merchant repeat intent and real redemption—not downloads or seeded feed volume.

## Bottom line

The app is good **for this context** because the context can provide the scarce inputs a two-sided local product needs: trusted merchant access, a venue, cultural relevance, and creators. The same app launched cold as “Botswana's creative marketplace” would be weak.

Build the operating system for one excellent Molapo activation. If merchants pay to repeat it, Muse has a business. If they do not, adding more tabs, AI, payments, or platform APIs will not create the missing value.
