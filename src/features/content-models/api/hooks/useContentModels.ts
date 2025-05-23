import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchContentModels, 
  fetchContentFields,
  createContentModel,
  updateContentModel,
  deleteContentModel
} from '../contentModelApi';
import { ContentModel, ContentField } from '../../types';

// キャッシュのキー
export const queryKeys = {
  contentModels: 'contentModels',
  contentFields: (modelId: string) => ['contentFields', modelId],
};

// コンテンツモデル一覧を取得するフック
export const useContentModels = () => {
  return useQuery({
    queryKey: [queryKeys.contentModels],
    queryFn: () => fetchContentModels(),
  });
};

// 特定のモデルのフィールド一覧を取得するフック
export const useContentFields = (modelId: string) => {
  return useQuery({
    queryKey: queryKeys.contentFields(modelId),
    queryFn: () => fetchContentFields(modelId),
    // モデルIDがない場合は実行しない
    enabled: !!modelId,
  });
};

// 複数モデルのフィールド一覧を取得するフック
export const useAllContentFields = (modelIds: string[]) => {
  return useQuery({
    queryKey: ['allContentFields', ...modelIds],
    queryFn: async () => {
      if (modelIds.length === 0) return {};
      
      const fieldsPromises = modelIds.map(modelId => 
        fetchContentFields(modelId).then(fields => [modelId, fields])
      );
      
      const fieldsData = await Promise.all(fieldsPromises);
      return Object.fromEntries(fieldsData);
    },
    // モデルIDがない場合は実行しない
    enabled: modelIds.length > 0,
  });
};

// コンテンツモデルを作成するフック
export const useCreateContentModel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      model, 
      fields 
    }: { 
      model: Omit<ContentModel, 'id' | 'created_at' | 'updated_at'>, 
      fields: Omit<ContentField, 'id' | 'model_id' | 'created_at' | 'updated_at'>[]
    }) => createContentModel(model, fields),
    onSuccess: () => {
      // 成功したらキャッシュを更新
      queryClient.invalidateQueries({ queryKey: [queryKeys.contentModels] });
    }
  });
};

// コンテンツモデルを更新するフック
export const useUpdateContentModel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      id,
      model, 
      fields 
    }: { 
      id: string,
      model: Partial<ContentModel>, 
      fields: ContentField[]
    }) => updateContentModel(id, model, fields),
    onSuccess: (_, variables) => {
      // 成功したらキャッシュを更新
      queryClient.invalidateQueries({ queryKey: [queryKeys.contentModels] });
      queryClient.invalidateQueries({ queryKey: queryKeys.contentFields(variables.id) });
      queryClient.invalidateQueries({ queryKey: ['allContentFields'] });
    }
  });
};

// コンテンツモデルを削除するフック
export const useDeleteContentModel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteContentModel(id),
    onSuccess: () => {
      // 成功したらキャッシュを更新
      queryClient.invalidateQueries({ queryKey: [queryKeys.contentModels] });
    }
  });
};
