import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { ContentModel, ContentField } from '@/features/content-models/types';
import { createContentModel, createContentField, fetchContentModels } from '@/features/content-models/api/contentModelApi';
import { ContentModelForm } from '@/features/content-models/ui/ContentModelForm';
import { toast } from 'sonner';

const ContentModels: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [models, setModels] = useState<ContentModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      setLoading(true);
      const data = await fetchContentModels();
      setModels(data);
    } catch (error) {
      console.error('Error loading models:', error);
      toast.error('モデルの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateModel = async (
    model: Omit<ContentModel, 'id'>,
    fields: Omit<ContentField, 'id'>[]
  ) => {
    try {
      const createdModel = await createContentModel(model);
      
      // Create fields with the new model ID
      await Promise.all(
        fields.map(field =>
          createContentField({
            ...field,
            model_id: createdModel.id,
          })
        )
      );

      toast.success('コンテンツモデルを作成しました');
      setShowCreateModal(false);
      loadModels();
    } catch (error) {
      console.error('Error creating model:', error);
      toast.error('コンテンツモデルの作成に失敗しました');
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
          onClick={() => setShowCreateModal(true)}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map(model => (
            <div
              key={model.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <h2 className="text-lg font-medium mb-2">{model.name}</h2>
              {model.description && (
                <p className="text-gray-600 dark:text-gray-400 mb-4">{model.description}</p>
              )}
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>スラッグ: {model.slug}</p>
                <p>作成日: {new Date(model.created_at!).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowCreateModal(false)}
          ></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl m-4">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">新規コンテンツモデル</h2>
              <ContentModelForm onSubmit={handleCreateModel} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentModels;