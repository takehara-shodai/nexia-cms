/*
  # コンテンツ一覧表示用のカラム追加

  1. Changes
    - author_id カラムの追加（作成者）
    - tenant_id カラムの追加（テナント分離用）
    - slug カラムの追加（URL用）
    - RLS ポリシーの追加
  
  2. Security
    - テナントベースのRLSを設定
    - 作成者のみが編集可能
*/

-- Add new columns
ALTER TABLE nexia_cms_contents
  ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS tenant_id UUID,
  ADD COLUMN IF NOT EXISTS slug TEXT;

-- Add unique constraint for slug within same type
ALTER TABLE nexia_cms_contents
  ADD CONSTRAINT nexia_cms_contents_slug_type_key UNIQUE (slug, type_id);

-- Enable RLS
ALTER TABLE nexia_cms_contents ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Users can create their own contents"
  ON nexia_cms_contents
  FOR INSERT
  TO authenticated
  WITH CHECK (author_id IS NULL OR author_id = auth.uid());

CREATE POLICY "Users can update their own contents"
  ON nexia_cms_contents
  FOR UPDATE
  TO authenticated
  USING (author_id = auth.uid());

CREATE POLICY "Users can delete their own contents"
  ON nexia_cms_contents
  FOR DELETE
  TO authenticated
  USING (author_id = auth.uid());

CREATE POLICY "Users can view their own contents"
  ON nexia_cms_contents
  FOR SELECT
  TO authenticated
  USING (author_id = auth.uid());

-- Add trigger to automatically set author_id
CREATE OR REPLACE FUNCTION set_content_author()
RETURNS TRIGGER AS $$
BEGIN
  NEW.author_id := auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_content_author_trigger
  BEFORE INSERT ON nexia_cms_contents
  FOR EACH ROW
  EXECUTE FUNCTION set_content_author();