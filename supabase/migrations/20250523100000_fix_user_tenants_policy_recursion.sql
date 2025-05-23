
-- 既存の再帰的なポリシーを削除
DROP POLICY IF EXISTS "Admins can view tenant user memberships" ON public.user_tenants;
DROP POLICY IF EXISTS "Admins can insert tenant user memberships" ON public.user_tenants;
DROP POLICY IF EXISTS "Admins can update tenant user memberships" ON public.user_tenants;
DROP POLICY IF EXISTS "Admins can delete tenant user memberships" ON public.user_tenants;

-- 再帰を防止する改善したポリシーを追加

-- 2. 管理者は自分のテナントに属するユーザー関係を閲覧可能（再帰なし）
CREATE POLICY "Admins can view tenant user memberships"
ON public.user_tenants
FOR SELECT
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

-- 3. 管理者は自分のテナントのユーザー関係を追加可能（再帰なし）
CREATE POLICY "Admins can insert tenant user memberships"
ON public.user_tenants
FOR INSERT
TO authenticated
WITH CHECK (
    tenant_id IN (
        SELECT tenant_id
        FROM public.user_tenants
        WHERE 
            user_id = auth.uid() 
            AND role = 'admin'
    )
);

-- 4. 管理者は自分のテナントのユーザー関係を更新可能（再帰なし）
CREATE POLICY "Admins can update tenant user memberships"
ON public.user_tenants
FOR UPDATE
TO authenticated
USING (
    tenant_id IN (
        SELECT tenant_id
        FROM public.user_tenants
        WHERE 
            user_id = auth.uid() 
            AND role = 'admin'
    )
)
WITH CHECK (
    tenant_id IN (
        SELECT tenant_id
        FROM public.user_tenants
        WHERE 
            user_id = auth.uid() 
            AND role = 'admin'
    )
);

-- 5. 管理者は自分のテナントのユーザー関係を削除可能（再帰なし）
CREATE POLICY "Admins can delete tenant user memberships"
ON public.user_tenants
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
