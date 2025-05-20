-- タグマスタにtenant_id追加
alter table public.nexia_cms_tags add column if not exists tenant_id uuid not null;

-- RLS有効化
alter table public.nexia_cms_tags enable row level security;

-- 既存ポリシー削除
drop policy if exists "Tags are tenant-isolated" on public.nexia_cms_tags;

-- テナント分離RLSポリシー
create policy "Tags are tenant-isolated"
  on public.nexia_cms_tags
  for all
  using (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid); 