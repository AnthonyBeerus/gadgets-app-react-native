# Profile Feature

## Overview
The Profile feature manages user account information, settings, and navigation to other personal sections like orders, wishlist, and support.

## Structure
- `components/`: UI components specific to profile (e.g., `ProfileOption`)
- `screens/`: Screen components (e.g., `ProfileScreen`)

## Dependencies
- `shared/providers/auth-provider`: For user authentication state
- `shared/lib/supabase`: For sign-out functionality
- `shared/constants`: Uses `NEO_THEME` for styling

## Testing
Run tests using `npm test` (tests to be implemented).
