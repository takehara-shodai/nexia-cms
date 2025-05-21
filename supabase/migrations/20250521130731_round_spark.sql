/*
  # Fix Content Models RLS Policies

  1. Changes
    - Drop existing RLS policy for content models
    - Add new RLS policies for content models table:
      - Allow users to view content models of their tenants
      - Allow users to create content models for their tenants
      - Allow users to update content models of their tenants
      - Allow users to delete content models of their tenants

  2. Security
    - Enable RLS on content models table
    - Add policies based on tenant_id matching
*/

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can view content models of their tenants" ON nexia_cms_content_models;

-- Create new policies for content models
CREATE POLICY "Users can view content models of their tenants"
ON nexia_cms_content_models
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM nexia_cms_user_tenants
    WHERE nexia_cms_user_tenants.tenant_id = nexia_cms_content_models.tenant_id
    AND nexia_cms_user_tenants.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create content models for their tenants"
ON nexia_cms_content_models
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM nexia_cms_user_tenants
    WHERE nexia_cms_user_tenants.tenant_id = nexia_cms_content_models.tenant_id
    AND nexia_cms_user_tenants.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update content models of their tenants"
ON nexia_cms_content_models
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM nexia_cms_user_tenants
    WHERE nexia_cms_user_tenants.tenant_id = nexia_cms_content_models.tenant_id
    AND nexia_cms_user_tenants.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM nexia_cms_user_tenants
    WHERE nexia_cms_user_tenants.tenant_id = nexia_cms_content_models.tenant_id
    AND nexia_cms_user_tenants.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete content models of their tenants"
ON nexia_cms_content_models
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM nexia_cms_user_tenants
    WHERE nexia_cms_user_tenants.tenant_id = nexia_cms_content_models.tenant_id
    AND nexia_cms_user_tenants.user_id = auth.uid()
  )
);