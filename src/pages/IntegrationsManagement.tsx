import React, { useState } from 'react';
import { Package, Search, Filter, Plus, Globe, Code, Puzzle, ArrowRight, Power, CheckCircle, AlertTriangle, XCircle, Settings, RefreshCw } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  type: 'app' | 'plugin' | 'script' | 'service';
  status: 'active' | 'inactive' | 'error';
  version: string;
  lastUpdated: string;
  author: string;
  config?: Record<string, any>;
}

const IntegrationsManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'apps' | 'plugins' | 'scripts' | 'services'>('apps');
  
  const [integrations] = useState<Integration[]>([
    {
      id: '1',
      name: 'Slack連携',
      description: 'Slackへの通知連携',
      type: 'app',
      status: 'active',
      version: '1.2.0',
      lastUpdated: '2024-03-15',
      author: 'Slack Inc.',
      config: {
        webhook: 'https://hooks.slack.com/...',
        channel: '#notifications'
      }
    },
    {
      id: '2',
      name: 'SEO最適化',
      description: 'コンテンツのSEO分析と最適化',
      type: 'plugin',
      status: 'active',
      version: '2.1.3',
      lastUpdated: '2024-03-14',
      author: 'SEO Tools Ltd.'
    },
    {
      id: '3',
      name: 'カスタム投稿タイプ',
      description: 'カスタム投稿タイプの定義と管理',
      type: 'script',
      status: 'inactive',
      version: '1.0.0',
      lastUpdated: '2024-03-13',
      author: '山田太郎'
    },
    {
      id: '4',
      name: 'Google Analytics',
      description: 'アクセス解析連携',
      type: 'service',
      status: 'error',
      version: '4.0.1',
      lastUpdated: '2024-03-12',
      author: 'Google'
    }
  ]);

  const getStatusColor = (status: Integration['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: Integration['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={16} className="text-green-600 dark:text-green-400" />;
      case 'inactive':
        return <AlertTriangle size={16} className="text-yellow-600 dark:text-yellow-400" />;
      case 'error':
        return <XCircle size={16} className="text-red-600 dark:text-red-400" />;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: Integration['type']) => {
    switch (type) {
      case 'app':
        return <Globe size={20} />;
      case 'plugin':
        return <Puzzle size={20} />;
      case 'script':
        return <Code size={20} />;
      case 'service':
        return <Package size={20} />;
      default:
        return <Package size={20} />;
    }
  };

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">統合・拡張管理</h1>
          <p className="text-gray-600 dark:text-gray-400">アプリケーション連携、プラグイン、スクリプトの管理</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={20} />
          <span>新規追加</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('apps')}
            className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${
              activeTab === 'apps'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Globe size={18} />
            アプリケーション連携
          </button>
          <button
            onClick={() => setActiveTab('plugins')}
            className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${
              activeTab === 'plugins'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Puzzle size={18} />
            プラグイン
          </button>
          <button
            onClick={() => setActiveTab('scripts')}
            className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${
              activeTab === 'scripts'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Code size={18} />
            カスタムスクリプト
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${
              activeTab === 'services'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Package size={18} />
            外部サービス
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="検索..."
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

      {/* Integrations List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {integrations
            .filter(integration => {
              switch (activeTab) {
                case 'apps':
                  return integration.type === 'app';
                case 'plugins':
                  return integration.type === 'plugin';
                case 'scripts':
                  return integration.type === 'script';
                case 'services':
                  return integration.type === 'service';
                default:
                  return true;
              }
            })
            .map((integration) => (
              <div key={integration.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      {getTypeIcon(integration.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-medium">{integration.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${getStatusColor(integration.status)}`}>
                          {getStatusIcon(integration.status)}
                          <span>
                            {integration.status === 'active' ? '有効' :
                             integration.status === 'inactive' ? '無効' : 'エラー'}
                          </span>
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">{integration.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>バージョン: {integration.version}</span>
                        <span>作者: {integration.author}</span>
                        <span>更新日: {integration.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                      <Settings size={20} />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                      <RefreshCw size={20} />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                      <Power size={20} />
                    </button>
                  </div>
                </div>

                {integration.config && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">設定情報</h4>
                    <div className="space-y-2">
                      {Object.entries(integration.config).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2 text-sm">
                          <span className="font-medium">{key}:</span>
                          <span className="text-gray-600 dark:text-gray-400">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default IntegrationsManagement;