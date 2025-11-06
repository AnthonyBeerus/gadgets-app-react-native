-- Simple product seed for testing virtual try-on
-- Run this in Supabase SQL Editor
-- This assigns clothing products to Tuelie's Corner (we'll get the ID dynamically)

BEGIN;

-- Add some clothing products (category 2) for virtual try-on
-- Assign them to Tuelie's Corner shop

INSERT INTO product (title, slug, "heroImage", "imagesUrl", price, category, "maxQuantity", shop_id) VALUES 
-- Clothing items (category 2) for virtual try-on assigned to Tuelie's Corner
('Stylish Black T-Shirt', 'stylish-black-t-shirt', 
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', 
  '{"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"}', 
  299.00, 2, 50, (SELECT id FROM shops WHERE name = 'Tuelie''s Corner' LIMIT 1)),

('Blue Denim Jacket', 'blue-denim-jacket', 
  'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500', 
  '{"https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500"}', 
  899.00, 2, 30, (SELECT id FROM shops WHERE name = 'Tuelie''s Corner' LIMIT 1)),

('Designer Evening Dress', 'designer-evening-dress', 
  'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500', 
  '{"https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500"}', 
  1850.00, 2, 15, (SELECT id FROM shops WHERE name = 'Tuelie''s Corner' LIMIT 1)),

('Casual White Shirt', 'casual-white-shirt', 
  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500', 
  '{"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500"}', 
  450.00, 2, 40, (SELECT id FROM shops WHERE name = 'Tuelie''s Corner' LIMIT 1)),

('Red Cocktail Dress', 'red-cocktail-dress', 
  'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500', 
  '{"https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500"}', 
  1250.00, 2, 20, (SELECT id FROM shops WHERE name = 'Tuelie''s Corner' LIMIT 1)),

-- Add products to Pinkiees Boutique
('Floral Summer Dress', 'floral-summer-dress-pink', 
  'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500', 
  '{"https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500"}', 
  680.00, 2, 35, (SELECT id FROM shops WHERE name = 'Pinkiees Boutique' LIMIT 1)),

('Pink Blazer', 'pink-blazer', 
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500', 
  '{"https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500"}', 
  1200.00, 2, 25, (SELECT id FROM shops WHERE name = 'Pinkiees Boutique' LIMIT 1)),

-- Add products to Onius Motorsport Clothing
('Racing Leather Jacket', 'racing-leather-jacket-onius', 
  'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500', 
  '{"https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500"}', 
  2500.00, 2, 12, (SELECT id FROM shops WHERE name = 'Onius Motorsport Clothing' LIMIT 1)),

('Motorsport T-Shirt', 'motorsport-t-shirt-onius', 
  'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500', 
  '{"https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500"}', 
  350.00, 2, 50, (SELECT id FROM shops WHERE name = 'Onius Motorsport Clothing' LIMIT 1))

ON CONFLICT (slug) DO UPDATE
SET shop_id = EXCLUDED.shop_id;

COMMIT;

-- Verify products were added and assigned to shops
SELECT 
    s.name as shop_name, 
    COUNT(p.id) as product_count
FROM shops s
LEFT JOIN product p ON p.shop_id = s.id
WHERE s.name IN ('Tuelie''s Corner', 'Pinkiees Boutique', 'Onius Motorsport Clothing')
GROUP BY s.id, s.name
ORDER BY s.name;

