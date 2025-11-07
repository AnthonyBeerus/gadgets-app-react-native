-- ============================================================
-- CHECK IF PROVIDERS EXIST
-- ============================================================

-- Check 1: Do the providers exist?
SELECT id, name, email, shop_id FROM service_provider WHERE email IN ('thandi@hairstranz.com', 'kabelo@hairstranz.com');

-- Check 2: How many providers are there total?
SELECT COUNT(*) as total_providers FROM service_provider;

-- Check 3: Do we have ANY providers with shop_id 79?
SELECT * FROM service_provider WHERE shop_id = 79;

-- Check 4: What providers do we have?
SELECT id, name, email, shop_id FROM service_provider ORDER BY id DESC LIMIT 10;
