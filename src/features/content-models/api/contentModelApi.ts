import { supabase } from '@/lib/supabase';
import { ContentModel, ContentField } from '../types';

export async function createContentModel(
  model: Omit<ContentModel, 'id' | 'created_at' | 'updated_at'>
): Promise<ContentModel> {
  // Get user's tenant_id if not provided
  if (!model.tenant_id) {
    const { data: userTenants } = await supabase
      .from('nexia_cms_user_tenants')
      .select('tenant_id')
      .limit(1)
      .single();
    
    if (userTenants) {
      model.tenant_id = userTenants.tenant_id;
    }
  }

  // Generate slug if not provided
  if (!model.slug) {
    model.slug = model.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }

  // Create the content model
  const { data, error } = await supabase
    .from('nexia_cms_content_models')
    .insert([model])
    .select()
    .single();

  if (error) {
    console.error('Error creating content model:', error);
    throw error;
  }

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