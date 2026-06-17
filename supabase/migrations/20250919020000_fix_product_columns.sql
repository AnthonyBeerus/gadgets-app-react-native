-- Migration to add heroImage column if it doesn't exist
-- This will ensure the product table has all necessary columns

BEGIN;

-- Add heroImage column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'product' AND column_name = 'heroImage'
  ) THEN
    ALTER TABLE product ADD COLUMN "heroImage" TEXT;
  END IF;
END $$;

-- Add imagesUrl column if it doesn't exist  
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'product' AND column_name = 'imagesUrl'
  ) THEN
    ALTER TABLE product ADD COLUMN "imagesUrl" TEXT[];
  END IF;
END $$;

-- Add maxQuantity column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'product' AND column_name = 'maxQuantity'
  ) THEN
    ALTER TABLE product ADD COLUMN "maxQuantity" INTEGER DEFAULT 0;
  END IF;
END $$;

COMMIT;