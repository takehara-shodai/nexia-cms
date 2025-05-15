import React, { useState } from 'react';
import {
  Key,
  _RefreshCw,
  Copy,
  Eye,
  EyeOff,
  _AlertTriangle,
  _CheckCircle,
  _XCircle,
  Search,
  Filter,
  Plus,
  _Code,
  Settings,
  Trash,
  _ArrowRight,
  Globe,
  Lock,
  Book,
  Terminal,
  Download,
} from 'lucide-react';

interface ApiEndpoint {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  auth: boolean;
  status: 'active' | 'deprecated' | 'beta';
  version: string;
  parameters?: ApiParameter[];
  responses?: ApiResponse[];
  rateLimit?: {
    requests: number;
    period: string;
  };
  cache?: {
    enabled: boolean;
    duration: string;
  };
}

interface ApiParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: string;
}

interface ApiResponse {
  status: number;
  description: string;
  schema: string;
  example: string;
}

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string;
  status: 'active' | 'expired' | 'revoked';
  permissions: string[];
}

const ApiManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'endpoints' | 'auth' | 'docs'>('endpoints');
  const [showKey, setShowKey] = useState<string | null>(null);
  const [_showEndpointModal, _setShowEndpointModal] = useState(false);
  const [_editingEndpoint, _setEditingEndpoint] = useState<ApiEndpoint | null>(null);

  const [endpoints] = useState<ApiEndpoint[]>([
    {
      id: '1',
      path: '/api/v1/content',
      method: 'GET',
      description: 'コンテンツ一覧を取得',
      auth: true,
      status: 'active',
      version: '1.0',
      parameters: [
        {
          name: 'page',
          type: 'number',
          required: false,
          description: 'ページ番号',
          example: '1',
        },
        {
          name: 'limit',
          type: 'number',
          required: false,
          description: '1ページあたりの件数',
          example: '10',
        },
      ],
      responses: [
        {
          status: 200,
          description: '成功',
          schema: 'ContentList',
          example: '{ "items": [], "total": 0 }',
        },
      ],
      rateLimit: {
        requests: 1000,
        period: '1時間',
      },
      cache: {
        enabled: true,
        duration: '5分',
      },
    },
    {
      id: '2',
      path: '/api/v1/content/{id}',
      method: 'PUT',
      description: 'コンテンツを更新',
      auth: true,
      status: 'active',
      version: '1.0',
      parameters: [
        {
          name: 'id',
          type: 'string',
          required: true,
          description: 'コンテンツID',
        },
      ],
    },
    {
      id: '3',
      path: '/api/v2/analytics',
      method: 'GET',
      description: '新しい分析API',
      auth: true,
      status: 'beta',
      version: '2.0',
    },
  ]);

  const [apiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: '本番環境API',
      key: 'pk_live_123456789abcdef',
      createdAt: '2024-03-01',
      lastUsed: '2024-03-15',
      status: 'active',
      permissions: ['read', 'write'],
    },
    {
      id: '2',
      name: 'テスト環境API',
      key: 'pk_test_987654321zyxwvu',
      createdAt: '2024-03-10',
      lastUsed: '2024-03-14',
      status: 'active',
      permissions: ['read'],
    },
  ]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusColor = (status: ApiEndpoint['status'] | ApiKey['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'beta':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'deprecated':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'expired':
      case 'revoked':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getMethodColor = (method: ApiEndpoint['method']) => {
    switch (method) {
      case 'GET':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'POST':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'PUT':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'DELETE':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">API管理</h1>
          <p className="text-gray-600 dark:text-gray-400">REST APIの設定と管理</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Terminal size={20} />
            <span>Playground</span>
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Plus size={20} />
            <span>新規エンドポイント</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('endpoints')}
            className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${
              activeTab === 'endpoints'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Globe size={18} />
            エンドポイント
          </button>
          <button
            onClick={() => setActiveTab('auth')}
            className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${
              activeTab === 'auth'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Lock size={18} />
            認証・認可
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${
              activeTab === 'docs'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Book size={18} />
            ドキュメント
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
                placeholder={
                  activeTab === 'endpoints' ? 'エンドポイントを検索...' : 'APIキーを検索...'
                }
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

      {/* Content based on active tab */}
      {activeTab === 'endpoints' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {endpoints.map(endpoint => (
              <div
                key={endpoint.id}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(endpoint.method)}`}
                      >
                        {endpoint.method}
                      </span>
                      <h3 className="text-lg font-medium font-mono">{endpoint.path}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusColor(endpoint.status)}`}
                      >
                        {endpoint.status === 'active'
                          ? '有効'
                          : endpoint.status === 'beta'
                            ? 'ベータ版'
                            : '非推奨'}
                      </span>
                      {endpoint.auth && (
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 rounded-full text-xs">
                          認証必須
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">{endpoint.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>バージョン: {endpoint.version}</span>
                      {endpoint.rateLimit && (
                        <span>
                          レート制限: {endpoint.rateLimit.requests}リクエスト/
                          {endpoint.rateLimit.period}
                        </span>
                      )}
                      {endpoint.cache?.enabled && (
                        <span>キャッシュ: {endpoint.cache.duration}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                      <Terminal size={18} />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                      <Settings size={18} />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                      <Trash size={18} />
                    </button>
                  </div>
                </div>

                {/* Parameters */}
                {endpoint.parameters && endpoint.parameters.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">パラメータ</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {endpoint.parameters.map((param, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-sm">{param.name}</span>
                            <span
                              className={`text-xs ${param.required ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}
                            >
                              {param.required ? '必須' : 'オプション'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {param.description}
                          </p>
                          {param.example && (
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                              例: {param.example}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Responses */}
                {endpoint.responses && endpoint.responses.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">レスポンス</h4>
                    <div className="space-y-4">
                      {endpoint.responses.map((response, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                response.status >= 200 && response.status < 300
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                  : response.status >= 400
                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                              }`}
                            >
                              {response.status}
                            </span>
                            <span className="text-sm">{response.description}</span>
                          </div>
                          <div className="font-mono text-sm bg-gray-100 dark:bg-gray-700 p-3 rounded">
                            <pre>{response.example}</pre>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'auth' && (
        <div className="space-y-6">
          {/* API Keys Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">APIキー</h2>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <Key size={18} />
                  <span>新規APIキー発行</span>
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {apiKeys.map(apiKey => (
                <div
                  key={apiKey.id}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium mb-1">{apiKey.name}</h3>
                      <div className="flex items-center gap-2">
                        <div className="font-mono bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg text-sm">
                          {showKey === apiKey.id ? apiKey.key : '••••••••••••••••'}
                        </div>
                        <button
                          onClick={() => setShowKey(showKey === apiKey.id ? null : apiKey.id)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                        >
                          {showKey === apiKey.id ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button
                          onClick={() => copyToClipboard(apiKey.key)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusColor(apiKey.status)}`}
                    >
                      {apiKey.status === 'active'
                        ? '有効'
                        : apiKey.status === 'expired'
                          ? '期限切れ'
                          : '無効'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>作成日: {apiKey.createdAt}</span>
                    <span>最終使用: {apiKey.lastUsed}</span>
                    <span>権限: {apiKey.permissions.join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Authentication Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium">認証設定</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    認証方式
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="auth-method"
                        className="form-radio text-blue-600"
                        checked
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        APIキー認証
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="auth-method" className="form-radio text-blue-600" />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">JWT認証</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="auth-method" className="form-radio text-blue-600" />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        OAuth 2.0
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    セキュリティ設定
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox text-blue-600" checked />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        CORS制限を有効化
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox text-blue-600" checked />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        レート制限を有効化
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox text-blue-600" />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        IP制限を有効化
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    トークン設定
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                        トークン有効期限
                      </label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                        placeholder="24"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                        更新トークン有効期限
                      </label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                        placeholder="7"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'docs' && (
        <div className="space-y-6">
          {/* API Documentation */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">APIドキュメント</h2>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
                    <Download size={18} />
                    <span>OpenAPI仕様書</span>
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Settings size={18} />
                    <span>設定</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ドキュメント設定
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                        APIタイトル
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                        placeholder="API名"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                        説明
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                        rows={3}
                        placeholder="APIの説明"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                        バージョン
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                        placeholder="1.0.0"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    公開設定
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox text-blue-600" checked />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        公開ドキュメントを有効化
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox text-blue-600" checked />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Swagger UIを有効化
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox text-blue-600" />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Redocを有効化
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    カスタマイズ
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                        カスタムCSS
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 font-mono"
                        rows={3}
                        placeholder="/* カスタムスタイル */"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                        カスタムJavaScript
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 font-mono"
                        rows={3}
                        placeholder="// カスタムスクリプト"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Example _Code */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium">サンプルコード</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    cURL
                  </h3>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-x-auto">
                    <code>{`curl -X GET "https://api.example.com/v1/content" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}</code>
                  </pre>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    JavaScript
                  </h3>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-x-auto">
                    <code>{`fetch('https://api.example.com/v1/content', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data));`}</code>
                  </pre>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Python
                  </h3>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-x-auto">
                    <code>{`import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}

response = requests.get('https://api.example.com/v1/content', headers=headers)
data = response.json()`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiManagement;
