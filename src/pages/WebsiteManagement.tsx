import React, { useState } from 'react';
import {
  Globe,
  Search,
  Filter,
  Plus,
  LayoutTemplate,
  Menu,
  Link as LinkIcon,
  Settings,
  Eye,
  Pencil,
  Trash,
  ArrowRight,
} from 'lucide-react';

interface Page {
  id: string;
  title: string;
  slug: string;
  template: string;
  status: 'published' | 'draft' | 'scheduled';
  updatedAt: string;
  author: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  usageCount: number;
}

interface MenuItem {
  id: string;
  label: string;
  url: string;
  type: 'internal' | 'external';
  position: number;
  parent?: string;
}

const WebsiteManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pages' | 'templates' | 'menus' | 'settings'>('pages');

  const [pages] = useState<Page[]>([
    {
      id: '1',
      title: 'ホームページ',
      slug: '/',
      template: 'メインテンプレート',
      status: 'published',
      updatedAt: '2024-03-15',
      author: '山田太郎',
    },
    {
      id: '2',
      title: '会社概要',
      slug: '/about',
      template: '標準ページ',
      status: 'published',
      updatedAt: '2024-03-14',
      author: '佐藤花子',
    },
    {
      id: '3',
      title: '新製品発表',
      slug: '/news/new-product',
      template: 'ニュース',
      status: 'scheduled',
      updatedAt: '2024-03-13',
      author: '鈴木一郎',
    },
  ]);

  const [templates] = useState<Template[]>([
    {
      id: '1',
      name: 'メインテンプレート',
      description: 'トップページ用のテンプレート',
      thumbnail:
        'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      usageCount: 1,
    },
    {
      id: '2',
      name: '標準ページ',
      description: '一般的なコンテンツページ用テンプレート',
      thumbnail:
        'https://images.pexels.com/photos/196645/pexels-photo-196645.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      usageCount: 8,
    },
    {
      id: '3',
      name: 'ニュース',
      description: 'ニュース記事用テンプレート',
      thumbnail:
        'https://images.pexels.com/photos/196646/pexels-photo-196646.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      usageCount: 15,
    },
  ]);

  const [menuItems] = useState<MenuItem[]>([
    { id: '1', label: 'ホーム', url: '/', type: 'internal', position: 1 },
    { id: '2', label: '会社概要', url: '/about', type: 'internal', position: 2 },
    { id: '3', label: 'サービス', url: '/services', type: 'internal', position: 3 },
    { id: '4', label: 'ブログ', url: '/blog', type: 'internal', position: 4 },
    { id: '5', label: 'お問い合わせ', url: '/contact', type: 'internal', position: 5 },
  ]);

  const getStatusColor = (status: Page['status']) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusText = (status: Page['status']) => {
    switch (status) {
      case 'published':
        return '公開中';
      case 'draft':
        return '下書き';
      case 'scheduled':
        return '公開予定';
      default:
        return status;
    }
  };

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">ウェブサイト管理</h1>
          <p className="text-gray-600 dark:text-gray-400">ページ、テンプレート、メニューの管理</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Globe size={20} />
          <span>プレビュー</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('pages')}
            className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${
              activeTab === 'pages'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Globe size={18} />
            ページ
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${
              activeTab === 'templates'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <LayoutTemplate size={18} />
            テンプレート
          </button>
          <button
            onClick={() => setActiveTab('menus')}
            className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${
              activeTab === 'menus'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Menu size={18} />
            メニュー
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Settings size={18} />
            設定
          </button>
        </div>
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
                placeholder="検索..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Filter size={20} />
              <span>フィルター</span>
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors">
              <Plus size={20} />
              <span>新規作成</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'pages' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {pages.map(page => (
              <div
                key={page.id}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h2 className="text-lg font-medium">{page.title}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{page.slug}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${getStatusColor(page.status)}`}
                    >
                      {getStatusText(page.status)}
                    </span>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                      <Eye size={18} />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                      <Pencil size={18} />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>テンプレート: {page.template}</span>
                  <span>更新日: {page.updatedAt}</span>
                  <span>作成者: {page.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map(template => (
            <div
              key={template.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <img
                src={template.thumbnail}
                alt={template.name}
                className="w-full h-48 object-cover"
                width="400"
                height="192"
              />
              <div className="p-4">
                <h3 className="text-lg font-medium mb-1">{template.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {template.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    使用中: {template.usageCount}ページ
                  </span>
                  <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm flex items-center gap-1">
                    詳細を見る
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'menus' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {menuItems.map(item => (
              <div
                key={item.id}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      {item.type === 'internal' ? <LinkIcon size={18} /> : <Globe size={18} />}
                    </div>
                    <div>
                      <h3 className="font-medium">{item.label}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.url}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                      <Pencil size={18} />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">一般設定</h3>
                <div className="space-y-4">
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      htmlFor="site-title"
                    >
                      サイトタイトル
                    </label>
                    <input
                      id="site-title"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                      placeholder="サイトのタイトル"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      htmlFor="site-description"
                    >
                      サイトの説明
                    </label>
                    <textarea
                      id="site-description"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                      rows={3}
                      placeholder="サイトの説明"
                    ></textarea>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4">SEO設定</h3>
                <div className="space-y-4">
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      htmlFor="meta-title"
                    >
                      デフォルトのメタタイトル
                    </label>
                    <input
                      id="meta-title"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                      placeholder="メタタイトル"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      htmlFor="meta-description"
                    >
                      デフォルトのメタ説明
                    </label>
                    <textarea
                      id="meta-description"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                      rows={3}
                      placeholder="メタ説明"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebsiteManagement;
