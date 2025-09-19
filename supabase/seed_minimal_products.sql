-- Minimal seed file using only basic columns that should exist
-- This version only uses core columns: title, slug, price, category

BEGIN;

-- Clear existing products first
DELETE FROM product WHERE id > 0;

-- Insert basic products using minimal column set
INSERT INTO product (title, slug, price, category) VALUES 
('Fresh Organic Bananas 1kg', 'fresh-organic-bananas-1kg', 25.00, 1),
('Premium Ground Coffee 500g', 'premium-ground-coffee-500g', 89.00, 1),
('Fresh Milk 2L', 'fresh-milk-2l', 35.00, 1),
('Whole Grain Bread 700g', 'whole-grain-bread-700g', 28.00, 1),
('Free Range Eggs 18pk', 'free-range-eggs-18pk', 65.00, 1);

COMMIT;