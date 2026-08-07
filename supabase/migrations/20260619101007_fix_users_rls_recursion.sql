BEGIN;

-- Keep role lookups out of public table policies. A SECURITY DEFINER helper
-- runs as its owner and avoids public.users policies recursively querying users.
CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.users
    WHERE id = (select auth.uid())
      AND type = 'ADMIN'
  );
$$;

GRANT USAGE ON SCHEMA private TO authenticated;
REVOKE ALL ON FUNCTION private.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.is_admin() TO authenticated;

DROP POLICY IF EXISTS "Public can view profiles" ON public.users;
DROP POLICY IF EXISTS "Users can manage own profile, Admins can manage all" ON public.users;
DROP POLICY IF EXISTS "Users and Admins can update profiles" ON public.users;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.users;

CREATE POLICY "Authenticated users can view profiles"
ON public.users
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users and Admins can update profiles"
ON public.users
FOR UPDATE
TO authenticated
USING (
  id = (select auth.uid())
  OR (select private.is_admin())
)
WITH CHECK (
  id = (select auth.uid())
  OR (select private.is_admin())
);

CREATE POLICY "Admins can delete profiles"
ON public.users
FOR DELETE
TO authenticated
USING ((select private.is_admin()));

COMMIT;
