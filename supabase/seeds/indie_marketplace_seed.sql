-- Seed data for Indie Marketplace (mall_id = 2)
-- Independent businesses: Nail Techs, Hair Stylists (Braids), and Home Kitchens

-- ============================================
-- INDIE MARKETPLACE SHOPS
-- ============================================

-- Nail Technicians
INSERT INTO shops (
  name,
  description,
  location,
  mall_id,
  category_id,
  image_url,
  logo_url,
  phone,
  email,
  has_online_ordering,
  has_appointment_booking,
  has_delivery,
  has_collection,
  is_active,
  is_featured,
  rating,
  total_reviews,
  opening_hours
) VALUES
-- Nails by Thato
(
  'Nails by Thato',
  'Professional nail artistry specializing in acrylics, gel nails, and intricate nail art designs. Book your appointment for stunning nails!',
  'Gaborone - Mobile Service',
  2,
  (SELECT id FROM category WHERE name = 'Services & Professional' LIMIT 1),
  'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800',
  'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=200',
  '+267 71234567',
  'nailsbythato@gmail.com',
  true,
  true,
  false,
  false,
  true,
  true,
  4.9,
  87,
  '{"monday": "09:00-18:00", "tuesday": "09:00-18:00", "wednesday": "09:00-18:00", "thursday": "09:00-18:00", "friday": "09:00-19:00", "saturday": "08:00-20:00", "sunday": "10:00-16:00"}'::jsonb
),

-- Nails by Keabetswe
(
  'Nails by Keabetswe',
  'Affordable luxury nail services with a focus on nail health. Offering manicures, pedicures, and custom nail designs for every occasion.',
  'Gaborone - Mobile Service',
  2,
  (SELECT id FROM category WHERE name = 'Services & Professional' LIMIT 1),
  'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=800',
  'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=200',
  '+267 72345678',
  'keabetswenails@gmail.com',
  true,
  true,
  false,
  false,
  true,
  false,
  4.8,
  65,
  '{"monday": "10:00-19:00", "tuesday": "10:00-19:00", "wednesday": "10:00-19:00", "thursday": "10:00-19:00", "friday": "10:00-20:00", "saturday": "09:00-18:00", "sunday": "Closed"}'::jsonb
),

-- Nails by Lesego
(
  'Nails by Lesego',
  'Creative nail designs and premium nail care services. Specializing in ombre nails, French tips, and seasonal nail art.',
  'Francistown - Mobile Service',
  2,
  (SELECT id FROM category WHERE name = 'Services & Professional' LIMIT 1),
  'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800',
  'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=200',
  '+267 73456789',
  'lesegosnails@gmail.com',
  true,
  true,
  false,
  false,
  true,
  true,
  4.7,
  52,
  '{"monday": "09:00-17:00", "tuesday": "09:00-17:00", "wednesday": "09:00-17:00", "thursday": "09:00-17:00", "friday": "09:00-18:00", "saturday": "08:00-16:00", "sunday": "Closed"}'::jsonb
),

-- Hair Stylists (Braids)
-- Braids by Mpho
(
  'Braids by Mpho',
  'Expert in African hair braiding styles including box braids, cornrows, Senegalese twists, and protective styles. Quality extensions available.',
  'Gaborone - Mobile Service',
  2,
  (SELECT id FROM category WHERE name = 'Health & Beauty' LIMIT 1),
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200',
  '+267 74567890',
  'braidsbyampho@gmail.com',
  true,
  true,
  false,
  false,
  true,
  true,
  4.9,
  143,
  '{"monday": "08:00-20:00", "tuesday": "08:00-20:00", "wednesday": "08:00-20:00", "thursday": "08:00-20:00", "friday": "08:00-21:00", "saturday": "07:00-22:00", "sunday": "09:00-18:00"}'::jsonb
),

