-- タグマスタ
create table if not exists public.nexia_cms_tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  color text,
  created_at timestamptz not null default now()
);

-- 中間テーブル
create table if not exists public.nexia_cms_content_tags (
  content_id uuid references public.nexia_cms_contents(id) on delete cascade,
  tag_id uuid references public.nexia_cms_tags(id) on delete cascade,
  primary key (content_id, tag_id)
); 