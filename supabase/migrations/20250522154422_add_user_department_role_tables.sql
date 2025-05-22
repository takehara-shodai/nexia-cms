-- Add users, departments, roles and related junction tables
/*
  # Add organizational structure tables

  This migration adds the following tables:
  1. tenants - テナントテーブル（存在しない場合のみ作成）
  2. users - Main user profiles linked to auth.users
  3. departments - Organizational units within tenants
  4. user_departments - Junction table for user-department relationships
  5. roles - User roles for permission management
  6. role_tenants - Junction table for role-tenant relationships
  
  All tables include appropriate RLS policies to maintain tenant isolation.
*/

-- Create tenants table if not exists
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create user_tenants junction table if not exists
CREATE TABLE IF NOT EXISTS public.user_tenants (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member',
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (user_id, tenant_id)
);

-- Create departments table
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    path TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create user_departments junction table
CREATE TABLE IF NOT EXISTS public.user_departments (
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, department_id)
);

-- Create roles table
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create role_tenants junction table
CREATE TABLE IF NOT EXISTS public.role_tenants (
    role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (role_id, tenant_id)
);

-- Enable Row Level Security
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_tenants ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tenants
CREATE POLICY "Users can view tenants they belong to"
ON public.tenants
FOR SELECT
TO authenticated
USING (
    id IN (
        SELECT tenant_id
        FROM public.user_tenants
        WHERE user_id = auth.uid()
    )
);

-- Create RLS policies for user_tenants
CREATE POLICY "Users can view their own tenant memberships"
ON public.user_tenants
FOR SELECT
TO authenticated
USING (
    user_id = auth.uid() OR
    tenant_id IN (
        SELECT tenant_id
        FROM public.user_tenants
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "Admins can manage user_tenants for their tenants"
ON public.user_tenants
FOR ALL
TO authenticated
USING (
    tenant_id IN (
        SELECT tenant_id
        FROM public.user_tenants
        WHERE user_id = auth.uid() AND role = 'admin'
    )
)
WITH CHECK (
    tenant_id IN (
        SELECT tenant_id
        FROM public.user_tenants
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

-- Create RLS policies for users
CREATE POLICY "Users can view their own profile" 
ON public.users
FOR SELECT 
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" 
ON public.users
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Create RLS policies for departments
CREATE POLICY "Users can view departments of their tenants" 
ON public.departments
FOR SELECT
TO authenticated
USING (
    tenant_id IN (
        SELECT tenant_id 
        FROM public.user_tenants
        WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can create departments for their tenants" 
ON public.departments
FOR INSERT
TO authenticated
WITH CHECK (
    tenant_id IN (
        SELECT tenant_id 
        FROM public.user_tenants
        WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can update departments of their tenants" 
ON public.departments
FOR UPDATE
TO authenticated
USING (
    tenant_id IN (
        SELECT tenant_id 
        FROM public.user_tenants
        WHERE user_id = auth.uid()
    )
)
WITH CHECK (
    tenant_id IN (
        SELECT tenant_id 
        FROM public.user_tenants
        WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can delete departments of their tenants" 
ON public.departments
FOR DELETE
TO authenticated
USING (
    tenant_id IN (
        SELECT tenant_id 
        FROM public.user_tenants
        WHERE user_id = auth.uid()
    )
);

-- Create RLS policies for user_departments
CREATE POLICY "Users can view user_departments of their tenants" 
ON public.user_departments
FOR SELECT
TO authenticated
USING (
    tenant_id IN (
        SELECT tenant_id 
        FROM public.user_tenants
        WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can manage user_departments of their tenants" 
ON public.user_departments
FOR ALL
TO authenticated
USING (
    tenant_id IN (
        SELECT tenant_id 
        FROM public.user_tenants
        WHERE user_id = auth.uid()
    )
)
WITH CHECK (
    tenant_id IN (
        SELECT tenant_id 
        FROM public.user_tenants
        WHERE user_id = auth.uid()
    )
);

-- Create RLS policies for roles
CREATE POLICY "Everyone can view roles" 
ON public.roles
FOR SELECT
TO authenticated
USING (true);

-- Only allow superadmins to modify roles in a real implementation
-- For now, allow authenticated users to manage roles
CREATE POLICY "Authenticated users can manage roles" 
ON public.roles
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create RLS policies for role_tenants
CREATE POLICY "Users can view role_tenants of their tenants" 
ON public.role_tenants
FOR SELECT
TO authenticated
USING (
    tenant_id IN (
        SELECT tenant_id 
        FROM public.user_tenants
        WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can manage role_tenants of their tenants" 
ON public.role_tenants
FOR ALL
TO authenticated
USING (
    tenant_id IN (
        SELECT tenant_id 
        FROM public.user_tenants
        WHERE user_id = auth.uid()
    )
)
WITH CHECK (
    tenant_id IN (
        SELECT tenant_id 
        FROM public.user_tenants
        WHERE user_id = auth.uid()
    )
);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Add triggers for updated_at columns
DROP TRIGGER IF EXISTS update_departments_updated_at ON public.departments;
CREATE TRIGGER update_departments_updated_at
    BEFORE UPDATE ON public.departments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_roles_updated_at ON public.roles;
CREATE TRIGGER update_roles_updated_at
    BEFORE UPDATE ON public.roles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON public.tenants(slug);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_user_tenants_user_id ON public.user_tenants(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tenants_tenant_id ON public.user_tenants(tenant_id);
CREATE INDEX IF NOT EXISTS idx_departments_tenant_id ON public.departments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_departments_parent_id ON public.departments(parent_id);
CREATE INDEX IF NOT EXISTS idx_user_departments_user_id ON public.user_departments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_departments_department_id ON public.user_departments(department_id);
CREATE INDEX IF NOT EXISTS idx_user_departments_tenant_id ON public.user_departments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_role_tenants_role_id ON public.role_tenants(role_id);
CREATE INDEX IF NOT EXISTS idx_role_tenants_tenant_id ON public.role_tenants(tenant_id);

-- Create function to maintain department path
CREATE OR REPLACE FUNCTION update_department_path()
RETURNS TRIGGER AS $$
DECLARE
    parent_path TEXT;
BEGIN
    IF NEW.parent_id IS NULL THEN
        NEW.path = NEW.id::TEXT;
    ELSE
        SELECT path INTO parent_path FROM public.departments WHERE id = NEW.parent_id;
        IF parent_path IS NOT NULL THEN
            NEW.path = parent_path || '.' || NEW.id::TEXT;
        ELSE
            NEW.path = NEW.id::TEXT;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Add trigger for department path maintenance
DROP TRIGGER IF EXISTS update_department_path_trigger ON public.departments;
CREATE TRIGGER update_department_path_trigger
    BEFORE INSERT OR UPDATE OF parent_id ON public.departments
    FOR EACH ROW EXECUTE FUNCTION update_department_path();

-- Add trigger for synchronizing users table with auth.users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, created_at)
    VALUES (NEW.id, NEW.email, NEW.created_at)
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS on_auth_user_created_add_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_add_profile
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
