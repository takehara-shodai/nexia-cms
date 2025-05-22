/*
  # Fix Database Relationships

  1. New Tables
    - nexia_cms_content_statuses
    - nexia_cms_content_types  
    - nexia_cms_contents
    - nexia_cms_content_tags (junction table)

  2. Changes
    - Add proper foreign key relationships between tables
    - Add RLS policies
    - Add indexes for performance

  3. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table
*/

-- Create content statuses table
CREATE TABLE IF NOT EXISTS public.nexia_cms_content_statuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create content types table
CREATE TABLE IF NOT EXISTS public.nexia_cms_content_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    schema JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create contents table
CREATE TABLE IF NOT EXISTS public.nexia_cms_contents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT,
    status TEXT DEFAULT 'draft',
    status_id UUID REFERENCES public.nexia_cms_content_statuses(id),
    type_id UUID REFERENCES public.nexia_cms_content_types(id),
    tenant_id UUID REFERENCES auth.users(id),
    author_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    published_at TIMESTAMPTZ,
    CONSTRAINT nexia_cms_contents_status_check CHECK (status IN ('draft', 'review', 'published', 'archived'))
);

-- Create junction table for content-tag relationship
CREATE TABLE IF NOT EXISTS public.nexia_cms_content_tags (
    content_id UUID REFERENCES public.nexia_cms_contents(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES public.nexia_cms_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (content_id, tag_id)
);

-- Enable RLS
ALTER TABLE public.nexia_cms_content_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nexia_cms_content_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nexia_cms_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nexia_cms_content_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for content statuses
DROP POLICY IF EXISTS "Anyone can read content statuses" ON public.nexia_cms_content_statuses;
CREATE POLICY "Anyone can read content statuses" 
    ON public.nexia_cms_content_statuses FOR SELECT 
    USING (true);

-- Create policies for content types
DROP POLICY IF EXISTS "Authenticated users can view content types" ON public.nexia_cms_content_types;
CREATE POLICY "Authenticated users can view content types" 
    ON public.nexia_cms_content_types FOR SELECT 
    TO authenticated 
    USING (true);

-- Create policies for contents
CREATE POLICY "Users can create their own contents" 
    ON public.nexia_cms_contents FOR INSERT 
    TO authenticated 
    WITH CHECK (author_id = auth.uid() OR author_id IS NULL);

CREATE POLICY "Users can view their own contents" 
    ON public.nexia_cms_contents FOR SELECT 
    TO authenticated 
    USING (author_id = auth.uid());

CREATE POLICY "Users can update their own contents" 
    ON public.nexia_cms_contents FOR UPDATE 
    TO authenticated 
    USING (author_id = auth.uid())
    WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can delete their own contents" 
    ON public.nexia_cms_contents FOR DELETE 
    TO authenticated 
    USING (author_id = auth.uid());

-- Create policies for content tags
CREATE POLICY "Users can manage content tags" 
    ON public.nexia_cms_content_tags 
    TO authenticated 
    USING (true)
    WITH CHECK (true);

-- Add updated_at triggers
CREATE TRIGGER update_content_statuses_updated_at
    BEFORE UPDATE ON public.nexia_cms_content_statuses
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_content_types_updated_at
    BEFORE UPDATE ON public.nexia_cms_content_types
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contents_updated_at
    BEFORE UPDATE ON public.nexia_cms_contents
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_contents_author_id ON public.nexia_cms_contents(author_id);
CREATE INDEX IF NOT EXISTS idx_contents_status_id ON public.nexia_cms_contents(status_id);
CREATE INDEX IF NOT EXISTS idx_contents_type_id ON public.nexia_cms_contents(type_id);
CREATE INDEX IF NOT EXISTS idx_content_tags_content_id ON public.nexia_cms_content_tags(content_id);
CREATE INDEX IF NOT EXISTS idx_content_tags_tag_id ON public.nexia_cms_content_tags(tag_id);

-- Insert default statuses
INSERT INTO public.nexia_cms_content_statuses (id, name, description) VALUES
    ('f0a6c4b0-7c91-4d1a-9e3a-a3dd76c46fdb', 'draft', 'Draft content'),
    ('2b773e0a-7cb6-4c56-b28b-fb96affaea8e', 'review', 'Content under review'),
    ('3c884d1b-8d9a-4f72-c39c-9d07bffdea9f', 'published', 'Published content'),
    ('4d995e2c-9e0a-5f83-d40d-ae18cffeeb0f', 'archived', 'Archived content')
ON CONFLICT (id) DO NOTHING;

-- Insert default content type
INSERT INTO public.nexia_cms_content_types (id, name, description, schema) VALUES
    ('f0a6c4b0-7c91-4d1a-9e3a-a3dd76c46fdb', 'article', 'Standard article', '{"fields": [{"name": "title", "type": "text", "required": true}, {"name": "content", "type": "richtext", "required": true}]}'::jsonb)
ON CONFLICT (id) DO NOTHING;
