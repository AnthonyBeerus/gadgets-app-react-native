-- ============================================================
-- DEBUGGING: Check what we have so far
-- ============================================================

-- Check 1: Do we have the category?
SELECT id, name FROM service_category WHERE name = 'Hair & Beauty';

-- Check 2: Do we have the providers?
SELECT id, name, email, shop_id FROM service_provider WHERE shop_id = 79;

-- Check 3: Check if services table exists and what columns it has
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'service'
ORDER BY ordinal_position;

-- Check 4: Do we already have any services?
SELECT COUNT(*) as total_services FROM service;

-- Check 5: Are there any services for shop 79's providers?
SELECT s.* 
FROM service s
JOIN service_provider sp ON s.provider_id = sp.id
WHERE sp.shop_id = 79;
