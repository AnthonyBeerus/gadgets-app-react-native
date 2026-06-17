BEGIN;

-- 1. Re-applying indexes (Verified columns)
CREATE INDEX IF NOT EXISTS order_item_order_idx ON public.order_item("order");

CREATE INDEX IF NOT EXISTS service_booking_service_idx ON public.service_booking(service_id);

CREATE INDEX IF NOT EXISTS service_provider_user_idx ON public.service_provider(user_id);

CREATE INDEX IF NOT EXISTS service_review_service_idx ON public.service_review(service_id);
CREATE INDEX IF NOT EXISTS service_review_user_idx ON public.service_review(user_id);

-- 2. New index identified from linter
CREATE INDEX IF NOT EXISTS service_availability_service_id_idx ON public.service_availability(service_id);

COMMIT;
