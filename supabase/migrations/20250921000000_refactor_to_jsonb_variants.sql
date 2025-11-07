-- Migration: Refactor color variants to JSONB column in product table
-- This consolidates variant data into the product row for simpler architecture

BEGIN;

-- Drop the old product_variants table if it exists
DROP TABLE IF EXISTS product_variants CASCADE;

-- Add color_variants JSONB column to product table
ALTER TABLE product 
ADD COLUMN IF NOT EXISTS color_variants JSONB DEFAULT '[]'::JSONB;

-- Add a check constraint to ensure color_variants is always an array
ALTER TABLE product
ADD CONSTRAINT color_variants_is_array 
CHECK (jsonb_typeof(color_variants) = 'array');

-- Create a GIN index for efficient querying of JSONB data
CREATE INDEX IF NOT EXISTS idx_product_color_variants 
ON product USING GIN (color_variants);

-- Add a comment explaining the structure
COMMENT ON COLUMN product.color_variants IS 
'JSONB array of color variants. Each variant should have: color_name (string), color_hex (string), image_url (string), stock_quantity (number), is_available (boolean). Example: [{"color_name": "Black", "color_hex": "#000000", "image_url": "https://...", "stock_quantity": 25, "is_available": true}]';

COMMIT;
