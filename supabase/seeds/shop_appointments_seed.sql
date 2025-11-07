-- =====================================================
-- SHOP APPOINTMENTS SEED DATA
-- Services and bookings for shops with appointment booking enabled
-- =====================================================

-- First, let's create service categories if they don't exist
INSERT INTO service_category (name, description, icon, color, slug, is_active, created_at) 
VALUES 
  ('Hair & Beauty', 'Professional hair styling, cutting, coloring, and beauty treatments', 'cut', '#FF69B4', 'hair-beauty', true, NOW()),
  ('Nail Services', 'Manicures, pedicures, nail art, and nail care', 'hand-left', '#FF1493', 'nail-services', true, NOW()),
  ('Braiding Services', 'African braiding, protective styles, and hair extensions', 'grid', '#8B4513', 'braiding-services', true, NOW()),
  ('Tech Support', 'Computer repairs, IT support, and technical services', 'laptop', '#4169E1', 'tech-support', true, NOW()),
  ('Health Consultation', 'Health assessments, wellness consultations, and alternative medicine', 'medical', '#32CD32', 'health-consultation', true, NOW()),
  ('Dental Services', 'Dental checkups, cleaning, and cosmetic dentistry', 'medkit', '#00CED1', 'dental-services', true, NOW()),
  ('Restaurant Reservations', 'Table bookings and dining reservations', 'restaurant', '#FF6347', 'restaurant-reservations', true, NOW()),
  ('Travel Consultation', 'Travel planning, bookings, and itinerary services', 'airplane', '#1E90FF', 'travel-consultation', true, NOW()),
  ('Property Viewing', 'Real estate property tours and consultations', 'home', '#FFD700', 'property-viewing', true, NOW()),
  ('Marketing Consultation', 'Business marketing strategy and advertising services', 'megaphone', '#FF4500', 'marketing-consultation', true, NOW())
ON CONFLICT (name) DO NOTHING;

