-- Create malls table
CREATE TABLE IF NOT EXISTS malls (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  location TEXT,
  image_url TEXT,
  hero_image TEXT,
  opening_hours JSONB,
  contact_phone TEXT,
  contact_email TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_physical BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add mall_id to shops table
ALTER TABLE shops ADD COLUMN IF NOT EXISTS mall_id INTEGER REFERENCES malls(id);

-- Insert Molapo Crossing as the first mall
INSERT INTO malls (
  id,
  name,
  slug,
  description,
  location,
  image_url,
  hero_image,
  opening_hours,
  contact_phone,
  contact_email,
  latitude,
  longitude,
  is_physical,
  is_featured
) VALUES (
  1,
  'Molapo Crossing',
  'molapo-crossing',
  'Premium shopping destination in Gaborone featuring top brands, dining, entertainment, and exceptional services.',
  'Gaborone, Botswana',
  'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=800',
  'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200',
  '{"monday": "09:00 - 21:00", "tuesday": "09:00 - 21:00", "wednesday": "09:00 - 21:00", "thursday": "09:00 - 21:00", "friday": "09:00 - 22:00", "saturday": "09:00 - 22:00", "sunday": "10:00 - 20:00"}'::jsonb,
  '+267 123 4567',
  'info@molapocrossing.co.bw',
  -24.6282,
  25.9231,
  true,
  true
);

-- Insert Indie Marketplace as the second mall
INSERT INTO malls (
  id,
  name,
  slug,
  description,
  location,
  image_url,
  hero_image,
  opening_hours,
  contact_phone,
  contact_email,
  latitude,
  longitude,
  is_physical,
  is_featured
) VALUES (
  2,
  'Indie Marketplace',
  'indie-marketplace',
  'Discover unique products from independent sellers and local artisans. Shop from the comfort of your home with nationwide delivery.',
  'Online - Nationwide',
  'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
  '{"monday": "24/7", "tuesday": "24/7", "wednesday": "24/7", "thursday": "24/7", "friday": "24/7", "saturday": "24/7", "sunday": "24/7"}'::jsonb,
  '+267 987 6543',
  'support@indiemarketplace.co.bw',
  NULL,
  NULL,
  false,
  true
);

-- Update existing shops to belong to Molapo Crossing
UPDATE shops SET mall_id = 1 WHERE mall_id IS NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_shops_mall_id ON shops(mall_id);
CREATE INDEX IF NOT EXISTS idx_malls_slug ON malls(slug);
CREATE INDEX IF NOT EXISTS idx_malls_is_featured ON malls(is_featured);

-- Add RLS policies for malls table
ALTER TABLE malls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Malls are viewable by everyone"
  ON malls FOR SELECT
  USING (true);

CREATE POLICY "Malls are insertable by authenticated users"
  ON malls FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Malls are updatable by authenticated users"
  ON malls FOR UPDATE
  USING (auth.role() = 'authenticated');
