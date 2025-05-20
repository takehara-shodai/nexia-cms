import React, { useState } from 'react';
import { Search, Filter, Plus, Settings, Trash, Copy, Code, Package, Layers } from 'lucide-react';

interface Component {
  _id: string;
  name: string;
  description: string;
  fields: ComponentField[];
  isReusable: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ComponentField {
  _id: string;
  name: string;
  type: string;
  required: boolean;
  settings?: Record<string, any>;
}

const ComponentManagement: React.FC = () => {
  const [components] = useState<Component[]>([
    {
      _id: '1',
      name: 'SEOメタデータ',
      description: 'ページのSEO関連メタデータを管理するコンポーネント',
      fields: [
        { _id: '1', name: 'メタタイトル', type: 'text', required: true },
        { _id: '2', name: 'メタ説明', type: 'textarea', required: true },
        { _id: '3', name: 'OGPイメージ', type: 'media', required: false },
      ],
      isReusable: true,
      usageCount: 12,
      createdAt: '2024-03-15',
      updatedAt: '2024-03-15',
    },
    {
      _id: '2',
      name: 'ギャラリー',
      description: '画像ギャラリーを管理するコンポーネント',
      fields: [
        { _id: '1', name: '画像', type: 'media', required: true, settings: { multiple: true } },
        { _id: '2', name: 'キャプション', type: 'text', required: false },
        {
          _id: '3',
          name: 'レイアウト',
          type: 'select',
          required: true,
          settings: {
            options: ['grid', 'masonry', 'slider'],
          },
        },
      ],
      isReusable: true,
      usageCount: 8,
      createdAt: '2024-03-14',
      updatedAt: '2024-03-15',
    },
    {
      _id: '3',
      name: '動画セクション',
      description: '動画とその関連情報を管理するコンポーネント',
      fields: [
        { _id: '1', name: '動画URL', type: 'text', required: true },
        { _id: '2', name: 'サムネイル', type: 'media', required: false },
        { _id: '3', name: '自動再生', type: 'boolean', required: false },
      ],
      isReusable: true,
      usageCount: 5,
      createdAt: '2024-03-13',
      updatedAt: '2024-03-14',
    },
  ]);

  const [showComponentModal, setShowComponentModal] = useState(false);
  const [editingComponent, setEditingComponent] = useState<Component | null>(null);

  const handleEdit = (_component: Component) => {
    setEditingComponent(_component);
    setShowComponentModal(true);
  };

  const handleDuplicate = (_component: Component) => {
    // Handle _component duplication
  };

  const handleDelete = (_id: string) => {
    // Handle _component deletion
  };

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">コンポーネント管理</h1>
          <p className="text-gray-600 dark:text-gray-400">
            再利用可能なコンポーネントを定義・管理します
          </p>
        </div>
        <button
          onClick={() => setShowComponentModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          <span>新規コンポーネント</span>
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
                placeholder="コンポーネントを検索..."
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

      {/* Components List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {components.map(_component => (
            <div
              key={_component._id}
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-lg font-medium">{_component.name}</h2>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        _component.isReusable
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                      }`}
                    >
                      {_component.isReusable ? '再利用可能' : '単一使用'}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">{_component.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Package size={16} />
                      使用数: {_component.usageCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Layers size={16} />
                      フィールド数: {_component.fields.length}
                    </span>
                    <span>更新日: {_component.updatedAt}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(_component)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <Settings size={18} />
                  </button>
                  <button
                    onClick={() => handleDuplicate(_component)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <Copy size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(_component._id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </div>

              {/* Fields List */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {_component.fields.map(field => (
                  <div
                    key={field._id}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="p-2 bg-white dark:bg-gray-700 rounded-md">
                      <Code size={16} />
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
            </div>
          ))}
        </div>
      </div>

      {/* Component Modal */}
      {showComponentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowComponentModal(false)}
          ></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl m-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium">
                {editingComponent ? 'コンポーネントを編集' : '新規コンポーネント'}
              </h2>
              <button
                onClick={() => setShowComponentModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Trash size={20} />
              </button>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="component-name">コンポーネント名</label>
                  <input id="component-name" type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent" placeholder="例: SEOメタデータ" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="component-description">説明</label>
                  <textarea id="component-description" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent" rows={3} placeholder="コンポーネントの説明を入力..."></textarea>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center" htmlFor="component-reusable">
                    <input id="component-reusable" type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">再利用可能</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="component-fields">フィールド</label>
                  <div className="space-y-2">
                    {/* Field items will be rendered here */}
                    <button className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <Plus size={20} />
                      <span>フィールドを追加</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowComponentModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={() => setShowComponentModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComponentManagement;
