-- 既存のテナントとスラッグの一意性制約を削除
ALTER TABLE IF EXISTS public.nexia_cms_content_models 
DROP CONSTRAINT IF EXISTS nexia_cms_content_models_tenant_id_slug_key;

-- スラッグが空でない場合のみ適用される部分インデックスを作成
CREATE UNIQUE INDEX nexia_cms_content_models_tenant_id_slug_key
ON public.nexia_cms_content_models (tenant_id, slug)
WHERE slug IS NOT NULL AND slug != '';

-- コメント
COMMENT ON INDEX public.nexia_cms_content_models_tenant_id_slug_key IS 'テナント内でスラッグの一意性を保証するが、空文字列とnullは除外';
