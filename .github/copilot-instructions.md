# Copilot Instructions for Ultimate Gadgets Mobile App

## Project Overview

This is a comprehensive, multi-mall e-commerce platform built with React Native (Expo), Supabase, and Vercel AI SDK. It goes beyond standard e-commerce by integrating:

1.  **Multi-Mall Architecture**: Support for multiple shopping locations (Physical Malls vs. Online Marketplaces).
2.  **AI-Powered Features**: Virtual Try-On using Google Gemini via Vercel AI SDK.
3.  **Interactive Feed**: TikTok-style product discovery with social interactions.
4.  **Service & Event Booking**: Integrated scheduling and ticketing systems.

## Architecture & Key Patterns

### File-Based Routing (Expo Router)

-   **Entry Point**: `src/app/_layout.tsx` (Root layout with providers).
-   **Main Flow**: `src/app/(shop)/` - Tab navigation (Shop, Services, Events, Orders, Profile).
-   **Feature Routes**:
    -   `src/app/mall-selector.tsx` - Modal for switching malls.
    -   `src/app/virtual-try-on/` - AI feature routes.
    -   `src/app/shop/[id].tsx` - Shop details.
-   **Navigation**: Use `Link` from `expo-router` or `router.push()`.

### State Management

-   **Client State (Zustand)**:
    -   `shop-store.ts`: Shops, categories, mall selection, filters.
    -   `cart-store.ts`: Shopping cart logic.
    -   `booking-store.ts`: Service appointment state.
-   **Server State (TanStack Query)**:
    -   Used for data fetching in `src/api/`.
    -   Keys should be consistent (e.g., `['shops', mallId]`).

### AI Integration (Virtual Try-On)

-   **SDK**: Vercel AI SDK (`ai`, `@ai-sdk/google`).
-   **Pattern**:
    -   UI: `src/features/virtual-try-on/components/TryOnModal.tsx`
    -   API: `src/app/virtual-try-on+api.ts` (Expo API Route).
    -   Model: Gemini 2.5 Flash Image Preview (`responseModalities: ['IMAGE']`).

### Database & Backend (Supabase)

-   **Types**: Use `Tables<'table_name'>` from `src/types/database.types.ts`.
-   **Malls**: `malls` table links to `shops`. All queries should respect the currently selected `mall_id`.
-   **Realtime**: Use Supabase channels for live updates (e.g., order status).

## Coding Standards

### Component Structure
-   **Functional Components**: Use TypeScript interfaces for props.
-   **Styling**: `StyleSheet.create()` at the bottom. Use consistent colors from a constants file if available, or standard hex codes matching the design system (Primary: `#9C27B0`).
-   **Imports**: Group imports: React/RN -> External Libs -> Internal Components -> Stores/Hooks.

### Data Fetching
-   **Shops**: `useShopStore` handles fetching and filtering of shops.
-   **Products**: Fetch products based on `shop_id`.
-   **Optimistic Updates**: Use `onMutate` in React Query mutations for immediate UI feedback.

### Critical Flows
1.  **Mall Selection**: Changing a mall updates the global `selectedMall` in `shop-store.ts` and refreshes the shop list.
2.  **Checkout**: Stripe payment flow handled in `cart.tsx` and server-side functions.
3.  **Virtual Try-On**:
    -   User uploads photo -> Selects product -> API call to Gemini -> Returns generated image.
    -   **Note**: This uses a server-side API route to keep keys secure.

## Common Pitfalls to Avoid
-   **Do NOT** use `App.tsx`. The entry is `src/app/_layout.tsx`.
-   **Do NOT** use `react-navigation` directly; use `expo-router`.
-   **Environment Variables**: Must be prefixed with `EXPO_PUBLIC_` for client-side access (except `GEMINI_API_KEY` which is server-only).
-   **Mall Context**: Always check if a feature needs to be filtered by the selected mall.

