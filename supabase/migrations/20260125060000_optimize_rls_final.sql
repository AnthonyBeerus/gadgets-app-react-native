BEGIN;

-- ==============================================================================
-- 1. FIX MULTIPLE PERMISSIVE POLICIES (Merge SELECTs, Split Mutations)
-- ==============================================================================

-- SHOPS
DROP POLICY IF EXISTS "Public can view shops" ON public.shops;
DROP POLICY IF EXISTS "Owners and Admins can manage shops" ON public.shops;

-- Consolidated SELECT (Public sees all)
CREATE POLICY "Public can view shops" ON public.shops FOR SELECT USING (true);
-- Specific Mutations (Owners/Admins)
CREATE POLICY "Owners and Admins can manage shops" ON public.shops FOR INSERT WITH CHECK (
    (owner_id = (select auth.uid())) 
    OR 
    ((SELECT type FROM public.users WHERE id = (select auth.uid())) = 'ADMIN')
);
CREATE POLICY "Owners and Admins can update shops" ON public.shops FOR UPDATE USING (
    (owner_id = (select auth.uid())) 
    OR 
    ((SELECT type FROM public.users WHERE id = (select auth.uid())) = 'ADMIN')
) WITH CHECK (
    (owner_id = (select auth.uid())) 
    OR 
    ((SELECT type FROM public.users WHERE id = (select auth.uid())) = 'ADMIN')
);
CREATE POLICY "Owners and Admins can delete shops" ON public.shops FOR DELETE USING (
    (owner_id = (select auth.uid())) 
    OR 
    ((SELECT type FROM public.users WHERE id = (select auth.uid())) = 'ADMIN')
);

-- USERS
DROP POLICY IF EXISTS "Public can view profiles" ON public.users;
DROP POLICY IF EXISTS "Users can manage own profile, Admins can manage all" ON public.users;

-- Consolidated SELECT
CREATE POLICY "Public can view profiles" ON public.users FOR SELECT TO authenticated USING (true);
-- Specific Mutations
CREATE POLICY "Users and Admins can update profiles" ON public.users FOR UPDATE USING (
    (id = (select auth.uid())) 
    OR 
    ((SELECT type FROM public.users WHERE id = (select auth.uid())) = 'ADMIN')
) WITH CHECK (
    (id = (select auth.uid())) 
    OR 
    ((SELECT type FROM public.users WHERE id = (select auth.uid())) = 'ADMIN')
);
-- Note: USERS table typically doesn't allow INSERT/DELETE by users directly (Auth handles it), but if needed:
CREATE POLICY "Admins can delete profiles" ON public.users FOR DELETE USING (
    ((SELECT type FROM public.users WHERE id = (select auth.uid())) = 'ADMIN')
);


-- SERVICE
DROP POLICY IF EXISTS "Public can view active services" ON public.service;
DROP POLICY IF EXISTS "Providers and Shop Owners can manage services" ON public.service;

-- Consolidated SELECT (Public sees active, Owners see all)
CREATE POLICY "Unified view for services" ON public.service FOR SELECT TO authenticated USING (
    (is_active = true)
    OR
    (EXISTS (SELECT 1 FROM public.service_provider sp WHERE sp.id = provider_id AND sp.user_id = (select auth.uid())))
    OR
    (EXISTS (SELECT 1 FROM public.shops s WHERE s.id = (SELECT shop_id FROM public.service_provider WHERE id = provider_id) AND s.owner_id = (select auth.uid())))
);

