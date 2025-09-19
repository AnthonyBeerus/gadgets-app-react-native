-- Simple test to check product table structure
-- First check if we can insert a basic product

INSERT INTO product (title, slug, "heroImage", "imagesUrl", price, category, "maxQuantity") VALUES 
('Test Product', 'test-product', 'https://example.com/test.jpg', '{"https://example.com/test.jpg"}', 10.00, 1, 5);