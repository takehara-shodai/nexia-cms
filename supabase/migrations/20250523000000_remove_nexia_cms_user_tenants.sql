-- Remove the nexia_cms_user_tenants table which is no longer needed
-- and update related references to use user_tenants instead

-- First, drop any policies, indexes, and triggers that depend on the table
DROP POLICY IF EXISTS "Users can view their tenant memberships" ON public.nexia_cms_user_tenants;
DROP INDEX IF EXISTS idx_user_tenants_user_id;
DROP INDEX IF EXISTS idx_user_tenants_tenant_id;

-- Drop function and trigger for handle_new_user if they exist
DROP TRIGGER IF EXISTS on_auth_user_created_nexia ON auth.users;

-- Then drop the table itself
DROP TABLE IF EXISTS public.nexia_cms_user_tenants;

-- Update related policies to use user_tenants table instead
-- (This will be handled in subsequent migrations or already exists)
