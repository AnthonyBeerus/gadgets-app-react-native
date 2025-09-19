-- Test seed file to verify table structure
-- First, let's see the current product table structure

-- Simple test insertion
INSERT INTO product (title, slug, heroImage, imagesUrl, price, category, maxQuantity) VALUES 
('Test Product', 'test-product', 'https://example.com/image.jpg', '{"https://example.com/image.jpg"}', 10.00, 1, 5);