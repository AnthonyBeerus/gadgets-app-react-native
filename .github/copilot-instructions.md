# Copilot Instructions for Ultimate Gadgets Mobile App

## Project Overview

This is a React Native e-commerce app built with Expo, using file-based routing, Supabase backend, Stripe payments, and Zustand state management. The app sells gadgets with features for browsing, cart management, and order processing.

## Architecture & Key Patterns

### File-Based Routing (Expo Router)

- Main entry point: `src/app/_layout.tsx` (not `App.tsx` which is unused)
- Route structure: `src/app/(shop)/`, `src/app/categories/`, `src/app/product/`
- Use `Link` from `expo-router` for navigation, not React Navigation components
- Route groups in parentheses like `(shop)` don't appear in URL paths
- Dynamic routes use `[slug].tsx` pattern

### Provider Architecture Stack

Critical provider order in `src/app/_layout.tsx`:

```tsx
ToastProvider >
  AuthProvider >
  QueryProvider >
  StripeProvider >
  NotificationProvider >
  Stack;
```

Never modify this order - it ensures proper initialization dependencies.

### State Management Patterns

- **Global state**: Zustand store in `src/store/cart-store.ts`
- **Server state**: TanStack Query in `src/api/api.ts`
- **Auth state**: Context provider in `src/providers/auth-provider.tsx`
- Pattern: Use Zustand for client state, React Query for server data

### Supabase Integration

- Custom encrypted storage: `src/lib/supabase.ts` uses AES encryption for large tokens
- Database types: Auto-generated in `src/types/database.types.ts`
- Pattern: Always use `Tables<'table_name'>` type for database entities
- API calls in `src/api/api.ts` follow React Query patterns with proper error handling

## Development Workflows

### Environment Setup

1. Copy `.env.example` to `.env.local` (not `.env`)
2. Required vars: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. Run: `npm start` (not `expo start` directly)

### Build & Deploy

- Development: `npm run android/ios` for emulators
- EAS builds configured in `eas.json` with development/preview/production profiles
- Uses `expo-router/entry` as main entry point in `package.json`

## Code Conventions

### Component Patterns

- Functional components with TypeScript interfaces
- Props destructuring: `{ product }: { product: Tables<'product'> }`
- Styling: StyleSheet.create() at component bottom
- File naming: kebab-case for components (`product-list-item.tsx`)

### API Integration

- Use React Query hooks from `src/api/api.ts`
- Pattern: `const { data, error, isLoading } = getProductsAndCategories()`
- Always handle loading/error states in components
- Mutations use `useMutation` with proper invalidation

### Cart Management

- Global cart state via `useCartStore()` hook
- Cart items include `maxQuantity` constraint checking
- Price calculations return strings (formatted currency)
- Cart operations: `addItem`, `removeItem`, `incrementItem`, `decrementItem`

### TypeScript Patterns

- Database types from Supabase in `src/types/database.types.ts`
- Asset types in `assets/types/` for static data structures
- Use `Tables<'table_name'>` for Supabase entity types
- Strict null checking - handle undefined/null explicitly

## Critical Integration Points

### Authentication Flow

- Supabase auth with custom encrypted session storage
- Session management in `AuthProvider` with mounting state
- Protected routes check session state, redirect to `/auth`

### Payment Processing

- Stripe integration in checkout flow
- Stripe functions in `supabase/functions/stripe-checkout/`
- Payment methods handled server-side, not in React Native app

### Notifications

- Expo notifications with device token storage
- Notification provider wraps app for push notification handling
- Tokens stored in Supabase user profiles

## File Structure Guidelines

- Components: `src/components/` - reusable UI components
- Screens: `src/app/` - file-based routes
- Logic: `src/api/` for data fetching, `src/store/` for state
- Utils: `src/utils/` for helper functions
- Assets: Local images in `assets/images/`, types in `assets/types/`

## Common Pitfalls

- Don't use `App.tsx` - routing starts from `src/app/_layout.tsx`
- Environment variables must have `EXPO_PUBLIC_` prefix for client access
- Use `Tables<'table_name'>` not manual type definitions for Supabase data
- Cart quantity changes must respect `maxQuantity` constraints
- Always wrap async operations in try/catch with proper error handling
