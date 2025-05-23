-- Fix Infinite recursion in user_tenants policies (second attempt)

-- Drop all existing policies on user_tenants to start clean
DROP POLICY IF EXISTS "Users can view their own tenant memberships fixed" ON public.user_tenants;
DROP POLICY IF EXISTS "Admins can view tenant memberships" ON public.user_tenants;
DROP POLICY IF EXISTS "Admins can manage user_tenants" ON public.user_tenants;
DROP POLICY IF EXISTS "Admins can update user_tenants" ON public.user_tenants;
DROP POLICY IF EXISTS "Admins can delete user_tenants" ON public.user_tenants;

-- Create a temporary helper function to avoid self-reference in RLS policies
CREATE OR REPLACE FUNCTION public.get_user_admin_tenants(user_uid UUID)
RETURNS SETOF UUID
LANGUAGE SQL SECURITY DEFINER
STABLE
AS $$
    SELECT tenant_id
    FROM public.user_tenants
    WHERE user_id = user_uid AND role = 'admin';
$$;

-- Create a temporary helper function to check if a user is an admin of a tenant
CREATE OR REPLACE FUNCTION public.is_tenant_admin(tenant_uid UUID)
RETURNS BOOLEAN
LANGUAGE SQL SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_tenants
        WHERE user_id = auth.uid() AND tenant_id = tenant_uid AND role = 'admin'
    );
$$;

-- Create new policies using the helper functions

-- 1. Users can view their own tenant memberships
CREATE POLICY "Users can view own memberships"
ON public.user_tenants
FOR SELECT
TO authenticated
USING (
    user_id = auth.uid()
);

-- 2. Tenant admins can view all user memberships for their tenants
CREATE POLICY "Admins can view all tenant memberships"
ON public.user_tenants
FOR SELECT
TO authenticated
USING (
    tenant_id IN (SELECT public.get_user_admin_tenants(auth.uid()))
);

-- 3. Tenant admins can insert new user-tenant relations for their tenants
CREATE POLICY "Admins can insert tenant memberships"
ON public.user_tenants
FOR INSERT
TO authenticated
WITH CHECK (
    tenant_id IN (SELECT public.get_user_admin_tenants(auth.uid()))
);

-- 4. Tenant admins can update user-tenant relations for their tenants
CREATE POLICY "Admins can update tenant memberships"
ON public.user_tenants
FOR UPDATE
TO authenticated
USING (
    tenant_id IN (SELECT public.get_user_admin_tenants(auth.uid()))
)
WITH CHECK (
    tenant_id IN (SELECT public.get_user_admin_tenants(auth.uid()))
);

-- 5. Tenant admins can delete user-tenant relations for their tenants
CREATE POLICY "Admins can delete tenant memberships"
ON public.user_tenants
FOR DELETE
TO authenticated
USING (
    tenant_id IN (SELECT public.get_user_admin_tenants(auth.uid()))
);

-- Note: The helper functions remain in the schema and are designed to avoid
-- the recursion issues that were occurring in the direct table references
-- in the previous policies.
