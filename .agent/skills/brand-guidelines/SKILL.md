---
name: brand-guidelines
description: Applies Muse's official brand colors and design principles to artifacts. Use when designing UI components, creating marketing materials, or ensuring brand consistency across the creative-commerce platform.
---

# Muse Brand Guidelines

## Overview

Muse is a creative-commerce platform powered by Molapo Creative Hub. This skill provides brand colors, typography, and design principles for maintaining visual consistency across all features.

**Keywords**: branding, Muse brand, creative economy, visual identity, design system, brand colors, typography, UI design, creative platform

> **Alignment**: This skill implements the specific aesthetic choices for Muse, following the "Bold Aesthetic Direction" philosophy from **frontend-design**. Refer to `frontend-design` for broader implementation strategies regarding motion, spatial composition, and avoiding generic patterns.

---

## Brand Identity

**Core Principle**: *Creativity is an economy. Muse is its infrastructure.*

Muse connects challenges, AI tools, marketplace commerce, services, events, and culture into one unified ecosystem. The brand should feel:

- **Vibrant & Energetic** — Reflects youth culture and creative energy. *Avoid timid, generic "clean" tech looks.*
- **Modern & Bold** — Tech-forward without being cold. Neubrutalist influence.
- **Premium yet Accessible** — Quality feel at P49-P99/month price point.
- **Cultural & Local** — Rooted in Botswana's creative community. *Use local patterns/motifs where possible.*
- **Distinctive & Unexpected** — Avoids "AI slop" or cookie-cutter templates. Features should feel hand-crafted.

---

## Color Palette

### Primary Colors

- **Deep Purple**: `#6B46C1` - Primary brand color, creative energy
- **Vibrant Orange**: `#FF6B35` - Accent, CTAs, energy
- **Electric Blue**: `#4A90E2` - Secondary accent, tech feel

### Neutral Colors

- **Dark**: `#1A202C` - Primary text, dark backgrounds
- **Light**: `#F7FAFC` - Light backgrounds, cards
- **Mid Gray**: `#A0AEC0` - Secondary text, borders
- **Light Gray**: `#EDF2F7` - Subtle backgrounds, disabled states

### Semantic Colors

- **Success Green**: `#48BB78` - Successful actions, gems earned
- **Warning Oran**: `#ED8936` - Warnings, important notices
- **Error Red**: `#F56565` - Errors, validation
- **Info Blue**: `#4299E1` - Informational messages

### Gem Economy Colors

- **Gem Gold**: `#F6AD55` - Gem currency, rewards, premium features
- **Gem Shine**: `#FBD38D` - Gem highlights, accents

---

## Typography

### Headings
- **Font**: **Inter** (with system fallback to -apple-system, BlinkMacSystemFont, "Segoe UI")
- **Weight**: Bold (700) for H1-H2, SemiBold (600) for H3-H4
- **Style**: Modern, clean, tech-forward

### Body Text
- **Font**: **Inter** (with system fallback)
- **Weight**: Regular (400) for body, Medium (500) for emphasis
- **Style**: Readable, accessible

### Creative Content (Display)
- **Font**: **Poppins** or **Montserrat** for creative sections (challenges, events)
- **Weight**: SemiBold (600) to Black (900) for maximum impact
- **Style**: Energetic, youthful, bold. *Use for Headlines to break the "generic Inter" monotony.*

*Note: While Inter is used for UI utility, rely heavily on the Display font (Poppins/Montserrat) for "Personality" areas to meet the `frontend-design` requirement for distinctive typography.*

---

## Design Principles

### 1. Neubrutalism Aesthetic (The "Bold Choice")
- **Conceptual Direction**: Raw, unpolished but functional. Digital craft.
- **Visuals**: Bold borders (2px-4px), hard shadows, high contrast.
- **Avoid**: Soft blurs, gradient glows on white (the "AI cliche"), rounded soft shadows.
- **differentiation**: Use grid patterns, halftone dots, or noise textures to add depth and "grit".
- Bold borders and shadows
- High contrast
- Vibrant color blocks
- Playful yet functional
- Digital craft feel

### 2. Mobile-First
- React Native/Expo optimized
- Thumb-friendly touch targets (min 44x44pt)
- Bottom navigation for core features
- Gesture-driven interactions

### 3. Gem Economy Visibility
- Gem balance always visible
- Gem costs clearly displayed
- Subscription benefits prominent
- Reward celebrations (confetti, animations)

### 4. Creative Energy
- Dynamic animations (Reanimated)
- Micro-interactions
- Celebration moments (challenge wins, gem earnings)
- Social proof (leaderboards, participation)

### 5. Cultural Authenticity
- Local imagery and iconography
- Botswana context
- Creative community focus
- Youth culture alignment

