/*
  # コンテンツ管理機能の拡張
  
  1. 既存テーブルの拡張
    - nexia_cms_contents テーブルに新しいフィールドを追加
      - type: コンテンツタイプ
      - description: 説明文
      - url: 公開URL
      - views: 閲覧数
      - likes: いいね数
      - comments: コメント数
      - published_at: 公開日
      - due_date: 期限日
*/

-- コンテンツタイプと説明文を追加
ALTER TABLE nexia_cms_contents 
  ADD COLUMN IF NOT EXISTS type TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS url TEXT,
  ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS comments INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS due_date TIMESTAMPTZ;

-- ステータスの制約を更新
ALTER TABLE nexia_cms_contents 
  DROP CONSTRAINT IF EXISTS nexia_cms_contents_status_check,
  ADD CONSTRAINT nexia_cms_contents_status_check 
    CHECK (status IN ('draft', 'review', 'published', 'archived'));

-- タイプの制約を追加
ALTER TABLE nexia_cms_contents 
  ADD CONSTRAINT nexia_cms_contents_type_check 
    CHECK (type IN ('article', 'report', 'guide'));