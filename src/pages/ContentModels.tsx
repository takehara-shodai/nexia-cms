import React, { useState, useEffect } from 'react';
import { Text, Hash, Calendar, Image as ImageIcon, List, MoreVertical, Plus } from 'lucide-react';
import { ContentModel, ContentField } from '@/features/content-models/types';
import { fetchContentModels, fetchContentFields, createContentModel, updateContentModel } from '@/features/content-models/api/contentModelApi';
import { ContentModelForm } from '@/features/content-models/ui/ContentModelForm';
import { toast } from 'sonner';
import Modal from '@/components/common/Modal';

const ContentModels: React.FC = () => {
  const [models, setModels] = useState<ContentModel[]>([]);
  const [fields, setFields] = useState<Record<string, ContentField[]>>({});
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingModel, setEditingModel] = useState<{model: ContentModel, fields: ContentField[]} | null>(null);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      setLoading(true);
      const modelData = await fetchContentModels();
      setModels(modelData);

      // Fetch fields for each model
      const fieldsData: Record<string, ContentField[]> = {};
      for (const model of modelData) {
        const modelFields = await fetchContentFields(model.id);
        fieldsData[model.id] = modelFields;
      }
      setFields(fieldsData);
    } catch (error) {
      console.error('Error loading models:', error);
      toast.error('モデルの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateModel = async (model: Omit<ContentModel, 'id'>, modelFields: Omit<ContentField, 'id'>[]) => {
    try {
      await createContentModel(model, modelFields);
      toast.success('モデルを作成しました');
      setShowModal(false);
      loadModels();
    } catch (error) {
      console.error('Error creating model:', error);
      toast.error('モデルの作成に失敗しました');
    }
  };

  const handleUpdateModel = async (model: Omit<ContentModel, 'id'>, modelFields: Omit<ContentField, 'id'>[]) => {
    if (!editingModel) return;
    
    try {
      await updateContentModel(editingModel.model.id, model, modelFields);
      toast.success('モデルを更新しました');
      setShowModal(false);
      setEditingModel(null);
      loadModels();
    } catch (error) {
      console.error('Error updating model:', error);
      toast.error('モデルの更新に失敗しました');
    }
  };

  const handleEdit = async (modelId: string) => {
    const model = models.find(m => m.id === modelId);
    const modelFields = fields[modelId] || [];
    if (model) {
      setEditingModel({ model, fields: modelFields });
      setShowModal(true);
    }
    setActiveMenu(null);
  };

  const handleDelete = async (modelId: string) => {
    try {
      const { error } = await supabase
        .from('nexia_cms_content_models')
        .delete()
        .eq('id', modelId);

      if (error) throw error;
      toast.success('モデルを削除しました');
      loadModels();
    } catch (error) {
      console.error('Error deleting model:', error);
      toast.error('モデルの削除に失敗しました');
    }
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
        return <ImageIcon size={16} />;
      case 'array':
        return <List size={16} />;
      default:
        return <Text size={16} />;
    }
  };

  const handleMenuClick = (modelId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === modelId ? null : modelId);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">コンテンツモデル</h1>
          <p className="text-gray-600 dark:text-gray-400">コンテンツの構造を定義・管理します</p>
        </div>
        <button
          onClick={() => {
            setEditingModel(null);
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          <span>新規モデル作成</span>
        </button>
      </div>

      {models.map(model => (
        <div
          key={model.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-medium">{model.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{model.description}</p>
            </div>
            <div className="relative">
              <button
                onClick={(e) => handleMenuClick(model.id, e)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <MoreVertical size={20} />
              </button>
              
              {activeMenu === model.id && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                  <button
                    onClick={() => handleEdit(model.id)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDelete(model.id)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600"
                  >
                    削除
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {fields[model.id]?.map((field, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
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
            作成日: {model.created_at} 更新日: {model.updated_at} フィールド数: {fields[model.id]?.length || 0}
          </div>
        </div>
      ))}

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingModel(null);
        }}
        title={editingModel ? 'モデルを編集' : '新規モデル作成'}
      >
        <ContentModelForm
          onSubmit={editingModel ? handleUpdateModel : handleCreateModel}
          initialModel={editingModel?.model}
          initialFields={editingModel?.fields}
        />
      </Modal>
    </div>
  );
};

export default ContentModels;