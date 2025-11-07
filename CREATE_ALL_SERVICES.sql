-- ============================================================
-- CREATE SERVICES FOR ALL SHOPS - DYNAMIC VERSION
-- ============================================================

-- Get all category and provider IDs dynamically
WITH category_ids AS (
  SELECT 
    MAX(CASE WHEN name = 'Hair & Beauty' THEN id END) as hair_beauty,
    MAX(CASE WHEN name = 'Nail Services' THEN id END) as nails,
    MAX(CASE WHEN name = 'Braiding Services' THEN id END) as braids,
    MAX(CASE WHEN name = 'Tech Support' THEN id END) as tech,
    MAX(CASE WHEN name = 'Health Consultation' THEN id END) as health,
    MAX(CASE WHEN name = 'Dental Services' THEN id END) as dental,
    MAX(CASE WHEN name = 'Restaurant Reservations' THEN id END) as restaurant,
    MAX(CASE WHEN name = 'Travel Consultation' THEN id END) as travel,
    MAX(CASE WHEN name = 'Property Viewing' THEN id END) as property,
    MAX(CASE WHEN name = 'Marketing Consultation' THEN id END) as marketing
  FROM service_category
),
provider_ids AS (
  SELECT 
    MAX(CASE WHEN email = 'lerato@dolllife.com' THEN id END) as lerato,
    MAX(CASE WHEN email = 'neo@dolllife.com' THEN id END) as neo_doll,
    MAX(CASE WHEN email = 'mpho@cuttingline.com' THEN id END) as mpho_cut,
    MAX(CASE WHEN email = 'nailsbythato@gmail.com' THEN id END) as thato,
    MAX(CASE WHEN email = 'keabetswenails@gmail.com' THEN id END) as keabetswe,
    MAX(CASE WHEN email = 'lesegosnails@gmail.com' THEN id END) as lesego,
    MAX(CASE WHEN email = 'braidsbyampho@gmail.com' THEN id END) as mpho_braids,
    MAX(CASE WHEN email = 'neosbraids@gmail.com' THEN id END) as neo_braids,
    MAX(CASE WHEN email = 'tlotlobraids@gmail.com' THEN id END) as tlotlo,
    MAX(CASE WHEN email = 'boitumelobraids@gmail.com' THEN id END) as boitumelo,
    MAX(CASE WHEN email = 'tshepo@viva.com' THEN id END) as tshepo,
    MAX(CASE WHEN email = 'kabo@viva.com' THEN id END) as kabo,
    MAX(CASE WHEN email = 'dr.modise@healthalt.com' THEN id END) as onkabetse,
    MAX(CASE WHEN email = 'dr.molefi@smiletime.com' THEN id END) as sarah,
    MAX(CASE WHEN email = 'dr.seabe@smiletime.com' THEN id END) as tebogo,
    MAX(CASE WHEN email = 'events@dros.com' THEN id END) as dros,
    MAX(CASE WHEN email = 'reservations@cappello.com' THEN id END) as cappello,
    MAX(CASE WHEN email = 'bookings@laparada.com' THEN id END) as laparada,
    MAX(CASE WHEN email = 'boipelo@shineafrica.com' THEN id END) as boipelo,
    MAX(CASE WHEN email = 'kagiso@premier.com' THEN id END) as kagiso,
    MAX(CASE WHEN email = 'gorata@funads.com' THEN id END) as gorata
  FROM service_provider
)
INSERT INTO service (category_id, provider_id, name, description, price, duration_minutes, is_active, rating, total_reviews, slug, created_at)
SELECT 
  CASE 
    WHEN s.category = 'hair_beauty' THEN c.hair_beauty
    WHEN s.category = 'nails' THEN c.nails
    WHEN s.category = 'braids' THEN c.braids
    WHEN s.category = 'tech' THEN c.tech
    WHEN s.category = 'health' THEN c.health
    WHEN s.category = 'dental' THEN c.dental
    WHEN s.category = 'restaurant' THEN c.restaurant
    WHEN s.category = 'travel' THEN c.travel
    WHEN s.category = 'property' THEN c.property
    WHEN s.category = 'marketing' THEN c.marketing
  END,
  CASE s.provider
    WHEN 'lerato' THEN p.lerato
    WHEN 'neo_doll' THEN p.neo_doll
    WHEN 'mpho_cut' THEN p.mpho_cut
    WHEN 'thato' THEN p.thato
    WHEN 'keabetswe' THEN p.keabetswe
    WHEN 'lesego' THEN p.lesego
    WHEN 'mpho_braids' THEN p.mpho_braids
    WHEN 'neo_braids' THEN p.neo_braids
    WHEN 'tlotlo' THEN p.tlotlo
    WHEN 'boitumelo' THEN p.boitumelo
    WHEN 'tshepo' THEN p.tshepo
    WHEN 'kabo' THEN p.kabo
    WHEN 'onkabetse' THEN p.onkabetse
    WHEN 'sarah' THEN p.sarah
    WHEN 'tebogo' THEN p.tebogo
    WHEN 'dros' THEN p.dros
    WHEN 'cappello' THEN p.cappello
    WHEN 'laparada' THEN p.laparada
    WHEN 'boipelo' THEN p.boipelo
    WHEN 'kagiso' THEN p.kagiso
    WHEN 'gorata' THEN p.gorata
  END,
  s.name,
  s.description,
  s.price,
  s.duration_minutes,
  s.is_active,
  s.rating,
  s.total_reviews,
  s.slug,
  NOW()
