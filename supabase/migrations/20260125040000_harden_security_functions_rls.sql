BEGIN;

-- 1. Fix Mutable Search Paths
ALTER FUNCTION public.create_dev_merchant() SET search_path = public, pg_catalog;
ALTER FUNCTION public.decrement_product_quantity(bigint, bigint) SET search_path = public, pg_catalog;
ALTER FUNCTION public.handle_new_user() SET search_path = public, pg_catalog;
ALTER FUNCTION public.update_available_tickets() SET search_path = public, pg_catalog;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public, pg_catalog;
ALTER FUNCTION public.update_shop_rating() SET search_path = public, pg_catalog;

-- 2. Tighten RLS Policies

-- Public Users (Profiles)
DROP POLICY IF EXISTS "Enable Update for auth users" ON public.users;
CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- Order
DROP POLICY IF EXISTS "Allow all operations for auth users" ON public.order;
CREATE POLICY "Users can manage their own orders" ON public.order
    FOR ALL TO authenticated
    USING ("user" = auth.uid())
    WITH CHECK ("user" = auth.uid());

-- Order Item
DROP POLICY IF EXISTS "Allow all operations for auth users" ON public.order_item;
CREATE POLICY "Users can manage their own order items" ON public.order_item
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public."order" WHERE id = order_item."order" AND "user" = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM public."order" WHERE id = order_item."order" AND "user" = auth.uid()));

-- Product
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.product;
CREATE POLICY "Shop owners can insert products" ON public.product
    FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM public.shops WHERE id = shop_id AND owner_id = auth.uid()));

-- Shop Reviews
DROP POLICY IF EXISTS "Allow all shop reviews operations" ON public.shop_reviews;
CREATE POLICY "Users can manage their own reviews" ON public.shop_reviews
    FOR ALL TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Challenges (assuming shop_id column per initial check, inferred owner check)
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.challenges;
-- Safe fallback if owner_id link exists via join, otherwise just restrict to shop owners
CREATE POLICY "Shop owners can insert challenges" ON public.challenges
    FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM public.shops WHERE id = shop_id AND owner_id = auth.uid()));

-- Service Provider
DROP POLICY IF EXISTS "Enable update for auth users" ON public.service_provider;
CREATE POLICY "Service providers can update their own profile" ON public.service_provider
    FOR UPDATE TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Delivery Orders
DROP POLICY IF EXISTS "Allow all delivery orders operations" ON public.delivery_orders;
CREATE POLICY "Shop owners can view delivery orders" ON public.delivery_orders
    FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM public.shops WHERE id = shop_id AND owner_id = auth.uid()));

-- Events
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.events;
CREATE POLICY "Admins can insert events" ON public.events
    FOR INSERT TO authenticated
    WITH CHECK ((SELECT type FROM public.users WHERE id = auth.uid()) = 'ADMIN');

COMMIT;
