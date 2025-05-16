/*
  # 初期スキーマのセットアップ

  1. 新規テーブル
    - `todos`
      - `id` (uuid, 主キー)
      - `task` (text, 必須)
      - `completed` (boolean, デフォルトfalse)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `user_id` (uuid)

  2. セキュリティ
    - todosテーブルのRLS有効化
    - 認証ユーザー向けのCRUDポリシー設定

  3. 機能
    - 更新日時の自動更新トリガー
*/

-- 必要な拡張機能の有効化
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- スキーマの作成
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS storage;

-- todosテーブルの作成
CREATE TABLE IF NOT EXISTS public.todos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID
);

-- RLSの有効化
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- RLSポリシーの作成
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'todos' AND policyname = 'Authenticated users can view their own todos'
  ) THEN
    CREATE POLICY "Authenticated users can view their own todos" 
    ON public.todos FOR SELECT
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'todos' AND policyname = 'Authenticated users can create their own todos'
  ) THEN
    CREATE POLICY "Authenticated users can create their own todos" 
    ON public.todos FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'todos' AND policyname = 'Authenticated users can update their own todos'
  ) THEN
    CREATE POLICY "Authenticated users can update their own todos" 
    ON public.todos FOR UPDATE
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'todos' AND policyname = 'Authenticated users can delete their own todos'
  ) THEN
    CREATE POLICY "Authenticated users can delete their own todos" 
    ON public.todos FOR DELETE
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- タイムスタンプ更新関数の作成
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- タイムスタンプ更新トリガーの作成
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_todos_timestamp'
  ) THEN
    CREATE TRIGGER update_todos_timestamp
    BEFORE UPDATE ON public.todos
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();
  END IF;
END $$;