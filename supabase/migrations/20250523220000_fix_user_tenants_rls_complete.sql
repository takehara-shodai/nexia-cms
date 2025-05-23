-- まず既存のすべての重複したポリシーを削除
DROP POLICY IF EXISTS "Admins can view tenant user memberships" ON public.user_tenants;
DROP POLICY IF EXISTS "Admins can view all tenant memberships" ON public.user_tenants;
DROP POLICY IF EXISTS "Admins can insert tenant user memberships" ON public.user_tenants;
DROP POLICY IF EXISTS "Admins can insert tenant memberships" ON public.user_tenants;
DROP POLICY IF EXISTS "Admins can update tenant user memberships" ON public.user_tenants;
DROP POLICY IF EXISTS "Admins can update tenant memberships" ON public.user_tenants;
DROP POLICY IF EXISTS "Admins can delete tenant user memberships" ON public.user_tenants;
DROP POLICY IF EXISTS "Admins can delete tenant memberships" ON public.user_tenants;
DROP POLICY IF EXISTS "Users can view own memberships" ON public.user_tenants;
DROP POLICY IF EXISTS "Users can view own tenant memberships" ON public.user_tenants;

-- 再帰を回避するためのヘルパー関数を作成または置き換え
-- この関数はセキュリティディファイナー（SECURITY DEFINER）として実行され、
-- RLSポリシーを迂回してテーブルにアクセスできるため、再帰的な参照が発生しない
CREATE OR REPLACE FUNCTION public.get_user_admin_tenants(user_uid uuid)
RETURNS SETOF uuid
LANGUAGE sql
STABLE SECURITY DEFINER
AS $function$
    SELECT tenant_id
    FROM public.user_tenants
    WHERE user_id = user_uid AND role = 'admin';
$function$;

-- ユーザー自身のメンバーシップ情報へのアクセスを許可
CREATE POLICY "Users can view own memberships"
ON public.user_tenants
FOR SELECT
TO authenticated
USING (
    user_id = auth.uid()
);

-- 管理者がテナントのユーザーメンバーシップを表示できるポリシー
CREATE POLICY "Admins can view tenant memberships"
ON public.user_tenants
FOR SELECT
TO authenticated
USING (
    tenant_id IN (
        SELECT public.get_user_admin_tenants(auth.uid())
    )
);

-- 管理者がテナントにユーザーを追加できるポリシー
CREATE POLICY "Admins can insert tenant memberships"
ON public.user_tenants
FOR INSERT
TO authenticated
WITH CHECK (
    tenant_id IN (
        SELECT public.get_user_admin_tenants(auth.uid())
    )
);

-- 管理者がテナントのユーザーメンバーシップを更新できるポリシー
CREATE POLICY "Admins can update tenant memberships"
ON public.user_tenants
FOR UPDATE
TO authenticated
USING (
    tenant_id IN (
        SELECT public.get_user_admin_tenants(auth.uid())
    )
)
WITH CHECK (
    tenant_id IN (
        SELECT public.get_user_admin_tenants(auth.uid())
    )
);

-- 管理者がテナントのユーザーメンバーシップを削除できるポリシー
CREATE POLICY "Admins can delete tenant memberships"
ON public.user_tenants
FOR DELETE
TO authenticated
USING (
    tenant_id IN (
        SELECT public.get_user_admin_tenants(auth.uid())
    )
);
