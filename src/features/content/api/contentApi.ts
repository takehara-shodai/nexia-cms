import { supabase } from '@/lib/supabase';
import { Content, Tag } from '@/features/content/types';

// TODO: Supabaseクライアントを使用した実装に置き換える
export const fetchContents = async (): Promise<Content[]> => {
  // ダミーデータ（後でSupabaseから取得するように変更）
  return [
    {
      id: '1',
      title: '2024年のトレンド予測',
      type: 'article',
      status: 'published',
      content: '2024年のトレンドを徹底予測します。',
      tags: [
        { id: 'tag1', name: 'トレンド' },
        { id: 'tag2', name: '予測' },
      ],
      updated_at: '2024-03-10',
      created_at: '2024-03-01',
      publishedAt: '2024-03-05',
      url: '/blog/2024-trends',
      views: 1234,
      likes: 56,
      comments: 12,
    },
    {
      id: '2',
      title: '新製品発表会レポート（下書き）',
      type: 'report',
      status: 'draft',
      content: '新製品発表会の詳細レポート。',
      tags: [
        { id: 'tag3', name: 'レポート' },
      ],
      updated_at: '2024-03-09',
      created_at: '2024-03-09',
      dueDate: '2024-03-20',
      description: '新製品発表会の詳細レポート。画像の追加が必要。',
    },
    {
      id: '3',
      title: 'サービス利用ガイド改訂版',
      type: 'guide',
      status: 'published',
      content: 'サービス利用ガイドの改訂版です。',
      tags: [
        { id: 'tag4', name: 'ガイド' },
      ],
      updated_at: '2024-03-08',
      created_at: '2024-03-05',
      publishedAt: '2024-03-08',
      url: '/guides/service',
      views: 567,
      likes: 23,
      comments: 5,
    },
    {
      id: '4',
      title: '2023年度総括',
      type: 'report',
      status: 'archived',
      content: '2023年度の総括です。',
      tags: [
        { id: 'tag5', name: '総括' },
      ],
      updated_at: '2024-01-15',
      created_at: '2024-01-10',
    },
  ];
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

export async function createContentWithTags(content: Omit<Content, 'id' | 'created_at' | 'updated_at' | 'author_id'>, tags: Tag[]) {
  // 1. コンテンツ本体をinsert
  const { data: contentData, error: contentError } = await supabase
    .from('nexia_cms_contents')
    .insert([{
      title: content.title,
      content: content.content,
      status: content.status,
    }])
    .select('id')
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
} 