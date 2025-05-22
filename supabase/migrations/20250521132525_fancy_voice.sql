-- Insert default tenant if not exists
INSERT INTO public.tenants (id, name, slug, description)
VALUES (
  'f0a6c4b0-7c91-4d1a-9e3a-a3dd76c46fdb',
  'Default Tenant',
  'default',
  'Default tenant for system'
)
ON CONFLICT (slug) DO NOTHING;

-- Ensure every authenticated user belongs to the default tenant
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  -- Use user_tenants instead of nexia_cms_user_tenants
  INSERT INTO public.user_tenants (user_id, tenant_id, role)
  VALUES (NEW.id, 'f0a6c4b0-7c91-4d1a-9e3a-a3dd76c46fdb', 'admin');
  RETURN NEW;
END;
$$ language plpgsql security definer;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add existing users to default tenant
-- Use user_tenants instead of nexia_cms_user_tenants
INSERT INTO public.user_tenants (user_id, tenant_id, role)
SELECT id, 'f0a6c4b0-7c91-4d1a-9e3a-a3dd76c46fdb', 'admin'
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_tenants
  WHERE user_id = auth.users.id
)
ON CONFLICT DO NOTHING;
