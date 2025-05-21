import React, { useState } from 'react';
import { Text, Hash, Calendar, Image as ImageIcon, List, MoreVertical } from 'lucide-react';
import { ContentModel } from '@/features/content-models/types';

const ContentModels: React.FC = () => {
  const [models] = useState<ContentModel[]>([
    {
      id: '1',
      name: 'ブログ記事',
      description: 'ブログ投稿のためのコンテンツモデル',
      tenant_id: null,
      slug: 'blog-posts',
      settings: {},
      created_at: '2024-03-01',
      updated_at: '2024-03-10',
    },
    {
      id: '2',
      name: '製品情報',
      description: '製品カタログのためのコンテンツモデル',
      tenant_id: null,
      slug: 'products',
      settings: {},
      created_at: '2024-03-05',
      updated_at: '2024-03-08',
    }
  ]);

  const [activeMenu, setActiveMenu] = useState<string | null>(null);

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

  return (
    <div className="space-y-4">
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
                  <button className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700">
                    編集
                  </button>
                  <button className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600">
                    削除
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="p-2 bg-white dark:bg-gray-700 rounded-md">
                <Text size={16} />
              </div>
              <div>
                <p className="font-medium">タイトル</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">text (必須)</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="p-2 bg-white dark:bg-gray-700 rounded-md">
                <Text size={16} />
              </div>
              <div>
                <p className="font-medium">本文</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">text (必須)</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="p-2 bg-white dark:bg-gray-700 rounded-md">
                <Calendar size={16} />
              </div>
              <div>
                <p className="font-medium">公開日</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">date (必須)</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="p-2 bg-white dark:bg-gray-700 rounded-md">
                <ImageIcon size={16} />
              </div>
              <div>
                <p className="font-medium">サムネイル</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">image</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="p-2 bg-white dark:bg-gray-700 rounded-md">
                <List size={16} />
              </div>
              <div>
                <p className="font-medium">タグ</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">array</p>
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            作成日: {model.created_at} 更新日: {model.updated_at} フィールド数: 5
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContentModels;