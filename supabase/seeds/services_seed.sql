-- Seed Data for Services Schema
-- Date: 2025-09-19
-- Description: Replace existing service data with real Molapo Crossing Mall businesses

-- Clear existing service data (in correct order due to foreign key constraints)
DELETE FROM "public"."service_availability";
DELETE FROM "public"."service_review";
DELETE FROM "public"."service_booking";
DELETE FROM "public"."service";
DELETE FROM "public"."service_provider";
DELETE FROM "public"."service_category";

-- Reset auto-increment sequences to start from 1
ALTER SEQUENCE service_category_id_seq RESTART WITH 1;
ALTER SEQUENCE service_provider_id_seq RESTART WITH 1;
ALTER SEQUENCE service_id_seq RESTART WITH 1;
ALTER SEQUENCE service_booking_id_seq RESTART WITH 1;
ALTER SEQUENCE service_review_id_seq RESTART WITH 1;
ALTER SEQUENCE service_availability_id_seq RESTART WITH 1;

-- Insert Service Categories - Based on Molapo Crossing Mall Services
INSERT INTO "public"."service_category" ("name", "description", "icon", "color", "slug") VALUES
('Fitness & Gym', 'Professional gym equipment, personal training, fitness classes', 'fitness-center', '#4ECDC4', 'fitness-gym'),
('Sports Training', 'Professional sports coaching and training academies', 'sports-soccer', '#45B7D1', 'sports-training'),
('Football & Soccer', 'Soccer fields, football training, tournaments', 'sports-football', '#28A745', 'football-soccer'),
('Motorsports', 'Motorsports equipment, clothing, and racing gear', 'directions-car', '#DC3545', 'motorsports'),
('Dance & Entertainment', 'Dance classes, choreography, entertainment services', 'music-note', '#FFC107', 'dance-entertainment'),
('Healthcare', 'Medical services, physiotherapy, health consultations', 'local-hospital', '#96CEB4', 'healthcare');

-- Insert Service Providers - Real Businesses from Molapo Crossing Mall
INSERT INTO "public"."service_provider" ("name", "email", "phone", "address", "description", "rating", "total_reviews", "is_verified") VALUES
-- Fitness & Gym Providers
('Jacks Gym', 'info@jacksgym.co.bw', '+267 391 0060', 'Shop 108, Ground Floor, Molapo Crossing Mall', 'Professional gym facility with modern equipment and experienced trainers', 4.7, 89, true),

-- Sports Training Providers  
('Propellers Sports', 'contact@propellerssports.co.bw', '+267 75 757 070', 'Shop 108 - Jacks Gym, Molapo Crossing Mall', 'Sports Academy offering professional training in various sports disciplines', 4.8, 124, true),

-- Football & Soccer Providers
('Super5 Football', 'bookings@super5football.co.bw', '+267 71 788 290', 'South Parking, Molapo Crossing Mall', 'Professional soccer fields for training, matches, and tournaments', 4.6, 156, true),

-- Motorsports Providers
('Onius Motorsports', 'gear@oniusmotorsports.co.bw', '+267 74 641 121', 'Shop 18, First Floor, Molapo Crossing Mall', 'Motorsports clothing store and racing gear specialists', 4.5, 43, true),

-- Dance & Entertainment Providers
('Mike N Msti Dance Company', 'dance@mikenmsticompany.co.bw', '+267 72 461 555', 'Ground Floor, Molapo Crossing Mall', 'Professional dance company offering classes and choreography services', 4.9, 78, true),

-- Healthcare Providers
('Grace Physio', 'therapy@gracephysio.co.bw', '+267 74 351 847', 'Shop 108A, First Floor, Molapo Crossing Mall', 'Professional physiotherapy and rehabilitation services', 4.8, 167, true),
('Health Alt. Medical Centre', 'appointments@healthalt.co.bw', '+267 371 0045', 'Shop 33, First Floor, Molapo Crossing Mall', 'Comprehensive medical centre offering various healthcare services', 4.7, 203, true);

-- Insert Services - Based on Real Molapo Crossing Mall Businesses
INSERT INTO "public"."service" ("name", "description", "category_id", "provider_id", "price", "duration_minutes", "slug", "rating", "total_reviews") VALUES

-- Fitness & Gym Services (Category ID: 1) - Jacks Gym (Provider ID: 1)
('Gym Day Pass', 'Full day access to gym equipment and facilities', 1, 1, 50.00, 480, 'gym-day-pass', 4.7, 89),
('Personal Training Session', 'One-on-one training with certified personal trainer', 1, 1, 150.00, 60, 'personal-training-session', 4.8, 124),
('Group Fitness Class', 'High-energy group fitness classes including aerobics and strength training', 1, 1, 75.00, 45, 'group-fitness-class', 4.6, 67),
('Monthly Gym Membership', 'Unlimited access to gym facilities for one month', 1, 1, 400.00, 43800, 'monthly-gym-membership', 4.7, 156),

-- Sports Training Services (Category ID: 2) - Propellers Sports (Provider ID: 2)
('Football Training', 'Professional football training and skill development', 2, 2, 100.00, 90, 'football-training', 4.8, 78),
('Basketball Coaching', 'Basketball skills training and game strategy coaching', 2, 2, 120.00, 90, 'basketball-coaching', 4.7, 45),
('Athletics Training', 'Track and field training for various athletic disciplines', 2, 2, 110.00, 90, 'athletics-training', 4.8, 34),
('Sports Performance Assessment', 'Comprehensive fitness and performance evaluation for athletes', 2, 2, 200.00, 60, 'sports-performance-assessment', 4.9, 23),

