# Copilot Instructions for Ultimate Gadgets Mobile App

## Project Overview

This is a comprehensive React Native shopping mall app built with Expo, featuring file-based routing, Supabase backend, Stripe payments, and Zustand state management. The app integrates four main business models:

1. **E-commerce** - Gadget sales with cart management and order processing
2. **Services Marketplace** - Appointment-based services (hair, beauty, tech support)
3. **Event Ticketing** - Venue-based events with ticket sales
4. **Mall Directory** - Individual shop listings with their own products and features

This multi-modal architecture requires understanding cross-domain data flows and shared UI patterns.

## Architecture & Key Patterns

### File-Based Routing (Expo Router)

- Main entry point: `src/app/_layout.tsx` (not `App.tsx` which is unused)
- Route structure:
  - `src/app/(shop)/` - Main tab navigation (index, services, events, profile, orders)
  - `src/app/categories/` - Product categories
  - `src/app/product/` - Individual product details
  - `src/app/shop/` - Individual mall shop details
- Use `Link` from `expo-router` for navigation, not React Navigation components
- Route groups in parentheses like `(shop)` don't appear in URL paths
- Dynamic routes use `[slug].tsx` or `[id].tsx` pattern

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

- Custom encrypted storage: `src/lib/supabase.ts` uses AES encryption for large tokens via `LargeSecureStore` class
- Database types: Auto-generated in `src/types/database.types.ts` from Supabase schema
- Pattern: Always use `Tables<'table_name'>` type for database entities
- Real-time subscriptions: Use Supabase channels for live updates (see `src/api/subscriptions.ts`)
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
- Environment variables must have `EXPO_PUBLIC_` prefix for client access

## Code Conventions

### Component Patterns

- Functional components with TypeScript interfaces
- Props destructuring: `{ product }: { product: Tables<'product'> }`
- Styling: StyleSheet.create() at component bottom
- File naming: kebab-case for components (`product-list-item.tsx`)
- Navigation: Use `Link` from `expo-router` with `asChild` prop for custom components

### API Integration

- **React Query hooks** in `src/api/api.ts`: `const { data, error, isLoading } = getProductsAndCategories()`
- **Async functions** in `src/api/shops.ts`: Direct Supabase calls for shop-specific operations
- Multi-domain queries: Services (`getServiceCategories`, `getServicesByCategory`), Events (`getEvents`, `getEventsByCategory`), Shops (`getShops`, `getShopsByCategory`)
- Always handle loading/error states in components
- Mutations use `useMutation` with proper invalidation: `queryClient.invalidateQueries({ queryKey: ["orders"] })`
- Service bookings: `createServiceBooking()` mutation
- Event tickets: `createTicketPurchase()` mutation
- Real-time updates: Use `supabase.channel()` for live data subscriptions

### Cart Management

- Global cart state via `useCartStore()` hook
- Cart items include `maxQuantity` constraint checking
- Price calculations return formatted strings (e.g., `"$29.99"`)
- Cart operations: `addItem`, `removeItem`, `incrementItem`, `decrementItem`
- Quantity validation: `Math.min(quantity, maxQuantity)` to respect inventory limits

### TypeScript Patterns

- Database types from Supabase in `src/types/database.types.ts`
- Asset types in `assets/types/` for static data structures
- Use `Tables<'table_name'>` for Supabase entity types
- Strict null checking - handle undefined/null explicitly
- Extended types: `ProductWithShop = Tables<'product'> & { shops?: {...} }`

## Critical Integration Points

### Authentication Flow

- Supabase auth with custom encrypted session storage (`LargeSecureStore`)
- Session management in `AuthProvider` with mounting state
- Protected routes check session state, redirect to `/auth`
- User profile data fetched separately from auth session

### Payment Processing

- Stripe integration in checkout flow
- Stripe functions in `supabase/functions/stripe-checkout/`
- Payment methods handled server-side, not in React Native app
- Customer IDs stored in user profiles (`stripe_customer_id`)

### Notifications

- Expo notifications with device token storage
- Notification provider wraps app for push notification handling
- Tokens stored in Supabase user profiles (`expo_notification_token`)

### Service Booking System

- Service categories, providers, and bookings managed in Supabase
- Booking flow: Select service → Choose provider → Pick date/time → Confirm
- Modal components: `BookingModal` for service appointments
- API pattern: `createServiceBooking()` returns mutation for appointment creation
- Database tables: `service`, `service_category`, `service_provider`, `service_booking`

### Event Ticketing System

- Events linked to venues with capacity management
- Categories: Music, Comedy, Art, Business, Culture, Film
- Ticket purchasing flow with quantity selection and payment
- Components: `EventBookingModal` for ticket purchases
- API pattern: `createTicketPurchase()` for ticket sales
- Database tables: `events`, `event_venue`, `ticket_purchases`

### Mall Shop Directory

- Individual shops with their own products and features
- Shop-specific APIs in `src/api/shops.ts` separate from main product APIs
- Features per shop: delivery, collection, appointments, virtual try-on
- Route: `/shop/[id]` for individual shop details with product listings
- Database tables: `shops`, `shop_reviews`, enhanced `product` table with `shop_id`

## File Structure Guidelines

- Components: `src/components/` - reusable UI components
- Screens: `src/app/` - file-based routes (Expo Router)
- Logic: `src/api/` for data fetching, `src/store/` for state
- Utils: `src/utils/` for helper functions
- Assets: Local images in `assets/images/`, types in `assets/types/`
- Providers: `src/providers/` for React context providers
- Lib: `src/lib/` for external service configurations

## Common Pitfalls

- Don't use `App.tsx` - routing starts from `src/app/_layout.tsx`
- Environment variables must have `EXPO_PUBLIC_` prefix for client access
- Use `Tables<'table_name'>` not manual type definitions for Supabase data
- Cart quantity changes must respect `maxQuantity` constraints
- Always wrap async operations in try/catch with proper error handling
- Shop APIs use direct async functions, not React Query hooks
- Real-time subscriptions require proper cleanup in useEffect return functions
