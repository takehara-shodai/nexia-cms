import { useState } from 'react';
import { toast } from 'sonner';
import { createContentWithTags, updateContentWithTags } from '@/features/content/api/contentApi';
import { Content } from '@/features/content/types';
import { useAuth } from '@/shared/hooks/useAuth';

export function useContentForm(
  onSuccess?: (content: Content) => void,
  initialContent?: Partial<Content> | null
) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Default values for required fields
  const defaultStatus = 'f0a6c4b0-7c91-4d1a-9e3a-a3dd76c46fdb'; // Default draft status
  const defaultType = 'f0a6c4b0-7c91-4d1a-9e3a-a3dd76c46fdb'; // Default article type

  const [form, setForm] = useState<Omit<Content, 'id' | 'created_at' | 'updated_at'>>({
    title: initialContent?.title || '',
    content: initialContent?.content || '',
    status: initialContent?.status || 'draft',
    status_id: initialContent?.status_id || defaultStatus,
    type_id: initialContent?.type_id || defaultType,
    tenant_id: initialContent?.tenant_id || user?.tenant_id || null,
    author_id: initialContent?.author_id || user?.id || null,
    tags: initialContent?.tags || [],
  });

  const handleChange = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      toast.error('認証が必要です');
      return;
    }

    setLoading(true);
    try {
      // Ensure author_id is set to the current user's ID
      const contentData = {
        ...form,
        author_id: user.id,
        tenant_id: user.tenant_id || null,
      };

      if (initialContent?.id) {
        // Edit mode
        const updated = await updateContentWithTags(
          initialContent.id,
          contentData,
          contentData.tags || []
        );
        toast.success('コンテンツを更新しました');
        onSuccess?.({ ...contentData, id: updated.id });
      } else {
        // Create mode
        const created = await createContentWithTags(contentData, contentData.tags || []);
        toast.success('コンテンツを作成しました');
        onSuccess?.({ ...contentData, id: created.id });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(error instanceof Error ? error.message : 'エラーが発生しました');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { form, handleChange, handleSubmit, loading };
}