FROM provider_ids p, category_ids c,
(VALUES
  -- Doll Life (Shop 80) - Hair & Beauty
  ('hair_beauty', 'lerato', 'Full Makeup Application', 'Special occasion makeup', 350.00, 90, true, 4.8, 145, 'full-makeup-dolllife'),
  ('hair_beauty', 'neo_doll', 'Natural Hair Styling', 'Styling for natural hair textures', 200.00, 75, true, 4.7, 167, 'natural-hair-dolllife'),
  ('hair_beauty', 'lerato', 'Bridal Makeup', 'Complete bridal makeup package', 850.00, 150, true, 4.9, 67, 'bridal-makeup-dolllife'),
  ('hair_beauty', 'neo_doll', 'Loc Maintenance', 'Dreadlock maintenance and styling', 250.00, 120, true, 4.8, 89, 'loc-maintenance-dolllife'),
  
  -- Cutting Line Studio (Shop 81) - Hair & Beauty
  ('hair_beauty', 'mpho_cut', 'Precision Haircut', 'Expert precision cutting', 180.00, 60, true, 4.7, 203, 'precision-haircut-cutting'),
  ('hair_beauty', 'mpho_cut', 'Beard Trim & Shape', 'Professional beard grooming', 80.00, 30, true, 4.6, 178, 'beard-trim-cutting'),
  ('hair_beauty', 'mpho_cut', 'Hair & Beard Combo', 'Haircut and beard trim package', 230.00, 75, true, 4.8, 145, 'hair-beard-combo-cutting'),
  
  -- Nails by Thato (Shop 198)
  ('nails', 'thato', 'Acrylic Full Set', 'Complete acrylic nail set', 350.00, 120, true, 4.9, 267, 'acrylic-full-set-thato'),
  ('nails', 'thato', 'Gel Manicure', 'Long-lasting gel polish manicure', 180.00, 60, true, 4.8, 312, 'gel-manicure-thato'),
  ('nails', 'thato', 'Nail Art Design', 'Custom nail art and designs', 420.00, 90, true, 4.9, 189, 'nail-art-thato'),
  ('nails', 'thato', 'Pedicure Deluxe', 'Premium pedicure treatment', 220.00, 75, true, 4.7, 245, 'pedicure-deluxe-thato'),
  
  -- Nails by Keabetswe (Shop 199)
  ('nails', 'keabetswe', 'Gel Nails', 'Gel nail extensions', 320.00, 90, true, 4.8, 198, 'gel-nails-keabetswe'),
  ('nails', 'keabetswe', 'Manicure & Pedicure', 'Complete mani-pedi package', 380.00, 120, true, 4.7, 156, 'manicure-pedicure-keabetswe'),
  ('nails', 'keabetswe', 'Nail Repair', 'Broken nail repair service', 150.00, 45, true, 4.6, 87, 'nail-repair-keabetswe'),
  
  -- Nails by Lesego (Shop 200)
  ('nails', 'lesego', 'Ombre Nails', 'Gradient ombre nail design', 380.00, 90, true, 4.8, 145, 'ombre-nails-lesego'),
  ('nails', 'lesego', 'French Manicure', 'Classic French tip nails', 280.00, 75, true, 4.7, 176, 'french-manicure-lesego'),
  ('nails', 'lesego', 'Seasonal Nail Art', 'Themed nail designs', 350.00, 90, true, 4.9, 132, 'seasonal-nail-art-lesego'),
  
  -- Braids by Mpho (Shop 201)
  ('braids', 'mpho_braids', 'Box Braids', 'Classic box braids style', 450.00, 240, true, 4.9, 298, 'box-braids-mpho'),
  ('braids', 'mpho_braids', 'Cornrows', 'Traditional cornrow braiding', 280.00, 150, true, 4.8, 345, 'cornrows-mpho'),
  ('braids', 'mpho_braids', 'Senegalese Twists', 'Elegant Senegalese twist style', 500.00, 300, true, 4.9, 187, 'senegalese-twists-mpho'),
  ('braids', 'mpho_braids', 'Protective Style Consultation', 'Hair health consultation', 50.00, 30, true, 4.7, 156, 'protective-consult-mpho'),
  
  -- Braids by Neo (Shop 202)
  ('braids', 'neo_braids', 'Knotless Braids', 'Gentle knotless braiding technique', 550.00, 300, true, 4.9, 234, 'knotless-braids-neo'),
  ('braids', 'neo_braids', 'Tribal Braids', 'Intricate tribal braid patterns', 480.00, 270, true, 4.8, 198, 'tribal-braids-neo'),
  ('braids', 'neo_braids', 'Braided Updo', 'Elegant braided updo style', 380.00, 180, true, 4.7, 167, 'braided-updo-neo'),
  
  -- Braids by Tlotlo (Shop 203)
  ('braids', 'tlotlo', 'Goddess Braids', 'Thick, elegant goddess braids', 520.00, 240, true, 4.9, 213, 'goddess-braids-tlotlo'),
  ('braids', 'tlotlo', 'Fulani Braids', 'Traditional Fulani braid style', 480.00, 270, true, 4.8, 189, 'fulani-braids-tlotlo'),
  ('braids', 'tlotlo', 'Braided Ponytail', 'High braided ponytail', 320.00, 180, true, 4.7, 234, 'braided-ponytail-tlotlo'),
  
  -- Braids by Boitumelo (Shop 204)
  ('braids', 'boitumelo', 'Simple Cornrows', 'Quick cornrow braiding', 250.00, 120, true, 4.7, 287, 'simple-cornrows-boitumelo'),
  ('braids', 'boitumelo', 'Feed-in Braids', 'Natural-looking feed-in braids', 420.00, 240, true, 4.8, 198, 'feed-in-braids-boitumelo'),
  ('braids', 'boitumelo', 'Kids Braids', 'Child-friendly braiding styles', 200.00, 90, true, 4.6, 245, 'kids-braids-boitumelo'),
  
  -- Viva Computers (Shop 77) - Tech Support
  ('tech', 'tshepo', 'Computer Diagnostic', 'Full system diagnostic and assessment', 200.00, 60, true, 4.8, 156, 'computer-diagnostic-viva'),
  ('tech', 'tshepo', 'Laptop Repair', 'Hardware and software repair', 450.00, 120, true, 4.7, 134, 'laptop-repair-viva'),
  ('tech', 'kabo', 'IT Consultation', 'Business IT strategy consultation', 350.00, 90, true, 4.6, 89, 'it-consultation-viva'),
  ('tech', 'kabo', 'Network Setup', 'Home or office network installation', 600.00, 180, true, 4.8, 76, 'network-setup-viva'),
  
  -- Health Alternatives (Shop 83)
  ('health', 'onkabetse', 'Wellness Consultation', 'Holistic health assessment', 350.00, 60, true, 4.6, 145, 'wellness-consultation-health'),
  ('health', 'onkabetse', 'Nutrition Planning', 'Personalized nutrition plan', 450.00, 90, true, 4.7, 98, 'nutrition-planning-health'),
  ('health', 'onkabetse', 'Alternative Treatment Session', 'Natural healing session', 280.00, 75, true, 4.5, 123, 'alternative-treatment-health'),
  
  -- Smile Time Dentist (Shop 84)
  ('dental', 'sarah', 'Dental Checkup', 'Comprehensive dental examination', 250.00, 45, true, 4.8, 312, 'dental-checkup-smile'),
  ('dental', 'sarah', 'Teeth Cleaning', 'Professional teeth cleaning', 350.00, 60, true, 4.7, 287, 'teeth-cleaning-smile'),
  ('dental', 'sarah', 'Teeth Whitening', 'Cosmetic teeth whitening treatment', 850.00, 90, true, 4.9, 167, 'teeth-whitening-smile'),
  ('dental', 'tebogo', 'Children Dental Checkup', 'Pediatric dental examination', 200.00, 30, true, 4.8, 234, 'children-dental-smile'),
  ('dental', 'tebogo', 'Cavity Filling', 'Tooth cavity treatment and filling', 450.00, 60, true, 4.7, 198, 'cavity-filling-smile'),
  
  -- Dros (Shop 85) - Restaurant
  ('restaurant', 'dros', 'Table Reservation', 'Reserve your table', 0.00, 15, true, 4.4, 567, 'table-reservation-dros'),
  ('restaurant', 'dros', 'Private Event Booking', 'Book for special events and parties', 0.00, 30, true, 4.5, 89, 'private-event-dros'),
  
  -- Cappello (Shop 86) - Restaurant
  ('restaurant', 'cappello', 'Fine Dining Reservation', 'Reserve your fine dining experience', 0.00, 15, true, 4.6, 423, 'fine-dining-cappello'),
  ('restaurant', 'cappello', 'Wine Tasting Booking', 'Private wine tasting session', 500.00, 120, true, 4.8, 67, 'wine-tasting-cappello'),
  
  -- La Parada (Shop 87) - Restaurant
  ('restaurant', 'laparada', 'Table Booking', 'Book your table at La Parada', 0.00, 15, true, 4.3, 389, 'table-booking-laparada'),
  
  -- Shine Africa Travels (Shop 88)
  ('travel', 'boipelo', 'Travel Consultation', 'Discuss your travel plans', 150.00, 60, true, 4.5, 123, 'travel-consultation-shine'),
  ('travel', 'boipelo', 'Tour Package Planning', 'Custom tour package design', 300.00, 90, true, 4.6, 87, 'tour-package-shine'),
  
  -- Premier Properties (Shop 89)
  ('property', 'kagiso', 'Property Viewing', 'Schedule a property tour', 0.00, 60, true, 4.4, 198, 'property-viewing-premier'),
  ('property', 'kagiso', 'Property Consultation', 'Real estate investment consultation', 250.00, 45, true, 4.5, 76, 'property-consultation-premier'),
  
  -- Fun Ads Solutions (Shop 90)
  ('marketing', 'gorata', 'Marketing Consultation', 'Business marketing strategy session', 400.00, 90, true, 4.6, 134, 'marketing-consultation-funads'),
  ('marketing', 'gorata', 'Brand Development Session', 'Brand identity and strategy', 650.00, 120, true, 4.7, 87, 'brand-development-funads')
) AS s(category, provider, name, description, price, duration_minutes, is_active, rating, total_reviews, slug)
ON CONFLICT (slug) DO NOTHING;

-- Verify all services were created
SELECT 
  sp.shop_id,
  sh.name as shop_name,
  COUNT(s.id) as service_count
FROM service s
JOIN service_provider sp ON s.provider_id = sp.id
JOIN shops sh ON sp.shop_id = sh.id
WHERE sp.shop_id IN (80, 81, 77, 83, 84, 85, 86, 87, 88, 89, 90, 198, 199, 200, 201, 202, 203, 204)
GROUP BY sp.shop_id, sh.name
ORDER BY sp.shop_id;
