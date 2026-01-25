BEGIN;

-- ==============================================================================
-- 1. DROP DUPLICATE INDEXES
-- ==============================================================================
-- Dropping the 'idx_' prefix versions in favor of '_idx' suffix convention
DROP INDEX IF EXISTS public.idx_appointments_shop_id;
DROP INDEX IF EXISTS public.idx_appointments_user_id;
DROP INDEX IF EXISTS public.idx_product_shop_id;
DROP INDEX IF EXISTS public.idx_ticket_purchases_user_id;

-- ==============================================================================
-- 2. CREATE MISSING INDEXES (Corrected Column Names)
-- ==============================================================================
CREATE INDEX IF NOT EXISTS order_item_product_idx ON public.order_item(product);
CREATE INDEX IF NOT EXISTS product_category_idx ON public.product(category);

-- ==============================================================================
-- 3. DROP REDUNDANT POLICIES (Fixing 'Multiple Permissive Policies')
-- ==============================================================================
-- These legacy policies overlap with the new optimized ones we added.

-- CATEGORY
DROP POLICY IF EXISTS "Enable read access for all users" ON public.category;

-- CHALLENGES
DROP POLICY IF EXISTS "Enable read access for all users" ON public.challenges;

-- EVENTS
DROP POLICY IF EXISTS "Events are viewable by everyone" ON public.events;

-- MALLS
DROP POLICY IF EXISTS "Malls are viewable by everyone" ON public.malls;

-- PRODUCT
DROP POLICY IF EXISTS "Enable read access for all users" ON public.product;

-- SERVICE_CATEGORY
DROP POLICY IF EXISTS "Enable read access for all users" ON public.service_category;

-- SERVICE_PROVIDER
DROP POLICY IF EXISTS "Enable read access for all users" ON public.service_provider;

-- SERVICE_REVIEW
DROP POLICY IF EXISTS "Enable read access for all users" ON public.service_review;

-- ==============================================================================
-- 4. CONSOLIDATE UPDATES (Service Provider)
-- ==============================================================================
-- Merge Admin and Provider update logic to remove overlap warning
DROP POLICY IF EXISTS "Admins can insert/delete providers" ON public.service_provider;
DROP POLICY IF EXISTS "Service providers can update their own profile" ON public.service_provider;

-- Split Admin permissions
CREATE POLICY "Admins can insert and delete providers" ON public.service_provider
    FOR INSERT WITH CHECK ((SELECT type FROM public.users WHERE id = (select auth.uid())) = 'ADMIN');
    
CREATE POLICY "Admins can delete providers" ON public.service_provider
    FOR DELETE USING ((SELECT type FROM public.users WHERE id = (select auth.uid())) = 'ADMIN');

-- Consolidated Update
CREATE POLICY "Admins and Providers can update profile" ON public.service_provider
    FOR UPDATE TO authenticated
    USING (
         (user_id = (select auth.uid()))
         OR
         ((SELECT type FROM public.users WHERE id = (select auth.uid())) = 'ADMIN')
    )
    WITH CHECK (
         (user_id = (select auth.uid()))
         OR
         ((SELECT type FROM public.users WHERE id = (select auth.uid())) = 'ADMIN')
    );

COMMIT;
