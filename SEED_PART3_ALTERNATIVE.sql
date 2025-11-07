-- ============================================================
-- PART 3 ALTERNATIVE: Services for HairStranz - Step by Step
-- ============================================================

-- Step 1: Get the IDs we need
SELECT id, name FROM service_category WHERE name = 'Hair & Beauty';
-- Copy the id from the result (should be 18)

SELECT id, name, email FROM service_provider WHERE email IN ('thandi@hairstranz.com', 'kabelo@hairstranz.com');
-- Copy both IDs from the result

-- Step 2: Replace the IDs below with the actual IDs from above
-- IMPORTANT: Replace 18, 123, and 124 with your actual IDs!

INSERT INTO service (category_id, provider_id, name, description, price, duration_minutes, is_active, rating, total_reviews, slug, created_at)
VALUES 
  (18, 123, 'Haircut & Style', 'Professional haircut with styling', 150.00, 60, true, 4.8, 234, 'haircut-style-79', NOW()),
  (18, 123, 'Hair Coloring', 'Full hair coloring service', 450.00, 120, true, 4.9, 156, 'hair-coloring-79', NOW()),
  (18, 124, 'Balayage Treatment', 'Premium balayage coloring technique', 650.00, 180, true, 4.9, 98, 'balayage-treatment-79', NOW()),
  (18, 124, 'Hair Treatment', 'Deep conditioning and repair treatment', 280.00, 90, true, 4.7, 187, 'hair-treatment-79', NOW()),
  (18, 123, 'Blow Dry & Style', 'Professional blow dry and styling', 120.00, 45, true, 4.6, 312, 'blow-dry-style-79', NOW())
ON CONFLICT (slug) DO NOTHING;

-- Step 3: Verify services were created
SELECT 
  s.id,
  s.name as service_name,
  s.price,
  s.duration_minutes,
  sp.name as provider_name,
  sp.shop_id
FROM service s
JOIN service_provider sp ON s.provider_id = sp.id
WHERE sp.shop_id = 79
ORDER BY s.name;
