import { supabase } from '@/lib/supabase';
import { Tag } from '@/features/content/types';

export async function fetchTags(): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('nexia_cms_tags')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Tag[];
}

export async function createTag(name: string, tenant_id: string, color?: string): Promise<Tag> {
  const { data, error } = await supabase
    .from('nexia_cms_tags')
    .insert([{ name, color, tenant_id }])
    .select('*')
    .single();
  if (error) throw error;
  return data as Tag;
} 