# Muse Technology Stack Rules

## Framework & Routing

### React Native (Expo)
- **Expo Router**: File-based routing in `app/` directory
- Route structure: `app/[feature]/[route]/index.tsx`
- Screens: Extracted to `features/[feature]/screens/[Name]Screen.tsx`
- Deep linking: Configure in `linking.ts`
- Compose screens from organisms + global components

### Next.js (Future Web)
- **App Router**: `app/[feature]/[route]/page.tsx`
- **API Routes**: `app/api/[feature]/[endpoint]/route.ts`
- **Middleware**: `middleware.ts` for auth, headers, feature flags

---

## Technology Stack

### Database & Backend
- **Supabase**: PostgreSQL database, Auth, Storage, Real-time
  - Queries wrapped in typed services: `features/[feature]/services/db.service.ts`
  - Row-Level Security (RLS) always enabled
  - Migrations: Versioned in `supabase/migrations/`
  - Real-time subscriptions managed in hooks

### Payments & Subscriptions
- **RevenueCat**: In-app purchases, subscriptions
  - Wrapped in `useSubscriptions` hook
  - Synced to store: `useSubscriptionStore`
  - Entitlements stored in Supabase for server-side verification

### Authentication (Optional)
- **Clerk**: User authentication
  - Context: `useAuth()` and `useUser()`
  - Synced to global store: `useAuthStore`
  - Combined with Supabase for extended user profiles

### Caching & Rate Limiting
- **Redis**: Rate limiting (primary), caching (secondary)
  - Wrapped in `lib/cache/redis.ts`
  - Rate limiting on all API endpoints (return 429 on exceed)
  - Namespaced keys: `ratelimit:{userId}:api-call:{endpoint}`

### Analytics & Feature Flags
- **PostHog**: Events, feature flags, LLM analytics
  - Event tracking wrapped in `lib/analytics/posthog.ts`
  - Feature flags stored in `useFeatureFlagsStore`
  - Event names: PascalCase (e.g., `ChallengeCompleted`)
  - Flag names: kebab-case (e.g., `new-challenge-ui`)

### Error Tracking
- **Sentry**: Error monitoring with context
  - Initialize at app entry point
  - Breadcrumbs for user actions and API calls
  - Source maps uploaded for production builds

---

## API Standards

### Response Format
```typescript
{ success: boolean, data: any, error?: Error }
```

### Error Handling
- Typed errors in `types/errors.ts`
- Redis-backed rate limiting on all endpoints
- Return 429 when rate limit exceeded
- Standardized error codes

---

## Testing Third-Party Integrations

- **Supabase**: Mock with realistic fixtures; test RLS and error states
- **RevenueCat**: Mock SDK responses; test receipt validation
- **Clerk**: Mock auth context; test protected routes
- **Redis**: Use in-memory store for unit tests; integration tests for rate limiting
- **PostHog**: Mock events and flags; verify payload structure
- **Sentry**: Mock error capture; test context propagation

---

## Deployment Configuration

### Environment Variables
Required in `.env`:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `REVENUECAT_API_KEY`
- `CLERK_PUBLISHABLE_KEY` (if using Clerk)
- `REDIS_URL`
- `POSTHOG_API_KEY`
- `SENTRY_DSN`

### Production Checklist
- [ ] Supabase RLS policies verified
- [ ] RevenueCat entitlements configured
- [ ] Redis rate limiting tested
- [ ] PostHog events tracking correctly
- [ ] Feature flags configured
- [ ] Sentry source maps uploaded
- [ ] API rate limits documented

---

## Monitoring

- **Sentry**: Alert on new error types
- **PostHog**: Track feature adoption, user flows, feature flag performance
- **Supabase**: Monitor query performance and RLS violations
- **Redis**: Monitor rate limiting performance and cache hit rates
