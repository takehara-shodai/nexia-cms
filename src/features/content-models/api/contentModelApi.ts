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

  // スラッグが空文字列の場合はnullに設定
  if (model.slug !== undefined && model.slug?.trim() === '') {
    model.slug = null;
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
    // フィールドをorder_position順でソート
    const sortedFields = [...fields].sort((a, b) => {
      return (a.order_position || 0) - (b.order_position || 0);
    });
    
    // 明示的に順番を付け直す
    const fieldsWithModelId = sortedFields.map((field, index) => ({
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
    .order('created_at', { ascending: false });  // created_atの降順でソート

  if (error) throw error;
  return data;
}

export async function fetchContentFields(modelId: string): Promise<ContentField[]> {
  const { data, error } = await supabase
    .from('nexia_cms_content_fields')
    .select('*')
    .eq('model_id', modelId)
    .order('order_position', { ascending: true }); // order_positionを最優先でソート

  if (error) throw error;
  return data;
}

export async function updateContentModel(
  id: string,
  model: Partial<ContentModel>,
  fields: ContentField[]
): Promise<ContentModel> {
  // モデルの内容が実際に変更されているか確認する
  // name、description、slugなど実際のモデル情報に変更がある場合のみ、モデルを更新
  const hasModelChanges = Object.keys(model).length > 0 && 
    (model.name !== undefined || model.description !== undefined || model.slug !== undefined || model.settings !== undefined);
  
  let updatedModel: ContentModel;
    
  // モデル自体に変更がある場合のみ更新処理を実行
  if (hasModelChanges) {
    // スラッグが空文字列の場合はnullに設定
    if (model.slug !== undefined && model.slug?.trim() === '') {
      model.slug = null;
    }
    
    const { data, error: modelError } = await supabase
      .from('nexia_cms_content_models')
      .update(model)
      .eq('id', id)
      .select()
      .single();
      
    if (modelError) throw modelError;
    updatedModel = data;
  } else {
    // モデル自体に変更がない場合は、現在のモデルデータを取得するだけ
    const { data, error: fetchError } = await supabase
      .from('nexia_cms_content_models')
      .select('*')
      .eq('id', id)
      .single();
      
    if (fetchError) throw fetchError;
    updatedModel = data;
  }

  // 既存のフィールドを取得
  const { data: existingFields, error: fetchError } = await supabase
    .from('nexia_cms_content_fields')
    .select('id')
    .eq('model_id', id);

  if (fetchError) throw fetchError;

  // フィールドを既存のものと新規のものに分ける
  const existingFieldIds = existingFields.map(f => f.id);
  const fieldsToUpdate = fields.filter(f => f.id && existingFieldIds.includes(f.id));
  const fieldsToCreate = fields.filter(f => !f.id || !existingFieldIds.includes(f.id));
  const fieldsToDelete = existingFieldIds.filter(
    existingId => !fields.some(f => f.id === existingId)
  );

  // 削除するフィールドがあれば削除
  if (fieldsToDelete.length > 0) {
    const { error: deleteError } = await supabase
      .from('nexia_cms_content_fields')
      .delete()
      .in('id', fieldsToDelete);

    if (deleteError) throw deleteError;
  }

  // 更新するフィールドがあれば更新
  for (const field of fieldsToUpdate) {
    const { name, type, required, settings, order_position } = field;
    const { error: updateError } = await supabase
      .from('nexia_cms_content_fields')
      .update({ name, type, required, settings, order_position })
      .eq('id', field.id);

    if (updateError) throw updateError;
  }

  // 新規作成するフィールドがあれば作成
  if (fieldsToCreate.length > 0) {
    const newFieldsData = fieldsToCreate.map(field => ({
      model_id: id,
      name: field.name,
      type: field.type,
      required: field.required,
      settings: field.settings,
      order_position: field.order_position,
    }));

    const { error: createError } = await supabase
      .from('nexia_cms_content_fields')
      .insert(newFieldsData);

    if (createError) throw createError;
  }

  return updatedModel;
}

export async function deleteContentModel(id: string): Promise<void> {
  const { error } = await supabase
    .from('nexia_cms_content_models')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting content model:', error);
    throw error;
  }
}
