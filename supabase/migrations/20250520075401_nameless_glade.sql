/*
  # Add author and tenant columns to contents

  1. New Columns
    - author_id: References auth.users
    - tenant_id: For multi-tenant support
    - slug: For URL-friendly identifiers

  2. Constraints
    - Unique constraint on slug + type combination
    - RLS enabled for security

  3. Policies
    - CRUD policies for content ownership
    - Automatic author_id setting
*/

-- Add new columns
ALTER TABLE nexia_cms_contents
  ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS tenant_id UUID,
  ADD COLUMN IF NOT EXISTS slug TEXT;

-- Add unique constraint for slug within same type
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'nexia_cms_contents_slug_type_key'
  ) THEN
    ALTER TABLE nexia_cms_contents
      ADD CONSTRAINT nexia_cms_contents_slug_type_key UNIQUE (slug, type_id);
  END IF;
END $$;

-- Enable RLS if not already enabled
ALTER TABLE nexia_cms_contents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can create their own contents" ON nexia_cms_contents;
DROP POLICY IF EXISTS "Users can update their own contents" ON nexia_cms_contents;
DROP POLICY IF EXISTS "Users can delete their own contents" ON nexia_cms_contents;
DROP POLICY IF EXISTS "Users can view their own contents" ON nexia_cms_contents;

-- Add RLS policies
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

-- Add trigger to automatically set author_id if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'set_content_author_trigger'
  ) THEN
    CREATE OR REPLACE FUNCTION set_content_author()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.author_id := auth.uid();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER set_content_author_trigger
      BEFORE INSERT ON nexia_cms_contents
      FOR EACH ROW
      EXECUTE FUNCTION set_content_author();
  END IF;
END $$;