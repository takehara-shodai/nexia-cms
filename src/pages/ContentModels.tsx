import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreVertical, Text, Hash, Calendar, Image, List, Pencil, Trash } from 'lucide-react';
import { ContentModel } from '@/features/content-models/types';
import { createContentModel, createContentField, fetchContentModels, fetchContentFields } from '@/features/content-models/api/contentModelApi';
import { ContentModelForm } from '@/features/content-models/ui/ContentModelForm';
import { toast } from 'sonner';

const ContentModels: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [models, setModels] = useState<ContentModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [editingModel, setEditingModel] = useState<ContentModel | null>(null);
  const [editingFields, setEditingFields] = useState<any[]>([]);

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
    fields: any[]
  ) => {
    try {
      const createdModel = await createContentModel(model);
      
      await Promise.all(
        fields.map(field =>
          createContentField({
            ...field,
            model_id: createdModel.id,
          })
        )
      );

      toast.success('コンテンツモデルを作成しました');
      setShowModal(false);
      setEditingModel(null);
      setEditingFields([]);
      loadModels();
    } catch (error) {
      console.error('Error creating model:', error);
      toast.error('コンテンツモデルの作成に失敗しました');
    }
  };

  const handleEditModel = async (model: ContentModel) => {
    try {
      const fields = await fetchContentFields(model.id);
      setEditingModel(model);
      setEditingFields(fields);
      setShowModal(true);
      setActiveMenu(null);
    } catch (error) {
      console.error('Error loading fields:', error);
      toast.error('フィールドの読み込みに失敗しました');
    }
  };

  const handleDeleteModel = (model: ContentModel) => {
    // Handle delete
    console.log('Delete model:', model);
    setActiveMenu(null);
  };

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

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingModel(null);
    setEditingFields([]);
  };

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">コンテンツモデル</h1>
          <p className="text-gray-600 dark:text-gray-400">コンテンツの構造を定義・管理します</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
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
                        onClick={() => handleEditModel(model)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <Pencil size={16} />
                        <span>編集</span>
                      </button>
                      <button
                        onClick={() => handleDeleteModel(model)}
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
                {/* Example fields - replace with actual fields data */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="p-2 bg-white dark:bg-gray-700 rounded-md">
                    {getFieldIcon('text')}
                  </div>
                  <div>
                    <p className="font-medium">タイトル</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">text (必須)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="p-2 bg-white dark:bg-gray-700 rounded-md">
                    {getFieldIcon('text')}
                  </div>
                  <div>
                    <p className="font-medium">本文</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">text (必須)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="p-2 bg-white dark:bg-gray-700 rounded-md">
                    {getFieldIcon('date')}
                  </div>
                  <div>
                    <p className="font-medium">公開日</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">date (必須)</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                作成日: {new Date(model.created_at!).toLocaleDateString()} 更新日: {new Date(model.updated_at!).toLocaleDateString()} フィールド数: 5
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={handleCloseModal}
          ></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl m-4">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingModel ? 'コンテンツモデルを編集' : '新規コンテンツモデル'}
              </h2>
              <ContentModelForm 
                onSubmit={handleCreateModel} 
                initialModel={editingModel}
                initialFields={editingFields}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentModels;