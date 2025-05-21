/*
  # Fix Content Models RLS Policy

  1. Changes
    - Drop existing INSERT policy for content models
    - Create new INSERT policy with correct tenant check
    - Add explicit check for tenant_id NOT NULL

  2. Security
    - Ensures users can only create content models for tenants they belong to
    - Requires tenant_id to be provided
    - Maintains existing RLS policies for other operations
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Users can create content models for their tenants" ON nexia_cms_content_models;

-- Create new INSERT policy with proper tenant check
CREATE POLICY "Users can create content models for their tenants"
ON nexia_cms_content_models
FOR INSERT
TO authenticated
WITH CHECK (
  tenant_id IS NOT NULL AND
  EXISTS (
    SELECT 1 
    FROM nexia_cms_user_tenants
    WHERE nexia_cms_user_tenants.tenant_id = nexia_cms_content_models.tenant_id
    AND nexia_cms_user_tenants.user_id = auth.uid()
  )
);