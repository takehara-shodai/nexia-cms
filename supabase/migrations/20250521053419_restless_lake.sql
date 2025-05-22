/*
  # Create Tags Table Schema

  1. New Tables
    - `nexia_cms_tags`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `color` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `tenant_id` (uuid)
      - `description` (text)
      - `slug` (text, unique)

  2. Security
    - Enable RLS on `nexia_cms_tags` table
    - Add policies for authenticated users to:
      - Read tags within their tenant
      - Create tags for their tenant
      - Update their tenant's tags
      - Delete their tenant's tags

  3. Triggers
    - Add updated_at trigger
*/

-- Create the tags table
CREATE TABLE IF NOT EXISTS public.nexia_cms_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    color TEXT,
    description TEXT,
    tenant_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.nexia_cms_tags ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read tags within their tenant" 
    ON public.nexia_cms_tags
    FOR SELECT 
    TO authenticated
    USING (tenant_id = auth.uid());

CREATE POLICY "Users can create tags for their tenant" 
    ON public.nexia_cms_tags
    FOR INSERT 
    TO authenticated
    WITH CHECK (tenant_id = auth.uid());

CREATE POLICY "Users can update their tenant's tags" 
    ON public.nexia_cms_tags
    FOR UPDATE 
    TO authenticated
    USING (tenant_id = auth.uid())
    WITH CHECK (tenant_id = auth.uid());

CREATE POLICY "Users can delete their tenant's tags" 
    ON public.nexia_cms_tags
    FOR DELETE 
    TO authenticated
    USING (tenant_id = auth.uid());

-- Create updated_at trigger (with IF NOT EXISTS check)
DROP TRIGGER IF EXISTS update_nexia_cms_tags_updated_at ON public.nexia_cms_tags;
CREATE TRIGGER update_nexia_cms_tags_updated_at
    BEFORE UPDATE ON public.nexia_cms_tags
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to generate slug if not provided
CREATE OR REPLACE FUNCTION generate_tag_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL THEN
        NEW.slug := lower(regexp_replace(NEW.name, '[^a-zA-Z0-9]+', '-', 'g'));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate slug
DROP TRIGGER IF EXISTS set_tag_slug ON public.nexia_cms_tags;
CREATE TRIGGER set_tag_slug
    BEFORE INSERT OR UPDATE ON public.nexia_cms_tags
    FOR EACH ROW
    EXECUTE FUNCTION generate_tag_slug();

-- Indexes are moved to a later migration
-- to ensure columns exist first
