-- Create update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

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

-- Create policies (drop first to avoid conflicts)
DROP POLICY IF EXISTS "Users can read tags within their tenant" ON public.nexia_cms_tags;
CREATE POLICY "Users can read tags within their tenant" 
    ON public.nexia_cms_tags
    FOR SELECT 
    TO authenticated
    USING (tenant_id = auth.uid());

DROP POLICY IF EXISTS "Users can create tags for their tenant" ON public.nexia_cms_tags;
CREATE POLICY "Users can create tags for their tenant" 
    ON public.nexia_cms_tags
    FOR INSERT 
    TO authenticated
    WITH CHECK (tenant_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their tenant's tags" ON public.nexia_cms_tags;
CREATE POLICY "Users can update their tenant's tags" 
    ON public.nexia_cms_tags
    FOR UPDATE 
    TO authenticated
    USING (tenant_id = auth.uid())
    WITH CHECK (tenant_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their tenant's tags" ON public.nexia_cms_tags;
CREATE POLICY "Users can delete their tenant's tags" 
    ON public.nexia_cms_tags
    FOR DELETE 
    TO authenticated
    USING (tenant_id = auth.uid());

-- Create updated_at trigger (only if it doesn't exist)
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

-- Indexes are moved to a later migration (20250522110000_add_missing_columns.sql)
-- to ensure columns exist first