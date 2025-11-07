-- ============================================================
-- FINAL STEP: Verify everything is working
-- ============================================================

-- 1. Check if service_provider has data with shop_id
SELECT 
  id, 
  name, 
  shop_id,
  email
FROM service_provider
WHERE shop_id = 79
LIMIT 5;

-- Expected: Should see 2 providers (Thandi and Kabelo) with shop_id = 79

-- 2. Check if services exist for those providers
SELECT 
  s.id,
  s.name as service_name,
  s.price,
  s.duration_minutes,
  sp.name as provider_name,
  sp.shop_id
FROM service s
JOIN service_provider sp ON s.provider_id = sp.id
WHERE sp.shop_id = 79;

-- Expected: Should see 5 services (Haircut & Style, Hair Coloring, Balayage, Hair Treatment, Blow Dry)

-- 3. Test the exact query used by the app
SELECT 
  s.*,
  json_build_object(
    'id', sp.id,
    'name', sp.name,
    'rating', sp.rating,
    'total_reviews', sp.total_reviews,
    'is_verified', sp.is_verified,
    'shop_id', sp.shop_id
  ) as service_provider
FROM service s
INNER JOIN service_provider sp ON s.provider_id = sp.id
WHERE sp.shop_id = 79
  AND s.is_active = true
ORDER BY s.name;

-- Expected: Should return services with embedded service_provider object
-- If this returns 0 rows, the issue is database data, not the app code!
