-- ============================================================
-- PART 2: Service Providers for HairStranz (Shop 79)
-- ============================================================

-- First, verify shop 79 exists and has appointment booking enabled
SELECT id, name, has_appointment_booking FROM shops WHERE id = 79;

-- If has_appointment_booking is false, enable it:
UPDATE shops SET has_appointment_booking = true WHERE id = 79;

-- Now add the service providers
INSERT INTO service_provider (name, email, phone, description, rating, total_reviews, shop_id, is_active, is_verified, created_at)
VALUES 
  ('Thandi Mokoena - Senior Stylist', 'thandi@hairstranz.com', '+267 71234501', 'Award-winning hair stylist with 10+ years experience', 4.9, 156, 79, true, true, NOW()),
  ('Kabelo Motsumi - Master Colorist', 'kabelo@hairstranz.com', '+267 71234502', 'Specialist in hair coloring and treatments', 4.8, 142, 79, true, true, NOW())
ON CONFLICT (email) DO NOTHING;

-- Verify providers were created
SELECT id, name, email, shop_id FROM service_provider WHERE shop_id = 79;
