import { supabase } from '@/lib/supabase';
import { Content, Tag } from '@/features/content/types';
import { toast } from 'sonner';

export const fetchContents = async (): Promise<Content[]> => {
  try {
    console.log('Fetching contents from Supabase...');
    const { data, error } = await supabase
      .from('nexia_cms_contents')
      .select(
        `
        *,
        tags:nexia_cms_content_tags(
          tag:nexia_cms_tags(*)
        )
      `
      )
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching contents:', error);
      throw error;
    }

    console.log('Contents fetched successfully:', data);
    return data as Content[];
  } catch (error) {
    console.error('Unexpected error in fetchContents:', error);
    throw error;
  }
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
          .insert([
            {
              name: tag.name,
              color: tag.color,
              tenant_id: tag.tenant_id || null, // 空文字列の場合はnullに変換
            },
          ])
          .select('id')
          .single();
        if (createError) throw createError;
        tagIds.push(created.id);
      }
    }
  }
  return tagIds;
}

export async function createContentWithTags(
  content: Omit<Content, 'id' | 'created_at' | 'updated_at'>,
  tags: Tag[]
) {
  // 空文字列の場合はnullに変換し、デフォルト値を設定する（DBの制約違反を防ぐため）
  const defaultTypeId = 'f0a6c4b0-7c91-4d1a-9e3a-a3dd76c46fdb'; // デフォルトの記事タイプID
  const defaultStatusId = 'f0a6c4b0-7c91-4d1a-9e3a-a3dd76c46fdb'; // デフォルトの下書きステータスID

  const payload = {
    title: content.title,
    content: content.content,
    status: content.status || 'draft',
    status_id: content.status_id || defaultStatusId,
    type_id: content.type_id || defaultTypeId,
    tenant_id: content.tenant_id || null,
    author_id: content.author_id || null,
  };

  console.log('Creating content with payload:', payload);

  // 1. コンテンツ本体をinsert
  const { data: contentData, error: contentError } = await supabase
    .from('nexia_cms_contents')
    .insert([payload])
    .select('id')
    .single();
  if (contentError) throw contentError;

  // 2. タグIDを確定
  const tagIds = await ensureTags(
    tags.map(tag => ({
      ...tag,
      tenant_id: content.tenant_id,
    }))
  );

  // 3. 中間テーブルにinsert
  const contentTags = tagIds.map(tag_id => ({
    content_id: contentData.id,
    tag_id,
  }));
  if (contentTags.length > 0) {
    const { error: linkError } = await supabase.from('nexia_cms_content_tags').insert(contentTags);
    if (linkError) throw linkError;
  }

  return contentData;
}

// 既存の中間テーブルのタグ関連付けを削除
async function removeContentTags(contentId: string) {
  const { error } = await supabase
    .from('nexia_cms_content_tags')
    .delete()
    .eq('content_id', contentId);
  if (error) throw error;
}

export async function updateContentWithTags(
  id: string,
  content: Omit<Content, 'id' | 'created_at' | 'updated_at'>,
  tags: Tag[]
) {
  try {
    // デフォルト値を設定（外部キー制約違反の回避）
    const defaultTypeId = 'f0a6c4b0-7c91-4d1a-9e3a-a3dd76c46fdb'; // デフォルトの記事タイプID
    const defaultStatusId = 'f0a6c4b0-7c91-4d1a-9e3a-a3dd76c46fdb'; // デフォルトの下書きステータスID

    // タイトルのみ更新する最小限のペイロード
    const minimalPayload = {
      title: content.title,
      type_id: content.type_id || defaultTypeId,
      status_id: content.status_id || defaultStatusId,
    };

    console.log('Updating content with minimal payload:', minimalPayload);

    // 1. コンテンツ本体をupdate - 最小限の情報のみ
    const { data: contentData, error: contentError } = await supabase
      .from('nexia_cms_contents')
      .update(minimalPayload)
      .eq('id', id)
      .select('id')
      .single();

    if (contentError) {
      console.error('Update error:', contentError);
      console.error('Error details:', JSON.stringify(contentError, null, 2));
      throw contentError;
    }

    console.log('Basic content update successful');

    // 2. タグIDを確定
    const tagIds = await ensureTags(
      tags.map(tag => ({
        ...tag,
        tenant_id: content.tenant_id === '' ? null : content.tenant_id,
      }))
    );

    // 3. 既存のタグ関連付けを削除
    await removeContentTags(id);

    // 4. 中間テーブルにinsert
    if (tagIds.length > 0) {
      const contentTags = tagIds.map(tag_id => ({
        content_id: id,
        tag_id,
      }));

      const { error: linkError } = await supabase
        .from('nexia_cms_content_tags')
        .insert(contentTags);

      if (linkError) {
        console.error('Error linking tags:', linkError);
        // タグエラーは処理を続行
      }
    }

    return contentData;
  } catch (error) {
    console.error('Error in updateContentWithTags:', error);
    throw error;
  }
}

// コンテンツ削除機能
export async function deleteContent(id: string): Promise<void> {
  try {
    // まずタグの関連付けを削除
    await removeContentTags(id);

    // コンテンツ本体を削除
    const { error } = await supabase.from('nexia_cms_contents').delete().eq('id', id);

    if (error) {
      console.error('Error deleting content:', error);
      toast.error('コンテンツの削除に失敗しました');
      throw error;
    }

    toast.success('コンテンツを削除しました');
    console.log('Content deleted successfully');
  } catch (error) {
    console.error('Failed to delete content:', error);
    toast.error('コンテンツの削除に失敗しました');
    throw error;
  }
}
