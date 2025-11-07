-- ============================================================
-- STEP 3: Check if you need to enable appointment booking for shop 79
-- ============================================================

-- Check current status
SELECT id, name, has_appointment_booking
FROM shops
WHERE id = 79;

-- If has_appointment_booking is false, run this:
UPDATE shops
SET has_appointment_booking = true
WHERE id = 79;

-- Verify it was updated
SELECT id, name, has_appointment_booking
FROM shops
WHERE id = 79;

-- Expected result: 79 | HairStranz | true
