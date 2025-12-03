-- Seed Data for Challenges based on Shops

INSERT INTO public.challenges (title, description, brand_name, reward, deadline, participants_count, image_url, requirements, status, type, ai_allowed, is_premium, entry_fee, category) VALUES
-- Sefalana (Grocery)
('Grocery Haul Challenge', 'Show us your weekly grocery haul from Sefalana! Highlight your favorite local products.', 'Sefalana', 'P500 Shopping Voucher', '2025-12-31', 45, 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800', ARRAY['Must show Sefalana branding', 'Highlight at least 3 items', 'Video or Photo'], 'active', 'free', false, false, null, 'Lifestyle'),

-- Bartender (Drinks)
('Mixology Master', 'Create the ultimate cocktail using supplies from Bartender. Creativity is key!', 'Bartender', 'Premium Cocktail Kit', '2025-11-30', 28, 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800', ARRAY['Use Bartender supplies', 'Share the recipe', 'Aesthetic presentation'], 'active', 'paid', false, false, 50, 'Food & Drink'),

-- Onius Motorsport Clothing (Fashion/Auto)
('Race Day Style', 'Show off your best motorsport outfit from Onius. Best look wins!', 'Onius Motorsport', 'P1000 Store Credit', '2025-12-15', 89, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800', ARRAY['Wear Onius clothing', 'Motorsport theme', 'High energy'], 'active', 'free', true, false, null, 'Fashion'),

-- Pinkiees Boutique (Fashion)
('Chic & Trendy', 'Style a complete outfit using pieces from Pinkiees Boutique. Inspire us!', 'Pinkiees Boutique', 'Fashion Photoshoot', '2025-12-20', 112, 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800', ARRAY['Full outfit from Pinkiees', 'Tag @pinkiees_boutique', 'Street style'], 'active', 'free', true, false, null, 'Fashion'),

-- Viva Computers (Tech)
('Ultimate Desk Setup', 'Showcase your productivity or gaming setup featuring gear from Viva Computers.', 'Viva Computers', 'Gaming Headset', '2026-01-10', 230, 'https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=800', ARRAY['List specs', 'Show Viva Computers product', 'Clean setup'], 'active', 'subscriber', false, true, null, 'Tech'),

-- HairStranz (Beauty)
('Hair Transformation', 'Post your before and after look from HairStranz. We love a glow up!', 'HairStranz', 'Free Hair Treatment', '2025-11-25', 67, 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800', ARRAY['Before & After photos', 'Tag stylist', 'Review service'], 'active', 'free', false, false, null, 'Beauty'),

-- Dros (Food)
('Steak Night Delight', 'Share your dining experience at Dros. What''s on your plate?', 'Dros', 'Dinner for Two', '2025-12-05', 156, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', ARRAY['Food photography', 'Tag location', 'Honest review'], 'active', 'free', false, false, null, 'Food & Drink'),

-- Cappello (Food)
('Pizza Perfection', 'Capture the perfect slice at Cappello. Cheesy goodness awaits!', 'Cappello', 'P300 Meal Voucher', '2025-12-10', 98, 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', ARRAY['Creative angle', 'Mention favorite topping', 'Share with friends'], 'active', 'free', false, false, null, 'Food & Drink'),

-- Nails by Thato (Beauty)
('Nail Artistry', 'Flaunt your fresh set from Nails by Thato. intricate designs get bonus points!', 'Nails by Thato', 'Free Refill', '2025-11-28', 74, 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800', ARRAY['Close up shot', 'Tag artist', 'Clean background'], 'active', 'free', false, false, null, 'Beauty'),

-- Mma Kabo''s Kitchen (Food)
('Traditional Taste', 'Celebrate local flavor! Post a photo of your meal from Mma Kabo''s Kitchen.', 'Mma Kabo''s Kitchen', 'Family Feast Platter', '2025-12-12', 134, 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800', ARRAY['Traditional dish', 'Appetizing shot', 'Love local'], 'active', 'free', false, false, null, 'Food & Drink'),

-- Shine Africa Travels (Travel)
('Dream Destination', 'Create a mood board or video of your dream trip planned with Shine Africa Travels.', 'Shine Africa Travels', 'Weekend Getaway', '2026-02-01', 310, 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800', ARRAY['Travel inspiration', 'Tag Shine Africa', 'Creative edit'], 'upcoming', 'subscriber', true, true, null, 'Travel'),

-- Tuelie''s Corner (Fashion)
('Vintage Vibes', 'Style a vintage piece from Tuelie''s Corner. Old school cool.', 'Tuelie''s Corner', 'Vintage Accessory', '2025-12-08', 55, 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800', ARRAY['Vintage aesthetic', 'Outfit details', 'Retro filter'], 'active', 'paid', false, false, 25, 'Fashion');
