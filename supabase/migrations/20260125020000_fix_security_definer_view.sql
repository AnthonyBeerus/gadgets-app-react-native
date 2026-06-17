BEGIN;

DROP VIEW IF EXISTS public.shops_with_product_count CASCADE;

CREATE OR REPLACE VIEW public.shops_with_product_count WITH (security_invoker = true) AS
SELECT 
    s.*,
    COUNT(p.id) as product_count
FROM public.shops s
LEFT JOIN public.product p ON p.shop_id = s.id
GROUP BY s.id;

COMMIT;
