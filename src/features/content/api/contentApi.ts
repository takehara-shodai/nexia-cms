import { supabase } from '@/lib/supabase';
import { Content, Tag } from '@/features/content/types';
import { demoContents } from '../data/demo';

export const fetchContents = async (): Promise<Content[]> => {
  const { data, error } = await supabase
    .from('nexia-cms-contents')
    .select(`
      *,
      tags:nexia_cms_content_tags(
        tag:nexia_cms_tags(*)
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching contents:', error);
    // デモデータを返す
    return demoContents;
  }

  return data.map(content => ({
    ...content,
    tags: content.tags?.map((t: any) => t.tag) || [],
  }));
};

export const createContentWithTags = async (
  content: Omit<Content, 'id' | 'created_at' | 'updated_at' | 'author_id'>,
  tags: Tag[]
) => {
  // 1. コンテンツ本体をinsert
  const { data: contentData, error: contentError } = await supabase
    .from('nexia-cms-contents')
    .insert([{
      title: content.title,
      content: content.content,
      status: content.status || 'draft' // Ensure status is either 'draft' or 'published'
    }])
    .select('*')
    .single();

  if (contentError) throw contentError;

  // 2. タグIDを確定
  const tagIds = await ensureTags(tags);

  // 3. 中間テーブルにinsert
  const contentTags = tagIds.map(tag_id => ({
    content_id: contentData.id,
    tag_id,
  }));

  if (contentTags.length > 0) {
    const { error: linkError } = await supabase
      .from('nexia_cms_content_tags')
      .insert(contentTags);
    if (linkError) throw linkError;
  }

  return contentData;
};

// タグが未登録なら追加し、全てのタグIDを返す
async function ensureTags(tags: Tag[]): Promise<string[]> {
  const tagIds: string[] = [];
  for (const tag of tags) {
    if (tag.id) {
      tagIds.push(tag.id);
    } else {
      // nameで既存タグを検索
      const { data: existing, error: findError } = await supabase
        .from('nexia_cms_tags')
        .select('id')
        .eq('name', tag.name)
        .maybeSingle();
      if (findError) throw findError;
      if (existing) {
        tagIds.push(existing.id);
      } else {
        // 新規タグ追加
        const { data: created, error: createError } = await supabase
          .from('nexia_cms_tags')
          .insert([{ name: tag.name, color: tag.color }])
          .select('id')
          .single();
        if (createError) throw createError;
        tagIds.push(created.id);
      }
    }
  }
  return tagIds;
}