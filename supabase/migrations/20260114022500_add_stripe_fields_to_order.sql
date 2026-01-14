-- Add Stripe tracking fields to the order table
-- Note: "order" is a reserved keyword, so we must quote it.

ALTER TABLE public."order"
ADD COLUMN IF NOT EXISTS payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_payment_status TEXT DEFAULT 'pending';
