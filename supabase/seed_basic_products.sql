-- Fixed seed file with proper column names and structure
-- This version removes shop_id references until the migration is run

BEGIN;

-- Clear existing products first
DELETE FROM product WHERE id > 0;

-- FOOD & DRINKS CATEGORY PRODUCTS

-- Sefalana (Supermarket) - Test with basic columns first
INSERT INTO product (title, slug, "heroImage", "imagesUrl", price, category, "maxQuantity") VALUES 
('Fresh Organic Bananas 1kg', 'fresh-organic-bananas-1kg', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500', '{"https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500"}', 25.00, 1, 200),
('Premium Ground Coffee 500g', 'premium-ground-coffee-500g', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500', '{"https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500"}', 89.00, 1, 80),
('Fresh Milk 2L', 'fresh-milk-2l', 'https://images.unsplash.com/photo-1550583724-b2692b85169f?w=500', '{"https://images.unsplash.com/photo-1550583724-b2692b85169f?w=500"}', 35.00, 1, 150);

COMMIT;