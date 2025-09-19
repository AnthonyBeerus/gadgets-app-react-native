-- Migration to add shop products support
-- Add shop_id column to products table to link products to specific shops

-- Add shop_id column to existing product table (only if it doesn't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'product' AND column_name = 'shop_id'
  ) THEN
    ALTER TABLE product ADD COLUMN shop_id INTEGER;
  END IF;
END $$;

-- Add foreign key constraint (only if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'product_shop_id_fkey'
  ) THEN
    ALTER TABLE product 
    ADD CONSTRAINT product_shop_id_fkey 
    FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create index for better query performance (only if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_product_shop_id'
  ) THEN
    CREATE INDEX idx_product_shop_id ON product(shop_id);
  END IF;
END $$;

-- Optional: Create a shop_products junction table (alternative approach)
-- This would be useful if products can belong to multiple shops
/*
CREATE TABLE shop_products (
  id SERIAL PRIMARY KEY,
  shop_id INTEGER NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES product(id) ON DELETE CASCADE,
  is_featured BOOLEAN DEFAULT FALSE,
  stock_quantity INTEGER DEFAULT 0,
  custom_price DECIMAL(10,2), -- Allow shops to override product price
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(shop_id, product_id)
);

CREATE INDEX idx_shop_products_shop_id ON shop_products(shop_id);
CREATE INDEX idx_shop_products_product_id ON shop_products(product_id);
*/