-- Create service providers for each shop
-- Beauty & Hair Shops (HairStranz=79, Doll Life=80, Cutting Line Studio=81)
INSERT INTO service_provider (name, email, phone, description, rating, total_reviews, shop_id, is_active, is_verified, created_at)
VALUES 
  ('Thandi Mokoena - Senior Stylist', 'thandi@hairstranz.com', '+267 71234501', 'Award-winning hair stylist with 10+ years experience', 4.9, 156, 79, true, true, NOW()),
  ('Kabelo Motsumi - Master Colorist', 'kabelo@hairstranz.com', '+267 71234502', 'Specialist in hair coloring and treatments', 4.8, 142, 79, true, true, NOW()),
  ('Lerato Dube - Beauty Expert', 'lerato@dolllife.com', '+267 71234503', 'Expert in makeup and beauty treatments', 4.7, 98, 80, true, true, NOW()),
  ('Neo Kgosana - Hair Specialist', 'neo@dolllife.com', '+267 71234504', 'Professional stylist focusing on natural hair', 4.8, 112, 80, true, true, NOW()),
  ('Mpho Setlhare - Lead Stylist', 'mpho@cuttingline.com', '+267 71234505', 'Precision cuts and modern styling techniques', 4.6, 76, 81, true, true, NOW()),
  
  -- Nail Technicians (Nails by Thato=198, Keabetswe=199, Lesego=200)
  ('Thato Ndlovu', 'nailsbythato@gmail.com', '+267 71234567', 'Professional nail artist specializing in acrylics and gel nails', 4.9, 87, 198, true, true, NOW()),
  ('Keabetswe Mokwena', 'keabetswenails@gmail.com', '+267 72345678', 'Nail health specialist with luxury services', 4.8, 65, 199, true, true, NOW()),
  ('Lesego Tau', 'lesegosnails@gmail.com', '+267 73456789', 'Creative nail designer, ombre and French tip expert', 4.7, 52, 200, true, true, NOW()),
  
  -- Hair Braiders (Braids by Mpho=201, Neo=202, Tlotlo=203, Boitumelo=204)
  ('Mpho Mmusi', 'braidsbyampho@gmail.com', '+267 74567890', 'Expert in African braiding and protective styles', 4.9, 143, 201, true, true, NOW()),
  ('Neo Mogotsi', 'neosbraids@gmail.com', '+267 75678901', 'Specialist in knotless and tribal braids', 4.8, 98, 202, true, true, NOW()),
  ('Tlotlo Seboni', 'tlotlobraids@gmail.com', '+267 76789012', 'Goddess and fulani braids specialist', 4.9, 76, 203, true, true, NOW()),
  ('Boitumelo Kgang', 'boitumelobraids@gmail.com', '+267 77890123', 'Fast braiding service, all styles', 4.7, 61, 204, true, true, NOW()),
  
  -- Tech Services (Viva Computers=77)
  ('Tshepo Molefe - IT Specialist', 'tshepo@viva.com', '+267 71234506', 'Computer repairs and IT support expert', 4.8, 89, 77, true, true, NOW()),
  ('Kabo Letsebe - Tech Consultant', 'kabo@viva.com', '+267 71234507', 'Technology consultation and setup specialist', 4.7, 67, 77, true, true, NOW()),
  
  -- Health Services (Health Alternatives=83, Smile Time Dentist=84)
  ('Dr. Onkabetse Modise', 'dr.modise@healthalt.com', '+267 71234508', 'Alternative medicine and wellness consultant', 4.6, 67, 83, true, true, NOW()),
  ('Dr. Sarah Molefi - DDS', 'dr.molefi@smiletime.com', '+267 71234509', 'General and cosmetic dentistry specialist', 4.7, 154, 84, true, true, NOW()),
  ('Dr. Tebogo Seabe - DDS', 'dr.seabe@smiletime.com', '+267 71234510', 'Pediatric and family dentistry', 4.8, 145, 84, true, true, NOW()),
  
  -- Restaurant Services (Dros=85, Cappello=86, La Parada=87)
  ('Events Team - Dros', 'events@dros.com', '+267 71234511', 'Table reservations and event bookings', 4.4, 312, 85, true, true, NOW()),
  ('Reservations - Cappello', 'reservations@cappello.com', '+267 71234512', 'Fine dining reservations specialist', 4.6, 287, 86, true, true, NOW()),
  ('Bookings - La Parada', 'bookings@laparada.com', '+267 71234513', 'Casual dining reservations', 4.3, 178, 87, true, true, NOW()),
  
  -- Travel & Property Services (Shine Africa Travels=88, Premier Properties=89)
  ('Boipelo Radebe - Travel Agent', 'boipelo@shineafrica.com', '+267 71234514', 'International and domestic travel specialist', 4.5, 45, 88, true, true, NOW()),
  ('Kagiso Matlhare - Property Agent', 'kagiso@premier.com', '+267 71234515', 'Real estate sales and rental specialist', 4.4, 38, 89, true, true, NOW()),
  
  -- Marketing Services (Fun Ads Solutions=90)
  ('Gorata Moagi - Marketing Director', 'gorata@funads.com', '+267 71234516', 'Digital marketing and advertising expert', 4.6, 56, 90, true, true, NOW())
ON CONFLICT (email) DO NOTHING;

-- Get category IDs
DO $$
DECLARE
  cat_hair_beauty INT;
  cat_nails INT;
  cat_braids INT;
  cat_tech INT;
  cat_health INT;
  cat_dental INT;
  cat_restaurant INT;
  cat_travel INT;
  cat_property INT;
  cat_marketing INT;
  
  -- Provider IDs
  prov_thandi INT;
  prov_kabelo INT;
  prov_lerato INT;
  prov_neo_doll INT;
  prov_mpho_cut INT;
  prov_thato INT;
  prov_keabetswe INT;
  prov_lesego INT;
  prov_mpho_braids INT;
  prov_neo_braids INT;
  prov_tlotlo INT;
  prov_boitumelo INT;
  prov_tshepo INT;
  prov_kabo INT;
  prov_onkabetse INT;
  prov_sarah INT;
  prov_tebogo INT;
  prov_dros INT;
  prov_cappello INT;
  prov_laparada INT;
  prov_boipelo INT;
  prov_kagiso INT;
  prov_gorata INT;
  
