import { useState } from 'react';
import { createContentWithTags } from '@/features/content/api/contentApi';
import { Content } from '@/features/content/types';
import { useAuth } from '@/shared/hooks/useAuth';

export function useContentForm(onSuccess?: (content: Content) => void) {
  const { user } = useAuth();
  const [form, setForm] = useState<Omit<Content, 'id' | 'created_at' | 'updated_at'>>({
    title: '',
    content: '',
    status: 'draft',
    slug: '',
    type_id: '00000000-0000-0000-0000-000000000001', // Default type_id
    tenant_id: user?.app_metadata?.tenant_id,
    author_id: user?.id,
    tags: [],
  });
  const [loading, setLoading] = useState(false);

  const handleChange = <K extends keyof typeof form>(key: K, value: typeof form[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const created = await createContentWithTags(form, form.tags || []);
      onSuccess?.({ ...form, id: created.id });
    } finally {
      setLoading(false);
    }
  };

  return { form, handleChange, handleSubmit, loading };
}