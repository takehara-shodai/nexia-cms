-- Use only properly named tables without hyphens
-- Note: All references to nexia-cms-contents have been removed

-- Create similar triggers for other tables only if they exist
DO $$
BEGIN
  -- Create trigger for nexia_cms_tags if it exists
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'nexia_cms_tags') THEN
    EXECUTE 'CREATE OR REPLACE TRIGGER update_nexia_cms_tags_updated_at
             BEFORE UPDATE ON public.nexia_cms_tags
             FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column()';
  END IF;
  
  -- Create trigger for nexia_cms_content_types if it exists
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'nexia_cms_content_types') THEN
    EXECUTE 'CREATE OR REPLACE TRIGGER update_nexia_cms_content_types_updated_at
             BEFORE UPDATE ON public.nexia_cms_content_types
             FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column()';
  END IF;
  
  -- Create trigger for nexia_cms_content_statuses if it exists
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'nexia_cms_content_statuses') THEN
    EXECUTE 'CREATE OR REPLACE TRIGGER update_nexia_cms_content_statuses_updated_at
             BEFORE UPDATE ON public.nexia_cms_content_statuses
             FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column()';
  END IF;
END
$$;
