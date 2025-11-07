-- ============================================================
-- DYNAMIC VERSION: Creates services using actual provider IDs
-- ============================================================

WITH provider_ids AS (
  SELECT 
    MAX(CASE WHEN email = 'thandi@hairstranz.com' THEN id END) as thandi_id,
    MAX(CASE WHEN email = 'kabelo@hairstranz.com' THEN id END) as kabelo_id
  FROM service_provider
  WHERE shop_id = 79
),
category_id AS (
  SELECT id as cat_id FROM service_category WHERE name = 'Hair & Beauty'
)
INSERT INTO service (category_id, provider_id, name, description, price, duration_minutes, is_active, rating, total_reviews, slug, created_at)
SELECT 
  c.cat_id,
  CASE 
    WHEN service_data.provider = 'thandi' THEN p.thandi_id
    WHEN service_data.provider = 'kabelo' THEN p.kabelo_id
  END,
  service_data.name,
  service_data.description,
  service_data.price,
  service_data.duration_minutes,
  service_data.is_active,
  service_data.rating,
  service_data.total_reviews,
  service_data.slug,
  NOW()
FROM provider_ids p, category_id c,
(VALUES
  ('thandi', 'Haircut & Style', 'Professional haircut with styling', 150.00, 60, true, 4.8, 234, 'haircut-style-hairstranz'),
  ('thandi', 'Hair Coloring', 'Full hair coloring service', 450.00, 120, true, 4.9, 156, 'hair-coloring-hairstranz'),
  ('kabelo', 'Balayage Treatment', 'Premium balayage coloring technique', 650.00, 180, true, 4.9, 98, 'balayage-treatment-hairstranz'),
  ('kabelo', 'Hair Treatment', 'Deep conditioning and repair treatment', 280.00, 90, true, 4.7, 187, 'hair-treatment-hairstranz'),
  ('thandi', 'Blow Dry & Style', 'Professional blow dry and styling', 120.00, 45, true, 4.6, 312, 'blow-dry-style-hairstranz')
) AS service_data(provider, name, description, price, duration_minutes, is_active, rating, total_reviews, slug)
ON CONFLICT (slug) DO NOTHING;

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
