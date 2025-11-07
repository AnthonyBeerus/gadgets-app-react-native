-- Seed data for product color variants
-- This populates the product_variants table with color options for clothing items

BEGIN;

-- First, let's ensure we have some clothing products in the database
-- We'll add them to shops that already exist in the complete_mall_seed.sql
-- We'll dynamically get the shop IDs to ensure compatibility

-- Insert sample clothing products if they don't exist
-- Using subqueries to get actual shop IDs from the shops table
INSERT INTO product (title, slug, category, "heroImage", "imagesUrl", price, "maxQuantity", shop_id)
SELECT * FROM (
  VALUES
    -- Mr Price Products (get shop_id dynamically)
    (
      'Classic Cotton T-Shirt',
      'classic-cotton-tshirt',
      2,
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
      ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800'],
      29.99::DECIMAL,
      50,
      (SELECT id FROM shops WHERE name = 'Mr Price' LIMIT 1)
    ),
    (
      'Slim Fit Denim Jeans',
      'slim-fit-denim-jeans',
      2,
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800',
      ARRAY['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800', 'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800'],
      59.99::DECIMAL,
      40,
      (SELECT id FROM shops WHERE name = 'Mr Price' LIMIT 1)
    ),
    (
      'Casual Hoodie',
      'casual-hoodie',
      2,
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
      ARRAY['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800'],
      45.99::DECIMAL,
      35,
      (SELECT id FROM shops WHERE name = 'Mr Price' LIMIT 1)
    ),
    
    -- Edgars Products
    (
      'Formal Dress Shirt',
      'formal-dress-shirt',
      2,
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800',
      ARRAY['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800'],
      79.99::DECIMAL,
      30,
      (SELECT id FROM shops WHERE name = 'Edgars' LIMIT 1)
    ),
    (
      'Elegant Blazer',
      'elegant-blazer',
      2,
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800',
      ARRAY['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800', 'https://images.unsplash.com/photo-1593030103066-0093718efeb9?w=800'],
      149.99::DECIMAL,
      20,
      (SELECT id FROM shops WHERE name = 'Edgars' LIMIT 1)
    ),
    (
      'Chino Pants',
      'chino-pants',
      2,
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800',
      ARRAY['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800'],
      69.99::DECIMAL,
      35,
      (SELECT id FROM shops WHERE name = 'Edgars' LIMIT 1)
    ),
    
    -- Truworths Products
    (
      'Designer Polo Shirt',
      'designer-polo-shirt',
      2,
      'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800',
      ARRAY['https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800'],
      89.99::DECIMAL,
      25,
      (SELECT id FROM shops WHERE name = 'Truworths' LIMIT 1)
    ),
    (
      'Summer Dress',
      'summer-dress',
      2,
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
      ARRAY['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800'],
      99.99::DECIMAL,
      30,
      (SELECT id FROM shops WHERE name = 'Truworths' LIMIT 1)
    ),
    (
      'Knit Sweater',
      'knit-sweater',
      2,
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800',
      ARRAY['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800', 'https://images.unsplash.com/photo-1583744999572-e0e285222315?w=800'],
      69.99::DECIMAL,
      28,
      (SELECT id FROM shops WHERE name = 'Truworths' LIMIT 1)
    )
) AS new_products(title, slug, category, "heroImage", "imagesUrl", price, "maxQuantity", shop_id)
WHERE NOT EXISTS (
  SELECT 1 FROM product WHERE slug = new_products.slug
)
AND new_products.shop_id IS NOT NULL; -- Only insert if shop exists

-- Now insert color variants for each product
-- We'll get the product IDs dynamically

-- Color variants for Classic Cotton T-Shirt
INSERT INTO product_variants (product_id, color_name, color_hex, stock_quantity, is_available)
SELECT p.id, v.color_name, v.color_hex, v.stock_quantity, v.is_available
FROM product p
CROSS JOIN (
  VALUES
    ('Black', '#000000', 25, true),
    ('White', '#FFFFFF', 30, true),
    ('Navy Blue', '#001F3F', 20, true),
    ('Gray', '#808080', 22, true),
    ('Red', '#EF4444', 18, true)
) AS v(color_name, color_hex, stock_quantity, is_available)
WHERE p.slug = 'classic-cotton-tshirt'
ON CONFLICT (product_id, color_name) DO NOTHING;

-- Color variants for Slim Fit Denim Jeans
INSERT INTO product_variants (product_id, color_name, color_hex, stock_quantity, is_available)
SELECT p.id, v.color_name, v.color_hex, v.stock_quantity, v.is_available
FROM product p
CROSS JOIN (
  VALUES
    ('Dark Blue', '#1E3A8A', 20, true),
    ('Light Blue', '#60A5FA', 18, true),
    ('Black', '#000000', 22, true),
    ('Gray', '#6B7280', 15, true)
) AS v(color_name, color_hex, stock_quantity, is_available)
WHERE p.slug = 'slim-fit-denim-jeans'
ON CONFLICT (product_id, color_name) DO NOTHING;

