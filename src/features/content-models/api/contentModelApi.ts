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

  // Split insert and select into separate operations
  const { data: insertedData, error: insertError } = await supabase
    .from('nexia_cms_content_models')
    .insert([model])
    .select('id')
    .single();

  if (insertError) {
    console.error('Error creating content model:', insertError);
    throw insertError;
  }

  // Fetch the complete model data in a separate query
  const { data: completeData, error: selectError } = await supabase
    .from('nexia_cms_content_models')
    .select('*')
    .eq('id', insertedData.id)
    .single();

  if (selectError) {
    console.error('Error fetching created model:', selectError);
    // Return partial data if select fails
    return { ...model, id: insertedData.id };
  }

  return completeData;
}

export async function createContentField(
  field: Omit<ContentField, 'id' | 'created_at' | 'updated_at'>
): Promise<ContentField> {
  const { data, error } = await supabase
    .from('nexia_cms_content_fields')
    .insert([field])
    .select('id')
    .single();

  if (error) throw error;

  // Fetch complete field data
  const { data: completeData, error: selectError } = await supabase
    .from('nexia_cms_content_fields')
    .select('*')
    .eq('id', data.id)
    .single();

  if (selectError) {
    // Return partial data if select fails
    return { ...field, id: data.id };
  }

  return completeData;
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