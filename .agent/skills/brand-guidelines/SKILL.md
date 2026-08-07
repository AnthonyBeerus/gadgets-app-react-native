---
name: brand-guidelines
description: Applies Muse's official brand colors and design principles to artifacts. Use when designing UI components, creating marketing materials, or ensuring brand consistency across the creative-commerce platform.
---

# Muse Brand Guidelines

## Overview

Muse is a creative-commerce platform for local merchants (challenge pots + marketplace). Visual identity is **quiet commerce modernist** — merchant-trust first, content/media first on Discover.

**Keywords**: branding, Muse brand, quiet commerce, design system, brand colors, typography

> **Source of truth**: `src/shared/design-system/` — import tokens and primitives from there. Do **not** introduce new `NEO_THEME` / neobrutalism imports.

---

## Brand Identity

**Core Principle**: *Creativity is an economy. Muse is its infrastructure.*

The brand should feel:

- **Competent & calm** — Merchants fund voucher pots; UI must feel money-safe
- **Content-led** — Photography and pot economics carry personality; chrome recedes
- **Local & clear** — Rooted in Botswana SME commerce (food, beauty, services)
- **Distinctive without costume** — Avoid pastel neo kits, hard offset shadows, lilac washes

---

## Color Palette (quiet commerce v1)

### Surfaces & ink (light)

- **Canvas**: `#FAFAF8` — app field
- **Surface**: `#FFFFFF` — cards, inputs
- **Ink**: `#111111` — primary text and **primary CTA fill**
- **Ink muted**: `#6B7280` — secondary text
- **Border**: `#B0B6C0` — denser 1px structural edges (cards, inputs, chrome)

### Surfaces & ink (dark)

- **Canvas**: `#111111`
- **Surface**: `#1C1C1A` — warm elevated panels (not blue-gray)
- **Ink**: `#F4F4F2` — primary text and CTA fill (light on dark)
- **Ink muted**: `#A1A1AA`
- **Border**: `#3F3F46`
- **Gray washes**: `#18181B` / `#27272A` for `gray50` / `gray100`

Dark mode is preference-driven (`system` | `light` | `dark`) via `ThemeProvider` → `DesignTokensProvider` (`resolveSemanticColors`). Accent / success / error stay the same hexes.

### Accent (punctuation, not wallpaper)

- **Accent**: `#E85D04` — challenge energy (pot/deadline), sparse use
- **Accent muted**: `#FFF4ED` — soft highlight behind accent moments

### Semantic

- **Success**: `#16A34A`
- **Warning**: `#D97706`
- **Error**: `#DC2626`
- **Info**: `#2563EB`

### Forbidden as identity

- Pastel lilac primary / lilac canvas
- Hard `4px 4px 0 #000` neo shadows
- Thick comic black outlines as default chrome
- Multi-pastel rainbow (mint/pink/sky) as system colors

---

## Typography

- **UI family**: Inter (400 / 500 / 600 / 700)
- Hierarchy via size and weight — not all-caps by default
- Display roles use Inter bold at larger sizes (no dual neo Poppins voice required)

Token source: `src/shared/design-system/tokens/typography.ts`

---

## Design principles

### 1. Quiet commerce (system identity)

- Flat depth: `none` | `hairline` | soft blur only
- Modest radii (`6` / `10` / `16`) — not pill-default for every control
- Primary actions = ink fill / white label
- Accent reserved for challenge energy

### 2. FDD ownership

| Shared (`src/shared/design-system`) | Features (`src/features/[x]`) |
|---|---|
| Tokens, Button, Text, Input, Surface, Tag, IconButton | Domain cards (challenge, opportunity) |
| ScreenHeader, TabBarShell contracts | Feature screens composing shared primitives |

### 3. Mobile-first

- Thumb targets ≥ 44×44
- Discover media-first; merchant denser and quieter

### 4. Accessibility

- Prefer `#111` on `#FAFAF8` over pure 21:1 black/white for long reading
- Visible focus / press feedback without hard-shadow gimmicks

---

## Implementation

```ts
import { Button, Text, colors, useDesignTokens } from '@/shared/design-system';
```

Deprecated (compat only):

- `shared/constants/neobrutalism` → `NEO_THEME` shim
- `NuviaButton` / `NeoButton` / `NeoView` / `NuviaText` wrappers

---

## Do / Don't

**Do**

- Import from `shared/design-system`
- Let product/challenge imagery carry energy
- Keep merchant Open Shop / settle screens calm

**Don't**

- Add new neobrutalism imports
- Use hard offset shadows
- Make lilac/purple the primary action color
- All-caps every label