---

## Component Styling

### Buttons

**Primary (CTAs)**:
- Background: `#6B46C1` (Deep Purple)
- Text: `#FFFFFF`
- Border: 3px solid `#1A202C`
- Shadow: 4px 4px 0px `#1A202C`
- Active: Shift shadow (-2px, -2px)

**Secondary (Actions)**:
- Background: `#FF6B35` (Vibrant Orange)
- Text: `#FFFFFF`
- Border: 3px solid `#1A202C`
- Shadow: 4px 4px 0px `#1A202C`

**Tertiary (Gem Actions)**:
- Background: `#F6AD55` (Gem Gold)
- Text: `#1A202C`
- Border: 3px solid `#1A202C`
- Shadow: 4px 4px 0px `#1A202C`
- Icon: Gem icon before text

### Cards

- Background: `#FFFFFF` or `#F7FAFC`
- Border: 3px solid `#1A202C`
- Border Radius: 16px
- Shadow: 6px 6px 0px `#1A202C`
- Padding: 16-24px

### Input Fields

- Background: `#FFFFFF`
- Border: 2px solid `#A0AEC0`
- Border Radius: 8px
- Focus: Border color `#6B46C1`, 3px width
- Error: Border color `#F56565`

---

## Icon System

- **Style**: Rounded, friendly, energetic
- **Library**: Expo vector-icons (Ionicons, MaterialCommunityIcons)
- **Size**: 20pt (small), 24pt (default), 32pt (large)
- **Color**: Match text color or brand purple

### Key Icons

- Gem: `💎` or custom gem icon
- Challenge: `🎯`
- AI Tools: `✨`
- Shop: `🛍️`
- Events: `🎪`
- Profile: `👤`

---

## Visual Texture & Atmosphere
*Aligned with `frontend-design` guidelines for Backgrounds & Visual Details*

- **Depth**: Don't just use flat colors. Use distinct separation.
- **Texture**: Subtle noise overlays, dot grids, or diagonal lines to break up solid backgrounds.
- **Forms**: Use geometric shapes (circles, triangles, jagged lines) as background artifacts in accent colors to create energy.
- **Lighting**: Hard light/edges rather than soft diffusion.

---

## Animation Guidelines

### Micro-interactions
- Duration: 200-300ms
- Easing: `spring` for playful, `ease-out` for smooth
- Scale on press: 0.95
- Haptic feedback on important actions

### Celebrations
- Gem earned: Confetti + scale animation
- Challenge complete: Trophy reveal
- Level up: Badge animation
- Purchase complete: Success checkmark

---

## Accessibility

- **Contrast Ratios**: Minimum 4.5:1 for text, 3:1 for UI components
- **Touch Targets**: Minimum 44x44pt
- **Screen Reader**: All interactive elements labeled
- **Color Blindness**: Don't rely on color alone for information
- **Font Sizes**: Respect device font scaling

---

## Usage Examples

### Challenge Card
```tsx
<Card 
  bg="#FFFFFF"
  border="3px solid #1A202C"
  shadow="6px 6px 0px #1A202C"
>
  <Badge bg="#6B46C1" color="#FFFFFF">Premium</Badge>
  <Title font="Poppins" weight="600">Create TikTok Dance</Title>
  <GemCost color="#F6AD55">💎 50 gems</GemCost>
  <Button bg="#FF6B35" color="#FFFFFF">Enter Challenge</Button>
</Card>
```

### Gem Balance Display
```tsx
<GemBalance>
  <Icon name="💎" size={24} color="#F6AD55" />
  <Text font="Inter" weight="700" size={20}>1,234</Text>
  <Badge bg="#6B46C1">Premium</Badge>
</GemBalance>
```

---

## Technical Implementation

### React Native Styling
- Use `StyleSheet.create()` for performance
- Theme via Context API or Zustand store
- Color constants in `constants/colors.ts`
- Typography constants in `constants/typography.ts`

### Dark Mode
- Support system preference
- Dark backgrounds: `#1A202C`
- Cards on dark: `#2D3748`
- Maintain brand purple/orange accents
- Gem gold remains `#F6AD55`

---

## Brand Voice

- **Tone**: Energetic, inclusive, empowering
- **Voice**: "We're building this together" not "Use our platform"
- **Language**: Clear, direct, youth-friendly
- **Avoid**: Corporate jargon, overly formal language
- **Embrace**: Creative slang, local references, celebration

---

## Platform-Specific Notes

### Mobile (React Native/Expo)
- Bottom tab navigation
- Gesture-driven UI
- Native animations (Reanimated)
- Platform-specific shadows (iOS vs Android)

### Future Web
- Same color palette
- Responsive grid
- Hover states for desktop
- Same neubrutalist aesthetic
