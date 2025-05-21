import { supabase } from '@/lib/supabase';
import { ContentModel, ContentField } from '../types';

export async function createContentModel(
  model: Omit<ContentModel, 'id' | 'created_at' | 'updated_at'>
): Promise<ContentModel> {
  const { data, error } = await supabase
    .from('nexia_cms_content_models')
    .insert([model])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createContentField(
  field: Omit<ContentField, 'id' | 'created_at' | 'updated_at'>
): Promise<ContentField> {
  const { data, error } = await supabase
    .from('nexia_cms_content_fields')
    .insert([field])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchContentModels(): Promise<ContentModel[]> {
  const { data, error } = await supabase
    .from('nexia_cms_content_models')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function fetchContentFields(modelId: string): Promise<ContentField[]> {
  const { data, error } = await supabase
    .from('nexia_cms_content_fields')
    .select('*')
    .eq('model_id', modelId)
    .order('order_position', { ascending: true });

  if (error) throw error;
  return data;
}