-- Create content_models table
CREATE TABLE IF NOT EXISTS public.content_models (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  fields JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID
);

-- Create media table
CREATE TABLE IF NOT EXISTS public.media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  size INTEGER NOT NULL,
  dimensions JSONB,
  metadata JSONB DEFAULT '{}',
  folder TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID
);

-- Create analytics_data table
CREATE TABLE IF NOT EXISTS public.analytics_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric TEXT NOT NULL,
  value INTEGER NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE public.content_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_data ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for content_models
CREATE POLICY "Users can view content models" ON public.content_models
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create content models" ON public.content_models
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their content models" ON public.content_models
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their content models" ON public.content_models
  FOR DELETE USING (auth.uid() = user_id);

-- Add RLS policies for media
CREATE POLICY "Users can view media" ON public.media
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can upload media" ON public.media
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their media" ON public.media
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their media" ON public.media
  FOR DELETE USING (auth.uid() = user_id);

-- Add RLS policies for analytics
CREATE POLICY "Users can view analytics" ON public.analytics_data
  FOR SELECT USING (true);

-- Insert sample content models
INSERT INTO public.content_models (name, description, fields) VALUES
(
  'ブログ記事',
  'ブログ投稿のためのコンテンツモデル',
  '[
    {"name": "タイトル", "type": "text", "required": true},
    {"name": "本文", "type": "markdown", "required": true},
    {"name": "サムネイル", "type": "media", "required": false},
    {"name": "公開日", "type": "date", "required": true},
    {"name": "タグ", "type": "array", "required": false}
  ]'
),
(
  '製品情報',
  '製品カタログのためのコンテンツモデル',
  '[
    {"name": "製品名", "type": "text", "required": true},
    {"name": "価格", "type": "number", "required": true},
    {"name": "説明", "type": "markdown", "required": true},
    {"name": "画像ギャラリー", "type": "media", "required": false, "multiple": true},
    {"name": "在庫数", "type": "number", "required": true}
  ]'
);

-- Insert sample media
INSERT INTO public.media (name, type, url, size, dimensions, folder) VALUES
(
  'hero-image.jpg',
  'image',
  'https://images.pexels.com/photos/2387418/pexels-photo-2387418.jpeg',
  2400000,
  '{"width": 1920, "height": 1080}',
  'ヒーロー画像'
),
(
  'product-catalog.pdf',
  'document',
  'https://example.com/catalog.pdf',
  5100000,
  null,
  'カタログ'
),
(
  'promotional-video.mp4',
  'video',
  'https://example.com/promo.mp4',
  15800000,
  '{"width": 1920, "height": 1080}',
  'プロモーション'
);

-- Insert sample analytics data
INSERT INTO public.analytics_data (metric, value, date) VALUES
('page_views', 1234, CURRENT_DATE),
('unique_visitors', 567, CURRENT_DATE),
('bounce_rate', 45, CURRENT_DATE),
('avg_session_duration', 180, CURRENT_DATE);

-- Add timestamp triggers to new tables
CREATE TRIGGER update_content_models_timestamp
  BEFORE UPDATE ON public.content_models
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_media_timestamp
  BEFORE UPDATE ON public.media
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();