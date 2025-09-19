-- Seed data for enhanced shop categories based on Molapo Crossing Mall

-- Clear existing categories (be careful with this in production)
DELETE FROM public.category;

-- Insert shop categories with their specific features
INSERT INTO public.category (
    name,
    slug,
    "imageUrl",
    description,
    icon_name,
    has_virtual_try_on,
    has_delivery,
    has_collection,
    has_appointment_booking
) VALUES
-- Food & Drinks - Delivery/Collection
(
    'Food & Drinks',
    'food-drinks',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800',
    'Fresh food, beverages, and groceries from top retailers',
    'restaurant',
    FALSE, -- No virtual try-on
    TRUE,  -- Has delivery
    TRUE,  -- Has collection
    FALSE  -- No appointments needed
),

-- Clothing - Virtual Try-On + Delivery/Collection
(
    'Clothing',
    'clothing',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
    'Fashion and apparel with virtual try-on technology',
    'checkroom',
    TRUE,  -- Has virtual try-on
    TRUE,  -- Has delivery
    TRUE,  -- Has collection
    FALSE  -- No appointments (though some might offer personal styling)
),

-- Tech - Delivery/Collection
(
    'Tech',
    'tech',
    'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800',
    'Electronics, computers, and technology products',
    'devices',
    FALSE, -- No virtual try-on
    TRUE,  -- Has delivery
    TRUE,  -- Has collection
    FALSE  -- No appointments needed
),

-- Hair Care - Appointments + Virtual Try-On for some services
(
    'Hair Care',
    'hair-care',
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
    'Professional hair services and styling with virtual consultations',
    'content_cut',
    TRUE,  -- Virtual try-on for hair colors/styles
    FALSE, -- No delivery
    FALSE, -- No collection
    TRUE   -- Appointment booking required
),

-- Health - Mixed (Pharmacy has delivery, dental/medical needs appointments)
(
    'Health',
    'health',
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
    'Healthcare services, pharmacy, and wellness products',
    'local_hospital',
    FALSE, -- No virtual try-on
    TRUE,  -- Pharmacy delivery
    TRUE,  -- Pharmacy collection
    TRUE   -- Medical appointments
),

-- Restaurants - Delivery/Collection
(
    'Restaurants',
    'restaurants',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
    'Dining experiences and food delivery from premium restaurants',
    'restaurant_menu',
    FALSE, -- No virtual try-on
    TRUE,  -- Food delivery
    TRUE,  -- Takeaway collection
    TRUE   -- Table reservations
),

-- Service - Appointment-based
(
    'Service',
    'service',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800',
    'Professional services requiring consultations and appointments',
    'business_center',
    FALSE, -- No virtual try-on
    FALSE, -- No delivery
    FALSE, -- No collection
    TRUE   -- Appointment booking required
),

-- Others - Mixed features
(
    'Others',
    'others',
    'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800',
    'Miscellaneous products and services',
    'category',
    FALSE, -- No virtual try-on (varies by shop)
    TRUE,  -- Some have delivery
    TRUE,  -- Some have collection
    FALSE  -- Generally no appointments
);

-- Update the sequences to continue from the highest ID
SELECT setval('category_id_seq', (SELECT MAX(id) FROM public.category));