-- Fix shop-product relationship
-- This migration ensures products can be properly linked to shops

BEGIN;

-- Step 1: Add shop_id column to product table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'product' 
        AND column_name = 'shop_id'
    ) THEN
        ALTER TABLE public.product 
        ADD COLUMN shop_id BIGINT REFERENCES public.shops(id) ON DELETE SET NULL;
        
        -- Create index for better query performance
        CREATE INDEX IF NOT EXISTS idx_product_shop_id ON public.product(shop_id);
    END IF;
END $$;

-- Step 2: Update RLS policies for product table to allow shop-filtered queries
DROP POLICY IF EXISTS "Public products are viewable by everyone" ON public.product;
CREATE POLICY "Public products are viewable by everyone" 
ON public.product FOR SELECT 
USING (true);

-- Step 3: Create a view for shops with product counts (useful for listings)
CREATE OR REPLACE VIEW shops_with_product_count WITH (security_invoker = true) AS
SELECT 
    s.*,
    COUNT(p.id) as product_count
FROM public.shops s
LEFT JOIN public.product p ON p.shop_id = s.id
GROUP BY s.id;

COMMIT;

-- Note: After running this migration, you'll need to update existing products 
-- to assign them to specific shops manually or via a separate seed script
