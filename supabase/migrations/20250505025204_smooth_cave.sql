/*
  # Create CMS Tables

  1. New Tables
    - `nexia_app_cms_content_types`: Content type definitions
      - `id` (UUID, PK)
      - `name` (TEXT)
      - `description` (TEXT)
      - `fields` (JSONB)
      - Timestamps
    
    - `nexia_app_cms_content`: Content entries
      - `id` (UUID, PK)
      - `content_type_id` (UUID, FK)
      - `title` (TEXT)
      - `slug` (TEXT)
      - `data` (JSONB)
      - `status` (TEXT)
      - `author_id` (UUID, FK)
      - Timestamps
    
    - `nexia_app_cms_media`: Media files
      - `id` (UUID, PK)
      - `name` (TEXT)
      - `url` (TEXT)
      - `type` (TEXT)
      - `size` (INTEGER)
      - Timestamps
    
    - `nexia_app_cms_categories`: Content categories
      - `id` (UUID, PK)
      - `name` (TEXT)
      - `description` (TEXT)
      - Timestamps
    
    - `nexia_app_cms_content_categories`: Content-category relationships
      - `content_id` (UUID, FK)
      - `category_id` (UUID, FK)

  2. Security
    - Enable RLS on all tables
    - Add policies for system admins and tenant admins
*/

-- Content Types
CREATE TABLE IF NOT EXISTS nexia_app_cms_content_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  fields jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE nexia_app_cms_content_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "System admins can manage content types"
  ON nexia_app_cms_content_types
  FOR ALL
  TO authenticated
  USING (is_system_admin(auth.uid()))
  WITH CHECK (is_system_admin(auth.uid()));

CREATE POLICY "Users can view content types"
  ON nexia_app_cms_content_types
  FOR SELECT
  TO authenticated
  USING (true);

-- Content
CREATE TABLE IF NOT EXISTS nexia_app_cms_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type_id uuid NOT NULL REFERENCES nexia_app_cms_content_types(id) ON DELETE RESTRICT,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  data jsonb DEFAULT '{}'::jsonb,
  status text NOT NULL CHECK (status IN ('draft', 'published', 'archived')),
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz
);

ALTER TABLE nexia_app_cms_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "System admins can manage content"
  ON nexia_app_cms_content
  FOR ALL
  TO authenticated
  USING (is_system_admin(auth.uid()))
  WITH CHECK (is_system_admin(auth.uid()));

CREATE POLICY "Users can view published content"
  ON nexia_app_cms_content
  FOR SELECT
  TO authenticated
  USING (status = 'published');

-- Media
CREATE TABLE IF NOT EXISTS nexia_app_cms_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  type text NOT NULL,
  size integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE nexia_app_cms_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "System admins can manage media"
  ON nexia_app_cms_media
  FOR ALL
  TO authenticated
  USING (is_system_admin(auth.uid()))
  WITH CHECK (is_system_admin(auth.uid()));

CREATE POLICY "Users can view media"
  ON nexia_app_cms_media
  FOR SELECT
  TO authenticated
  USING (true);

-- Categories
CREATE TABLE IF NOT EXISTS nexia_app_cms_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE nexia_app_cms_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "System admins can manage categories"
  ON nexia_app_cms_categories
  FOR ALL
  TO authenticated
  USING (is_system_admin(auth.uid()))
  WITH CHECK (is_system_admin(auth.uid()));

CREATE POLICY "Users can view categories"
  ON nexia_app_cms_categories
  FOR SELECT
  TO authenticated
  USING (true);

-- Content Categories (Junction Table)
CREATE TABLE IF NOT EXISTS nexia_app_cms_content_categories (
  content_id uuid NOT NULL REFERENCES nexia_app_cms_content(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES nexia_app_cms_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (content_id, category_id)
);

ALTER TABLE nexia_app_cms_content_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "System admins can manage content categories"
  ON nexia_app_cms_content_categories
  FOR ALL
  TO authenticated
  USING (is_system_admin(auth.uid()))
  WITH CHECK (is_system_admin(auth.uid()));

CREATE POLICY "Users can view content categories"
  ON nexia_app_cms_content_categories
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_content_type_name ON nexia_app_cms_content_types(name);
CREATE INDEX IF NOT EXISTS idx_content_slug ON nexia_app_cms_content(slug);
CREATE INDEX IF NOT EXISTS idx_content_status ON nexia_app_cms_content(status);
CREATE INDEX IF NOT EXISTS idx_content_author ON nexia_app_cms_content(author_id);
CREATE INDEX IF NOT EXISTS idx_media_type ON nexia_app_cms_media(type);
CREATE INDEX IF NOT EXISTS idx_category_name ON nexia_app_cms_categories(name);

-- Create trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_content_types_updated_at
    BEFORE UPDATE ON nexia_app_cms_content_types
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_updated_at
    BEFORE UPDATE ON nexia_app_cms_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_updated_at
    BEFORE UPDATE ON nexia_app_cms_media
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON nexia_app_cms_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();