import { useState } from 'react';
import { createContentWithTags } from '@/features/content/api/contentApi';
import { Content } from '@/features/content/types';

export function useContentForm(onSuccess?: (content: Content) => void) {
  const [form, setForm] = useState<Omit<Content, 'id' | 'created_at' | 'updated_at' | 'author_id'>>({
    title: '',
    content: '',
    status: 'draft',
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