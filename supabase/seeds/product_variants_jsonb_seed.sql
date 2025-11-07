-- Seed data for product color variants using JSONB
-- This populates products with color_variants as a JSONB array

BEGIN;

-- Insert sample clothing products with color variants
-- Using subqueries to get actual shop IDs from the shops table
INSERT INTO product (title, slug, category, "heroImage", "imagesUrl", price, "maxQuantity", shop_id, color_variants)
SELECT * FROM (
  VALUES
    -- Onius Motorsport Clothing Products
    (
      'Classic Cotton T-Shirt',
      'classic-cotton-tshirt',
      2,
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
      ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800'],
      29.99::DECIMAL,
      50,
      (SELECT id FROM shops WHERE name = 'Onius Motorsport Clothing' LIMIT 1),
      '[
        {"color_name": "Black", "color_hex": "#000000", "image_url": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800", "stock_quantity": 25, "is_available": true},
        {"color_name": "White", "color_hex": "#FFFFFF", "image_url": "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=800", "stock_quantity": 30, "is_available": true},
        {"color_name": "Navy Blue", "color_hex": "#001F3F", "image_url": "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800", "stock_quantity": 20, "is_available": true},
        {"color_name": "Gray", "color_hex": "#808080", "image_url": "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800", "stock_quantity": 22, "is_available": true},
        {"color_name": "Red", "color_hex": "#EF4444", "image_url": "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800", "stock_quantity": 18, "is_available": true}
      ]'::JSONB
    ),
    (
      'Slim Fit Denim Jeans',
      'slim-fit-denim-jeans',
      2,
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800',
      ARRAY['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800', 'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800'],
      59.99::DECIMAL,
      40,
      (SELECT id FROM shops WHERE name = 'Onius Motorsport Clothing' LIMIT 1),
      '[
        {"color_name": "Dark Blue", "color_hex": "#1E3A8A", "image_url": "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800", "stock_quantity": 20, "is_available": true},
        {"color_name": "Light Blue", "color_hex": "#60A5FA", "image_url": "https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800", "stock_quantity": 18, "is_available": true},
        {"color_name": "Black", "color_hex": "#000000", "image_url": "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800", "stock_quantity": 22, "is_available": true},
        {"color_name": "Gray", "color_hex": "#6B7280", "image_url": "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800", "stock_quantity": 15, "is_available": true}
      ]'::JSONB
    ),
    (
      'Casual Hoodie',
      'casual-hoodie',
      2,
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
      ARRAY['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800'],
      45.99::DECIMAL,
      35,
      (SELECT id FROM shops WHERE name = 'Onius Motorsport Clothing' LIMIT 1),
      '[
        {"color_name": "Black", "color_hex": "#000000", "image_url": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800", "stock_quantity": 18, "is_available": true},
        {"color_name": "Gray", "color_hex": "#9CA3AF", "image_url": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800", "stock_quantity": 20, "is_available": true},
        {"color_name": "Navy", "color_hex": "#1E40AF", "image_url": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800", "stock_quantity": 16, "is_available": true},
        {"color_name": "Burgundy", "color_hex": "#7F1D1D", "image_url": "https://images.unsplash.com/photo-1620799140188-3b506eb5f1a7?w=800", "stock_quantity": 14, "is_available": true},
        {"color_name": "Forest Green", "color_hex": "#047857", "image_url": "https://images.unsplash.com/photo-1620799139834-6b8f844426f8?w=800", "stock_quantity": 12, "is_available": true}
      ]'::JSONB
    ),
    
    -- Pinkiees Boutique Products
    (
      'Formal Dress Shirt',
      'formal-dress-shirt',
      2,
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800',
      ARRAY['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800'],
      79.99::DECIMAL,
      30,
      (SELECT id FROM shops WHERE name = 'Pinkiees Boutique' LIMIT 1),
      '[
        {"color_name": "White", "color_hex": "#FFFFFF", "image_url": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800", "stock_quantity": 25, "is_available": true},
        {"color_name": "Light Blue", "color_hex": "#BFDBFE", "image_url": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800", "stock_quantity": 20, "is_available": true},
        {"color_name": "Pink", "color_hex": "#FBD5D5", "image_url": "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800", "stock_quantity": 15, "is_available": true},
        {"color_name": "Lavender", "color_hex": "#DDD6FE", "image_url": "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800", "stock_quantity": 12, "is_available": true}
      ]'::JSONB
    ),
    (
      'Elegant Blazer',
      'elegant-blazer',
      2,
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800',
      ARRAY['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800', 'https://images.unsplash.com/photo-1593030103066-0093718efeb9?w=800'],
      149.99::DECIMAL,
      20,
      (SELECT id FROM shops WHERE name = 'Pinkiees Boutique' LIMIT 1),
      '[
        {"color_name": "Black", "color_hex": "#000000", "image_url": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800", "stock_quantity": 12, "is_available": true},
        {"color_name": "Navy", "color_hex": "#1E3A8A", "image_url": "https://images.unsplash.com/photo-1593030103066-0093718efeb9?w=800", "stock_quantity": 10, "is_available": true},
        {"color_name": "Charcoal", "color_hex": "#374151", "image_url": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800", "stock_quantity": 8, "is_available": true},
        {"color_name": "Tan", "color_hex": "#D97706", "image_url": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800", "stock_quantity": 6, "is_available": true}
      ]'::JSONB
    ),
    (
      'Chino Pants',
      'chino-pants',
      2,
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800',
      ARRAY['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800'],
      69.99::DECIMAL,
      35,
      (SELECT id FROM shops WHERE name = 'Pinkiees Boutique' LIMIT 1),
      '[
        {"color_name": "Khaki", "color_hex": "#C2B280", "image_url": "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800", "stock_quantity": 20, "is_available": true},
        {"color_name": "Navy", "color_hex": "#001F3F", "image_url": "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800", "stock_quantity": 18, "is_available": true},
        {"color_name": "Black", "color_hex": "#000000", "image_url": "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800", "stock_quantity": 16, "is_available": true},
        {"color_name": "Olive", "color_hex": "#556B2F", "image_url": "https://images.unsplash.com/photo-1517438476312-10d79c077509?w=800", "stock_quantity": 14, "is_available": true},
        {"color_name": "Beige", "color_hex": "#F5F5DC", "image_url": "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800", "stock_quantity": 12, "is_available": true}
      ]'::JSONB
    ),
    
    -- Tuelie's Corner Products
    (
      'Designer Polo Shirt',
      'designer-polo-shirt',
      2,
      'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800',
      ARRAY['https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800'],
      89.99::DECIMAL,
      25,
      (SELECT id FROM shops WHERE name = 'Tuelie''s Corner' LIMIT 1),
      '[
        {"color_name": "White", "color_hex": "#FFFFFF", "image_url": "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800", "stock_quantity": 15, "is_available": true},
        {"color_name": "Navy", "color_hex": "#1E3A8A", "image_url": "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800", "stock_quantity": 12, "is_available": true},
        {"color_name": "Red", "color_hex": "#DC2626", "image_url": "https://images.unsplash.com/photo-1626497764746-6dc36546b388?w=800", "stock_quantity": 10, "is_available": true},
        {"color_name": "Green", "color_hex": "#16A34A", "image_url": "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800", "stock_quantity": 8, "is_available": true},
        {"color_name": "Yellow", "color_hex": "#EAB308", "image_url": "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=800", "stock_quantity": 6, "is_available": true}
      ]'::JSONB
    ),
    (
      'Summer Dress',
      'summer-dress',
      2,
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
      ARRAY['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800'],
      99.99::DECIMAL,
      30,
      (SELECT id FROM shops WHERE name = 'Tuelie''s Corner' LIMIT 1),
      '[
        {"color_name": "Coral", "color_hex": "#FF7F50", "image_url": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800", "stock_quantity": 18, "is_available": true},
        {"color_name": "Sky Blue", "color_hex": "#87CEEB", "image_url": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800", "stock_quantity": 16, "is_available": true},
        {"color_name": "Mint Green", "color_hex": "#98FF98", "image_url": "https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?w=800", "stock_quantity": 14, "is_available": true},
        {"color_name": "Yellow", "color_hex": "#FFD700", "image_url": "https://images.unsplash.com/photo-1611601322748-fa0a18f0d8e9?w=800", "stock_quantity": 12, "is_available": true},
        {"color_name": "Pink", "color_hex": "#FFC0CB", "image_url": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800", "stock_quantity": 10, "is_available": true}
      ]'::JSONB
    ),
    (
      'Knit Sweater',
      'knit-sweater',
      2,
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800',
      ARRAY['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800', 'https://images.unsplash.com/photo-1583744999572-e0e285222315?w=800'],
      69.99::DECIMAL,
      28,
      (SELECT id FROM shops WHERE name = 'Tuelie''s Corner' LIMIT 1),
      '[
        {"color_name": "Cream", "color_hex": "#FFFDD0", "image_url": "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800", "stock_quantity": 15, "is_available": true},
        {"color_name": "Burgundy", "color_hex": "#800020", "image_url": "https://images.unsplash.com/photo-1583744999572-e0e285222315?w=800", "stock_quantity": 12, "is_available": true},
        {"color_name": "Forest Green", "color_hex": "#228B22", "image_url": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800", "stock_quantity": 10, "is_available": true},
        {"color_name": "Charcoal", "color_hex": "#36454F", "image_url": "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800", "stock_quantity": 14, "is_available": true},
        {"color_name": "Navy", "color_hex": "#000080", "image_url": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800", "stock_quantity": 11, "is_available": true}
      ]'::JSONB
    )
) AS new_products(title, slug, category, "heroImage", "imagesUrl", price, "maxQuantity", shop_id, color_variants)
WHERE NOT EXISTS (
  SELECT 1 FROM product WHERE slug = new_products.slug
)
AND new_products.shop_id IS NOT NULL;

COMMIT;

-- Add helpful comment
COMMENT ON TABLE product IS 'Updated with JSONB color_variants for 9 clothing products';
