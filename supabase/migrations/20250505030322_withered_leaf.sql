/*
  # Add tenant support to CMS tables

  1. Changes
    - Add tenant_id column to all CMS tables
    - Add foreign key constraints to tenants table
    - Update RLS policies to enforce tenant isolation
    - Add indexes for tenant_id columns

  2. Security
    - Modify policies to check tenant access
    - Ensure users can only access content from their assigned tenants
*/

-- Add tenant_id to content types
ALTER TABLE nexia_app_cms_content_types 
ADD COLUMN tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE;

CREATE INDEX idx_content_types_tenant ON nexia_app_cms_content_types(tenant_id);

-- Add tenant_id to content
ALTER TABLE nexia_app_cms_content 
ADD COLUMN tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE;

CREATE INDEX idx_content_tenant ON nexia_app_cms_content(tenant_id);

-- Add tenant_id to media
ALTER TABLE nexia_app_cms_media 
ADD COLUMN tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE;

CREATE INDEX idx_media_tenant ON nexia_app_cms_media(tenant_id);

-- Add tenant_id to categories
ALTER TABLE nexia_app_cms_categories 
ADD COLUMN tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE;

CREATE INDEX idx_categories_tenant ON nexia_app_cms_categories(tenant_id);

-- Drop existing policies
DROP POLICY IF EXISTS "System admins can manage content types" ON nexia_app_cms_content_types;
DROP POLICY IF EXISTS "Users can view content types" ON nexia_app_cms_content_types;
DROP POLICY IF EXISTS "System admins can manage content" ON nexia_app_cms_content;
DROP POLICY IF EXISTS "Users can view published content" ON nexia_app_cms_content;
DROP POLICY IF EXISTS "System admins can manage media" ON nexia_app_cms_media;
DROP POLICY IF EXISTS "Users can view media" ON nexia_app_cms_media;
DROP POLICY IF EXISTS "System admins can manage categories" ON nexia_app_cms_categories;
DROP POLICY IF EXISTS "Users can view categories" ON nexia_app_cms_categories;

-- Create new tenant-aware policies
CREATE POLICY "Manage content types"
  ON nexia_app_cms_content_types
  FOR ALL
  TO authenticated
  USING (
    is_system_admin(auth.uid()) OR 
    EXISTS (
      SELECT 1 FROM user_tenants ut
      WHERE ut.user_id = auth.uid() 
      AND ut.tenant_id = tenant_id
    )
  )
  WITH CHECK (
    is_system_admin(auth.uid()) OR 
    EXISTS (
      SELECT 1 FROM user_tenants ut
      WHERE ut.user_id = auth.uid() 
      AND ut.tenant_id = tenant_id
    )
  );

CREATE POLICY "Manage content"
  ON nexia_app_cms_content
  FOR ALL
  TO authenticated
  USING (
    is_system_admin(auth.uid()) OR 
    EXISTS (
      SELECT 1 FROM user_tenants ut
      WHERE ut.user_id = auth.uid() 
      AND ut.tenant_id = tenant_id
    )
  )
  WITH CHECK (
    is_system_admin(auth.uid()) OR 
    EXISTS (
      SELECT 1 FROM user_tenants ut
      WHERE ut.user_id = auth.uid() 
      AND ut.tenant_id = tenant_id
    )
  );

CREATE POLICY "Manage media"
  ON nexia_app_cms_media
  FOR ALL
  TO authenticated
  USING (
    is_system_admin(auth.uid()) OR 
    EXISTS (
      SELECT 1 FROM user_tenants ut
      WHERE ut.user_id = auth.uid() 
      AND ut.tenant_id = tenant_id
    )
  )
  WITH CHECK (
    is_system_admin(auth.uid()) OR 
    EXISTS (
      SELECT 1 FROM user_tenants ut
      WHERE ut.user_id = auth.uid() 
      AND ut.tenant_id = tenant_id
    )
  );

CREATE POLICY "Manage categories"
  ON nexia_app_cms_categories
  FOR ALL
  TO authenticated
  USING (
    is_system_admin(auth.uid()) OR 
    EXISTS (
      SELECT 1 FROM user_tenants ut
      WHERE ut.user_id = auth.uid() 
      AND ut.tenant_id = tenant_id
    )
  )
  WITH CHECK (
    is_system_admin(auth.uid()) OR 
    EXISTS (
      SELECT 1 FROM user_tenants ut
      WHERE ut.user_id = auth.uid() 
      AND ut.tenant_id = tenant_id
    )
  );

-- Add NOT NULL constraint after existing data is handled
ALTER TABLE nexia_app_cms_content_types ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE nexia_app_cms_content ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE nexia_app_cms_media ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE nexia_app_cms_categories ALTER COLUMN tenant_id SET NOT NULL;