ALTER TABLE "public"."order" ADD COLUMN "fulfillment_token" uuid DEFAULT gen_random_uuid();
