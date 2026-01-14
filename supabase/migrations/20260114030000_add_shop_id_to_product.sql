-- Add shop_id to product table to link products to specific shops
ALTER TABLE public.product
ADD COLUMN IF NOT EXISTS shop_id BIGINT REFERENCES public.shops(id);

-- Optional: Create an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_product_shop_id ON public.product(shop_id);
