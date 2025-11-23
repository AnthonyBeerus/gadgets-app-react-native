# Events Feature

## Overview
The Events feature allows users to browse upcoming events, view details, and book tickets or make reservations for venues.

## Structure
- `components/`: UI components specific to events (e.g., `EventCard`, `EventBookingModal`)
- `screens/`: Screen components (e.g., `EventsScreen`)
- `types/`: TypeScript definitions
- `api/`: API integration and mock data

## Dependencies
- `shared/components/ui`: Uses shared UI components
- `shared/constants`: Uses `NEO_THEME` for styling
- `shared/api`: Uses `createEventBooking` for venue bookings

## Testing
Run tests using `npm test` (tests to be implemented).
