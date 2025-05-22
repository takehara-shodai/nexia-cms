-- デバッグ用の緩いポリシーを削除
DROP POLICY IF EXISTS "Allow all for authenticated users" ON public.user_tenants;
DROP POLICY IF EXISTS "Allow all for authenticated users on content models" ON public.nexia_cms_content_models;
DROP POLICY IF EXISTS "Allow all for authenticated users on content fields" ON public.nexia_cms_content_fields;

-- ユーザーテナント関連のポリシー（適切なアクセス制御）
-- 1. ユーザーは自分自身のテナントメンバーシップを閲覧可能
CREATE POLICY "Users can view own tenant memberships"
ON public.user_tenants
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 2. 管理者は自分のテナントに属するユーザー関係を閲覧可能
CREATE POLICY "Admins can view tenant user memberships"
ON public.user_tenants
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.user_tenants ut
        WHERE 
            ut.user_id = auth.uid() 
            AND ut.role = 'admin'
            AND ut.tenant_id = user_tenants.tenant_id
    )
);

-- 3. 管理者は自分のテナントのユーザー関係を追加可能
CREATE POLICY "Admins can insert tenant user memberships"
ON public.user_tenants
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.user_tenants ut
        WHERE 
            ut.user_id = auth.uid() 
            AND ut.role = 'admin'
            AND ut.tenant_id = user_tenants.tenant_id
    )
);

-- 4. 管理者は自分のテナントのユーザー関係を更新可能
CREATE POLICY "Admins can update tenant user memberships"
ON public.user_tenants
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.user_tenants ut
        WHERE 
            ut.user_id = auth.uid() 
            AND ut.role = 'admin'
            AND ut.tenant_id = user_tenants.tenant_id
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.user_tenants ut
        WHERE 
            ut.user_id = auth.uid() 
            AND ut.role = 'admin'
            AND ut.tenant_id = user_tenants.tenant_id
    )
);

-- 5. 管理者は自分のテナントのユーザー関係を削除可能
CREATE POLICY "Admins can delete tenant user memberships"
ON public.user_tenants
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.user_tenants ut
        WHERE 
            ut.user_id = auth.uid() 
            AND ut.role = 'admin'
            AND ut.tenant_id = user_tenants.tenant_id
    )
);

-- コンテンツモデル関連のポリシー
-- 1. ユーザーは自分のテナントのコンテンツモデルを閲覧可能
CREATE POLICY "Users can view tenant content models"
ON public.nexia_cms_content_models
FOR SELECT
TO authenticated
USING (
    tenant_id IN (
        SELECT tenant_id
        FROM public.user_tenants
        WHERE user_id = auth.uid()
    )
);

-- 2. 管理者と編集者はコンテンツモデルを作成可能
CREATE POLICY "Editors and admins can create content models"
ON public.nexia_cms_content_models
FOR INSERT
TO authenticated
WITH CHECK (
    tenant_id IN (
        SELECT tenant_id
        FROM public.user_tenants
        WHERE 
            user_id = auth.uid()
            AND role IN ('admin', 'editor')
    )
);

-- 3. 管理者と編集者はコンテンツモデルを更新可能
CREATE POLICY "Editors and admins can update content models"
ON public.nexia_cms_content_models
FOR UPDATE
TO authenticated
USING (
    tenant_id IN (
        SELECT tenant_id
        FROM public.user_tenants
        WHERE 
            user_id = auth.uid()
            AND role IN ('admin', 'editor')
    )
)
WITH CHECK (
    tenant_id IN (
        SELECT tenant_id
        FROM public.user_tenants
        WHERE 
            user_id = auth.uid()
            AND role IN ('admin', 'editor')
    )
);

-- 4. 管理者のみがコンテンツモデルを削除可能
CREATE POLICY "Admins can delete content models"
ON public.nexia_cms_content_models
FOR DELETE
TO authenticated
USING (
    tenant_id IN (
        SELECT tenant_id
        FROM public.user_tenants
        WHERE 
            user_id = auth.uid()
            AND role = 'admin'
    )
);

-- コンテンツフィールド関連のポリシー
-- 1. ユーザーは自分のテナントのコンテンツフィールドを閲覧可能
CREATE POLICY "Users can view content fields"
ON public.nexia_cms_content_fields
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.nexia_cms_content_models cm
        JOIN public.user_tenants ut ON cm.tenant_id = ut.tenant_id
        WHERE 
            cm.id = nexia_cms_content_fields.model_id
            AND ut.user_id = auth.uid()
    )
);

-- 2. 管理者と編集者はコンテンツフィールドを作成可能
CREATE POLICY "Editors and admins can create content fields"
ON public.nexia_cms_content_fields
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.nexia_cms_content_models cm
        JOIN public.user_tenants ut ON cm.tenant_id = ut.tenant_id
        WHERE 
            cm.id = nexia_cms_content_fields.model_id
            AND ut.user_id = auth.uid()
            AND ut.role IN ('admin', 'editor')
    )
);

-- 3. 管理者と編集者はコンテンツフィールドを更新可能
CREATE POLICY "Editors and admins can update content fields"
ON public.nexia_cms_content_fields
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.nexia_cms_content_models cm
        JOIN public.user_tenants ut ON cm.tenant_id = ut.tenant_id
        WHERE 
            cm.id = nexia_cms_content_fields.model_id
            AND ut.user_id = auth.uid()
            AND ut.role IN ('admin', 'editor')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.nexia_cms_content_models cm
        JOIN public.user_tenants ut ON cm.tenant_id = ut.tenant_id
        WHERE 
            cm.id = nexia_cms_content_fields.model_id
            AND ut.user_id = auth.uid()
            AND ut.role IN ('admin', 'editor')
    )
);

-- 4. 管理者のみがコンテンツフィールドを削除可能
CREATE POLICY "Admins can delete content fields"
ON public.nexia_cms_content_fields
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.nexia_cms_content_models cm
        JOIN public.user_tenants ut ON cm.tenant_id = ut.tenant_id
        WHERE 
            cm.id = nexia_cms_content_fields.model_id
            AND ut.user_id = auth.uid()
            AND ut.role = 'admin'
    )
);
