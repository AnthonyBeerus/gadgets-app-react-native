# Services Feature

Appointment booking system for beauty, health, sports, and wellness services.

## Overview
The Services feature allows users to browse service categories, view available services, and book appointments with service providers.

## Structure

```
features/services/
├── screens/
│   └── ServicesScreen.tsx       # Main services screen with category selection
├── components/
│   ├── ServiceCard.tsx           # Individual service card display
│   ├── CategoryCard.tsx          # Service category cards
│   └── BookingModal.tsx          # (TODO) Booking modal with Neubrutalism
└── README.md
```

## Features

- **Category Selection**: Browse services by category (Beauty, Health, Sports, etc.)
- **Service Browsing**: View detailed service information including price, duration, provider, and ratings
- **Appointment Booking**: Book services through an integrated booking modal
- **Animated Headers**: Smooth scroll-based header animations for both category list and service list views

## Navigation

The Services screen is accessible via:
- Tab bar navigation icon (Medical Services icon)
- Route: `/services` (outside tab group to allow modals to render over tabs)

## Components

### `ServicesScreen`
Main screen component managing:
- Category selection state
- Service fetching based on selected category
- Booking modal visibility
- Loading and error states
- AnimatedHeaderLayout for both views

### `ServiceCard`
Displays individual service with:
- Service name (uppercase, bold)
- Provider name
- Duration and price
- Rating badge
- "BOOK NOW" button

### `CategoryCard`
Shows service category with:
- Category icon with background color
- Category name
- Description
- Tap to view services in category

## Styling

All components follow **Neobrutalism** design principles:
- Thick black borders (3px)
- Hard shadows (no blur)
- Bold, uppercase typography
- High contrast colors (yellow accents, black/white base)
- Sharp corners with consistent 8px border radius

## Data Flow

1. Fetch categories on mount via `getServiceCategories()`
2. User selects category
3. Fetch category services via `getServicesByCategory(categoryId)`
4. User taps "BOOK NOW" on service
5. BookingModal opens with service details
6. User completes booking

## TODO

- [ ] Refactor `BookingModal` with full Neobrutalism styling
- [ ] Add service search/filter functionality
- [ ] Implement favorite services
- [ ] Add booking history integration

## Dependencies

- `@expo/vector-icons` - Icons (MaterialIcons)
- `shared/api/api` - Service data fetching
- `shared/components/layout/AnimatedHeaderLayout` - Animated headers
- `features/appointments/components/BookingModal` - Booking functionality (needs refactor)
