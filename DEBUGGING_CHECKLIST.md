# Debugging Checklist for Appointment Booking

## Console Logs to Watch

When you click "Book Appointment" on a shop, you should see these logs in order:

1. **Shop Detail Screen** - When services load:

   ```
   Shop Detail - Selected service: { id: X, name: "...", service_provider: {...} }
   Shop Detail - Shop context: { id: Y, name: "...", logo_url: "..." }
   ```

2. **Booking Modal** - When modal opens:
   ```
   BookingModal - Modal opened
   BookingModal - Service: { id: X, name: "...", ... }
   BookingModal - Shop: { id: Y, name: "...", ... }
   BookingModal - Rendering modal with service: "Service Name"
   ```

## Common Issues & Solutions

### Issue 1: "No service data, returning null"

**Cause**: Service object is null/undefined when modal opens
**Check**:

- Did the seed data run successfully?
- Are there services in the database for that shop?
- Run SQL: `SELECT * FROM service WHERE provider_id IN (SELECT id FROM service_provider WHERE shop_id = YOUR_SHOP_ID);`

### Issue 2: Modal opens but shows "Unknown Service" or "Unknown Provider"

**Cause**: Service object exists but missing nested `service_provider` data
**Check**:

- The query in shop/[id].tsx line 92-107 should use `!inner` join
- Verify service_provider data exists: `SELECT * FROM service_provider WHERE shop_id = YOUR_SHOP_ID;`

### Issue 3: Modal doesn't open at all

**Cause**: isModalVisible is false
**Check**:

- `openBookingModal` is being called with correct parameters
- Zustand store is imported correctly
- No errors in console preventing modal render

### Issue 4: "service_provider.shop_id doesn't exist" error

**Cause**: Migration hasn't been applied
**Solution**: Run migration in Supabase Dashboard SQL Editor (see MANUAL_SETUP_INSTRUCTIONS.md)

## Database Verification Queries

Run these in Supabase Dashboard > SQL Editor:

```sql
-- 1. Check which shops should have appointment booking
SELECT id, name, has_appointment_booking
FROM shops
WHERE has_appointment_booking = true;

-- 2. Check service providers with shop_id
SELECT sp.id, sp.name, sp.shop_id, s.name as shop_name
FROM service_provider sp
LEFT JOIN shops s ON s.id = sp.shop_id
ORDER BY sp.shop_id;

-- 3. Check services for a specific shop (replace 79 with your shop ID)
SELECT
  s.id,
  s.name as service_name,
  s.price,
  s.duration_minutes,
  sp.name as provider_name,
  sp.shop_id,
  sh.name as shop_name
FROM service s
JOIN service_provider sp ON s.provider_id = sp.id
JOIN shops sh ON sp.shop_id = sh.id
WHERE sp.shop_id = 79;

-- 4. Count services per shop
SELECT
  sh.id,
  sh.name as shop_name,
  COUNT(s.id) as service_count
FROM shops sh
LEFT JOIN service_provider sp ON sp.shop_id = sh.id
LEFT JOIN service s ON s.provider_id = sp.id
WHERE sh.has_appointment_booking = true
GROUP BY sh.id, sh.name
ORDER BY service_count DESC;
```

## Test Flow

1. **Open app** - Check console for any initial errors
2. **Navigate to a shop** with `has_appointment_booking = true`
   - Recommended: "HairStranz" (ID 79) or "Nails by Thato" (ID 198)
3. **Click "Book Appointment"** button
4. **Watch console logs** - Should see service selection modal or booking modal
5. **Select a service** - Modal should show shop logo, name, service details
6. **Verify all fields display**:
   - Shop logo (if exists)
   - Shop name
   - Shop location
   - Service name
   - Provider name
   - Duration
   - Price
7. **Select date and time**
8. **Click "Book Now"**
9. **Confirm booking** appears

## Expected Data Structure

The service object passed to `openBookingModal` should look like:

```typescript
{
  id: 123,
  name: "Haircut & Style",
  description: "Professional haircut with styling",
  price: 150.00,
  duration_minutes: 60,
  category_id: 1,
  is_active: true,
  rating: 4.8,
  total_reviews: 234,
  slug: "haircut-style",
  service_provider: {
    id: 45,
    name: "Thandi Mokoena - Senior Stylist",
    email: "thandi@hairstranz.com",
    phone: "+267 71234501",
    rating: 4.9,
    total_reviews: 156,
    is_verified: true,
    shop_id: 79
  }
}
```

## Quick Fixes

### If modal shows but data is missing:

Add more debug logs in `src/components/booking-modal.tsx` after line 108:

```typescript
console.log("Service full object:", JSON.stringify(service, null, 2));
console.log("Shop full object:", JSON.stringify(shop, null, 2));
```

### If service selection doesn't work:

Check `loadShopServices()` in `src/app/shop/[id].tsx` line 88-115:

- Query should include `!inner` join
- Filter should be `.eq("service_provider.shop_id", parseInt(id!))`
- Check if `services` state has data: add `console.log("Loaded services:", services);`

### Force enable appointment booking for a shop:

```sql
UPDATE shops SET has_appointment_booking = true WHERE id = YOUR_SHOP_ID;
```
