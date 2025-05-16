/*
  # コンテンツ管理システムの基本テーブル構造

  1. 新規テーブル
    - nexia_cms_contents: コンテンツ本体を管理
    - nexia_cms_content_versions: コンテンツのバージョン履歴
    - nexia_cms_content_statuses: コンテンツのステータス定義
    - nexia_cms_content_types: コンテンツタイプの定義
    - nexia_cms_categories: カテゴリ管理
    - nexia_cms_tags: タグ管理
    - nexia_cms_content_tags: コンテンツとタグの中間テーブル

  2. セキュリティ
    - 全テーブルでRLSを有効化
    - 適切なポリシーを設定
*/

-- コンテンツステータスの定義テーブル
CREATE TABLE IF NOT EXISTS public.nexia_cms_content_statuses (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    color text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- コンテンツタイプの定義テーブル
CREATE TABLE IF NOT EXISTS public.nexia_cms_content_types (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    schema jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- カテゴリテーブル
CREATE TABLE IF NOT EXISTS public.nexia_cms_categories (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    slug text NOT NULL UNIQUE,
    description text,
    parent_id uuid REFERENCES public.nexia_cms_categories(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- タグテーブル
CREATE TABLE IF NOT EXISTS public.nexia_cms_tags (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    slug text NOT NULL UNIQUE,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- メインのコンテンツテーブル
CREATE TABLE IF NOT EXISTS public.nexia_cms_contents (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text NOT NULL,
    slug text NOT NULL,
    content text,
    excerpt text,
    featured_image text,
    type_id uuid NOT NULL REFERENCES public.nexia_cms_content_types(id),
    status_id uuid NOT NULL REFERENCES public.nexia_cms_content_statuses(id),
    category_id uuid REFERENCES public.nexia_cms_categories(id),
    author_id uuid NOT NULL,
    published_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    metadata jsonb DEFAULT '{}'::jsonb,
    UNIQUE(slug, type_id)
);

-- コンテンツのバージョン管理テーブル
CREATE TABLE IF NOT EXISTS public.nexia_cms_content_versions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id uuid NOT NULL REFERENCES public.nexia_cms_contents(id),
    version_number integer NOT NULL,
    title text NOT NULL,
    content text,
    excerpt text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_by uuid NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- コンテンツとタグの中間テーブル
CREATE TABLE IF NOT EXISTS public.nexia_cms_content_tags (
    content_id uuid REFERENCES public.nexia_cms_contents(id),
    tag_id uuid REFERENCES public.nexia_cms_tags(id),
    created_at timestamptz DEFAULT now(),
    PRIMARY KEY (content_id, tag_id)
);

-- RLSの有効化
ALTER TABLE public.nexia_cms_content_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nexia_cms_content_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nexia_cms_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nexia_cms_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nexia_cms_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nexia_cms_content_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nexia_cms_content_tags ENABLE ROW LEVEL SECURITY;

-- 基本的なポリシーの設定
CREATE POLICY "Users can view content statuses" ON public.nexia_cms_content_statuses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can view content types" ON public.nexia_cms_content_types FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can view categories" ON public.nexia_cms_categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can view tags" ON public.nexia_cms_tags FOR SELECT TO authenticated USING (true);

-- コンテンツに対するポリシー
CREATE POLICY "Users can view their own contents" ON public.nexia_cms_contents
    FOR SELECT TO authenticated
    USING (author_id = auth.uid());

CREATE POLICY "Users can create their own contents" ON public.nexia_cms_contents
    FOR INSERT TO authenticated
    WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can update their own contents" ON public.nexia_cms_contents
    FOR UPDATE TO authenticated
    USING (author_id = auth.uid());

CREATE POLICY "Users can delete their own contents" ON public.nexia_cms_contents
    FOR DELETE TO authenticated
    USING (author_id = auth.uid());

-- バージョン履歴に対するポリシー
CREATE POLICY "Users can view versions of their contents" ON public.nexia_cms_content_versions
    FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.nexia_cms_contents
        WHERE id = content_id AND author_id = auth.uid()
    ));

-- タグ関連付けに対するポリシー
CREATE POLICY "Users can manage tags for their contents" ON public.nexia_cms_content_tags
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.nexia_cms_contents
        WHERE id = content_id AND author_id = auth.uid()
    ));

-- トリガーの作成
CREATE TRIGGER update_nexia_cms_content_statuses_timestamp
    BEFORE UPDATE ON public.nexia_cms_content_statuses
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_nexia_cms_content_types_timestamp
    BEFORE UPDATE ON public.nexia_cms_content_types
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_nexia_cms_categories_timestamp
    BEFORE UPDATE ON public.nexia_cms_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_nexia_cms_tags_timestamp
    BEFORE UPDATE ON public.nexia_cms_tags
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_nexia_cms_contents_timestamp
    BEFORE UPDATE ON public.nexia_cms_contents
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- 初期データの投入
INSERT INTO public.nexia_cms_content_statuses (name, description, color) VALUES
    ('draft', '下書き', 'gray'),
    ('published', '公開済み', 'green'),
    ('archived', 'アーカイブ', 'yellow'),
    ('scheduled', '公開予定', 'blue');

INSERT INTO public.nexia_cms_content_types (name, description) VALUES
    ('page', '固定ページ'),
    ('post', 'ブログ記事'),
    ('news', 'ニュース');