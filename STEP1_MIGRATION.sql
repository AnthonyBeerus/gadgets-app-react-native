-- ============================================================
-- STEP 1: Run this FIRST - Add shop_id column to service_provider
-- ============================================================

-- Add shop_id column to service_provider table
ALTER TABLE "public"."service_provider"
ADD COLUMN IF NOT EXISTS "shop_id" bigint;

-- Add foreign key constraint to shops table
ALTER TABLE "public"."service_provider"
ADD CONSTRAINT "service_provider_shop_id_fkey"
FOREIGN KEY ("shop_id")
REFERENCES "public"."shops"("id")
ON DELETE CASCADE;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS "service_provider_shop_id_idx"
ON "public"."service_provider"("shop_id");

-- Add comment explaining the relationship
COMMENT ON COLUMN "public"."service_provider"."shop_id" IS 'Links the service provider to a specific shop in the mall';

-- ============================================================
-- STEP 2: Verify the column was added
-- ============================================================

SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'service_provider'
  AND column_name = 'shop_id';

-- Expected result: shop_id | bigint | YES
