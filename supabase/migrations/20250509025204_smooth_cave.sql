/*
  # Unified Migration File  (fixed)

  0. Tenant Core (★追加)
  1. Create CMS Tables           （tenant_id なしで作成）
  2. Add Tenant Support          （ALTER で tenant_id + FK）
  3. Security (RLS & Policies)
  4. Add NOT NULL Constraints
  5. Triggers
*/

/* ------------------------------------------------------------------------- */
/* Step 0-a: Tenant Core  ★ NEW                                               */
/* ------------------------------------------------------------------------- */

-- Tenants master
CREATE TABLE IF NOT EXISTS tenants (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL UNIQUE,
  short_name  text,
  description text,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- User ↔ Tenant junction
CREATE TABLE IF NOT EXISTS user_tenants (
  user_id    uuid NOT NULL REFERENCES auth.users(id)    ON DELETE CASCADE,
  tenant_id  uuid NOT NULL REFERENCES tenants(id)       ON DELETE CASCADE,
  role       text NOT NULL DEFAULT 'member',
  PRIMARY KEY (user_id, tenant_id)
);

/* RLS 例（任意）*/
ALTER TABLE user_tenants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Link users to tenant"
  ON user_tenants
  FOR ALL TO authenticated
  USING (auth.uid() = user_id);

/* ------------------------------------------------------------------------- */
/* Step 0‑b: System‑admin helper (← これを RLS ポリシーの前に置く)           */
/* ------------------------------------------------------------------------- */

-- 管理者ユーザーを記録するだけのテーブル
CREATE TABLE IF NOT EXISTS system_admins (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 与えられた uid が管理者かどうかを返す関数
CREATE OR REPLACE FUNCTION is_system_admin(uid uuid)
RETURNS boolean
LANGUAGE sql STABLE PARALLEL SAFE
AS $$
  SELECT EXISTS (
    SELECT 1
      FROM system_admins sa
     WHERE sa.user_id = uid
  );
$$;

/* 任意: system_admins にも RLS を張っておくと安全 */
ALTER TABLE system_admins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage admin list"
  ON system_admins             -- ここは好きな範囲で
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)     -- 例: 自分の行だけ見える
  WITH CHECK (auth.uid() = user_id);

/* ------------------------------------------------------------------------- */
/* Step 1: Create CMS Tables  (※ tenant_id まだ付けない)                     */
/* ------------------------------------------------------------------------- */

-- Content Types
CREATE TABLE IF NOT EXISTS nexia_app_cms_content_types (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL UNIQUE,
  description text,
  fields      jsonb DEFAULT '{}'::jsonb,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- Content
CREATE TABLE IF NOT EXISTS nexia_app_cms_content (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type_id uuid NOT NULL REFERENCES nexia_app_cms_content_types(id) ON DELETE RESTRICT,
  title          text NOT NULL,
  slug           text NOT NULL UNIQUE,
  data           jsonb DEFAULT '{}'::jsonb,
  status         text NOT NULL CHECK (status IN ('draft', 'published', 'archived')),
  author_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  created_at     timestamptz DEFAULT now(),
  updated_at     timestamptz DEFAULT now(),
  published_at   timestamptz
);

-- Media
CREATE TABLE IF NOT EXISTS nexia_app_cms_media (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  url        text NOT NULL,
  type       text NOT NULL,
  size       integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Categories
CREATE TABLE IF NOT EXISTS nexia_app_cms_categories (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL UNIQUE,
  description text,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- Content ↔ Categories
CREATE TABLE IF NOT EXISTS nexia_app_cms_content_categories (
  content_id  uuid NOT NULL REFERENCES nexia_app_cms_content(id)    ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES nexia_app_cms_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (content_id, category_id)
);

/* ------------------------------------------------------------------------- */
/* Step 2: Add Tenant Support  (ALTER で tenant_id + FK)                     */
/* ------------------------------------------------------------------------- */

ALTER TABLE nexia_app_cms_content_types
  ADD COLUMN IF NOT EXISTS tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_content_types_tenant ON nexia_app_cms_content_types(tenant_id);

ALTER TABLE nexia_app_cms_content
  ADD COLUMN IF NOT EXISTS tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_content_tenant        ON nexia_app_cms_content(tenant_id);

ALTER TABLE nexia_app_cms_media
  ADD COLUMN IF NOT EXISTS tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_media_tenant          ON nexia_app_cms_media(tenant_id);

ALTER TABLE nexia_app_cms_categories
  ADD COLUMN IF NOT EXISTS tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_categories_tenant     ON nexia_app_cms_categories(tenant_id);

/* ------------------------------------------------------------------------- */
/* Step 3, 4, 5: 既存の RLS / NOT NULL / Trigger 定義をそのまま下に続ける   */
/* ------------------------------------------------------------------------- */

/*
  # Unified Migration File

  1. Create CMS Tables
    - `nexia_app_cms_content_types`
    - `nexia_app_cms_content`
    - `nexia_app_cms_media`
    - `nexia_app_cms_categories`
    - `nexia_app_cms_content_categories`

  2. Add Tenant Support
    - Add `tenant_id` column to all CMS tables
    - Add foreign key constraints to `tenants` table
    - Update RLS policies to enforce tenant isolation
    - Add indexes for `tenant_id` columns

  3. Security
    - Enable RLS on all tables
    - Add policies for system admins and tenant admins
*/

/* Step 1: Create CMS Tables */

-- Content Types
CREATE TABLE IF NOT EXISTS nexia_app_cms_content_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  fields jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Content
CREATE TABLE IF NOT EXISTS nexia_app_cms_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type_id uuid NOT NULL REFERENCES nexia_app_cms_content_types(id) ON DELETE RESTRICT,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  data jsonb DEFAULT '{}'::jsonb,
  status text NOT NULL CHECK (status IN ('draft', 'published', 'archived')),
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz
);

-- Media
CREATE TABLE IF NOT EXISTS nexia_app_cms_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  type text NOT NULL,
  size integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Categories
CREATE TABLE IF NOT EXISTS nexia_app_cms_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Content Categories (Junction Table)
CREATE TABLE IF NOT EXISTS nexia_app_cms_content_categories (
  content_id uuid NOT NULL REFERENCES nexia_app_cms_content(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES nexia_app_cms_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (content_id, category_id)
);

/* Step 2: Add Tenant Support */

-- Add tenant_id to content types
ALTER TABLE nexia_app_cms_content_types 
ADD COLUMN IF NOT EXISTS tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_content_types_tenant ON nexia_app_cms_content_types(tenant_id);

-- Add tenant_id to content
ALTER TABLE nexia_app_cms_content 
ADD COLUMN IF NOT EXISTS tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_content_tenant ON nexia_app_cms_content(tenant_id);

-- Add tenant_id to media
ALTER TABLE nexia_app_cms_media 
ADD COLUMN IF NOT EXISTS tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_media_tenant ON nexia_app_cms_media(tenant_id);

-- Add tenant_id to categories
ALTER TABLE nexia_app_cms_categories 
ADD COLUMN IF NOT EXISTS tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_categories_tenant ON nexia_app_cms_categories(tenant_id);

/* Step 3: Security */

-- Enable RLS on all tables
ALTER TABLE nexia_app_cms_content_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexia_app_cms_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexia_app_cms_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexia_app_cms_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexia_app_cms_content_categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "System admins can manage content types" ON nexia_app_cms_content_types;
DROP POLICY IF EXISTS "Users can view content types" ON nexia_app_cms_content_types;
DROP POLICY IF EXISTS "System admins can manage content" ON nexia_app_cms_content;
DROP POLICY IF EXISTS "Users can view published content" ON nexia_app_cms_content;
DROP POLICY IF EXISTS "System admins can manage media" ON nexia_app_cms_media;
DROP POLICY IF EXISTS "Users can view media" ON nexia_app_cms_media;
DROP POLICY IF EXISTS "System admins can manage categories" ON nexia_app_cms_categories;
DROP POLICY IF EXISTS "Users can view categories" ON nexia_app_cms_categories;

-- Create new tenant-aware policies
CREATE POLICY "Manage content types"
  ON nexia_app_cms_content_types
  FOR ALL
  TO authenticated
  USING (
    is_system_admin(auth.uid()) OR 
    EXISTS (
      SELECT 1 FROM user_tenants ut
      WHERE ut.user_id = auth.uid() 
      AND ut.tenant_id = tenant_id
    )
  )
  WITH CHECK (
    is_system_admin(auth.uid()) OR 
    EXISTS (
      SELECT 1 FROM user_tenants ut
      WHERE ut.user_id = auth.uid() 
      AND ut.tenant_id = tenant_id
    )
  );

CREATE POLICY "Manage content"
  ON nexia_app_cms_content
  FOR ALL
  TO authenticated
  USING (
    is_system_admin(auth.uid()) OR 
    EXISTS (
      SELECT 1 FROM user_tenants ut
      WHERE ut.user_id = auth.uid() 
      AND ut.tenant_id = tenant_id
    )
  )
  WITH CHECK (
    is_system_admin(auth.uid()) OR 
    EXISTS (
      SELECT 1 FROM user_tenants ut
      WHERE ut.user_id = auth.uid() 
      AND ut.tenant_id = tenant_id
    )
  );

CREATE POLICY "Manage media"
  ON nexia_app_cms_media
  FOR ALL
  TO authenticated
  USING (
    is_system_admin(auth.uid()) OR 
    EXISTS (
      SELECT 1 FROM user_tenants ut
      WHERE ut.user_id = auth.uid() 
      AND ut.tenant_id = tenant_id
    )
  )
  WITH CHECK (
    is_system_admin(auth.uid()) OR 
    EXISTS (
      SELECT 1 FROM user_tenants ut
      WHERE ut.user_id = auth.uid() 
      AND ut.tenant_id = tenant_id
    )
  );

CREATE POLICY "Manage categories"
  ON nexia_app_cms_categories
  FOR ALL
  TO authenticated
  USING (
    is_system_admin(auth.uid()) OR 
    EXISTS (
      SELECT 1 FROM user_tenants ut
      WHERE ut.user_id = auth.uid() 
      AND ut.tenant_id = tenant_id
    )
  )
  WITH CHECK (
    is_system_admin(auth.uid()) OR 
    EXISTS (
      SELECT 1 FROM user_tenants ut
      WHERE ut.user_id = auth.uid() 
      AND ut.tenant_id = tenant_id
    )
  );

/* Step 4: Add NOT NULL Constraints */

-- Add NOT NULL constraint after existing data is handled
ALTER TABLE nexia_app_cms_content_types ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE nexia_app_cms_content ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE nexia_app_cms_media ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE nexia_app_cms_categories ALTER COLUMN tenant_id SET NOT NULL;

/* Step 5: Create Triggers for Updated At */

-- Create trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_content_types_updated_at
    BEFORE UPDATE ON nexia_app_cms_content_types
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_updated_at
    BEFORE UPDATE ON nexia_app_cms_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_updated_at
    BEFORE UPDATE ON nexia_app_cms_media
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON nexia_app_cms_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();