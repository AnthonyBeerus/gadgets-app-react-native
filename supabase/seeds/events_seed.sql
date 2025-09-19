-- Insert event venues first (locations within Molapo Crossing Mall)
INSERT INTO public.event_venue (
    name,
    type,
    location,
    description,
    capacity,
    amenities,
    price_range,
    phone,
    email,
    is_available,
    image_url,
    icon,
    color
) VALUES
(
    'Central Court Stage',
    'Outdoor Stage',
    'Molapo Crossing Mall - Central Court',
    'Main performance stage in the heart of the mall with excellent acoustics and lighting.',
    '500-1000 people',
    ARRAY['Sound System', 'Lighting', 'Stage Equipment', 'Security'],
    'P5000-P15000',
    '+267 123 4567',
    'events@molapo.co.bw',
    true,
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    'stage',
    '#FF6B6B'
),
(
    'Mall Conference Center',
    'Conference Hall',
    'Molapo Crossing Mall - Upper Level',
    'Modern conference facility perfect for business events and presentations.',
    '200-300 people',
    ARRAY['Projector', 'Sound System', 'WiFi', 'Air Conditioning', 'Catering'],
    'P3000-P8000',
    '+267 123 4568',
    'conference@molapo.co.bw',
    true,
    'https://images.unsplash.com/photo-1559523161-0fc0d8b38a7a?w=800',
    'business',
    '#4ECDC4'
),
(
    'Food Court Amphitheater',
    'Indoor Theater',
    'Molapo Crossing Mall - Food Court Area',
    'Intimate theater space near the food court, perfect for comedy and smaller performances.',
    '150-200 people',
    ARRAY['Sound System', 'Basic Lighting', 'Seating'],
    'P2000-P5000',
    '+267 123 4569',
    'theater@molapo.co.bw',
    true,
    'https://images.unsplash.com/photo-1528459584353-2f0d0600e8fa?w=800',
    'theater',
    '#45B7D1'
),
(
    'Gallery Exhibition Space',
    'Art Gallery',
    'Molapo Crossing Mall - West Wing',
    'Dedicated art exhibition space with professional lighting and display systems.',
    '100-150 people',
    ARRAY['Art Lighting', 'Display Systems', 'Climate Control', 'Security'],
    'P1500-P4000',
    '+267 123 4570',
    'gallery@molapo.co.bw',
    true,
    'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
    'palette',
    '#F39C12'
),
(
    'Workshop Studio',
    'Multi-purpose Room',
    'Molapo Crossing Mall - East Wing',
    'Flexible workshop space with tables, chairs, and basic equipment for hands-on activities.',
    '50-80 people',
    ARRAY['Tables', 'Chairs', 'Basic Tools', 'Storage'],
    'P1000-P3000',
    '+267 123 4571',
    'workshop@molapo.co.bw',
    true,
    'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800',
    'tools',
    '#9B59B6'
),
(
    'Cinema Hall',
    'Movie Theater',
    'Molapo Crossing Mall - Entertainment Wing',
    'Full cinema experience with premium sound and projection systems.',
    '120-180 people',
    ARRAY['Premium Sound', 'Digital Projection', 'Comfortable Seating', 'Concessions'],
    'P2500-P6000',
    '+267 123 4572',
    'cinema@molapo.co.bw',
    true,
    'https://images.unsplash.com/photo-1489599833288-6d0e8b6c0ecc?w=800',
    'film',
    '#E74C3C'
);

-- Insert sample events for Molapo Crossing Mall venues
INSERT INTO public.events (
    title,
    description,
    venue_id,
    category,
    event_date,
    start_time,
    end_time,
    image_url,
    price,
    total_tickets,
    available_tickets,
    is_featured,
    tags,
    status
) VALUES
-- Music Events
(
    'Botswana Music Festival 2025',
    'Experience the best of Botswana''s musical talent in this spectacular festival featuring traditional and contemporary artists from across the country.',
    1, -- Central Court Stage
    'Music',
    '2025-10-15',
    '18:00',
    '23:00',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    250.00,
    500,
    500,
    true,
    ARRAY['Traditional', 'Contemporary', 'Live Music', 'Festival'],
    'active'
),
(
    'Jazz Under the Stars',
    'An intimate evening of smooth jazz featuring local and international artists in a cozy outdoor setting.',
    1, -- Central Court Stage
    'Music',
    '2025-09-28',
    '19:30',
    '22:30',
    'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800',
    150.00,
    200,
    185,
    false,
    ARRAY['Jazz', 'Live Music', 'Outdoor'],
    'active'
),

