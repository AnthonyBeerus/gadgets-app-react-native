-- Add shop_id to service_provider table to link providers to specific shops
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
