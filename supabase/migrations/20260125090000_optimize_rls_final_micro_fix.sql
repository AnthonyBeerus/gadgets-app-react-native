BEGIN;
-- Drop final duplicate index found by linter
DROP INDEX IF EXISTS public.idx_shops_mall_id;
COMMIT;
