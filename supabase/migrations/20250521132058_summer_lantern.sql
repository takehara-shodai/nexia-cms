/*
  # Fix Content Models RLS Policies

  1. Changes
    - Update RLS policies for nexia_cms_content_models table to properly handle INSERT operations
    - Ensure policies check for authenticated users and valid tenant membership
    
  2. Security
    - Maintains tenant isolation
    - Requires authentication
    - Validates tenant membership through user_tenants table
*/

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Users can create content models for their tenants" ON nexia_cms_content_models;

-- Create new INSERT policy with proper tenant validation
CREATE POLICY "Users can create content models for their tenants" 
ON nexia_cms_content_models
FOR INSERT 
TO authenticated
WITH CHECK (
  -- Ensure tenant_id is provided and user belongs to that tenant
  tenant_id IN (
    SELECT tenant_id 
    FROM nexia_cms_user_tenants 
    WHERE user_id = auth.uid()
  )
);