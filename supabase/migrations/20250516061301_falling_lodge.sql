/*
  # Fix content creation RLS policy

  1. Changes
    - Update RLS policy for content creation to properly handle new content
    - Ensure author_id is set correctly for new content
    - Allow authenticated users to create content with null author_id

  2. Security
    - Maintains security by ensuring users can only create content they own
    - Allows initial creation with null author_id which gets set by trigger
*/

-- Drop the existing insert policy
DROP POLICY IF EXISTS "Users can create their own contents" ON nexia_cms_contents;

-- Create new insert policy that allows creation with null author_id
CREATE POLICY "Users can create their own contents"
ON nexia_cms_contents
FOR INSERT
TO authenticated
WITH CHECK (
  -- Allow rows where author_id is null (will be set by trigger)
  -- OR where author_id matches the authenticated user
  author_id IS NULL OR author_id = auth.uid()
);