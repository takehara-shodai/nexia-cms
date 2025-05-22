-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view their own tenant memberships fixed" ON public.user_tenants;
DROP POLICY IF EXISTS "Admins can view tenant memberships" ON public.user_tenants;
DROP POLICY IF EXISTS "Admins can manage user_tenants" ON public.user_tenants;
DROP POLICY IF EXISTS "Admins can update user_tenants" ON public.user_tenants;
DROP POLICY IF EXISTS "Admins can delete user_tenants" ON public.user_tenants;

-- 完全に単純化したシングルポリシーを採用（デバッグ用）
-- このポリシーは認証済みユーザーに対してすべての操作を許可します
CREATE POLICY "Allow all for authenticated users"
ON public.user_tenants
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- nexia_cms_content_modelsテーブルにもシンプルなポリシーを追加
CREATE POLICY "Allow all for authenticated users on content models"
ON public.nexia_cms_content_models
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
