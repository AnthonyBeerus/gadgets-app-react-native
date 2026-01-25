BEGIN;

-- Appointments
DROP POLICY IF EXISTS "Allow all appointments operations" ON public.appointments;

CREATE POLICY "Users can manage their own appointments" ON public.appointments
    FOR ALL TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Shop owners can manage appointments" ON public.appointments
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.shops WHERE id = shop_id AND owner_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM public.shops WHERE id = shop_id AND owner_id = auth.uid()));

-- Service
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.service;
DROP POLICY IF EXISTS "Enable update for auth users" ON public.service;

CREATE POLICY "Service Providers can manage their services" ON public.service
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.service_provider sp WHERE sp.id = provider_id AND sp.user_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM public.service_provider sp WHERE sp.id = provider_id AND sp.user_id = auth.uid()));

CREATE POLICY "Public can view active services" ON public.service
    FOR SELECT TO authenticated
    USING (is_active = true);

-- Service Availability
DROP POLICY IF EXISTS "Enable all operations for auth users" ON public.service_availability;

CREATE POLICY "Service Providers can manage availability" ON public.service_availability
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.service_provider sp WHERE sp.id = provider_id AND sp.user_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM public.service_provider sp WHERE sp.id = provider_id AND sp.user_id = auth.uid()));

CREATE POLICY "Public can view availability" ON public.service_availability
    FOR SELECT TO authenticated
    USING (true);

COMMIT;