-- Braids by Neo
(
  'Braids by Neo',
  'Professional braiding services with a personal touch. Specializing in knotless braids, tribal braids, and intricate braided updos.',
  'Gaborone - Mobile Service',
  2,
  (SELECT id FROM category WHERE name = 'Health & Beauty' LIMIT 1),
  'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800',
  'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=200',
  '+267 75678901',
  'neosbraids@gmail.com',
  true,
  true,
  false,
  false,
  true,
  false,
  4.8,
  98,
  '{"monday": "09:00-19:00", "tuesday": "09:00-19:00", "wednesday": "09:00-19:00", "thursday": "09:00-19:00", "friday": "09:00-20:00", "saturday": "08:00-20:00", "sunday": "10:00-17:00"}'::jsonb
),

-- Braids by Tlotlo
(
  'Braids by Tlotlo',
  'Bringing style and elegance to every braid. Specializing in goddess braids, fulani braids, and creative braided ponytails.',
  'Maun - Mobile Service',
  2,
  (SELECT id FROM category WHERE name = 'Health & Beauty' LIMIT 1),
  'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800',
  'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=200',
  '+267 76789012',
  'tlotlobraids@gmail.com',
  true,
  true,
  false,
  false,
  true,
  true,
  4.9,
  76,
  '{"monday": "08:00-18:00", "tuesday": "08:00-18:00", "wednesday": "08:00-18:00", "thursday": "08:00-18:00", "friday": "08:00-19:00", "saturday": "07:00-19:00", "sunday": "09:00-16:00"}'::jsonb
),

-- Braids by Boitumelo
(
  'Braids by Boitumelo',
  'Fast, friendly, and fabulous braiding services. From simple cornrows to elaborate braided styles - I do it all!',
  'Francistown - Mobile Service',
  2,
  (SELECT id FROM category WHERE name = 'Health & Beauty' LIMIT 1),
  'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800',
  'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=200',
  '+267 77890123',
  'boitumelobraids@gmail.com',
  true,
  true,
  false,
  false,
  true,
  false,
  4.7,
  61,
  '{"monday": "09:00-20:00", "tuesday": "09:00-20:00", "wednesday": "09:00-20:00", "thursday": "09:00-20:00", "friday": "09:00-21:00", "saturday": "08:00-21:00", "sunday": "10:00-18:00"}'::jsonb
),

-- Home Kitchens
-- Mma Kabo's Kitchen
(
  'Mma Kabo''s Kitchen',
  'Authentic Setswana traditional dishes made with love. Order seswaa, pap, morogo, and other local favorites delivered fresh to your door.',
  'Gaborone - Home Delivery',
  2,
  (SELECT id FROM category WHERE name = 'Food & Drinks' LIMIT 1),
  'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
  'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200',
  '+267 71111222',
  'mmakaboskitchen@gmail.com',
  true,
  false,
  true,
  true,
  true,
  true,
  4.9,
  234,
  '{"monday": "10:00-20:00", "tuesday": "10:00-20:00", "wednesday": "10:00-20:00", "thursday": "10:00-20:00", "friday": "10:00-21:00", "saturday": "09:00-21:00", "sunday": "11:00-19:00"}'::jsonb
),

-- Thuto's Baked Delights
(
  'Thuto''s Baked Delights',
  'Homemade cakes, cupcakes, and pastries for all occasions. Custom orders for birthdays, weddings, and celebrations. Gluten-free options available.',
  'Gaborone - Home Delivery',
  2,
  (SELECT id FROM category WHERE name = 'Food & Drinks' LIMIT 1),
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800',
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200',
  '+267 72222333',
  'thutosbakes@gmail.com',
  true,
  false,
  true,
  true,
  true,
  true,
  4.8,
  156,
  '{"monday": "09:00-18:00", "tuesday": "09:00-18:00", "wednesday": "09:00-18:00", "thursday": "09:00-18:00", "friday": "09:00-19:00", "saturday": "08:00-17:00", "sunday": "Closed"}'::jsonb
),

-- Lesedi's Lunch Box
(
  'Lesedi''s Lunch Box',
  'Healthy meal prep and lunch boxes delivered daily. Fresh, nutritious meals perfect for busy professionals. Weekly meal plans available.',
  'Gaborone - Home Delivery',
  2,
  (SELECT id FROM category WHERE name = 'Food & Drinks' LIMIT 1),
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200',
  '+267 73333444',
  'lesedislunchbox@gmail.com',
  true,
  false,
  true,
  true,
  true,
  false,
  4.7,
  189,
  '{"monday": "07:00-19:00", "tuesday": "07:00-19:00", "wednesday": "07:00-19:00", "thursday": "07:00-19:00", "friday": "07:00-19:00", "saturday": "08:00-15:00", "sunday": "Closed"}'::jsonb
),

