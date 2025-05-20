/*
  # Content table enhancements
  
  1. Changes
    - Add new columns for content metadata
    - Add status column with constraints
    - Add type column with constraints
    
  2. New Columns
    - type: Content type (article, report, guide)
    - description: Content description
    - url: Content URL
    - views: View count
    - likes: Like count
    - comments: Comment count
    - published_at: Publication timestamp
    - due_date: Due date timestamp
    - status: Content status
*/

-- Add status column if it doesn't exist
ALTER TABLE nexia_cms_contents 
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft';

-- Add other metadata columns
ALTER TABLE nexia_cms_contents 
  ADD COLUMN IF NOT EXISTS type TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS url TEXT,
  ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS comments INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS due_date TIMESTAMPTZ;

-- Add status constraint
ALTER TABLE nexia_cms_contents 
  DROP CONSTRAINT IF EXISTS nexia_cms_contents_status_check,
  ADD CONSTRAINT nexia_cms_contents_status_check 
    CHECK (status IN ('draft', 'review', 'published', 'archived'));

-- Add type constraint
ALTER TABLE nexia_cms_contents 
  ADD CONSTRAINT nexia_cms_contents_type_check 
    CHECK (type IN ('article', 'report', 'guide'));