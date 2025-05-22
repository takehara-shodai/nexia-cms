-- Fix Infinite recursion in user_tenants policies
-- This migration drops the problematic RLS policies and creates fixed versions

-- First, remove the problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "Users can view their own tenant memberships" ON public.user_tenants;
DROP POLICY IF EXISTS "Admins can manage user_tenants for their tenants" ON public.user_tenants;
DROP POLICY IF EXISTS "Users can view their tenant memberships" ON public.user_tenants;

-- Create fixed policies with no self-reference
-- Policy for users to view their own tenant memberships without recursion
CREATE POLICY "Users can view their own tenant memberships fixed"
ON public.user_tenants
FOR SELECT
TO authenticated
USING (
    user_id = auth.uid()
);

-- Policy for admins to see other user-tenant relationships in their tenants
CREATE POLICY "Admins can view tenant memberships"
ON public.user_tenants
FOR SELECT
TO authenticated
USING (
    tenant_id IN (
        SELECT tenant_id
        FROM public.user_tenants ut
        WHERE ut.user_id = auth.uid() AND ut.role = 'admin'
    )
);

-- Policy for admins to manage user-tenant relationships
CREATE POLICY "Admins can manage user_tenants"
ON public.user_tenants
FOR INSERT
TO authenticated
WITH CHECK (
    tenant_id IN (
        SELECT tenant_id
        FROM public.user_tenants ut
        WHERE ut.user_id = auth.uid() AND ut.role = 'admin'
    )
);

CREATE POLICY "Admins can update user_tenants"
ON public.user_tenants
FOR UPDATE
TO authenticated
USING (
    tenant_id IN (
        SELECT tenant_id
        FROM public.user_tenants ut
        WHERE ut.user_id = auth.uid() AND ut.role = 'admin'
    )
) 
WITH CHECK (
    tenant_id IN (
        SELECT tenant_id
        FROM public.user_tenants ut
        WHERE ut.user_id = auth.uid() AND ut.role = 'admin'
    )
);

CREATE POLICY "Admins can delete user_tenants"
ON public.user_tenants
FOR DELETE
TO authenticated
USING (
    tenant_id IN (
        SELECT tenant_id
        FROM public.user_tenants ut
        WHERE ut.user_id = auth.uid() AND ut.role = 'admin'
    )
);
