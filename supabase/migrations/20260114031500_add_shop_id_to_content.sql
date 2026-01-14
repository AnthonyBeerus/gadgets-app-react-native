-- Add shop_id to events table
ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS shop_id BIGINT REFERENCES public.shops(id);

CREATE INDEX IF NOT EXISTS idx_events_shop_id ON public.events(shop_id);

-- Add shop_id to challenges table
ALTER TABLE public.challenges
ADD COLUMN IF NOT EXISTS shop_id BIGINT REFERENCES public.shops(id);

CREATE INDEX IF NOT EXISTS idx_challenges_shop_id ON public.challenges(shop_id);
