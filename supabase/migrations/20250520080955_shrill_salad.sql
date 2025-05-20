/*
  # Add author and tenant columns to contents table

  1. Changes
    - Add author_id, tenant_id, and slug columns
    - Add unique constraint for slug + type
    - Enable RLS
    - Add RLS policies for CRUD operations
    - Add trigger for auto-setting author_id

  2. Security
    - Enable RLS on contents table
    - Add policies for authenticated users
*/

-- Add new columns
ALTER TABLE nexia_cms_contents
  ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS tenant_id UUID,
  ADD COLUMN IF NOT EXISTS slug TEXT;

-- Add unique constraint for slug within same type
ALTER TABLE nexia_cms_contents
  DROP CONSTRAINT IF EXISTS nexia_cms_contents_slug_type_key;

ALTER TABLE nexia_cms_contents
  ADD CONSTRAINT nexia_cms_contents_slug_type_key UNIQUE (slug, type_id);

-- Enable RLS
ALTER TABLE nexia_cms_contents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create their own contents" ON nexia_cms_contents;
DROP POLICY IF EXISTS "Users can update their own contents" ON nexia_cms_contents;
DROP POLICY IF EXISTS "Users can delete their own contents" ON nexia_cms_contents;
DROP POLICY IF EXISTS "Users can view their own contents" ON nexia_cms_contents;

-- Create RLS policies
CREATE POLICY "Users can create their own contents"
  ON nexia_cms_contents
  FOR INSERT
  TO authenticated
  WITH CHECK (author_id IS NULL OR author_id = auth.uid());

CREATE POLICY "Users can update their own contents"
  ON nexia_cms_contents
  FOR UPDATE
  TO authenticated
  USING (author_id = auth.uid());

CREATE POLICY "Users can delete their own contents"
  ON nexia_cms_contents
  FOR DELETE
  TO authenticated
  USING (author_id = auth.uid());

CREATE POLICY "Users can view their own contents"
  ON nexia_cms_contents
  FOR SELECT
  TO authenticated
  USING (author_id = auth.uid());

-- Create author trigger function
CREATE OR REPLACE FUNCTION set_content_author()
RETURNS TRIGGER AS $$
BEGIN
  NEW.author_id := auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS set_content_author_trigger ON nexia_cms_contents;

CREATE TRIGGER set_content_author_trigger
  BEFORE INSERT ON nexia_cms_contents
  FOR EACH ROW
  EXECUTE FUNCTION set_content_author();