-- ============================================================
-- PART 3: Services for HairStranz (Shop 79)
-- ============================================================

-- Get the category and provider IDs we need
DO $$
DECLARE
  cat_hair_beauty INT;
  prov_thandi INT;
  prov_kabelo INT;
BEGIN
  -- Get category ID
  SELECT id INTO cat_hair_beauty FROM service_category WHERE name = 'Hair & Beauty';
  
  -- Get provider IDs
  SELECT id INTO prov_thandi FROM service_provider WHERE email = 'thandi@hairstranz.com';
  SELECT id INTO prov_kabelo FROM service_provider WHERE email = 'kabelo@hairstranz.com';
  
  -- Create services
  INSERT INTO service (category_id, provider_id, name, description, price, duration_minutes, is_active, rating, total_reviews, slug, created_at)
  VALUES 
    (cat_hair_beauty, prov_thandi, 'Haircut & Style', 'Professional haircut with styling', 150.00, 60, true, 4.8, 234, 'haircut-style', NOW()),
    (cat_hair_beauty, prov_thandi, 'Hair Coloring', 'Full hair coloring service', 450.00, 120, true, 4.9, 156, 'hair-coloring', NOW()),
    (cat_hair_beauty, prov_kabelo, 'Balayage Treatment', 'Premium balayage coloring technique', 650.00, 180, true, 4.9, 98, 'balayage-treatment', NOW()),
    (cat_hair_beauty, prov_kabelo, 'Hair Treatment', 'Deep conditioning and repair treatment', 280.00, 90, true, 4.7, 187, 'hair-treatment', NOW()),
    (cat_hair_beauty, prov_thandi, 'Blow Dry & Style', 'Professional blow dry and styling', 120.00, 45, true, 4.6, 312, 'blow-dry-style', NOW())
  ON CONFLICT (slug) DO NOTHING;
  
  RAISE NOTICE 'Services created successfully for HairStranz!';
END $$;

-- Verify services were created
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
