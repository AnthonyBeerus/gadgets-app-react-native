-- Migration to add color variants support for products
-- This creates a product_variants table to store different color options

-- Create product_variants table
CREATE TABLE IF NOT EXISTS product_variants (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES product(id) ON DELETE CASCADE,
  color_name VARCHAR(50) NOT NULL, -- e.g., "Black", "Red", "Blue"
  color_hex VARCHAR(7) NOT NULL, -- e.g., "#000000", "#FF0000", "#0000FF"
  image_url TEXT, -- Optional: specific image for this color variant
  stock_quantity INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_available ON product_variants(is_available);

-- Add a unique constraint to prevent duplicate color variants for the same product
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_product_color 
ON product_variants(product_id, color_name);

-- Enable Row Level Security (RLS)
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can view product variants"
ON product_variants FOR SELECT
USING (true);

-- Create policies for authenticated users to manage variants (for shop owners)
CREATE POLICY "Authenticated users can insert variants"
ON product_variants FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update variants"
ON product_variants FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete variants"
ON product_variants FOR DELETE
TO authenticated
USING (true);

-- Add comment for documentation
COMMENT ON TABLE product_variants IS 'Stores color variants for products, allowing multiple color options per product';
COMMENT ON COLUMN product_variants.color_name IS 'Human-readable color name (e.g., Black, Red, Navy Blue)';
COMMENT ON COLUMN product_variants.color_hex IS 'Hexadecimal color code for display (e.g., #000000)';
COMMENT ON COLUMN product_variants.image_url IS 'Optional: URL to image showing this specific color variant';
