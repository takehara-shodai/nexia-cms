-- Create tenants table
CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  short_name TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_tenants junction table
CREATE TABLE IF NOT EXISTS public.user_tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id),
  role TEXT NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tenant_id)
);

-- Enable RLS
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tenants ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for tenants
CREATE POLICY "Users can view tenants they belong to" ON public.tenants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_tenants
      WHERE tenant_id = tenants.id
      AND user_id = auth.uid()
    )
  );

-- Add RLS policies for user_tenants
CREATE POLICY "Users can view their tenant memberships" ON public.user_tenants
  FOR SELECT USING (user_id = auth.uid());

-- Add timestamp triggers
CREATE TRIGGER update_tenants_timestamp
  BEFORE UPDATE ON public.tenants
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_user_tenants_timestamp
  BEFORE UPDATE ON public.user_tenants
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

-- Insert sample tenants
INSERT INTO public.tenants (name, short_name, description) VALUES
('株式会社VAREAL', 'VAREAL', 'バリアルのメインテナント'),
('開発環境', 'DEV', '開発用テナント'),
('ステージング環境', 'STG', 'ステージング用テナント');

-- Insert sample user-tenant relationships
-- Note: Replace 'sample-user-id' with an actual user ID when testing
INSERT INTO public.user_tenants (user_id, tenant_id, role)
SELECT 
  auth.uid(),
  id,
  'admin'
FROM public.tenants
WHERE EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid());