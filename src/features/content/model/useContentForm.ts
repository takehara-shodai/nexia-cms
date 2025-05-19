import { useState } from 'react';
import { createContent } from '@/features/content/api/contentApi';
import { Content } from '@/features/content/types';

export function useContentForm(onSuccess?: (content: Content) => void) {
  const [form, setForm] = useState<Omit<Content, 'id' | 'created_at' | 'updated_at' | 'author_id'>>({
    title: '',
    content: '',
    status: 'draft',
    tags: [],
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (key: keyof typeof form, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const created = await createContent(form);
      onSuccess?.(created);
    } finally {
      setLoading(false);
    }
  };

  return { form, handleChange, handleSubmit, loading };
} 