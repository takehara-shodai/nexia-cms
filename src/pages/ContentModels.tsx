import React, { useState } from 'react';
import {
  Plus,
  Search,
  MoreVertical,
  Database,
  Hash,
  Calendar,
  Type,
  Image,
  List,
  ToggleLeft as Toggle,
} from 'lucide-react';

interface ContentModel {
  id: string;
  name: string;
  description: string;
  fields: ModelField[];
  createdAt: string;
  updatedAt: string;
}

interface ModelField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'image' | 'boolean' | 'array';
  required: boolean;
  description?: string;
}

const ContentModels: React.FC = () => {
  const [models] = useState<ContentModel[]>([
    {
      id: '1',
      name: 'ブログ記事',
      description: 'ブログ投稿のためのコンテンツモデル',
      fields: [
        { id: '1', name: 'タイトル', type: 'text', required: true },
        { id: '2', name: '本文', type: 'text', required: true },
        { id: '3', name: '公開日', type: 'date', required: true },
        { id: '4', name: 'サムネイル', type: 'image', required: false },
        { id: '5', name: 'タグ', type: 'array', required: false },
      ],
      createdAt: '2024-03-01',
      updatedAt: '2024-03-10',
    },
    {
      id: '2',
      name: '製品情報',
      description: '製品カタログのためのコンテンツモデル',
      fields: [
        { id: '1', name: '製品名', type: 'text', required: true },
        { id: '2', name: '価格', type: 'number', required: true },
        { id: '3', name: '説明', type: 'text', required: true },
        { id: '4', name: '在庫あり', type: 'boolean', required: true },
        { id: '5', name: '画像ギャラリー', type: 'array', required: false },
      ],
      createdAt: '2024-03-05',
      updatedAt: '2024-03-08',
    },
  ]);

  const getFieldIcon = (type: ModelField['type']) => {
    switch (type) {
      case 'text':
        return <Type size={16} />;
      case 'number':
        return <Hash size={16} />;
      case 'date':
        return <Calendar size={16} />;
      case 'image':
        return <Image size={16} />;
      case 'boolean':
        return <Toggle size={16} />;
      case 'array':
        return <List size={16} />;
      default:
        return <Database size={16} />;
    }
  };

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">コンテンツモデル</h1>
          <p className="text-gray-600 dark:text-gray-400">コンテンツの構造を定義・管理します</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={20} />
          <span>新規モデル作成</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
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

      {/* Models List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {models.map(model => (
            <div
              key={model.id}
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium mb-1">{model.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{model.description}</p>
                </div>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {model.fields.map(field => (
                  <div
                    key={field.id}
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

              <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>作成日: {model.createdAt}</span>
                <span>更新日: {model.updatedAt}</span>
                <span>フィールド数: {model.fields.length}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentModels;
