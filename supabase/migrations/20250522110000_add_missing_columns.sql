-- Add missing columns to nexia_cms_tags table
ALTER TABLE public.nexia_cms_tags ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE public.nexia_cms_tags ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.nexia_cms_tags ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tags_tenant_id ON public.nexia_cms_tags(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON public.nexia_cms_tags(slug);

-- Make sure the generate_tag_slug function exists
CREATE OR REPLACE FUNCTION generate_tag_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL THEN
        NEW.slug := lower(regexp_replace(NEW.name, '[^a-zA-Z0-9]+', '-', 'g'));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate the trigger
DROP TRIGGER IF EXISTS set_tag_slug ON public.nexia_cms_tags;
CREATE TRIGGER set_tag_slug
    BEFORE INSERT OR UPDATE ON public.nexia_cms_tags
    FOR EACH ROW
    EXECUTE FUNCTION generate_tag_slug();
