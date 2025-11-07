-- ============================================================
-- FIX: Update existing providers to add shop_id
-- ============================================================

-- First, let's see which providers we need to update
SELECT id, name, email, shop_id 
FROM service_provider 
WHERE email IN (
  'thandi@hairstranz.com',
  'kabelo@hairstranz.com'
);

-- Now UPDATE them to add shop_id = 79
UPDATE service_provider 
SET shop_id = 79
WHERE email IN (
  'thandi@hairstranz.com',
  'kabelo@hairstranz.com'
);

-- Verify the update worked
SELECT id, name, email, shop_id 
FROM service_provider 
WHERE shop_id = 79;

-- Expected: Should show 2 providers with shop_id = 79
