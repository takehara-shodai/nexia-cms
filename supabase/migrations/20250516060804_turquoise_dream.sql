/*
  # Add RLS policies for content creation

  1. Changes
    - Add RLS policy for content creation
    - Ensure authenticated users can create content with their own user ID

  2. Security
    - Enable RLS on nexia_cms_contents table (already enabled)
    - Add policy for authenticated users to create content
    - Ensure users can only set themselves as author
*/

-- Drop existing INSERT policy if it exists
DROP POLICY IF EXISTS "Users can create their own contents" ON nexia_cms_contents;

-- Create new INSERT policy with proper checks
CREATE POLICY "Users can create their own contents"
ON nexia_cms_contents
FOR INSERT
TO authenticated
WITH CHECK (
  -- Ensure the author_id matches the authenticated user's ID
  author_id = auth.uid() AND
  -- Basic validation for required fields
  title IS NOT NULL AND
  slug IS NOT NULL AND
  type_id IS NOT NULL AND
  status_id IS NOT NULL
);

-- Update the SELECT policy to allow users to view content they just created
DROP POLICY IF EXISTS "Users can view their own contents" ON nexia_cms_contents;

CREATE POLICY "Users can view their own contents"
ON nexia_cms_contents
FOR SELECT
TO authenticated
USING (
  -- Allow viewing if user is the author
  author_id = auth.uid()
);