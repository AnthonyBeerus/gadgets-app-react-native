-- ============================================================
-- PART 1: Service Categories (Run this first)
-- ============================================================

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

-- Verify categories were created
SELECT id, name FROM service_category ORDER BY name;
