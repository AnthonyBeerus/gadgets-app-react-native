# **Muse — Powered by Molapo Creative Hub**

## **Product Requirements Document (PRD)**

**Version 1.0 — 2025**

This PRD defines the complete functional scope, economic model, content rules, system behavior, and technical requirements for **Muse**, a creative-commerce platform powered by **Molapo Creative Hub**. It merges creativity, commerce, culture, and participation into a unified digital ecosystem designed for youth, creators, brands, and vendors.

Muse’s identity is built around one principle:

> **Creativity is an economy. Muse is its infrastructure.**

Muse connects:

* **Creative challenges**
* **AI content tools**
* **Marketplace commerce**
* **Service bookings**
* **Events & cultural programming**
* **Ride-hailing & delivery as support utilities**
* **Subscriptions & gems as the economic engine**

All content created for challenges is **posted externally** (TikTok, Instagram, YouTube, etc.). Muse handles **briefs, entries, leaderboards, scoring, payouts, and participation logic** — *but never hosts the content itself.*

---

# **1. Core App Sections**

Muse has five primary user-facing domains:

---

## **1.1 Shop**

A dual-mode marketplace with:

### **Molapo Mall Marketplace**

Physical stores inside Molapo Crossing.

### **Indie Marketplace**

Local creators, craftspeople, artists, micro-brands.

### **Status**

* Implemented: product listings, vendor profiles, checkout (Stripe), switching logic.
* Needs refinement: polished UI for Mall vs Indie toggle.

### **Gem Integration**

* Users may redeem **gems for voucher codes** usable in participating stores.
* Vendors may offer **gem-only products**.
* Subscribers get **delivery and discount perks** (Section 3).

---

## **1.2 Services**

Booking interface for in-mall and creative services:

* salons, barbers
* photographers
* stylists
* workshop sessions
* creative studios

### **Gem Integration**

* Users can redeem gems for **discounted bookings**.
* Subscribers get **priority booking windows** or reduced service fees.

---

## **1.3 Events**

Ticketed experiences powered by Molapo Creative Hub:

* exhibitions
* workshops
* performances
* creative education
* cultural events

### **Gem Integration**

* Users can purchase **small perks** (VIP check-in, early entrance).
* Subscribers get **ticket discounts** (Muse+ 10%, Premium 20%).

---

## **1.4 Orders**

Tracks:

* product purchases
* service bookings
* deliveries
* event tickets

### **Need**

* Collection QR codes for in-person pickups.

---

## **1.5 Profile**

Displays:

* user identity
* gem balance
* subscription tier
* challenge participation
* delivery addresses

### Needs:

* subscription status UI
* wallet UI
* challenge history

---

# **2. Challenges Hub — Core Product**

Muse’s primary engagement and virality engine.

Challenges are:

* briefed by brands, creators, or Muse
* solved by users
* created externally (social media)
* submitted back to Muse via URL
* verified and ranked by the system

Challenges have **three entry types**:

* **Free**
* **Paid (gems)**
* **Subscriber-only**

---

## **2.1 Challenge Structure**

### Required DB fields:

```
challenges:
  id, title, organizer_id, description, instructions,
  hashtags[], prize_type, prize_value, entry_fee_gems,
  start_at, end_at, visibility (public / premium),
  icon_url, categories[], sponsored (bool)
```

---

## **2.2 User Flow**

1. **Discover challenge** in *Explore*.
2. **Read brief & requirements** (hashtags, caption rules, platform).
3. **Generate content** manually or with Muse AI tools (gems deducted).
4. **Post externally** to TikTok / Instagram / YouTube / X.
5. **Submit link** to Muse.
6. Muse **verifies post** via:

   * hashtag check
   * creator ownership check
   * platform API
7. **Leaderboard** updates periodically.
8. **Reward distribution** at challenge end.

---

## **2.3 Leaderboards**

Shows:

* top creators
* live ranking
* winners of previous challenges
* premium-only leaderboards for subscriber challenges

Premium subscribers get **priority evaluation**.

---

## **2.4 AI Content Tools**

Users can:

* generate images
* generate short videos
* generate voice audio
* remix visuals/light styling

### All AI operations cost **gems**.

Subscribers get discounts or unlimited use (see Section 3).

---

## **2.5 Challenge Subtabs**

