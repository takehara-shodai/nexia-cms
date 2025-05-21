import { useState, useEffect } from 'react';
import { Tag } from '@/features/content/types';
import { fetchTags, createTag } from '@/features/content/api/tagApi';

export function useTagSelect(tenant_id: string) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchTags()
      .then(setTags)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const addTag = async (name: string, color?: string) => {
    setLoading(true);
    try {
      const newTag = await createTag(name, tenant_id, color);
      setTags(prev => [newTag, ...prev]);
      return newTag;
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { tags, loading, error, addTag };
}
