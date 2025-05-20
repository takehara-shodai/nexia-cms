/*
  # Fix content schema and add default status

  1. Changes
    - Add default status record
    - Update content schema constraints
    - Fix foreign key relationships

  2. Security
    - Maintain existing RLS policies
*/

-- Create default status if not exists
INSERT INTO nexia_cms_content_statuses (id, name, description)
VALUES (
  'f0a6c4b0-7c91-4d1a-9e3a-a3dd76c46fdb',
  'draft',
  'Draft content status'
) ON CONFLICT (id) DO NOTHING;

-- Update content schema
ALTER TABLE nexia_cms_contents
  ALTER COLUMN status_id SET DEFAULT 'f0a6c4b0-7c91-4d1a-9e3a-a3dd76c46fdb',
  ALTER COLUMN type_id SET DEFAULT 'f0a6c4b0-7c91-4d1a-9e3a-a3dd76c46fdb';

-- Add status constraint
ALTER TABLE nexia_cms_contents 
  DROP CONSTRAINT IF EXISTS nexia_cms_contents_status_check,
  ADD CONSTRAINT nexia_cms_contents_status_check 
    CHECK (status IN ('draft', 'review', 'published', 'archived'));