/*
  # Add content models and sample data

  1. New Tables
    - `content_model_categories` - Content model categories
    - `content_model_fields` - Field definitions for content models
    - `content_model_validations` - Validation rules for fields
    - `content_model_relations` - Relations between content models

  2. Sample Data
    - Categories: Basic, Advanced, Custom
    - Content models with fields and validations
    - Sample relations between models

  3. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table
*/

-- Create content model categories table
CREATE TABLE IF NOT EXISTS public.content_model_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create content model fields table
CREATE TABLE IF NOT EXISTS public.content_model_fields (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_id UUID REFERENCES public.content_models(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  required BOOLEAN DEFAULT false,
  settings JSONB DEFAULT '{}',
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create content model validations table
CREATE TABLE IF NOT EXISTS public.content_model_validations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  field_id UUID REFERENCES public.content_model_fields(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  settings JSONB DEFAULT '{}',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create content model relations table
CREATE TABLE IF NOT EXISTS public.content_model_relations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  source_model_id UUID REFERENCES public.content_models(id) ON DELETE CASCADE,
  target_model_id UUID REFERENCES public.content_models(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  required BOOLEAN DEFAULT false,
  on_delete TEXT DEFAULT 'restrict',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.content_model_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_model_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_model_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_model_relations ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Users can view content model categories" ON public.content_model_categories FOR SELECT USING (true);
CREATE POLICY "Users can view content model fields" ON public.content_model_fields FOR SELECT USING (true);
CREATE POLICY "Users can view content model validations" ON public.content_model_validations FOR SELECT USING (true);
CREATE POLICY "Users can view content model relations" ON public.content_model_relations FOR SELECT USING (true);

-- Add timestamp triggers
CREATE TRIGGER update_content_model_categories_timestamp
  BEFORE UPDATE ON public.content_model_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_content_model_fields_timestamp
  BEFORE UPDATE ON public.content_model_fields
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_content_model_validations_timestamp
  BEFORE UPDATE ON public.content_model_validations
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_content_model_relations_timestamp
  BEFORE UPDATE ON public.content_model_relations
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

-- Insert sample categories
INSERT INTO public.content_model_categories (name, description) VALUES
('基本', '基本的なコンテンツモデル'),
('応用', '高度な機能を持つコンテンツモデル'),
('カスタム', 'カスタマイズされたコンテンツモデル');

-- Insert sample content models
INSERT INTO public.content_models (name, description, fields) VALUES
('記事', 'ブログ記事用のモデル', '[]'),
('商品', '商品情報用のモデル', '[]'),
('カテゴリー', 'カテゴリー管理用のモデル', '[]'),
('タグ', 'タグ管理用のモデル', '[]'),
('ユーザープロフィール', 'ユーザープロフィール用のモデル', '[]');

-- Insert sample fields
INSERT INTO public.content_model_fields (model_id, name, type, description, required, settings, position) 
SELECT 
  id as model_id,
  'タイトル',
  'text',
  'コンテンツのタイトル',
  true,
  '{"minLength": 1, "maxLength": 100}',
  0
FROM public.content_models WHERE name = '記事';

INSERT INTO public.content_model_fields (model_id, name, type, description, required, settings, position)
SELECT 
  id as model_id,
  '本文',
  'markdown',
  '記事の本文',
  true,
  '{}',
  1
FROM public.content_models WHERE name = '記事';

-- Insert sample validations
INSERT INTO public.content_model_validations (field_id, type, settings, error_message)
SELECT 
  id as field_id,
  'required',
  '{}',
  'タイトルは必須項目です'
FROM public.content_model_fields WHERE name = 'タイトル';

-- Insert sample relations
INSERT INTO public.content_model_relations (name, source_model_id, target_model_id, type, required, on_delete)
SELECT 
  '記事とカテゴリー',
  a.id as source_model_id,
  b.id as target_model_id,
  'manyToOne',
  true,
  'restrict'
FROM public.content_models a, public.content_models b
WHERE a.name = '記事' AND b.name = 'カテゴリー';

INSERT INTO public.content_model_relations (name, source_model_id, target_model_id, type, required, on_delete)
SELECT 
  '記事とタグ',
  a.id as source_model_id,
  b.id as target_model_id,
  'manyToMany',
  false,
  'cascade'
FROM public.content_models a, public.content_models b
WHERE a.name = '記事' AND b.name = 'タグ';