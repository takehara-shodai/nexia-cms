-- Drop existing policies
DROP POLICY IF EXISTS "Users can create content models for their tenants" ON nexia_cms_content_models;
DROP POLICY IF EXISTS "Users can view content models of their tenants" ON nexia_cms_content_models;
DROP POLICY IF EXISTS "Users can update content models of their tenants" ON nexia_cms_content_models;
DROP POLICY IF EXISTS "Users can delete content models of their tenants" ON nexia_cms_content_models;

-- Create simplified policies
CREATE POLICY "Enable all operations for authenticated users"
ON nexia_cms_content_models
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Enable RLS
ALTER TABLE nexia_cms_content_models ENABLE ROW LEVEL SECURITY;