BEGIN;

-- 1. DROP DUPLICATE INDEXES (Found in recent linter check)
DROP INDEX IF EXISTS public.service_booking_service_id_idx; -- Keeping service_booking_service_idx
DROP INDEX IF EXISTS public.service_review_service_id_idx;  -- Keeping service_review_service_idx

-- 2. CREATE MISSING FOREIGN KEY INDEXES
CREATE INDEX IF NOT EXISTS shop_reviews_order_idx ON public.shop_reviews(order_id);
-- Note: shop_reviews(user_id) listed as unindexed. I added 'service_review', but not 'shop_reviews'.
CREATE INDEX IF NOT EXISTS shop_reviews_user_idx ON public.shop_reviews(user_id);

CREATE INDEX IF NOT EXISTS shops_owner_idx ON public.shops(owner_id);
CREATE INDEX IF NOT EXISTS shops_mall_idx ON public.shops(mall_id);

COMMIT;
