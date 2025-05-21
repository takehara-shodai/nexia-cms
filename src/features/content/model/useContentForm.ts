import { useState } from 'react';
import { createContentWithTags, updateContentWithTags } from '@/features/content/api/contentApi';
import { Content } from '@/features/content/types';
import { useAuth } from '@/shared/hooks/useAuth';

export function useContentForm(onSuccess?: (content: Content) => void, initialContent?: Partial<Content> | null) {
  const { user } = useAuth();
  console.log('useContentForm initialized with initialContent:', initialContent);
  console.log('Current user:', user);
  
  // 初期化時のデフォルト値をログに出力
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
  
  console.log('Form initialized with:', form);

  const [loading, setLoading] = useState(false);

  const handleChange = <K extends keyof typeof form>(key: K, value: typeof form[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      console.log('Form submit - Current form data:', form);
      console.log('Initial content:', initialContent);
      
      if (initialContent?.id) {
        // 編集モード
        console.log(`Updating content with ID: ${initialContent.id}`);
        try {
          const updated = await updateContentWithTags(initialContent.id, form, form.tags || []);
          console.log('Update successful:', updated);
          onSuccess?.({ ...form, id: updated.id });
        } catch (error) {
          console.error('Error updating content:', error);
          throw error;
        }
      } else {
        // 新規作成モード
        console.log('Creating new content');
        try {
          const created = await createContentWithTags(form, form.tags || []);
          console.log('Creation successful:', created);
          onSuccess?.({ ...form, id: created.id });
        } catch (error) {
          console.error('Error creating content:', error);
          throw error;
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { form, handleChange, handleSubmit, loading };
}