-- Auntie Kgotla's Catering
(
  'Auntie Kgotla''s Catering',
  'Professional catering for events, parties, and corporate functions. Specializing in both traditional and modern cuisine. Minimum order 20 pax.',
  'Gaborone - Catering Service',
  2,
  (SELECT id FROM category WHERE name = 'Food & Drinks' LIMIT 1),
  'https://images.unsplash.com/photo-1555244162-803834f70033?w=800',
  'https://images.unsplash.com/photo-1555244162-803834f70033?w=200',
  '+267 74444555',
  'kgotlacatering@gmail.com',
  true,
  false,
  true,
  false,
  true,
  true,
  4.9,
  92,
  '{"monday": "08:00-17:00", "tuesday": "08:00-17:00", "wednesday": "08:00-17:00", "thursday": "08:00-17:00", "friday": "08:00-17:00", "saturday": "By Appointment", "sunday": "By Appointment"}'::jsonb
),

-- Mama T's Soul Food
(
  'Mama T''s Soul Food',
  'Comfort food at its finest! Fried chicken, beef stew, dumplings, and all your favorite homestyle meals made fresh daily.',
  'Francistown - Home Delivery',
  2,
  (SELECT id FROM category WHERE name = 'Food & Drinks' LIMIT 1),
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200',
  '+267 75555666',
  'mamatssoulfood@gmail.com',
  true,
  false,
  true,
  true,
  true,
  false,
  4.8,
  127,
  '{"monday": "11:00-21:00", "tuesday": "11:00-21:00", "wednesday": "11:00-21:00", "thursday": "11:00-21:00", "friday": "11:00-22:00", "saturday": "11:00-22:00", "sunday": "12:00-20:00"}'::jsonb
),

-- Rra Moshe's Braai Spot
(
  'Rra Moshe''s Braai Spot',
  'The best braai in town! Order our famous boerewors, steak, chicken, and pap. Perfect for weekend gatherings and celebrations.',
  'Gaborone - Home Delivery',
  2,
  (SELECT id FROM category WHERE name = 'Food & Drinks' LIMIT 1),
  'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800',
  'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=200',
  '+267 76666777',
  'rramoshebraai@gmail.com',
  true,
  false,
  true,
  true,
  true,
  true,
  4.9,
  201,
  '{"monday": "Closed", "tuesday": "Closed", "wednesday": "Closed", "thursday": "16:00-22:00", "friday": "14:00-23:00", "saturday": "12:00-23:00", "sunday": "12:00-21:00"}'::jsonb
);

-- Add delivery fees and minimum orders for home kitchens
UPDATE shops 
SET 
  delivery_fee = 25.00,
  minimum_order_amount = 50.00,
  estimated_delivery_time = '45-60 minutes'
WHERE mall_id = 2 
  AND category_id = (SELECT id FROM category WHERE name = 'Food & Drinks' LIMIT 1);

-- Update beauty services with virtual try-on and appointment booking
UPDATE shops 
SET 
  delivery_fee = NULL,
  minimum_order_amount = NULL,
  estimated_delivery_time = NULL,
  has_virtual_try_on = true,
  has_appointment_booking = true
WHERE mall_id = 2 
  AND category_id IN (
    (SELECT id FROM category WHERE name = 'Health & Beauty' LIMIT 1),
    (SELECT id FROM category WHERE name = 'Services & Professional' LIMIT 1)
  );

-- ============================================
-- PRODUCTS FOR INDIE MARKETPLACE SHOPS
-- ============================================

-- Get shop IDs for products
DO $$
DECLARE
  nails_thato_id BIGINT;
  nails_keabetswe_id BIGINT;
  nails_lesego_id BIGINT;
  braids_mpho_id BIGINT;
  braids_neo_id BIGINT;
  braids_tlotlo_id BIGINT;
  braids_boitumelo_id BIGINT;
  mma_kabo_id BIGINT;
  thuto_bakes_id BIGINT;
  lesedi_lunch_id BIGINT;
  kgotla_catering_id BIGINT;
  mama_t_id BIGINT;
  rra_moshe_id BIGINT;
  health_beauty_category_id BIGINT;
  services_professional_category_id BIGINT;
  food_category_id BIGINT;
