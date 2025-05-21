-- Create tenants table if not exists
CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create user_tenants table if not exists
CREATE TABLE IF NOT EXISTS public.user_tenants (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, tenant_id)
);

-- Enable RLS
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tenants ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their tenants" ON public.tenants;
DROP POLICY IF EXISTS "Users can view their tenant memberships" ON public.user_tenants;

-- Create policies
CREATE POLICY "Users can view their tenants"
  ON public.tenants
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM user_tenants
      WHERE user_tenants.tenant_id = tenants.id
      AND user_tenants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their tenant memberships"
  ON public.user_tenants
  FOR SELECT
  TO public
  USING (user_id = auth.uid());

-- Insert default tenant if not exists
INSERT INTO public.tenants (id, name, slug, description)
VALUES (
  'f0a6c4b0-7c91-4d1a-9e3a-a3dd76c46fdb',
  'Default Tenant',
  'default',
  'Default tenant for system'
)
ON CONFLICT (slug) DO NOTHING;

-- Create function to handle new users
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
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
INSERT INTO public.user_tenants (user_id, tenant_id, role)
SELECT id, 'f0a6c4b0-7c91-4d1a-9e3a-a3dd76c46fdb', 'admin'
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_tenants
  WHERE user_id = auth.users.id
)
ON CONFLICT DO NOTHING;