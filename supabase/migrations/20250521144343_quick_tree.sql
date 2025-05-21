-- Create tenants table
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create user-tenant junction table
CREATE TABLE IF NOT EXISTS public.user_tenants (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member',
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (user_id, tenant_id)
);

-- Create content models table
CREATE TABLE IF NOT EXISTS public.nexia_cms_content_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (tenant_id, slug)
);

-- Create content fields table
CREATE TABLE IF NOT EXISTS public.nexia_cms_content_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id UUID REFERENCES public.nexia_cms_content_models(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    required BOOLEAN DEFAULT false,
    settings JSONB DEFAULT '{}'::jsonb,
    order_position INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (model_id, name)
);

-- Create entries table
CREATE TABLE IF NOT EXISTS public.nexia_cms_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id UUID REFERENCES public.nexia_cms_content_models(id) ON DELETE CASCADE,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'draft',
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create assets table
CREATE TABLE IF NOT EXISTS public.nexia_cms_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    entry_id UUID REFERENCES public.nexia_cms_entries(id) ON DELETE SET NULL,
    filename TEXT NOT NULL,
    filesize INTEGER NOT NULL,
    mimetype TEXT NOT NULL,
    url TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nexia_cms_content_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nexia_cms_content_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nexia_cms_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nexia_cms_assets ENABLE ROW LEVEL SECURITY;

-- Create policies for tenants
CREATE POLICY "Users can view their tenants" ON public.tenants
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_tenants
            WHERE tenant_id = id AND user_id = auth.uid()
        )
    );

-- Create policies for user_tenants
CREATE POLICY "Users can view their tenant memberships" ON public.user_tenants
    FOR SELECT USING (user_id = auth.uid());

-- Create policies for content models
CREATE POLICY "Users can view content models of their tenants" ON public.nexia_cms_content_models
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_tenants
            WHERE tenant_id = tenant_id AND user_id = auth.uid()
        )
    );

-- Create policies for content fields
CREATE POLICY "Users can view content fields of their tenants" ON public.nexia_cms_content_fields
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.nexia_cms_content_models cm
            JOIN public.user_tenants ut ON ut.tenant_id = cm.tenant_id
            WHERE cm.id = model_id AND ut.user_id = auth.uid()
        )
    );

-- Create policies for entries
CREATE POLICY "Users can view entries of their tenants" ON public.nexia_cms_entries
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.nexia_cms_content_models cm
            JOIN public.user_tenants ut ON ut.tenant_id = cm.tenant_id
            WHERE cm.id = model_id AND ut.user_id = auth.uid()
        )
    );

-- Create policies for assets
CREATE POLICY "Users can view assets of their tenants" ON public.nexia_cms_assets
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_tenants
            WHERE tenant_id = tenant_id AND user_id = auth.uid()
        )
    );

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tenants_updated_at
    BEFORE UPDATE ON public.tenants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_content_models_updated_at
    BEFORE UPDATE ON public.nexia_cms_content_models
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_content_fields_updated_at
    BEFORE UPDATE ON public.nexia_cms_content_fields
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_entries_updated_at
    BEFORE UPDATE ON public.nexia_cms_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Create indexes for better query performance
CREATE INDEX idx_user_tenants_user_id ON public.user_tenants(user_id);
CREATE INDEX idx_user_tenants_tenant_id ON public.user_tenants(tenant_id);
CREATE INDEX idx_content_models_tenant_id ON public.nexia_cms_content_models(tenant_id);
CREATE INDEX idx_content_fields_model_id ON public.nexia_cms_content_fields(model_id);
CREATE INDEX idx_entries_model_id ON public.nexia_cms_entries(model_id);
CREATE INDEX idx_assets_tenant_id ON public.nexia_cms_assets(tenant_id);
CREATE INDEX idx_assets_entry_id ON public.nexia_cms_assets(entry_id);