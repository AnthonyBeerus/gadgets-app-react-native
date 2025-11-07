-- Beauty Services Products Seed (Haircuts, Hairstyles, and Nails)
-- These are products with variants that support virtual try-on
-- For shops: HairStranz (79), Doll Life (80), Cutting Line Studio (81)

-- Insert Beauty Service Products with JSONB color_variants
-- Schema: title, slug, imagesUrl (array), price, heroImage, category, maxQuantity, shop_id, color_variants
-- Note: category 4 = Beauty & Health based on existing shop categories
INSERT INTO product (title, slug, "imagesUrl", price, "heroImage", category, "maxQuantity", shop_id, color_variants) VALUES

-- HairStranz Products (Shop ID: 79, Category: 4 - Beauty)
-- Haircuts
('Classic Men''s Cut', 'classic-mens-cut', 
ARRAY['https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800', 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800', 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800'], 
250, 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800', 4, 10, 79,
'[
  {"color_name": "Short Crop", "color_hex": "#8B7355", "image_url": "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800", "stock_quantity": 10, "is_available": true},
  {"color_name": "Textured Fade", "color_hex": "#654321", "image_url": "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800", "stock_quantity": 10, "is_available": true},
  {"color_name": "Side Part", "color_hex": "#4A4238", "image_url": "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800", "stock_quantity": 10, "is_available": true},
  {"color_name": "Buzz Cut", "color_hex": "#3D3228", "image_url": "https://images.unsplash.com/photo-1617791160536-598cf32026fb?w=800", "stock_quantity": 10, "is_available": true}
]'::jsonb),

('Women''s Precision Cut', 'womens-precision-cut',
ARRAY['https://images.unsplash.com/photo-1562004760-aceed7bb0fe3?w=800', 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=800', 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800'],
350, 'https://images.unsplash.com/photo-1562004760-aceed7bb0fe3?w=800', 4, 10, 79,
'[
  {"color_name": "Long Layers", "color_hex": "#8B4513", "image_url": "https://images.unsplash.com/photo-1562004760-aceed7bb0fe3?w=800", "stock_quantity": 10, "is_available": true},
  {"color_name": "Bob Cut", "color_hex": "#654321", "image_url": "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=800", "stock_quantity": 10, "is_available": true},
  {"color_name": "Pixie Cut", "color_hex": "#8B7355", "image_url": "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800", "stock_quantity": 10, "is_available": true},
  {"color_name": "Blunt Cut", "color_hex": "#4A4238", "image_url": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800", "stock_quantity": 10, "is_available": true}
]'::jsonb),

-- Hairstyles
('Braided Styles', 'braided-styles',
ARRAY['https://images.unsplash.com/photo-1583009313008-74d5fd609e9f?w=800', 'https://images.unsplash.com/photo-1606367991645-e4129ab44462?w=800', 'https://images.unsplash.com/photo-1596462502278-27b65f37b7c7?w=800'],
450, 'https://images.unsplash.com/photo-1583009313008-74d5fd609e9f?w=800', 4, 8, 79,
'[
  {"color_name": "Box Braids", "color_hex": "#2C1810", "image_url": "https://images.unsplash.com/photo-1583009313008-74d5fd609e9f?w=800", "stock_quantity": 8, "is_available": true},
  {"color_name": "Cornrows", "color_hex": "#3D2817", "image_url": "https://images.unsplash.com/photo-1606367991645-e4129ab44462?w=800", "stock_quantity": 8, "is_available": true},
  {"color_name": "Feed-in Braids", "color_hex": "#654321", "image_url": "https://images.unsplash.com/photo-1596462502278-27b65f37b7c7?w=800", "stock_quantity": 8, "is_available": true},
  {"color_name": "Knotless Braids", "color_hex": "#4A3728", "image_url": "https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=800", "stock_quantity": 8, "is_available": true}
]'::jsonb),

('Curly Styling', 'curly-styling',
ARRAY['https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800', 'https://images.unsplash.com/photo-1542378151-e8e2f7e7e14f?w=800', 'https://images.unsplash.com/photo-1599351431613-4e6dd8a9a7c8?w=800'],
300, 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800', 4, 10, 79,
'[
  {"color_name": "Defined Curls", "color_hex": "#654321", "image_url": "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800", "stock_quantity": 10, "is_available": true},
  {"color_name": "Beach Waves", "color_hex": "#8B7355", "image_url": "https://images.unsplash.com/photo-1542378151-e8e2f7e7e14f?w=800", "stock_quantity": 10, "is_available": true},
  {"color_name": "Tight Curls", "color_hex": "#4A3728", "image_url": "https://images.unsplash.com/photo-1599351431613-4e6dd8a9a7c8?w=800", "stock_quantity": 10, "is_available": true},
  {"color_name": "Loose Waves", "color_hex": "#8B6914", "image_url": "https://images.unsplash.com/photo-1595475884562-073c30d45670?w=800", "stock_quantity": 10, "is_available": true}
]'::jsonb),

('Color Services', 'color-services',
ARRAY['https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=800', 'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=800', 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=800'],
800, 'https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=800', 4, 6, 79,
'[
  {"color_name": "Balayage", "color_hex": "#D4A574", "image_url": "https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=800", "stock_quantity": 6, "is_available": true},
  {"color_name": "Full Color", "color_hex": "#8B4513", "image_url": "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=800", "stock_quantity": 6, "is_available": true},
  {"color_name": "Highlights", "color_hex": "#DEB887", "image_url": "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=800", "stock_quantity": 6, "is_available": true},
  {"color_name": "Ombre", "color_hex": "#8B7355", "image_url": "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800", "stock_quantity": 6, "is_available": true}
]'::jsonb),

-- Doll Life Products (Shop ID: 80, Category: 4 - Beauty)
-- Nail Services
('Classic Manicure', 'classic-manicure',
ARRAY['https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800', 'https://images.unsplash.com/photo-1610992015762-45dca7c60f38?w=800', 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800'],
180, 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800', 4, 15, 80,
'[
  {"color_name": "French Tips", "color_hex": "#FFE4E1", "image_url": "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800", "stock_quantity": 15, "is_available": true},
  {"color_name": "Red Classic", "color_hex": "#DC143C", "image_url": "https://images.unsplash.com/photo-1610992015762-45dca7c60f38?w=800", "stock_quantity": 15, "is_available": true},
  {"color_name": "Nude Elegance", "color_hex": "#F5DEB3", "image_url": "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800", "stock_quantity": 15, "is_available": true},
  {"color_name": "Pink Blush", "color_hex": "#FFB6C1", "image_url": "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=800", "stock_quantity": 15, "is_available": true}
]'::jsonb),

('Gel Nail Design', 'gel-nail-design',
ARRAY['https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=800', 'https://images.unsplash.com/photo-1606142896938-ae79cedda8a6?w=800', 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=800'],
280, 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=800', 4, 15, 80,
'[
  {"color_name": "Ombre Gradient", "color_hex": "#FF69B4", "image_url": "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=800", "stock_quantity": 15, "is_available": true},
  {"color_name": "Marble Effect", "color_hex": "#E6E6FA", "image_url": "https://images.unsplash.com/photo-1606142896938-ae79cedda8a6?w=800", "stock_quantity": 15, "is_available": true},
  {"color_name": "Glitter Accent", "color_hex": "#FFD700", "image_url": "https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=800", "stock_quantity": 15, "is_available": true},
  {"color_name": "Geometric Art", "color_hex": "#4B0082", "image_url": "https://images.unsplash.com/photo-1604654894609-b0f5d4eb3987?w=800", "stock_quantity": 15, "is_available": true}
]'::jsonb),

('Acrylic Nails', 'acrylic-nails',
ARRAY['https://images.unsplash.com/photo-1610546099443-0d2ee1c73965?w=800', 'https://images.unsplash.com/photo-1515688594390-b649af70d282?w=800', 'https://images.unsplash.com/photo-1604654894608-0e02d5e35f0a?w=800'],
450, 'https://images.unsplash.com/photo-1610546099443-0d2ee1c73965?w=800', 4, 12, 80,
'[
  {"color_name": "Almond Shape", "color_hex": "#FFC0CB", "image_url": "https://images.unsplash.com/photo-1610546099443-0d2ee1c73965?w=800", "stock_quantity": 12, "is_available": true},
  {"color_name": "Stiletto", "color_hex": "#8B0000", "image_url": "https://images.unsplash.com/photo-1515688594390-b649af70d282?w=800", "stock_quantity": 12, "is_available": true},
  {"color_name": "Coffin Shape", "color_hex": "#9370DB", "image_url": "https://images.unsplash.com/photo-1604654894608-0e02d5e35f0a?w=800", "stock_quantity": 12, "is_available": true},
  {"color_name": "Square Tips", "color_hex": "#FF1493", "image_url": "https://images.unsplash.com/photo-1610992015623-13555e1ff0c8?w=800", "stock_quantity": 12, "is_available": true}
]'::jsonb),

('Nail Art Premium', 'nail-art-premium',
ARRAY['https://images.unsplash.com/photo-1632345031451-efb5f76e1ba6?w=800', 'https://images.unsplash.com/photo-1604654894598-98848ba5a119?w=800', 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=800'],
550, 'https://images.unsplash.com/photo-1632345031451-efb5f76e1ba6?w=800', 4, 10, 80,
'[
  {"color_name": "Crystal Glamour", "color_hex": "#F0E68C", "image_url": "https://images.unsplash.com/photo-1632345031451-efb5f76e1ba6?w=800", "stock_quantity": 10, "is_available": true},
  {"color_name": "3D Flowers", "color_hex": "#FF69B4", "image_url": "https://images.unsplash.com/photo-1604654894598-98848ba5a119?w=800", "stock_quantity": 10, "is_available": true},
  {"color_name": "Abstract Art", "color_hex": "#4169E1", "image_url": "https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=800", "stock_quantity": 10, "is_available": true},
  {"color_name": "Chrome Finish", "color_hex": "#C0C0C0", "image_url": "https://images.unsplash.com/photo-1602031794716-e2c3df7f3c2b?w=800", "stock_quantity": 10, "is_available": true}
]'::jsonb),

-- Makeup Services
('Glam Makeup', 'glam-makeup',
ARRAY['https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800', 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800', 'https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?w=800'],
650, 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800', 4, 8, 80,
'[
  {"color_name": "Evening Glam", "color_hex": "#8B4513", "image_url": "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800", "stock_quantity": 8, "is_available": true},
  {"color_name": "Bridal Makeup", "color_hex": "#FFF5EE", "image_url": "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800", "stock_quantity": 8, "is_available": true},
  {"color_name": "Natural Beauty", "color_hex": "#F5DEB3", "image_url": "https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?w=800", "stock_quantity": 8, "is_available": true},
  {"color_name": "Smokey Eye", "color_hex": "#696969", "image_url": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800", "stock_quantity": 8, "is_available": true}
]'::jsonb),

-- Cutting Line Studio Products (Shop ID: 81, Category: 4 - Beauty)
-- Modern Cuts
('Urban Edge Cut', 'urban-edge-cut',
ARRAY['https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800', 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800', 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800'],
320, 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800', 4, 10, 81,
'[
  {"color_name": "Undercut", "color_hex": "#2F4F4F", "image_url": "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800", "stock_quantity": 10, "is_available": true},
  {"color_name": "Slick Back", "color_hex": "#1C1C1C", "image_url": "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800", "stock_quantity": 10, "is_available": true},
  {"color_name": "Textured Quiff", "color_hex": "#654321", "image_url": "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800", "stock_quantity": 10, "is_available": true},
  {"color_name": "Modern Pompadour", "color_hex": "#8B4513", "image_url": "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800", "stock_quantity": 10, "is_available": true}
]'::jsonb),

('Afro Styling', 'afro-styling',
ARRAY['https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800', 'https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=800', 'https://images.unsplash.com/photo-1596462502278-27b65f37b7c7?w=800'],
380, 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800', 4, 8, 81,
'[
  {"color_name": "Natural Afro", "color_hex": "#2C1810", "image_url": "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800", "stock_quantity": 8, "is_available": true},
  {"color_name": "Tapered Afro", "color_hex": "#3D2817", "image_url": "https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=800", "stock_quantity": 8, "is_available": true},
  {"color_name": "Twist Out", "color_hex": "#654321", "image_url": "https://images.unsplash.com/photo-1596462502278-27b65f37b7c7?w=800", "stock_quantity": 8, "is_available": true},
  {"color_name": "Coil Definition", "color_hex": "#4A3728", "image_url": "https://images.unsplash.com/photo-1599351431613-4e6dd8a9a7c8?w=800", "stock_quantity": 8, "is_available": true}
]'::jsonb),

('Dreadlock Services', 'dreadlock-services',
ARRAY['https://images.unsplash.com/photo-1595475884562-073c30d45670?w=800', 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800', 'https://images.unsplash.com/photo-1606367991645-e4129ab44462?w=800'],
650, 'https://images.unsplash.com/photo-1595475884562-073c30d45670?w=800', 4, 6, 81,
'[
  {"color_name": "Starter Locs", "color_hex": "#3D2817", "image_url": "https://images.unsplash.com/photo-1595475884562-073c30d45670?w=800", "stock_quantity": 6, "is_available": true},
  {"color_name": "Loc Retwist", "color_hex": "#2C1810", "image_url": "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800", "stock_quantity": 6, "is_available": true},
  {"color_name": "Faux Locs", "color_hex": "#654321", "image_url": "https://images.unsplash.com/photo-1606367991645-e4129ab44462?w=800", "stock_quantity": 6, "is_available": true},
  {"color_name": "Loc Extensions", "color_hex": "#4A3728", "image_url": "https://images.unsplash.com/photo-1583009313008-74d5fd609e9f?w=800", "stock_quantity": 6, "is_available": true}
]'::jsonb),

('Beard Grooming', 'beard-grooming',
ARRAY['https://images.unsplash.com/photo-1621607512214-68297480165e?w=800', 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800', 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800'],
150, 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800', 4, 15, 81,
'[
  {"color_name": "Classic Beard Trim", "color_hex": "#654321", "image_url": "https://images.unsplash.com/photo-1621607512214-68297480165e?w=800", "stock_quantity": 15, "is_available": true},
  {"color_name": "Full Beard Shape", "color_hex": "#4A3728", "image_url": "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800", "stock_quantity": 15, "is_available": true},
  {"color_name": "Goatee Style", "color_hex": "#8B4513", "image_url": "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800", "stock_quantity": 15, "is_available": true},
  {"color_name": "Stubble Refinement", "color_hex": "#3D2817", "image_url": "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800", "stock_quantity": 15, "is_available": true}
]'::jsonb),

-- Nail Services for Cutting Line Studio
('Men''s Manicure', 'mens-manicure',
ARRAY['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800', 'https://images.unsplash.com/photo-1632345031451-05d03d2c29d8?w=800', 'https://images.unsplash.com/photo-1610992015762-45dca7c60f38?w=800'],
120, 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800', 4, 15, 81,
'[
  {"color_name": "Classic Clean", "color_hex": "#F5F5F5", "image_url": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800", "stock_quantity": 15, "is_available": true},
  {"color_name": "Matte Finish", "color_hex": "#808080", "image_url": "https://images.unsplash.com/photo-1632345031451-05d03d2c29d8?w=800", "stock_quantity": 15, "is_available": true},
  {"color_name": "Natural Buff", "color_hex": "#F0E68C", "image_url": "https://images.unsplash.com/photo-1610992015762-45dca7c60f38?w=800", "stock_quantity": 15, "is_available": true},
  {"color_name": "Clear Protection", "color_hex": "#FFFFFF", "image_url": "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800", "stock_quantity": 15, "is_available": true}
]'::jsonb);

-- Verify the inserted products
SELECT 
    p.id,
    p.title,
    s.name as shop_name,
    p.price,
    jsonb_array_length(p.color_variants) as variant_count
FROM product p
JOIN shops s ON p.shop_id = s.id
WHERE p.shop_id IN (79, 80, 81)
ORDER BY p.shop_id, p.id;
