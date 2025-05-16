/*
  # Fix content creation RLS policies

  1. Changes
    - Update INSERT policy for nexia_cms_contents to allow initial content creation
    - Add default author_id value using auth.uid()
    - Remove NOT NULL checks from policy since they're handled by table constraints

  2. Security
    - Maintains RLS security by ensuring users can only create content as themselves
    - Automatically sets author_id to the authenticated user's ID
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Users can create their own contents" ON nexia_cms_contents;

-- Create new INSERT policy with simplified check
CREATE POLICY "Users can create their own contents"
ON nexia_cms_contents
FOR INSERT
TO authenticated
WITH CHECK (
  COALESCE(author_id, auth.uid()) = auth.uid()
);

-- Add trigger to automatically set author_id if not provided
CREATE OR REPLACE FUNCTION set_content_author()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.author_id IS NULL THEN
    NEW.author_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to run before insert
DROP TRIGGER IF EXISTS set_content_author_trigger ON nexia_cms_contents;
CREATE TRIGGER set_content_author_trigger
  BEFORE INSERT ON nexia_cms_contents
  FOR EACH ROW
  EXECUTE FUNCTION set_content_author();