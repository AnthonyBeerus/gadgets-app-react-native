# Appointments Feature

## Overview

The appointments feature allows users to book service appointments from service providers and manage their bookings.

## Feature Structure

### Components (`src/features/appointments/components/`)

- **BookingModal.tsx** - Modal for creating new service appointments
  - Date and time selection
  - Service provider selection
  - Notes input
  - Booking confirmation

### Routes (`src/app/appointments/`)

- **\_layout.tsx** - Stack navigation layout for appointments section
- **index.tsx** - List of user's appointments with status badges
- **[id].tsx** - Detailed view of a single appointment with:
  - Full appointment details
  - Service and provider information
  - Booking information
  - Cancel appointment functionality (for pending/confirmed only)

## Navigation Flow

1. User browses services in `/services` tab
2. Taps "Book Now" to open `BookingModal`
3. Completes booking form
4. Appointment created in database
5. User can view appointments at `/appointments`
6. Tap appointment card to view details at `/appointments/[id]`
7. Can cancel appointment from details screen (if status allows)

## Integration Points

### Database Tables

- `service` - Available services
- `service_provider` - Service providers
- `service_booking` - Appointment records
- `service_category` - Service categorization

### API Functions

- `createServiceBooking()` - Creates new appointment (mutation)
- `getShopAppointments(userId)` - Fetches user's appointments (async)

### State Management

- Uses React Query for booking mutations
- Local component state for appointment lists and details
- Real-time updates via Supabase subscriptions (optional)

## Status Flow

- **pending** - Newly created booking (orange)
- **confirmed** - Provider confirmed appointment (green)
- **completed** - Service rendered (gray)
- **cancelled** - User or provider cancelled (red)

## Usage Example

### From Services Screen

```tsx
import BookingModal from "../../features/appointments/components/BookingModal";

const ServicesScreen = () => {
  const [selectedService, setSelectedService] = useState(null);

  return (
    <>
      {/* Service list */}
      <BookingModal
        visible={!!selectedService}
        service={selectedService}
        onClose={() => setSelectedService(null)}
      />
    </>
  );
};
```

### Navigate to Appointments

```tsx
import { router } from "expo-router";

// View all appointments
router.push("/appointments");

// View specific appointment
router.push(`/appointments/${appointmentId}`);
```

## File Locations

- Feature components: `src/features/appointments/components/`
- Route screens: `src/app/appointments/`
- API functions: `src/api/api.ts` (mutations), `src/api/shops.ts` (async)
- Database types: `src/types/database.types.ts`

## Key Features

- ✅ Date and time selection
- ✅ Service provider selection
- ✅ Notes/special requests
- ✅ Appointment listing with filters
- ✅ Status tracking with visual badges
- ✅ Detailed appointment view
- ✅ Cancel appointment (conditional)
- ✅ Loading and error states
- ✅ Navigation integration

## Future Enhancements

- [ ] Add pull-to-refresh on appointments list
- [ ] Add appointment reminders/notifications
- [ ] Add reschedule functionality
- [ ] Add reviews/ratings after completion
- [ ] Add appointment search/filtering
- [ ] Add calendar view option
- [ ] Add quick access from profile tab
