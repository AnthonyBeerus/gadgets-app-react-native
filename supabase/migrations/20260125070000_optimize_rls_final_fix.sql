BEGIN;

-- FIX: Multiple Permissive Policies on public.events (INSERT collision)
-- Dropping conflicting policies to creating unified/specific ones.
DROP POLICY IF EXISTS "Admins can insert events" ON public.events;
DROP POLICY IF EXISTS "Shop owners can manage events" ON public.events;

-- 1. SELECT (Restore public access)
-- Note: 'authenticated' role is used here to match general app pattern, ensuring only logged-in users read.
-- If truly public (unauthenticated), we'd use 'public', but linter warnings were about 'authenticated' role.
CREATE POLICY "Public can view events" ON public.events 
    FOR SELECT TO authenticated 
    USING (true);

-- 2. INSERT (Consolidated Admin + Shop Owner)
CREATE POLICY "Admins and Shop Owners can insert events" ON public.events
    FOR INSERT TO authenticated
    WITH CHECK (
        ((SELECT type FROM public.users WHERE id = (select auth.uid())) = 'ADMIN')
        OR
        (EXISTS (SELECT 1 FROM public.shops WHERE id = shop_id AND owner_id = (select auth.uid())))
    );

-- 3. UPDATE (Shop Owner only)
CREATE POLICY "Shop owners can update events" ON public.events
    FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.shops WHERE id = shop_id AND owner_id = (select auth.uid())))
    WITH CHECK (EXISTS (SELECT 1 FROM public.shops WHERE id = shop_id AND owner_id = (select auth.uid())));

-- 4. DELETE (Shop Owner only)
CREATE POLICY "Shop owners can delete events" ON public.events
    FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.shops WHERE id = shop_id AND owner_id = (select auth.uid())));

COMMIT;
