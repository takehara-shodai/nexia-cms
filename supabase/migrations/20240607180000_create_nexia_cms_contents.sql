-- コンテンツ管理テーブル
create table if not exists public.nexia_cms_contents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  status text not null default 'draft',
  tags text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  author_id uuid references auth.users(id)
); 