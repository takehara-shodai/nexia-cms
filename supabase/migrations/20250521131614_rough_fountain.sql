/*
  # Fix RLS policies for content models table

  1. Changes
    - Drop existing RLS policies for nexia_cms_content_models
    - Add new policies to allow:
      - Users to create content models for their tenants
      - Users to view content models of their tenants
      - Users to update content models of their tenants
      - Users to delete content models of their tenants

  2. Security
    - Enable RLS on nexia_cms_content_models table
    - Add policies for all CRUD operations
    - Ensure tenant isolation
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create content models for their tenants" ON nexia_cms_content_models;
DROP POLICY IF EXISTS "Users can view content models of their tenants" ON nexia_cms_content_models;
DROP POLICY IF EXISTS "Users can update content models of their tenants" ON nexia_cms_content_models;
DROP POLICY IF EXISTS "Users can delete content models of their tenants" ON nexia_cms_content_models;

-- Create new policies
CREATE POLICY "Users can create content models for their tenants"
ON nexia_cms_content_models
FOR INSERT
TO authenticated
WITH CHECK (
  tenant_id IN (
    SELECT tenant_id 
    FROM nexia_cms_user_tenants 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can view content models of their tenants"
ON nexia_cms_content_models
FOR SELECT
TO authenticated
USING (
  tenant_id IN (
    SELECT tenant_id 
    FROM nexia_cms_user_tenants 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update content models of their tenants"
ON nexia_cms_content_models
FOR UPDATE
TO authenticated
USING (
  tenant_id IN (
    SELECT tenant_id 
    FROM nexia_cms_user_tenants 
    WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  tenant_id IN (
    SELECT tenant_id 
    FROM nexia_cms_user_tenants 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete content models of their tenants"
ON nexia_cms_content_models
FOR DELETE
TO authenticated
USING (
  tenant_id IN (
    SELECT tenant_id 
    FROM nexia_cms_user_tenants 
    WHERE user_id = auth.uid()
  )
);