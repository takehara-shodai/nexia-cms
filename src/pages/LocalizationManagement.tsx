import React, { useState } from 'react';
import {
  Languages,
  Search,
  Filter,
  Plus,
  Globe,
  Check,
  X,
  _ChevronDown,
  Edit2,
  Trash,
  _RefreshCw,
  Download,
  Upload,
} from 'lucide-react';

interface Language {
  id: string;
  code: string;
  name: string;
  nativeName: string;
  isDefault: boolean;
  isActive: boolean;
  progress: number;
  lastUpdated: string;
}

interface Translation {
  id: string;
  key: string;
  category: string;
  translations: Record<string, string>;
  lastUpdated: string;
}

interface Region {
  id: string;
  code: string;
  name: string;
  language: string;
  timezone: string;
  currency: string;
  isActive: boolean;
}

const LocalizationManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'languages' | 'translations' | 'regions'>('languages');

  const [languages] = useState<Language[]>([
    {
      id: '1',
      code: 'ja',
      name: 'Japanese',
      nativeName: '日本語',
      isDefault: true,
      isActive: true,
      progress: 100,
      lastUpdated: '2024-03-15',
    },
    {
      id: '2',
      code: 'en',
      name: 'English',
      nativeName: 'English',
      isDefault: false,
      isActive: true,
      progress: 85,
      lastUpdated: '2024-03-14',
    },
    {
      id: '3',
      code: 'zh',
      name: 'Chinese',
      nativeName: '中文',
      isDefault: false,
      isActive: true,
      progress: 60,
      lastUpdated: '2024-03-13',
    },
  ]);

  const [translations] = useState<Translation[]>([
    {
      id: '1',
      key: 'common.save',
      category: 'Common',
      translations: {
        ja: '保存',
        en: 'Save',
        zh: '保存',
      },
      lastUpdated: '2024-03-15',
    },
    {
      id: '2',
      key: 'common.cancel',
      category: 'Common',
      translations: {
        ja: 'キャンセル',
        en: 'Cancel',
        zh: '取消',
      },
      lastUpdated: '2024-03-14',
    },
    {
      id: '3',
      key: 'auth.login',
      category: 'Authentication',
      translations: {
        ja: 'ログイン',
        en: 'Login',
        zh: '登录',
      },
      lastUpdated: '2024-03-13',
    },
  ]);

  const [regions] = useState<Region[]>([
    {
      id: '1',
      code: 'JP',
      name: '日本',
      language: 'ja',
      timezone: 'Asia/Tokyo',
      currency: 'JPY',
      isActive: true,
    },
    {
      id: '2',
      code: 'US',
      name: 'United States',
      language: 'en',
      timezone: 'America/New_York',
      currency: 'USD',
      isActive: true,
    },
    {
      id: '3',
      code: 'CN',
      name: '中国',
      language: 'zh',
      timezone: 'Asia/Shanghai',
      currency: 'CNY',
      isActive: true,
    },
  ]);

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">多言語・ローカライズ</h1>
          <p className="text-gray-600 dark:text-gray-400">言語設定と翻訳の管理</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={20} />
          <span>新規言語追加</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('languages')}
            className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${
              activeTab === 'languages'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Languages size={18} />
            言語設定
          </button>
          <button
            onClick={() => setActiveTab('translations')}
            className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${
              activeTab === 'translations'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Edit2 size={18} />
            翻訳管理
          </button>
          <button
            onClick={() => setActiveTab('regions')}
            className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${
              activeTab === 'regions'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Globe size={18} />
            地域設定
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
            {activeTab === 'translations' && (
              <>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Upload size={20} />
                  <span>インポート</span>
                </button>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Download size={20} />
                  <span>エクスポート</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'languages' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {languages.map(language => (
              <div
                key={language.id}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-xl font-medium">
                      {language.code.toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-medium">{language.name}</h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          ({language.nativeName})
                        </span>
                        {language.isDefault && (
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full">
                            デフォルト
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <span>コード: {language.code}</span>
                        <span>翻訳進捗: {language.progress}%</span>
                        <span>最終更新: {language.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                      <Edit2 size={20} />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                      <Trash size={20} />
                    </button>
                    <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      {language.isActive ? (
                        <>
                          <Check size={20} className="text-green-600 dark:text-green-400" />
                          <span>有効</span>
                        </>
                      ) : (
                        <>
                          <X size={20} className="text-red-600 dark:text-red-400" />
                          <span>無効</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${language.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'translations' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {translations.map(translation => (
              <div
                key={translation.id}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                        {translation.category}
                      </span>
                      <h3 className="font-mono text-gray-600 dark:text-gray-400">
                        {translation.key}
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(translation.translations).map(([lang, text]) => (
                        <div key={lang} className="flex items-center gap-2">
                          <span className="text-sm font-medium">{lang}:</span>
                          <span className="text-gray-600 dark:text-gray-400">{text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                      <Edit2 size={20} />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                      <Trash size={20} />
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  最終更新: {translation.lastUpdated}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'regions' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {regions.map(region => (
              <div
                key={region.id}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-xl font-medium">
                      {region.code}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">{region.name}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>言語: {region.language}</span>
                        <span>タイムゾーン: {region.timezone}</span>
                        <span>通貨: {region.currency}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                      <Edit2 size={20} />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                      <Trash size={20} />
                    </button>
                    <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      {region.isActive ? (
                        <>
                          <Check size={20} className="text-green-600 dark:text-green-400" />
                          <span>有効</span>
                        </>
                      ) : (
                        <>
                          <X size={20} className="text-red-600 dark:text-red-400" />
                          <span>無効</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocalizationManagement;
