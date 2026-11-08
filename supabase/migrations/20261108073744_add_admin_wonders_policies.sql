
-- Check whether the current user is an administrator.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = (SELECT auth.uid())
      AND role = 'admin'
  );
$$;

-- Allow administrators to view all wonders.
CREATE POLICY "Admins can view all wonders"
ON public.wonders
FOR SELECT
TO authenticated
USING ((SELECT public.is_admin()));

-- Allow administrators to update all wonders.
CREATE POLICY "Admins can update all wonders"
ON public.wonders
FOR UPDATE
TO authenticated
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));

-- Allow administrators to delete all wonders.
CREATE POLICY "Admins can delete all wonders"
ON public.wonders
FOR DELETE
TO authenticated
USING ((SELECT public.is_admin()));