BEGIN
  -- Get category IDs
  SELECT id INTO cat_hair_beauty FROM service_category WHERE name = 'Hair & Beauty';
  SELECT id INTO cat_nails FROM service_category WHERE name = 'Nail Services';
  SELECT id INTO cat_braids FROM service_category WHERE name = 'Braiding Services';
  SELECT id INTO cat_tech FROM service_category WHERE name = 'Tech Support';
  SELECT id INTO cat_health FROM service_category WHERE name = 'Health Consultation';
  SELECT id INTO cat_dental FROM service_category WHERE name = 'Dental Services';
  SELECT id INTO cat_restaurant FROM service_category WHERE name = 'Restaurant Reservations';
  SELECT id INTO cat_travel FROM service_category WHERE name = 'Travel Consultation';
  SELECT id INTO cat_property FROM service_category WHERE name = 'Property Viewing';
  SELECT id INTO cat_marketing FROM service_category WHERE name = 'Marketing Consultation';
  
  -- Get provider IDs
  SELECT id INTO prov_thandi FROM service_provider WHERE email = 'thandi@hairstranz.com';
  SELECT id INTO prov_kabelo FROM service_provider WHERE email = 'kabelo@hairstranz.com';
  SELECT id INTO prov_lerato FROM service_provider WHERE email = 'lerato@dolllife.com';
  SELECT id INTO prov_neo_doll FROM service_provider WHERE email = 'neo@dolllife.com';
  SELECT id INTO prov_mpho_cut FROM service_provider WHERE email = 'mpho@cuttingline.com';
  SELECT id INTO prov_thato FROM service_provider WHERE email = 'nailsbythato@gmail.com';
  SELECT id INTO prov_keabetswe FROM service_provider WHERE email = 'keabetswenails@gmail.com';
  SELECT id INTO prov_lesego FROM service_provider WHERE email = 'lesegosnails@gmail.com';
  SELECT id INTO prov_mpho_braids FROM service_provider WHERE email = 'braidsbyampho@gmail.com';
  SELECT id INTO prov_neo_braids FROM service_provider WHERE email = 'neosbraids@gmail.com';
  SELECT id INTO prov_tlotlo FROM service_provider WHERE email = 'tlotlobraids@gmail.com';
  SELECT id INTO prov_boitumelo FROM service_provider WHERE email = 'boitumelobraids@gmail.com';
  SELECT id INTO prov_tshepo FROM service_provider WHERE email = 'tshepo@viva.com';
  SELECT id INTO prov_kabo FROM service_provider WHERE email = 'kabo@viva.com';
  SELECT id INTO prov_onkabetse FROM service_provider WHERE email = 'dr.modise@healthalt.com';
  SELECT id INTO prov_sarah FROM service_provider WHERE email = 'dr.molefi@smiletime.com';
  SELECT id INTO prov_tebogo FROM service_provider WHERE email = 'dr.seabe@smiletime.com';
  SELECT id INTO prov_dros FROM service_provider WHERE email = 'events@dros.com';
  SELECT id INTO prov_cappello FROM service_provider WHERE email = 'reservations@cappello.com';
  SELECT id INTO prov_laparada FROM service_provider WHERE email = 'bookings@laparada.com';
  SELECT id INTO prov_boipelo FROM service_provider WHERE email = 'boipelo@shineafrica.com';
  SELECT id INTO prov_kagiso FROM service_provider WHERE email = 'kagiso@premier.com';
  SELECT id INTO prov_gorata FROM service_provider WHERE email = 'gorata@funads.com';
  
  -- Create services for HairStranz (Shop ID: 79)
  INSERT INTO service (category_id, provider_id, name, description, price, duration_minutes, is_active, rating, total_reviews, slug, created_at)
  VALUES 
    (cat_hair_beauty, prov_thandi, 'Haircut & Style', 'Professional haircut with styling', 150.00, 60, true, 4.8, 234, 'haircut-style', NOW()),
    (cat_hair_beauty, prov_thandi, 'Hair Coloring', 'Full hair coloring service', 450.00, 120, true, 4.9, 156, 'hair-coloring', NOW()),
    (cat_hair_beauty, prov_kabelo, 'Balayage Treatment', 'Premium balayage coloring technique', 650.00, 180, true, 4.9, 98, 'balayage-treatment', NOW()),
    (cat_hair_beauty, prov_kabelo, 'Hair Treatment', 'Deep conditioning and repair treatment', 280.00, 90, true, 4.7, 187, 'hair-treatment', NOW()),
    (cat_hair_beauty, prov_thandi, 'Blow Dry & Style', 'Professional blow dry and styling', 120.00, 45, true, 4.6, 312, 'blow-dry-style', NOW())
  ON CONFLICT (slug) DO NOTHING;
  
  -- Create services for Doll Life (Shop ID: 80)
  INSERT INTO service (category_id, provider_id, name, description, price, duration_minutes, is_active, rating, total_reviews, slug, created_at)
  VALUES 
    (cat_hair_beauty, prov_lerato, 'Full Makeup Application', 'Special occasion makeup', 350.00, 90, true, 4.8, 145, 'full-makeup-application', NOW()),
    (cat_hair_beauty, prov_neo_doll, 'Natural Hair Styling', 'Styling for natural hair textures', 200.00, 75, true, 4.7, 167, 'natural-hair-styling', NOW()),
    (cat_hair_beauty, prov_lerato, 'Bridal Makeup', 'Complete bridal makeup package', 850.00, 150, true, 4.9, 67, 'bridal-makeup', NOW()),
    (cat_hair_beauty, prov_neo_doll, 'Loc Maintenance', 'Dreadlock maintenance and styling', 250.00, 120, true, 4.8, 89, 'loc-maintenance', NOW())
  ON CONFLICT (slug) DO NOTHING;
  
  -- Create services for Cutting Line Studio (Shop ID: 81)
  INSERT INTO service (category_id, provider_id, name, description, price, duration_minutes, is_active, rating, total_reviews, slug, created_at)
  VALUES 
    (cat_hair_beauty, prov_mpho_cut, 'Precision Haircut', 'Expert precision cutting', 180.00, 60, true, 4.7, 203, 'precision-haircut', NOW()),
    (cat_hair_beauty, prov_mpho_cut, 'Beard Trim & Shape', 'Professional beard grooming', 80.00, 30, true, 4.6, 178, 'beard-trim-shape', NOW()),
    (cat_hair_beauty, prov_mpho_cut, 'Hair & Beard Combo', 'Haircut and beard trim package', 230.00, 75, true, 4.8, 145, 'hair-beard-combo', NOW())
  ON CONFLICT (slug) DO NOTHING;
  
  -- Create services for Nails by Thato (Shop ID: 198)
  INSERT INTO service (category_id, provider_id, name, description, price, duration_minutes, is_active, rating, total_reviews, slug, created_at)
  VALUES 
    (cat_nails, prov_thato, 'Acrylic Full Set', 'Complete acrylic nail set', 350.00, 120, true, 4.9, 267, 'acrylic-full-set', NOW()),
    (cat_nails, prov_thato, 'Gel Manicure', 'Long-lasting gel polish manicure', 180.00, 60, true, 4.8, 312, 'gel-manicure', NOW()),
    (cat_nails, prov_thato, 'Nail Art Design', 'Custom nail art and designs', 420.00, 90, true, 4.9, 189, 'nail-art-design', NOW()),
    (cat_nails, prov_thato, 'Pedicure Deluxe', 'Premium pedicure treatment', 220.00, 75, true, 4.7, 245, 'pedicure-deluxe', NOW())
  ON CONFLICT (slug) DO NOTHING;
  
  -- Create services for Nails by Keabetswe (Shop ID: 199)
  INSERT INTO service (category_id, provider_id, name, description, price, duration_minutes, is_active, rating, total_reviews, slug, created_at)
  VALUES 
    (cat_nails, prov_keabetswe, 'Gel Nails', 'Gel nail extensions', 320.00, 90, true, 4.8, 198, 'gel-nails', NOW()),
    (cat_nails, prov_keabetswe, 'Manicure & Pedicure', 'Complete mani-pedi package', 380.00, 120, true, 4.7, 156, 'manicure-pedicure', NOW()),
    (cat_nails, prov_keabetswe, 'Nail Repair', 'Broken nail repair service', 150.00, 45, true, 4.6, 87, 'nail-repair', NOW())
  ON CONFLICT (slug) DO NOTHING;
  
  -- Create services for Nails by Lesego (Shop ID: 200)
  INSERT INTO service (category_id, provider_id, name, description, price, duration_minutes, is_active, rating, total_reviews, slug, created_at)
  VALUES 
    (cat_nails, prov_lesego, 'Ombre Nails', 'Gradient ombre nail design', 380.00, 90, true, 4.8, 145, 'ombre-nails', NOW()),
    (cat_nails, prov_lesego, 'French Manicure', 'Classic French tip nails', 280.00, 75, true, 4.7, 176, 'french-manicure', NOW()),
    (cat_nails, prov_lesego, 'Seasonal Nail Art', 'Themed nail designs', 350.00, 90, true, 4.9, 132, 'seasonal-nail-art', NOW())
  ON CONFLICT (slug) DO NOTHING;
  
  -- Create services for Braids by Mpho (Shop ID: 201)
  INSERT INTO service (category_id, provider_id, name, description, price, duration_minutes, is_active, rating, total_reviews, slug, created_at)
  VALUES 
    (cat_braids, prov_mpho_braids, 'Box Braids', 'Classic box braids style', 450.00, 240, true, 4.9, 298, 'box-braids', NOW()),
    (cat_braids, prov_mpho_braids, 'Cornrows', 'Traditional cornrow braiding', 280.00, 150, true, 4.8, 345, 'cornrows', NOW()),
    (cat_braids, prov_mpho_braids, 'Senegalese Twists', 'Elegant Senegalese twist style', 500.00, 300, true, 4.9, 187, 'senegalese-twists', NOW()),
    (cat_braids, prov_mpho_braids, 'Protective Style Consultation', 'Hair health consultation', 50.00, 30, true, 4.7, 156, 'protective-style-consultation', NOW())
  ON CONFLICT (slug) DO NOTHING;
  
  -- Create services for Braids by Neo (Shop ID: 202)
  INSERT INTO service (category_id, provider_id, name, description, price, duration_minutes, is_active, rating, total_reviews, slug, created_at)
  VALUES 
    (cat_braids, prov_neo_braids, 'Knotless Braids', 'Gentle knotless braiding technique', 550.00, 300, true, 4.9, 234, 'knotless-braids', NOW()),
    (cat_braids, prov_neo_braids, 'Tribal Braids', 'Intricate tribal braid patterns', 480.00, 270, true, 4.8, 198, 'tribal-braids', NOW()),
    (cat_braids, prov_neo_braids, 'Braided Updo', 'Elegant braided updo style', 380.00, 180, true, 4.7, 167, 'braided-updo', NOW())
  ON CONFLICT (slug) DO NOTHING;
  
  -- Create services for Braids by Tlotlo (Shop ID: 203)
  INSERT INTO service (category_id, provider_id, name, description, price, duration_minutes, is_active, rating, total_reviews, slug, created_at)
  VALUES 
    (cat_braids, prov_tlotlo, 'Goddess Braids', 'Thick, elegant goddess braids', 520.00, 240, true, 4.9, 213, 'goddess-braids', NOW()),
    (cat_braids, prov_tlotlo, 'Fulani Braids', 'Traditional Fulani braid style', 480.00, 270, true, 4.8, 189, 'fulani-braids', NOW()),
    (cat_braids, prov_tlotlo, 'Braided Ponytail', 'High braided ponytail', 320.00, 180, true, 4.7, 234, 'braided-ponytail', NOW())
  ON CONFLICT (slug) DO NOTHING;
  
  -- Create services for Braids by Boitumelo (Shop ID: 204)
  INSERT INTO service (category_id, provider_id, name, description, price, duration_minutes, is_active, rating, total_reviews, slug, created_at)
  VALUES 
    (cat_braids, prov_boitumelo, 'Simple Cornrows', 'Quick cornrow braiding', 250.00, 120, true, 4.7, 287, 'simple-cornrows', NOW()),
    (cat_braids, prov_boitumelo, 'Feed-in Braids', 'Natural-looking feed-in braids', 420.00, 240, true, 4.8, 198, 'feed-in-braids', NOW()),
    (cat_braids, prov_boitumelo, 'Kids Braids', 'Child-friendly braiding styles', 200.00, 90, true, 4.6, 245, 'kids-braids', NOW())
  ON CONFLICT (slug) DO NOTHING;
  
  -- Create services for Viva Computers (Shop ID: 77)
  INSERT INTO service (category_id, provider_id, name, description, price, duration_minutes, is_active, rating, total_reviews, slug, created_at)
  VALUES 
    (cat_tech, prov_tshepo, 'Computer Diagnostic', 'Full system diagnostic and assessment', 200.00, 60, true, 4.8, 156, 'computer-diagnostic', NOW()),
    (cat_tech, prov_tshepo, 'Laptop Repair', 'Hardware and software repair', 450.00, 120, true, 4.7, 134, 'laptop-repair', NOW()),
    (cat_tech, prov_kabo, 'IT Consultation', 'Business IT strategy consultation', 350.00, 90, true, 4.6, 89, 'it-consultation', NOW()),
    (cat_tech, prov_kabo, 'Network Setup', 'Home or office network installation', 600.00, 180, true, 4.8, 76, 'network-setup', NOW())
  ON CONFLICT (slug) DO NOTHING;
  
  -- Create services for Health Alternatives (Shop ID: 83)
  INSERT INTO service (category_id, provider_id, name, description, price, duration_minutes, is_active, rating, total_reviews, slug, created_at)
  VALUES 
    (cat_health, prov_onkabetse, 'Wellness Consultation', 'Holistic health assessment', 350.00, 60, true, 4.6, 145, 'wellness-consultation', NOW()),
    (cat_health, prov_onkabetse, 'Nutrition Planning', 'Personalized nutrition plan', 450.00, 90, true, 4.7, 98, 'nutrition-planning', NOW()),
    (cat_health, prov_onkabetse, 'Alternative Treatment Session', 'Natural healing session', 280.00, 75, true, 4.5, 123, 'alternative-treatment-session', NOW())
  ON CONFLICT (slug) DO NOTHING;
  
  -- Create services for Smile Time Dentist (Shop ID: 84)
  INSERT INTO service (category_id, provider_id, name, description, price, duration_minutes, is_active, rating, total_reviews, slug, created_at)
  VALUES 
    (cat_dental, prov_sarah, 'Dental Checkup', 'Comprehensive dental examination', 250.00, 45, true, 4.8, 312, 'dental-checkup', NOW()),
    (cat_dental, prov_sarah, 'Teeth Cleaning', 'Professional teeth cleaning', 350.00, 60, true, 4.7, 287, 'teeth-cleaning', NOW()),
    (cat_dental, prov_sarah, 'Teeth Whitening', 'Cosmetic teeth whitening treatment', 850.00, 90, true, 4.9, 167, 'teeth-whitening', NOW()),
    (cat_dental, prov_tebogo, 'Children Dental Checkup', 'Pediatric dental examination', 200.00, 30, true, 4.8, 234, 'children-dental-checkup', NOW()),
    (cat_dental, prov_tebogo, 'Cavity Filling', 'Tooth cavity treatment and filling', 450.00, 60, true, 4.7, 198, 'cavity-filling', NOW())
  ON CONFLICT (slug) DO NOTHING;
  
  -- Create services for Dros (Shop ID: 85)
  INSERT INTO service (category_id, provider_id, name, description, price, duration_minutes, is_active, rating, total_reviews, slug, created_at)
  VALUES 
    (cat_restaurant, prov_dros, 'Table Reservation', 'Reserve your table', 0.00, 15, true, 4.4, 567, 'table-reservation-dros', NOW()),
    (cat_restaurant, prov_dros, 'Private Event Booking', 'Book for special events and parties', 0.00, 30, true, 4.5, 89, 'private-event-booking-dros', NOW())
  ON CONFLICT (slug) DO NOTHING;
  
  -- Create services for Cappello (Shop ID: 86)
  INSERT INTO service (category_id, provider_id, name, description, price, duration_minutes, is_active, rating, total_reviews, slug, created_at)
  VALUES 
    (cat_restaurant, prov_cappello, 'Fine Dining Reservation', 'Reserve your fine dining experience', 0.00, 15, true, 4.6, 423, 'fine-dining-reservation', NOW()),
    (cat_restaurant, prov_cappello, 'Wine Tasting Booking', 'Private wine tasting session', 500.00, 120, true, 4.8, 67, 'wine-tasting-booking', NOW())
  ON CONFLICT (slug) DO NOTHING;
  
  -- Create services for La Parada (Shop ID: 87)
  INSERT INTO service (category_id, provider_id, name, description, price, duration_minutes, is_active, rating, total_reviews, slug, created_at)
  VALUES 
    (cat_restaurant, prov_laparada, 'Table Booking', 'Book your table at La Parada', 0.00, 15, true, 4.3, 389, 'table-booking-laparada', NOW())
  ON CONFLICT (slug) DO NOTHING;
  
  -- Create services for Shine Africa Travels (Shop ID: 88)
  INSERT INTO service (category_id, provider_id, name, description, price, duration_minutes, is_active, rating, total_reviews, slug, created_at)
  VALUES 
    (cat_travel, prov_boipelo, 'Travel Consultation', 'Discuss your travel plans', 150.00, 60, true, 4.5, 123, 'travel-consultation', NOW()),
    (cat_travel, prov_boipelo, 'Tour Package Planning', 'Custom tour package design', 300.00, 90, true, 4.6, 87, 'tour-package-planning', NOW())
  ON CONFLICT (slug) DO NOTHING;
  
  -- Create services for Premier Properties (Shop ID: 89)
  INSERT INTO service (category_id, provider_id, name, description, price, duration_minutes, is_active, rating, total_reviews, slug, created_at)
  VALUES 
    (cat_property, prov_kagiso, 'Property Viewing', 'Schedule a property tour', 0.00, 60, true, 4.4, 198, 'property-viewing', NOW()),
    (cat_property, prov_kagiso, 'Property Consultation', 'Real estate investment consultation', 250.00, 45, true, 4.5, 76, 'property-consultation', NOW())
  ON CONFLICT (slug) DO NOTHING;
  
  -- Create services for Fun Ads Solutions (Shop ID: 90)
  INSERT INTO service (category_id, provider_id, name, description, price, duration_minutes, is_active, rating, total_reviews, slug, created_at)
  VALUES 
    (cat_marketing, prov_gorata, 'Marketing Consultation', 'Business marketing strategy session', 400.00, 90, true, 4.6, 134, 'marketing-consultation', NOW()),
    (cat_marketing, prov_gorata, 'Brand Development Session', 'Brand identity and strategy', 650.00, 120, true, 4.7, 87, 'brand-development-session', NOW())
  ON CONFLICT (slug) DO NOTHING;
  
  RAISE NOTICE 'Shop appointments seed data created successfully!';
    
END $$;

-- Note: Sample bookings will be created when users actually use the app
-- This seed creates the service infrastructure for the shops