-- Football & Soccer Services (Category ID: 3) - Super5 Football (Provider ID: 3)
('Soccer Field Rental', 'Professional soccer field rental for matches and training', 3, 3, 200.00, 120, 'soccer-field-rental', 4.6, 89),
('Youth Soccer Training', 'Soccer training program designed for young players', 3, 3, 80.00, 90, 'youth-soccer-training', 4.7, 134),
('Adult Soccer League', 'Competitive soccer league for adult players', 3, 3, 150.00, 90, 'adult-soccer-league', 4.5, 67),
('Soccer Tournament Hosting', 'Professional tournament organization and field management', 3, 3, 500.00, 480, 'soccer-tournament-hosting', 4.8, 45),

-- Motorsports Services (Category ID: 4) - Onius Motorsports (Provider ID: 4)
('Racing Gear Consultation', 'Expert consultation on motorsports equipment and safety gear', 4, 4, 100.00, 30, 'racing-gear-consultation', 4.5, 23),
('Custom Racing Suit Fitting', 'Professional fitting and customization of racing suits', 4, 4, 250.00, 60, 'custom-racing-suit-fitting', 4.6, 18),
('Motorsports Equipment Rental', 'Rental of professional motorsports equipment and gear', 4, 4, 300.00, 480, 'motorsports-equipment-rental', 4.4, 12),

-- Dance & Entertainment Services (Category ID: 5) - Mike N Msti Dance Company (Provider ID: 5)
('Dance Lessons', 'Professional dance instruction in various styles', 5, 5, 80.00, 60, 'dance-lessons', 4.9, 78),
('Choreography Services', 'Custom choreography for events, shows, and performances', 5, 5, 300.00, 120, 'choreography-services', 4.8, 34),
('Event Entertainment', 'Professional dance performances for events and celebrations', 5, 5, 500.00, 180, 'event-entertainment', 4.9, 45),
('Dance Workshop', 'Intensive dance workshops for skill development', 5, 5, 150.00, 180, 'dance-workshop', 4.8, 23),

-- Healthcare Services (Category ID: 6) - Grace Physio (Provider ID: 6)
('Physiotherapy Session', 'Professional physiotherapy treatment and rehabilitation', 6, 6, 200.00, 60, 'physiotherapy-session', 4.8, 167),
('Sports Injury Treatment', 'Specialized treatment for sports-related injuries', 6, 6, 250.00, 75, 'sports-injury-treatment', 4.9, 89),
('Rehabilitation Program', 'Comprehensive rehabilitation program for injury recovery', 6, 6, 400.00, 90, 'rehabilitation-program', 4.8, 78),

-- Healthcare Services (Category ID: 6) - Health Alt. Medical Centre (Provider ID: 7)
('General Medical Consultation', 'Comprehensive medical examination and consultation', 6, 7, 150.00, 30, 'general-medical-consultation', 4.7, 203),
('Health Screening', 'Complete health screening and wellness assessment', 6, 7, 300.00, 60, 'health-screening', 4.6, 134),
('Specialist Consultation', 'Consultation with medical specialists', 6, 7, 250.00, 45, 'specialist-consultation', 4.8, 89);

-- Insert Sample Service Availability 
-- Most services available Monday to Friday (1-5), 8 AM to 6 PM
INSERT INTO "public"."service_availability" ("provider_id", "day_of_week", "start_time", "end_time") 
SELECT 
    p.id as provider_id,
    dow as day_of_week,
    '08:00'::time as start_time,
    '18:00'::time as end_time
FROM "public"."service_provider" p
CROSS JOIN generate_series(1, 5) as dow
WHERE p.id IN (1, 2, 5, 6, 7); -- Gym, Sports Training, Dance, Healthcare providers

-- Soccer fields available 7 days a week (0-6), 6 AM to 10 PM
INSERT INTO "public"."service_availability" ("provider_id", "day_of_week", "start_time", "end_time") 
SELECT 
    3 as provider_id, -- Super5 Football
    dow as day_of_week,
    '06:00'::time as start_time,
    '22:00'::time as end_time
FROM generate_series(0, 6) as dow;

-- Motorsports store available Monday to Saturday (1-6), 9 AM to 6 PM
INSERT INTO "public"."service_availability" ("provider_id", "day_of_week", "start_time", "end_time") 
SELECT 
    4 as provider_id, -- Onius Motorsports
    dow as day_of_week,
    '09:00'::time as start_time,
    '18:00'::time as end_time
FROM generate_series(1, 6) as dow;

-- Weekend availability for gym and sports training (Saturday=6, Sunday=0), 8 AM to 4 PM
INSERT INTO "public"."service_availability" ("provider_id", "day_of_week", "start_time", "end_time") 
SELECT 
    p.id as provider_id,
    dow as day_of_week,
    '08:00'::time as start_time,
    '16:00'::time as end_time
FROM "public"."service_provider" p
CROSS JOIN (VALUES (0), (6)) as t(dow)
WHERE p.id IN (1, 2, 5); -- Gym, Sports Training, Dance Company