ALTER TABLE "public"."order" ADD COLUMN IF NOT EXISTS "stripe_payment_intent_id" text;
CREATE INDEX IF NOT EXISTS idx_order_stripe_pi ON "public"."order" ("stripe_payment_intent_id");