-- Comedy Events
(
    'Comedy Night Extravaganza',
    'Get ready for a night of non-stop laughter with Botswana''s funniest comedians and special guest performers.',
    3, -- Food Court Amphitheater
    'Comedy',
    '2025-10-05',
    '20:00',
    '22:00',
    'https://images.unsplash.com/photo-1528459584353-2f0d0600e8fa?w=800',
    80.00,
    150,
    135,
    false,
    ARRAY['Stand-up', 'Local Comedians', 'Entertainment'],
    'active'
),
(
    'International Comedy Showcase',
    'World-class comedians bring their best material to Gaborone in this special international comedy event.',
    1, -- Central Court Stage
    'Comedy',
    '2025-11-12',
    '19:00',
    '21:30',
    'https://images.unsplash.com/photo-1516307365426-bea591f05011?w=800',
    180.00,
    400,
    380,
    true,
    ARRAY['International', 'Stand-up', 'Premium'],
    'active'
),

-- Art Events
(
    'Contemporary Art Exhibition',
    'Discover the vibrant contemporary art scene of Botswana through this curated exhibition featuring emerging and established artists.',
    4, -- Gallery Exhibition Space
    'Art',
    '2025-09-25',
    '10:00',
    '18:00',
    'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
    50.00,
    100,
    85,
    false,
    ARRAY['Exhibition', 'Contemporary', 'Local Artists'],
    'active'
),
(
    'Traditional Crafts Workshop',
    'Learn traditional Botswana crafting techniques in this hands-on workshop led by master artisans.',
    5, -- Workshop Studio
    'Art',
    '2025-10-08',
    '09:00',
    '16:00',
    'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800',
    120.00,
    50,
    35,
    false,
    ARRAY['Workshop', 'Traditional', 'Crafts', 'Hands-on'],
    'active'
),

-- Business Events
(
    'Entrepreneurs Summit 2025',
    'Network with successful entrepreneurs and learn the latest business strategies in this comprehensive summit.',
    2, -- Mall Conference Center
    'Business',
    '2025-10-20',
    '08:00',
    '17:00',
    'https://images.unsplash.com/photo-1559523161-0fc0d8b38a7a?w=800',
    350.00,
    250,
    220,
    true,
    ARRAY['Networking', 'Business', 'Entrepreneurs', 'Summit'],
    'active'
),
(
    'Digital Marketing Masterclass',
    'Master the art of digital marketing with insights from industry experts and hands-on practical sessions.',
    2, -- Mall Conference Center
    'Business',
    '2025-09-30',
    '09:00',
    '17:00',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    200.00,
    100,
    85,
    false,
    ARRAY['Digital Marketing', 'Masterclass', 'Professional Development'],
    'active'
),

-- Culture Events
(
    'Heritage Day Celebration',
    'Celebrate Botswana''s rich cultural heritage with traditional performances, food, and cultural displays.',
    1, -- Central Court Stage
    'Culture',
    '2025-09-30',
    '14:00',
    '20:00',
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
    75.00,
    600,
    520,
    true,
    ARRAY['Heritage', 'Traditional', 'Cultural', 'Family-friendly'],
    'active'
),
(
    'Storytelling Evening',
    'Experience the oral tradition of Botswana through captivating storytelling sessions by renowned storytellers.',
    3, -- Food Court Amphitheater
    'Culture',
    '2025-10-12',
    '18:30',
    '20:30',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    60.00,
    80,
    65,
    false,
    ARRAY['Storytelling', 'Oral Tradition', 'Cultural'],
    'active'
),

-- Film Events
(
    'Botswana Film Festival',
    'Showcase of the best local and regional films, documentaries, and short films celebrating African cinema.',
    6, -- Cinema Hall
    'Film',
    '2025-11-01',
    '18:00',
    '22:00',
    'https://images.unsplash.com/photo-1489599833288-6d0e8b6c0ecc?w=800',
    100.00,
    150,
    140,
    true,
    ARRAY['Film Festival', 'Local Cinema', 'African Films'],
    'active'
),
(
    'Documentary Screening Night',
    'Thought-provoking documentaries about environmental conservation and wildlife in Southern Africa.',
    6, -- Cinema Hall
    'Film',
    '2025-10-18',
    '19:00',
    '21:30',
    'https://images.unsplash.com/photo-1489599833288-6d0e8b6c0ecc?w=800',
    70.00,
    120,
    110,
    false,
    ARRAY['Documentary', 'Environment', 'Wildlife'],
    'active'
);

-- Add some ticket purchases for demonstration (optional - you might want to skip this for production)
-- INSERT INTO public.ticket_purchases (
--     event_id,
--     user_id,
--     quantity,
--     total_price,
--     status
-- ) VALUES
-- (1, (SELECT id FROM auth.users LIMIT 1), 2, 500.00, 'confirmed'),
-- (3, (SELECT id FROM auth.users LIMIT 1), 1, 80.00, 'confirmed');