* **Explore** (all challenges)
* **My Challenges** (entries, status, rewards)
* **Leaderboards**
* **Create a Challenge** (for brands & future creator tier)

---

# **3. Gem Economy & Subscriptions**

Gems are **the universal creative currency** of Muse.

They integrate into:

* challenges
* AI tools
* services
* marketplace vouchers
* ride-hailing rewards
* event perks

There are **two ways to acquire gems**:

1. Buy gem packs directly.
2. Receive monthly gems via subscription.

---

# **3.1 Gem Use Cases Across the App**

### **Challenges**

* paid entry fees
* AI-generated content
* boosts / visibility perks

### **Services**

* discounted bookings
* special add-ons

### **Shop**

* gem-only deals
* marketplace vouchers

### **Events**

* discounted ticket add-ons
* early-access check-ins

### **Mobility**

* ride → earn gems
* gems redeemable for marketplace vouchers

Gems circulate inside the **creative economy loop**.

---

# **3.2 Membership Tiers**

Subscriptions give users:

* monthly gems
* reduced gem spending
* mobility perks
* creative advantages
* event perks
* marketplace perks
* AI tool access

Pricing for Botswana market:

* **Muse+ — P49/month**
* **Muse Premium — P99/month**

---

## **Muse+ Membership — P49/mo**

### Monthly Benefits:

* monthly gem pack
* discounted AI generation
* discounted challenge entry (20–40% off)
* 3 entries per challenge
* faster verification
* some subscriber-only challenges
* 10% off event tickets
* 1 priority delivery per month
* 10% off one ride per week
* earn **1 gem per ride** (max 10/month)

**Purpose:**
Entry-level creator support.

---

## **Muse Premium — P99/mo**

### Full Benefits:

* larger monthly gem pack
* free entry for most gem challenges under threshold
* 5–10 entries per challenge
* unlimited or near-free AI tools
* access to ALL subscriber-only challenges
* top verification priority
* 20% event discounts
* unlimited priority delivery
* 3 discounted rides per week (20% off)
* earn **3 gems per ride** (max 25/month)
* advanced creator analytics
* promoted entry visibility

**Purpose:**
For creators who want to *win*, publish more, and grow.

---

# **4. Mobility & Delivery (Support Feature)**

Ride-hailing is a **small supportive utility**, not a core tab.

Used for:

* getting to Molapo Crossing
* attending events
* picking up marketplace items
* filming content

### Benefits:

* subscribers get ride discounts
* rides earn gems
* priority matching for Premium users

Delivery supports:

* marketplace items
* prize distribution
* booking services

---

# **5. Supabase Database Requirements**

### **5.1 Challenges**

```
challenges
challenge_submissions
challenge_engagement_stats
```

### **5.2 Wallet & Gems**

```
user_wallets
transactions
```

### **5.3 Subscriptions**

```
user_subscriptions
subscription_history
```

### **5.4 Mobility**

```
rides
drivers
driver_profiles
```

### **5.5 Delivery**

```
delivery_orders
couriers
```

---

# **6. Technical Stack**

* **Frontend:** React Native + Expo
* **Backend:** Supabase (PostgreSQL, Auth, Storage)
* **AI:** Vercel AI SDK + Google Gemini
* **Payments:** Stripe (subs), Flutterwave/Paystack (fiat commerce)
* **UGC:** always external platforms
* **Push Notifications:** Expo Notifications

---

# **7. KPIs**

* MAU, DAU
* Challenge participation rate
* Gem purchase volume
* Subscription conversion & retention
* AI tool usage
* Event attendance
* Marketplace GMV
* Sponsored challenge revenue
* Ride/delivery volume

---

# **8. System Rules**

### **1. Muse never hosts long-form UGC.**

Only URLs to social media posts.

### **2. Gems cannot be converted into cash.**

Only vouchers or perks.

### **3. Subscriptions unlock creative power, not basic app access.**

### **4. Ride-hailing stays a supportive feature.**

---

# **9. Vision Summary**

Muse transforms Botswana’s creative economy by merging:

* creative challenges
* commerce
* AI
* events
* services
* mobility

into one unified cultural ecosystem powered by Molapo Creative Hub.

> **Creativity becomes capital.
> Community becomes culture.
> Muse becomes the platform.**