-- Color variants for Casual Hoodie
INSERT INTO product_variants (product_id, color_name, color_hex, stock_quantity, is_available)
SELECT p.id, v.color_name, v.color_hex, v.stock_quantity, v.is_available
FROM product p
CROSS JOIN (
  VALUES
    ('Black', '#000000', 18, true),
    ('Gray', '#9CA3AF', 20, true),
    ('Navy', '#1E40AF', 16, true),
    ('Burgundy', '#7F1D1D', 14, true),
    ('Forest Green', '#047857', 12, true)
) AS v(color_name, color_hex, stock_quantity, is_available)
WHERE p.slug = 'casual-hoodie'
ON CONFLICT (product_id, color_name) DO NOTHING;

-- Color variants for Formal Dress Shirt
INSERT INTO product_variants (product_id, color_name, color_hex, stock_quantity, is_available)
SELECT p.id, v.color_name, v.color_hex, v.stock_quantity, v.is_available
FROM product p
CROSS JOIN (
  VALUES
    ('White', '#FFFFFF', 25, true),
    ('Light Blue', '#BFDBFE', 20, true),
    ('Pink', '#FBD5D5', 15, true),
    ('Lavender', '#DDD6FE', 12, true)
) AS v(color_name, color_hex, stock_quantity, is_available)
WHERE p.slug = 'formal-dress-shirt'
ON CONFLICT (product_id, color_name) DO NOTHING;

-- Color variants for Elegant Blazer
INSERT INTO product_variants (product_id, color_name, color_hex, stock_quantity, is_available)
SELECT p.id, v.color_name, v.color_hex, v.stock_quantity, v.is_available
FROM product p
CROSS JOIN (
  VALUES
    ('Black', '#000000', 12, true),
    ('Navy', '#1E3A8A', 10, true),
    ('Charcoal', '#374151', 8, true),
    ('Tan', '#D97706', 6, true)
) AS v(color_name, color_hex, stock_quantity, is_available)
WHERE p.slug = 'elegant-blazer'
ON CONFLICT (product_id, color_name) DO NOTHING;

-- Color variants for Chino Pants
INSERT INTO product_variants (product_id, color_name, color_hex, stock_quantity, is_available)
SELECT p.id, v.color_name, v.color_hex, v.stock_quantity, v.is_available
FROM product p
CROSS JOIN (
  VALUES
    ('Khaki', '#C2B280', 20, true),
    ('Navy', '#001F3F', 18, true),
    ('Black', '#000000', 16, true),
    ('Olive', '#556B2F', 14, true),
    ('Beige', '#F5F5DC', 12, true)
) AS v(color_name, color_hex, stock_quantity, is_available)
WHERE p.slug = 'chino-pants'
ON CONFLICT (product_id, color_name) DO NOTHING;

-- Color variants for Designer Polo Shirt
INSERT INTO product_variants (product_id, color_name, color_hex, stock_quantity, is_available)
SELECT p.id, v.color_name, v.color_hex, v.stock_quantity, v.is_available
FROM product p
CROSS JOIN (
  VALUES
    ('White', '#FFFFFF', 15, true),
    ('Navy', '#1E3A8A', 12, true),
    ('Red', '#DC2626', 10, true),
    ('Green', '#16A34A', 8, true),
    ('Yellow', '#EAB308', 6, true)
) AS v(color_name, color_hex, stock_quantity, is_available)
WHERE p.slug = 'designer-polo-shirt'
ON CONFLICT (product_id, color_name) DO NOTHING;

-- Color variants for Summer Dress
INSERT INTO product_variants (product_id, color_name, color_hex, stock_quantity, is_available)
SELECT p.id, v.color_name, v.color_hex, v.stock_quantity, v.is_available
FROM product p
CROSS JOIN (
  VALUES
    ('Coral', '#FF7F50', 18, true),
    ('Sky Blue', '#87CEEB', 16, true),
    ('Mint Green', '#98FF98', 14, true),
    ('Yellow', '#FFD700', 12, true),
    ('Pink', '#FFC0CB', 10, true)
) AS v(color_name, color_hex, stock_quantity, is_available)
WHERE p.slug = 'summer-dress'
ON CONFLICT (product_id, color_name) DO NOTHING;

-- Color variants for Knit Sweater
INSERT INTO product_variants (product_id, color_name, color_hex, stock_quantity, is_available)
SELECT p.id, v.color_name, v.color_hex, v.stock_quantity, v.is_available
FROM product p
CROSS JOIN (
  VALUES
    ('Cream', '#FFFDD0', 15, true),
    ('Burgundy', '#800020', 12, true),
    ('Forest Green', '#228B22', 10, true),
    ('Charcoal', '#36454F', 14, true),
    ('Navy', '#000080', 11, true)
) AS v(color_name, color_hex, stock_quantity, is_available)
WHERE p.slug = 'knit-sweater'
ON CONFLICT (product_id, color_name) DO NOTHING;

COMMIT;

-- Add helpful comment
COMMENT ON TABLE product_variants IS 'Updated with seed data for 9 clothing products across 3 fashion shops';