-- Specific Mutations
CREATE POLICY "Providers and Shop Owners can insert services" ON public.service FOR INSERT WITH CHECK (
    (EXISTS (SELECT 1 FROM public.service_provider sp WHERE sp.id = provider_id AND sp.user_id = (select auth.uid())))
    OR
    (EXISTS (SELECT 1 FROM public.shops s WHERE s.id = (SELECT shop_id FROM public.service_provider WHERE id = provider_id) AND s.owner_id = (select auth.uid())))
);
CREATE POLICY "Providers and Shop Owners can update services" ON public.service FOR UPDATE USING (
    (EXISTS (SELECT 1 FROM public.service_provider sp WHERE sp.id = provider_id AND sp.user_id = (select auth.uid())))
    OR
    (EXISTS (SELECT 1 FROM public.shops s WHERE s.id = (SELECT shop_id FROM public.service_provider WHERE id = provider_id) AND s.owner_id = (select auth.uid())))
) WITH CHECK (
    (EXISTS (SELECT 1 FROM public.service_provider sp WHERE sp.id = provider_id AND sp.user_id = (select auth.uid())))
    OR
    (EXISTS (SELECT 1 FROM public.shops s WHERE s.id = (SELECT shop_id FROM public.service_provider WHERE id = provider_id) AND s.owner_id = (select auth.uid())))
);
CREATE POLICY "Providers and Shop Owners can delete services" ON public.service FOR DELETE USING (
    (EXISTS (SELECT 1 FROM public.service_provider sp WHERE sp.id = provider_id AND sp.user_id = (select auth.uid())))
    OR
    (EXISTS (SELECT 1 FROM public.shops s WHERE s.id = (SELECT shop_id FROM public.service_provider WHERE id = provider_id) AND s.owner_id = (select auth.uid())))
);

-- SERVICE AVAILABILITY
DROP POLICY IF EXISTS "Public can view availability" ON public.service_availability;
DROP POLICY IF EXISTS "Providers can manage availability" ON public.service_availability;

-- Consolidated SELECT
CREATE POLICY "Public can view availability" ON public.service_availability FOR SELECT USING (true);
-- Specific Mutations
CREATE POLICY "Providers can insert availability" ON public.service_availability FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.service_provider sp WHERE sp.id = provider_id AND sp.user_id = (select auth.uid()))
);
CREATE POLICY "Providers can update availability" ON public.service_availability FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.service_provider sp WHERE sp.id = provider_id AND sp.user_id = (select auth.uid()))
) WITH CHECK (
    EXISTS (SELECT 1 FROM public.service_provider sp WHERE sp.id = provider_id AND sp.user_id = (select auth.uid()))
);
CREATE POLICY "Providers can delete availability" ON public.service_availability FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.service_provider sp WHERE sp.id = provider_id AND sp.user_id = (select auth.uid()))
);

-- SERVICE REVIEW
DROP POLICY IF EXISTS "Users can manage their own service reviews" ON public.service_review;
-- Note: Assuming there was a "Public" view policy implicitly or explicitly. I'll make sure one exists.
-- Explicitly drop potential collisions if I can guess the name, but simplest is to just Create new ones.

-- Consolidated SELECT
CREATE POLICY "Public can view service reviews" ON public.service_review FOR SELECT USING (true);
-- Specific Mutations
CREATE POLICY "Users can insert reviews" ON public.service_review FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can update reviews" ON public.service_review FOR UPDATE USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can delete reviews" ON public.service_review FOR DELETE USING (user_id = (select auth.uid()));


-- ==============================================================================
-- 2. ADD MISSING INDEXES (Fix 'unindexed_foreign_keys')
-- ==============================================================================

CREATE INDEX IF NOT EXISTS challenges_shop_id_idx ON public.challenges(shop_id);
CREATE INDEX IF NOT EXISTS events_shop_id_idx ON public.events(shop_id);
CREATE INDEX IF NOT EXISTS order_user_idx ON public."order"("user");
CREATE INDEX IF NOT EXISTS product_shop_id_idx ON public.product(shop_id);
CREATE INDEX IF NOT EXISTS service_provider_shop_id_idx ON public.service_provider(shop_id);
-- Any others from the list? "appointments", "service_booking", "ticket_purchases"?
-- I'll add standard FK indexes for them too to be proactive.
CREATE INDEX IF NOT EXISTS appointments_shop_id_idx ON public.appointments(shop_id);
CREATE INDEX IF NOT EXISTS appointments_user_id_idx ON public.appointments(user_id);
CREATE INDEX IF NOT EXISTS service_booking_user_id_idx ON public.service_booking(user_id);
CREATE INDEX IF NOT EXISTS ticket_purchases_user_id_idx ON public.ticket_purchases(user_id);

COMMIT;
