import { supabase } from '@/lib/supabase';
import { ContentModel, ContentField } from '../types';

export async function createContentModel(
  model: Omit<ContentModel, 'id' | 'created_at' | 'updated_at'>,
  fields: Omit<ContentField, 'id' | 'model_id' | 'created_at' | 'updated_at'>[]
): Promise<ContentModel> {
  // Get user's tenant_id if not provided
  if (!model.tenant_id) {
    const { data: userTenants } = await supabase
      .from('user_tenants')
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

  // Start a transaction by using a single supabase call
  const { data: createdModel, error: modelError } = await supabase
    .from('nexia_cms_content_models')
    .insert([model])
    .select()
    .single();

  if (modelError) {
    console.error('Error creating content model:', modelError);
    throw modelError;
  }

  // Create fields with the model_id
  if (fields.length > 0) {
    const fieldsWithModelId = fields.map((field, index) => ({
      ...field,
      model_id: createdModel.id,
      order_position: index,
    }));

    const { error: fieldsError } = await supabase
      .from('nexia_cms_content_fields')
      .insert(fieldsWithModelId);

    if (fieldsError) {
      console.error('Error creating fields:', fieldsError);
      throw fieldsError;
    }
  }

  return createdModel;
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

export async function updateContentModel(
  id: string,
  model: Partial<ContentModel>,
  fields: Omit<ContentField, 'id' | 'model_id' | 'created_at' | 'updated_at'>[]
): Promise<ContentModel> {
  // Update model
  const { data: updatedModel, error: modelError } = await supabase
    .from('nexia_cms_content_models')
    .update(model)
    .eq('id', id)
    .select()
    .single();

  if (modelError) throw modelError;

  // Delete existing fields
  const { error: deleteError } = await supabase
    .from('nexia_cms_content_fields')
    .delete()
    .eq('model_id', id);

  if (deleteError) throw deleteError;

  // Create new fields
  if (fields.length > 0) {
    const fieldsWithModelId = fields.map((field, index) => ({
      ...field,
      model_id: id,
      order_position: index,
    }));

    const { error: fieldsError } = await supabase
      .from('nexia_cms_content_fields')
      .insert(fieldsWithModelId);

    if (fieldsError) throw fieldsError;
  }

  return updatedModel;
}