BEGIN
  -- Get shop IDs
  SELECT id INTO nails_thato_id FROM shops WHERE name = 'Nails by Thato' AND mall_id = 2;
  SELECT id INTO nails_keabetswe_id FROM shops WHERE name = 'Nails by Keabetswe' AND mall_id = 2;
  SELECT id INTO nails_lesego_id FROM shops WHERE name = 'Nails by Lesego' AND mall_id = 2;
  SELECT id INTO braids_mpho_id FROM shops WHERE name = 'Braids by Mpho' AND mall_id = 2;
  SELECT id INTO braids_neo_id FROM shops WHERE name = 'Braids by Neo' AND mall_id = 2;
  SELECT id INTO braids_tlotlo_id FROM shops WHERE name = 'Braids by Tlotlo' AND mall_id = 2;
  SELECT id INTO braids_boitumelo_id FROM shops WHERE name = 'Braids by Boitumelo' AND mall_id = 2;
  SELECT id INTO mma_kabo_id FROM shops WHERE name = 'Mma Kabo''s Kitchen' AND mall_id = 2;
  SELECT id INTO thuto_bakes_id FROM shops WHERE name = 'Thuto''s Baked Delights' AND mall_id = 2;
  SELECT id INTO lesedi_lunch_id FROM shops WHERE name = 'Lesedi''s Lunch Box' AND mall_id = 2;
  SELECT id INTO kgotla_catering_id FROM shops WHERE name = 'Auntie Kgotla''s Catering' AND mall_id = 2;
  SELECT id INTO mama_t_id FROM shops WHERE name = 'Mama T''s Soul Food' AND mall_id = 2;
  SELECT id INTO rra_moshe_id FROM shops WHERE name = 'Rra Moshe''s Braai Spot' AND mall_id = 2;
  
  -- Get category IDs (using actual category names from database)
  SELECT id INTO health_beauty_category_id FROM category WHERE name = 'Health & Beauty' LIMIT 1;
  SELECT id INTO services_professional_category_id FROM category WHERE name = 'Services & Professional' LIMIT 1;
  SELECT id INTO food_category_id FROM category WHERE name = 'Food & Drinks' LIMIT 1;

  -- Debug: Check if categories were found
  IF health_beauty_category_id IS NULL THEN
    RAISE EXCEPTION 'Health & Beauty category not found in database';
  END IF;
  
  IF services_professional_category_id IS NULL THEN
    RAISE EXCEPTION 'Services & Professional category not found in database';
  END IF;
  
  IF food_category_id IS NULL THEN
    RAISE EXCEPTION 'Food & Drinks category not found in database';
  END IF;

  -- ============================================
  -- NAILS BY THATO - Products
  -- ============================================
  INSERT INTO product (title, description, price, "heroImage", "imagesUrl", category, slug, "maxQuantity", shop_id, is_available, brand, sku, color_variants) VALUES
  (
    'Acrylic Full Set',
    'Complete acrylic nail set with custom length and shape. Includes nail prep, application, and basic design. Perfect for special occasions or everyday glamour.',
    350.00,
    'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800',
    ARRAY['https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800', 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=800'],
    services_professional_category_id,
    'nails-thato-acrylic-full-set',
    100,
    nails_thato_id,
    true,
    'Nails by Thato',
    'NBT-ACRY-001',
    '[{"color_name": "Natural Pink", "color_code": "#FFC0CB", "image_url": "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800", "is_available": true}, {"color_name": "Classic French", "color_code": "#FFFFFF", "image_url": "https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=800", "is_available": true}]'::jsonb
  ),
  (
    'Gel Manicure',
    'Long-lasting gel polish manicure with nail care treatment. Includes cuticle care, shaping, buffing, and gel polish application. Lasts up to 3 weeks.',
    180.00,
    'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800',
    ARRAY['https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800'],
    services_professional_category_id,
    'nails-thato-gel-manicure',
    100,
    nails_thato_id,
    true,
    'Nails by Thato',
    'NBT-GEL-001',
    NULL
  ),
  (
    'Nail Art Design',
    'Custom nail art per nail. Choose from ombre, marble, glitter, rhinestones, or hand-painted designs. Price is per nail.',
    50.00,
    'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=800',
    ARRAY['https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=800'],
    services_professional_category_id,
    'nails-thato-nail-art',
    100,
    nails_thato_id,
    true,
    'Nails by Thato',
    'NBT-ART-001',
    NULL
  );

  -- ============================================
  -- NAILS BY KEABETSWE - Products
  -- ============================================
  INSERT INTO product (title, description, price, "heroImage", "imagesUrl", category, slug, "maxQuantity", shop_id, is_available, brand, sku) VALUES
  (
    'Classic Manicure & Pedicure',
    'Complete mani-pedi package with nail care, shaping, cuticle treatment, exfoliation, massage, and regular polish. A relaxing spa experience.',
    280.00,
    'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=800',
    ARRAY['https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=800'],
    services_professional_category_id,
    'nails-keabetswe-mani-pedi',
    100,
    nails_keabetswe_id,
    true,
    'Nails by Keabetswe',
    'NBK-MANPED-001'
  ),
  (
    'Gel Extensions',
    'Natural-looking gel nail extensions with tip or sculpting method. Includes shaping and gel polish application.',
    400.00,
    'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=800',
    ARRAY['https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=800'],
    services_professional_category_id,
    'nails-keabetswe-gel-extensions',
    100,
    nails_keabetswe_id,
    true,
    'Nails by Keabetswe',
    'NBK-GELEX-001'
  );

  -- ============================================
  -- NAILS BY LESEGO - Products
  -- ============================================
  INSERT INTO product (title, description, price, "heroImage", "imagesUrl", category, slug, "maxQuantity", shop_id, is_available, brand, sku) VALUES
  (
    'Ombre Nails',
    'Trendy ombre gradient effect with gel polish. Choose any two colors for a seamless fade. Includes full nail prep and application.',
    320.00,
    'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800',
    ARRAY['https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800'],
    services_professional_category_id,
    'nails-lesego-ombre',
    100,
    nails_lesego_id,
    true,
    'Nails by Lesego',
    'NBL-OMBRE-001'
  ),
  (
    'Nail Repair & Maintenance',
    'Fix broken nails, fills for acrylics/gel, or general nail maintenance. Includes reshaping and polish refresh.',
    150.00,
    'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800',
    ARRAY['https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800'],
    services_professional_category_id,
    'nails-lesego-repair',
    100,
    nails_lesego_id,
    true,
    'Nails by Lesego',
    'NBL-REPAIR-001'
  );

  -- ============================================
  -- BRAIDS BY MPHO - Products
  -- ============================================
  INSERT INTO product (title, description, price, "heroImage", "imagesUrl", category, slug, "maxQuantity", shop_id, is_available, brand, sku, color_variants) VALUES
  (
    'Box Braids',
    'Classic box braids in small, medium, or large size. Includes hair extensions and styling. Lasts 6-8 weeks with proper care.',
    650.00,
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
    ARRAY['https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800', 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800'],
    health_beauty_category_id,
    'braids-mpho-box-braids',
    50,
    braids_mpho_id,
    true,
    'Braids by Mpho',
    'BBM-BOX-001',
    '[{"color_name": "Natural Black", "color_code": "#000000", "image_url": "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800", "is_available": true}, {"color_name": "Dark Brown", "color_code": "#654321", "image_url": "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800", "is_available": true}]'::jsonb
  ),
  (
    'Cornrows',
    'Neat cornrow braids in various patterns. Choose from straight back, zigzag, or custom designs. Protective style that lasts 2-4 weeks.',
    350.00,
    'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800',
    ARRAY['https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800'],
    health_beauty_category_id,
    'braids-mpho-cornrows',
    50,
    braids_mpho_id,
    true,
    'Braids by Mpho',
    'BBM-CORN-001',
    NULL
  ),
  (
    'Senegalese Twists',
    'Silky Senegalese rope twists using quality kanekalon hair. Lightweight and versatile. Lasts 6-8 weeks.',
    700.00,
    'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800',
    ARRAY['https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800'],
    health_beauty_category_id,
    'braids-mpho-senegalese',
    50,
    braids_mpho_id,
    true,
    'Braids by Mpho',
    'BBM-SENE-001',
    NULL
  );

  -- ============================================
  -- BRAIDS BY NEO - Products
  -- ============================================
  INSERT INTO product (title, description, price, "heroImage", "imagesUrl", category, slug, "maxQuantity", shop_id, is_available, brand, sku) VALUES
  (
    'Knotless Braids',
    'Trendy knotless box braids for a more natural look with less tension. Includes premium hair extensions. Lasts 6-8 weeks.',
    750.00,
    'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800',
    ARRAY['https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800'],
    health_beauty_category_id,
    'braids-neo-knotless',
    50,
    braids_neo_id,
    true,
    'Braids by Neo',
    'BBN-KNOT-001'
  ),
  (
    'Tribal Braids',
    'Stylish tribal braids with intricate patterns and designs. Includes beads and accessories upon request.',
    680.00,
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
    ARRAY['https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800'],
    health_beauty_category_id,
    'braids-neo-tribal',
    50,
    braids_neo_id,
    true,
    'Braids by Neo',
    'BBN-TRIB-001'
  );

  -- ============================================
  -- BRAIDS BY TLOTLO - Products
  -- ============================================
  INSERT INTO product (title, description, price, "heroImage", "imagesUrl", category, slug, "maxQuantity", shop_id, is_available, brand, sku) VALUES
  (
    'Goddess Braids',
    'Elegant goddess braids with curly ends for a bohemian look. Perfect for special occasions. Includes hair and styling.',
    720.00,
    'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800',
    ARRAY['https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800'],
    health_beauty_category_id,
    'braids-tlotlo-goddess',
    50,
    braids_tlotlo_id,
    true,
    'Braids by Tlotlo',
    'BBT-GODD-001'
  ),
  (
    'Fulani Braids',
    'Traditional Fulani braids with center braids and side cornrows. Includes beads and accessories.',
    690.00,
    'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800',
    ARRAY['https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800'],
    health_beauty_category_id,
    'braids-tlotlo-fulani',
    50,
    braids_tlotlo_id,
    true,
    'Braids by Tlotlo',
    'BBT-FULA-001'
  );

  -- ============================================
  -- BRAIDS BY BOITUMELO - Products
  -- ============================================
  INSERT INTO product (title, description, price, "heroImage", "imagesUrl", category, slug, "maxQuantity", shop_id, is_available, brand, sku) VALUES
  (
    'Feed-in Braids',
    'Natural-looking feed-in cornrows with gradual hair addition. Less tension on edges. Choose your pattern and length.',
    600.00,
    'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800',
    ARRAY['https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800'],
    health_beauty_category_id,
    'braids-boitumelo-feedin',
    50,
    braids_boitumelo_id,
    true,
    'Braids by Boitumelo',
    'BBB-FEED-001'
  ),
  (
    'Braided Ponytail',
    'High or low braided ponytail with cornrows leading to a braided or curly ponytail. Perfect for a sleek look.',
    480.00,
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
    ARRAY['https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800'],
    health_beauty_category_id,
    'braids-boitumelo-ponytail',
    50,
    braids_boitumelo_id,
    true,
    'Braids by Boitumelo',
    'BBB-PONY-001'
  );

  -- ============================================
  -- MMA KABO'S KITCHEN - Products
  -- ============================================
  INSERT INTO product (title, description, price, "heroImage", "imagesUrl", category, slug, "maxQuantity", shop_id, is_available, brand, sku) VALUES
  (
    'Seswaa with Pap',
    'Traditional Botswana dish - tender shredded beef cooked to perfection, served with soft pap. Authentic home-cooked flavor.',
    85.00,
    'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
    ARRAY['https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800'],
    food_category_id,
    'mma-kabo-seswaa',
    50,
    mma_kabo_id,
    true,
    'Mma Kabo''s Kitchen',
    'MKK-SESW-001'
  ),
  (
    'Morogo Special',
    'Fresh morogo (wild spinach) cooked with onions and tomatoes. Served with pap or rice. Vegetarian-friendly.',
    65.00,
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
    ARRAY['https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800'],
    food_category_id,
    'mma-kabo-morogo',
    50,
    mma_kabo_id,
    true,
    'Mma Kabo''s Kitchen',
    'MKK-MORO-001'
  ),
  (
    'Full Setswana Meal',
    'Complete traditional meal: seswaa, pap, morogo, and beans. Perfect portion for one person.',
    120.00,
    'https://images.unsplash.com/photo-1555244162-803834f70033?w=800',
    ARRAY['https://images.unsplash.com/photo-1555244162-803834f70033?w=800'],
    food_category_id,
    'mma-kabo-full-meal',
    50,
    mma_kabo_id,
    true,
    'Mma Kabo''s Kitchen',
    'MKK-FULL-001'
  );

  -- ============================================
  -- THUTO'S BAKED DELIGHTS - Products
  -- ============================================
  INSERT INTO product (title, description, price, "heroImage", "imagesUrl", category, slug, "maxQuantity", shop_id, is_available, brand, sku) VALUES
  (
    'Custom Birthday Cake',
    'Personalized birthday cake in your choice of flavor and design. Serves 12-15 people. Order 3 days in advance.',
    450.00,
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800',
    ARRAY['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800'],
    food_category_id,
    'thuto-birthday-cake',
    20,
    thuto_bakes_id,
    true,
    'Thuto''s Baked Delights',
    'TBD-CAKE-001'
  ),
  (
    'Cupcakes - Box of 12',
    'Assorted gourmet cupcakes with buttercream frosting. Choose from vanilla, chocolate, or red velvet.',
    180.00,
    'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=800',
    ARRAY['https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=800'],
    food_category_id,
    'thuto-cupcakes',
    30,
    thuto_bakes_id,
    true,
    'Thuto''s Baked Delights',
    'TBD-CUP-001'
  ),
  (
    'Gluten-Free Brownies',
    'Rich, fudgy gluten-free chocolate brownies. Box of 6. Perfect for those with dietary restrictions.',
    95.00,
    'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800',
    ARRAY['https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800'],
    food_category_id,
    'thuto-brownies',
    30,
    thuto_bakes_id,
    true,
    'Thuto''s Baked Delights',
    'TBD-BROW-001'
  );

  -- ============================================
  -- LESEDI'S LUNCH BOX - Products
  -- ============================================
  INSERT INTO product (title, description, price, "heroImage", "imagesUrl", category, slug, "maxQuantity", shop_id, is_available, brand, sku) VALUES
  (
    'Protein Power Box',
    'Grilled chicken breast, brown rice, roasted vegetables, and side salad. High-protein, balanced meal.',
    95.00,
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
    ARRAY['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'],
    food_category_id,
    'lesedi-protein-box',
    40,
    lesedi_lunch_id,
    true,
    'Lesedi''s Lunch Box',
    'LLB-PROT-001'
  ),
  (
    'Vegetarian Delight',
    'Quinoa, chickpeas, grilled vegetables, avocado, and tahini dressing. Plant-based and nutritious.',
    85.00,
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
    ARRAY['https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800'],
    food_category_id,
    'lesedi-vegetarian',
    40,
    lesedi_lunch_id,
    true,
    'Lesedi''s Lunch Box',
    'LLB-VEG-001'
  ),
  (
    'Weekly Meal Prep Package',
    'Five healthy lunch boxes for the week. Mix and match protein and vegetarian options. Pre-order by Sunday.',
    400.00,
    'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800',
    ARRAY['https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800'],
    food_category_id,
    'lesedi-weekly-prep',
    15,
    lesedi_lunch_id,
    true,
    'Lesedi''s Lunch Box',
    'LLB-WEEK-001'
  );

  -- ============================================
  -- AUNTIE KGOTLA'S CATERING - Products
  -- ============================================
  INSERT INTO product (title, description, price, "heroImage", "imagesUrl", category, slug, "maxQuantity", shop_id, is_available, brand, sku) VALUES
  (
    'Party Platter - 20 pax',
    'Assorted finger foods, sandwiches, samosas, spring rolls, and dips. Perfect for parties and events. Serves 20 people.',
    1200.00,
    'https://images.unsplash.com/photo-1555244162-803834f70033?w=800',
    ARRAY['https://images.unsplash.com/photo-1555244162-803834f70033?w=800'],
    food_category_id,
    'kgotla-party-platter',
    10,
    kgotla_catering_id,
    true,
    'Auntie Kgotla''s Catering',
    'AKC-PART-001'
  ),
  (
    'Traditional Buffet - 50 pax',
    'Full buffet with seswaa, chicken, rice, pap, salads, and dessert. Serves 50 people. Book 1 week in advance.',
    4500.00,
    'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
    ARRAY['https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800'],
    food_category_id,
    'kgotla-traditional-buffet',
    5,
    kgotla_catering_id,
    true,
    'Auntie Kgotla''s Catering',
    'AKC-BUFF-001'
  );

  -- ============================================
  -- MAMA T'S SOUL FOOD - Products
  -- ============================================
  INSERT INTO product (title, description, price, "heroImage", "imagesUrl", category, slug, "maxQuantity", shop_id, is_available, brand, sku) VALUES
  (
    'Fried Chicken Meal',
    'Crispy fried chicken (2 pieces), mashed potatoes, coleslaw, and dinner roll. Comfort food at its best!',
    95.00,
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    ARRAY['https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800'],
    food_category_id,
    'mama-t-fried-chicken',
    50,
    mama_t_id,
    true,
    'Mama T''s Soul Food',
    'MTS-CHICK-001'
  ),
  (
    'Beef Stew with Dumplings',
    'Tender beef stew with vegetables and fluffy dumplings. Hearty and satisfying home-style meal.',
    110.00,
    'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800',
    ARRAY['https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800'],
    food_category_id,
    'mama-t-beef-stew',
    50,
    mama_t_id,
    true,
    'Mama T''s Soul Food',
    'MTS-STEW-001'
  ),
  (
    'Family Feast Box',
    'Fried chicken (8 pieces), beef stew, pap, rice, vegetables, and salad. Feeds 4-5 people.',
    450.00,
    'https://images.unsplash.com/photo-1555244162-803834f70033?w=800',
    ARRAY['https://images.unsplash.com/photo-1555244162-803834f70033?w=800'],
    food_category_id,
    'mama-t-family-feast',
    20,
    mama_t_id,
    true,
    'Mama T''s Soul Food',
    'MTS-FAMI-001'
  );

  -- ============================================
  -- RRA MOSHE'S BRAAI SPOT - Products
  -- ============================================
  INSERT INTO product (title, description, price, "heroImage", "imagesUrl", category, slug, "maxQuantity", shop_id, is_available, brand, sku) VALUES
  (
    'Boerewors Platter',
    'Grilled boerewors (500g) with pap, tomato relish, and chakalaka. Authentic South African braai experience.',
    120.00,
    'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800',
    ARRAY['https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800'],
    food_category_id,
    'rra-moshe-boerewors',
    40,
    rra_moshe_id,
    true,
    'Rra Moshe''s Braai Spot',
    'RMB-BOER-001'
  ),
  (
    'Braai Steak Special',
    'Prime beef steak (300g), grilled to perfection. Served with pap and salad.',
    145.00,
    'https://images.unsplash.com/photo-1558030006-450675393462?w=800',
    ARRAY['https://images.unsplash.com/photo-1558030006-450675393462?w=800'],
    food_category_id,
    'rra-moshe-steak',
    40,
    rra_moshe_id,
    true,
    'Rra Moshe''s Braai Spot',
    'RMB-STEA-001'
  ),
  (
    'Braai Meat Pack - 2kg',
    'Mixed braai pack: boerewors, steak, chicken, and chops. Perfect for weekend gatherings. Serves 6-8 people.',
    650.00,
    'https://images.unsplash.com/photo-1555244162-803834f70033?w=800',
    ARRAY['https://images.unsplash.com/photo-1555244162-803834f70033?w=800'],
    food_category_id,
    'rra-moshe-meat-pack',
    15,
    rra_moshe_id,
    true,
    'Rra Moshe''s Braai Spot',
    'RMB-PACK-001'
  );

END $$;

COMMIT;
