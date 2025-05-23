-- スラッグカラムをNULL許容に変更する
ALTER TABLE public.nexia_cms_content_models 
ALTER COLUMN slug DROP NOT NULL;
