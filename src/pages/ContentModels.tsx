import React, { useState, useCallback } from 'react';
import { Plus, Search, Filter, MoreVertical, Text, Hash, Calendar, Image, List, Pencil, Trash } from 'lucide-react';
import { ContentModel, ContentField } from '@/features/content-models/types';
import { toast } from 'sonner';
import { useModal } from '@/shared/contexts/modal/hooks';
import { ContentModelForm, FormControlHandle } from '@/features/content-models/ui/ContentModelForm';
import { Button } from '@/shared/ui/atoms/Button';
import { useContentModels, useAllContentFields, useCreateContentModel, useUpdateContentModel, useDeleteContentModel } from '@/features/content-models/api/hooks/useContentModels';


const ContentModels: React.FC = () => {
  const { showModal, hideModal } = useModal();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  
  // React Queryフックを使用してデータを取得
  const { data: models = [], isLoading: loading } = useContentModels();
  
  // モデルIDの配列を取得
  const modelIds = models.map(model => model.id);
  
  // すべてのモデルのフィールドをキャッシュ付きで一括取得
  const { data: modelFields = {} } = useAllContentFields(modelIds);
  
  // ミューテーションフックを取得
  const createModel = useCreateContentModel();
  const updateModel = useUpdateContentModel();
  const deleteModel = useDeleteContentModel();
  
  // コンポーネントのトップレベルで formRef を定義
  const formRef = React.useRef<FormControlHandle>(null);

  const handleCreateModel = () => {
    const newModel = {
      id: '',
      tenant_id: null,
      name: '',
      slug: '',
      description: '',
      settings: {},
      created_at: '',
      updated_at: '',
    };
    
    // formRefはコンポーネントのトップレベルで定義済み
    showModal({
      title: '新規コンテンツモデル',
      size: '4xl', // 幅を大きく設定
      content: (
        <div className="w-full">
          <ContentModelForm
            initialModel={newModel}
            formRef={formRef}
            onSubmit={async (model, fields) => {
              try {
                await createModel.mutateAsync({ model, fields });
                toast.success('コンテンツモデルを作成しました');
                // React Queryが自動的にデータを更新
              } catch (error) {
                console.error('Error creating model:', error);
                toast.error('コンテンツモデルの作成に失敗しました');
              } finally {
                hideModal();
              }
            }}
          />
        </div>
      ),
      footer: (
        <div className="w-full flex items-center justify-between">
          <Button 
            type="button" 
            onClick={() => formRef.current?.addField()} 
            variant="outline" 
            size="sm"
          >
            <Plus size={16} className="mr-2" />
            フィールドを追加
          </Button>
          <Button 
            type="button" 
            onClick={() => formRef.current?.submit()}
            variant="primaryFilled"
          >
            保存
          </Button>
        </div>
      ),
    });
  };

  const handleEditModel = (model: ContentModel) => {
    // キャッシュからフィールドを取得
    const fields = modelFields[model.id] || [];
    
    // formRefはコンポーネントのトップレベルで定義済み
    showModal({
      title: 'コンテンツモデルを編集',
      size: '4xl', // 幅を大きく設定
      content: (
        <div className="w-full">
          <ContentModelForm
            initialModel={model}
            initialFields={fields}
            formRef={formRef}
            onSubmit={async (updatedModel, updatedFields) => {
              try {
                await updateModel.mutateAsync({ 
                  id: model.id, 
                  model: updatedModel, 
                  fields: updatedFields 
                });
                toast.success('コンテンツモデルを更新しました');
                // React Queryが自動的にデータを更新
              } catch (error) {
                console.error('Error updating model:', error);
                toast.error('コンテンツモデルの更新に失敗しました');
              } finally {
                hideModal();
              }
            }}
          />
        </div>
      ),      footer: (
        <div className="w-full flex items-center justify-between">
          <Button 
            type="button" 
            onClick={() => formRef.current?.addField()} 
            variant="outline" 
            size="sm"
          >
            <Plus size={16} className="mr-2" />
            フィールドを追加
          </Button>
          <Button 
            type="button" 
            onClick={() => formRef.current?.submit()}
            variant="primaryFilled"
          >
            保存
          </Button>
        </div>
      ),
    });
  };

  const handleDeleteModel = useCallback((model: ContentModel) => {
    showModal({
      title: `「${model.name}」を削除しますか？`,
      size: 'md', // 標準サイズ
      content: 'この操作は取り消せません。',
      footer: (
        <>
          <button
            onClick={hideModal} // Close modal
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            キャンセル
          </button>
          <button
            onClick={async () => {
              try {
                await deleteModel.mutateAsync(model.id);
                toast.success('コンテンツモデルを削除しました');
                // React Queryが自動的にデータを更新
              } catch (error) {
                console.error('Error deleting model:', error);
                toast.error('コンテンツモデルの削除に失敗しました');
              } finally {
                hideModal(); // Close modal
              }
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            削除
          </button>
        </>
      ),
    });
  }, [showModal, hideModal, deleteModel]);

  const getFieldIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <Text size={16} />;
      case 'number':
        return <Hash size={16} />;
      case 'date':
        return <Calendar size={16} />;
      case 'image':
        return <Image size={16} />;
      case 'array':
        return <List size={16} />;
      default:
        return <Text size={16} />;
    }
  };

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">コンテンツモデル</h1>
          <p className="text-gray-600 dark:text-gray-400">コンテンツの構造を定義・管理します</p>
        </div>
        <button
          onClick={handleCreateModel}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          <span>新規モデル</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="モデルを検索..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Filter size={20} />
            <span>フィルター</span>
          </button>
        </div>
      </div>

      {/* Models List */}
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="space-y-4">
          {models.map(model => (
            <div
              key={model.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-medium mb-1">{model.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{model.description}</p>
                </div>
                <div className="relative">
                  <button 
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    onClick={() => setActiveMenu(activeMenu === model.id ? null : model.id)}
                  >
                    <MoreVertical size={20} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {activeMenu === model.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                      <button
                        onClick={() => {
                          handleEditModel(model);
                          setActiveMenu(null); // ドロップダウンメニューを閉じる
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <Pencil size={16} />
                        <span>編集</span>
                      </button>
                      <button
                        onClick={() => {
                          handleDeleteModel(model);
                          setActiveMenu(null); // ドロップダウンメニューを閉じる
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600 dark:text-red-400"
                      >
                        <Trash size={16} />
                        <span>削除</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {modelFields[model.id]?.map((field: ContentField) => (
                  <div key={field.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="p-2 bg-white dark:bg-gray-700 rounded-md">
                      {getFieldIcon(field.type)}
                    </div>
                    <div>
                      <p className="font-medium">{field.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {field.type} {field.required && '(必須)'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                作成日: {new Date(model.created_at!).toLocaleDateString()} 
                更新日: {new Date(model.updated_at!).toLocaleDateString()} 
                フィールド数: {modelFields[model.id]?.length || 0}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 不要なモーダルセクションを削除 */}
    </div>
  );
};

export default ContentModels;
