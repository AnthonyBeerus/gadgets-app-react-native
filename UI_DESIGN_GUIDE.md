# Muse — UI Design Guide

This document translates the functional requirements from `PRD.md` into specific UI/UX guidelines. It serves as a reference for designers and developers to ensure a consistent, **Neubrutalist** experience across the Muse platform.

---

## 1. Design System Core

*   **Aesthetics**: **Strict Neubrutalism**. Unapologetic, bold, and raw. High contrast, defined borders, and hard shadows. No gradients, no blur, no "premium minimalism".
*   **Primary Color**: `#9C27B0` (Muse Purple).
*   **Secondary Colors**: `#FFD700` (Gold), `#000000` (Stark Black), `#FFFFFF` (Paper White), `#FF5252` (Alert Red).
*   **Borders**: **Thick black borders** (2px to 3px) on all interactive elements and containers.
*   **Shadows**: **Hard, offset shadows** (e.g., `4px 4px 0px #000`). No soft diffusion.
*   **Typography**:
    *   **Headings**: Bold, uppercase, potentially Monospace or chunky Sans-Serif (e.g., Archivo Black, Space Mono).
    *   **Body**: Clean Sans-Serif with high readability (e.g., Public Sans).
*   **Iconography**: Thick stroke (2px+), filled or outlined, no subtle details.

---

## 2. Screen Specifications

### **2.1 Shop (Home Tab)**

**Context**: The landing experience.

*   **Header**:
    *   **Mall Selector**: Rectangular dropdown with 3px border and hard shadow.
    *   **Search Bar**: White box, 3px black border, "SEARCH" button attached to the right with contrasting color.
*   **Hero Section**:
    *   **Featured Carousel**: Cards with thick borders. Pagination dots are squares.
*   **Filters**:
    *   **Pills**: Rectangular tags with borders. Active state = Black background, White text. Inactive = White background, Black text.
*   **Product Grid**:
    *   **Card**:
        *   **Container**: White background, 3px border, 4px hard shadow.
        *   **Image**: Separated from details by a horizontal black line.
        *   **Info**: Bold Title. Price in a yellow highlighted box.
        *   **Action**: "ADD" button is a square with a plus sign, hard edges.

### **2.2 Services Tab**

**Context**: Booking appointments.

*   **Layout**: List items are distinct blocks stacked vertically.
*   **Service Card**:
    *   **Container**: 3px border.
    *   **Thumbnail**: Framed with a border.
    *   **Button**: "BOOK NOW" - Rectangular, high contrast (Purple bg, White text, Black border).
*   **Booking Modal**:
    *   **Style**: Bottom sheet with a thick top border.
    *   **Time Slots**: Grid of boxes. Selected = Black fill. Available = White fill.

### **2.3 Events Tab**

**Context**: Discovery and Ticketing.

*   **Sub-Navigation**: Two big rectangular tabs. Active tab pops up or changes color drastically.
*   **Events View**:
    *   **Poster Card**: Looks like a physical ticket or poster. Dashed lines for "tear-off" sections.
    *   **Date**: Big bold numbers in a corner box.

### **2.4 Orders Tab**

**Context**: Tracking.

*   **Active Order Card**:
    *   **Status Bar**: Segmented bar with thick dividers. Filled segments are solid black or purple.
    *   **Actions**: Buttons are large, full-width, with hard shadows.

### **2.5 Profile Tab**

**Context**: User Hub.

*   **Header**:
    *   **Avatar**: Square or Circle with a thick border.
    *   **Stats**: Numbers are massive. "GEMS" label in a yellow tag.
*   **Menu List**:
    *   **Items**: Each menu item is a box with a border. Chevron icon is thick and sharp.
*   **Subscription Banner**:
    *   "MOLAPO+" text in a marquee or bold banner style.

---

## 3. Challenges Hub

**Context**: High-energy participation.

*   **Challenge List**:
    *   **Card**:
        *   **Style**: "Wanted Poster" or "Trading Card" aesthetic.
        *   **Brand**: Logo in a bordered box.
        *   **Reward**: "500 GEMS" in a jagged starburst or stamped badge.
*   **Challenge Detail Screen**:
    *   **Brief**: Text in a "courier" or typewriter style box.
    *   **Action Bar**:
        *   **Buttons**: Two massive buttons side-by-side. "ENTER" (Green/Black), "AI GEN" (Purple/Black). Hard shadows.

---

## 4. AI & Gems UI

### **4.1 Virtual Try-On**

*   **Input**: Drop zones have dashed thick borders.
*   **Process**: Progress bar is a retro loading bar (blocks filling up).
*   **Result**: Split screen with a thick draggable divider line.

### **4.2 Gem Wallet**

*   **Visuals**: Retro game inventory style.
*   **Balance**: Pixel font or heavy block numbers.

---

## 5. Navigation & Transitions

*   **Bottom Tab Bar**:
    *   **Container**: Solid white with top black border (3px).
    *   **Icons**: bold, unrefined. Active state might have a block background.
*   **Transitions**:
    *   **Snappy**: Instant or very fast slides. No fades.
    *   **Modals**: Slide up and "thud" into place (bounce effect).

---

**Design Philosophy**: **Function over Form**. Raw, honest, and distinct. Every element should feel touchable and solid. If it's a button, it looks like a button you can smash.
