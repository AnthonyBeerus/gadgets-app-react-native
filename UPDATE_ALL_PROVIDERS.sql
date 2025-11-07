-- ============================================================
-- ALL OTHER SHOPS WITH APPOINTMENT BOOKING
-- ============================================================

-- First, update all providers to set their shop_id
UPDATE service_provider SET shop_id = 80 WHERE email IN ('lerato@dolllife.com', 'neo@dolllife.com');
UPDATE service_provider SET shop_id = 81 WHERE email = 'mpho@cuttingline.com';
UPDATE service_provider SET shop_id = 198 WHERE email = 'nailsbythato@gmail.com';
UPDATE service_provider SET shop_id = 199 WHERE email = 'keabetswenails@gmail.com';
UPDATE service_provider SET shop_id = 200 WHERE email = 'lesegosnails@gmail.com';
UPDATE service_provider SET shop_id = 201 WHERE email = 'braidsbyampho@gmail.com';
UPDATE service_provider SET shop_id = 202 WHERE email = 'neosbraids@gmail.com';
UPDATE service_provider SET shop_id = 203 WHERE email = 'tlotlobraids@gmail.com';
UPDATE service_provider SET shop_id = 204 WHERE email = 'boitumelobraids@gmail.com';
UPDATE service_provider SET shop_id = 77 WHERE email IN ('tshepo@viva.com', 'kabo@viva.com');
UPDATE service_provider SET shop_id = 83 WHERE email = 'dr.modise@healthalt.com';
UPDATE service_provider SET shop_id = 84 WHERE email IN ('dr.molefi@smiletime.com', 'dr.seabe@smiletime.com');
UPDATE service_provider SET shop_id = 85 WHERE email = 'events@dros.com';
UPDATE service_provider SET shop_id = 86 WHERE email = 'reservations@cappello.com';
UPDATE service_provider SET shop_id = 87 WHERE email = 'bookings@laparada.com';
UPDATE service_provider SET shop_id = 88 WHERE email = 'boipelo@shineafrica.com';
UPDATE service_provider SET shop_id = 89 WHERE email = 'kagiso@premier.com';
UPDATE service_provider SET shop_id = 90 WHERE email = 'gorata@funads.com';

-- Enable appointment booking for all these shops
UPDATE shops SET has_appointment_booking = true 
WHERE id IN (80, 81, 77, 83, 84, 85, 86, 87, 88, 89, 90, 198, 199, 200, 201, 202, 203, 204);

-- Verify providers updated
SELECT shop_id, COUNT(*) as provider_count 
FROM service_provider 
WHERE shop_id IS NOT NULL 
GROUP BY shop_id 
ORDER BY shop_id;
