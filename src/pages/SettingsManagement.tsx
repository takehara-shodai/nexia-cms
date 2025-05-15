import React, { useState } from 'react';
import {
  Settings,
  Search,
  Save,
  Globe,
  Database,
  Shield,
  _Bell,
  _Trash,
  Archive,
  _Clock,
  _Server,
  RefreshCw,
} from 'lucide-react';

interface SettingSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  fields: SettingField[];
}

interface SettingField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'select' | 'toggle' | 'textarea';
  _value: string | number | boolean;
  options?: { _value: string; label: string }[];
  description?: string;
}

const SettingsManagement: React.FC = () => {
  const [activeSection, setActiveSection] = useState('system');
  const [isDirty, setIsDirty] = useState(false);

  const [sections] = useState<SettingSection[]>([
    {
      id: 'system',
      title: 'システム設定',
      description: '基本的なシステム設定を管理します',
      icon: <Settings size={20} />,
      fields: [
        {
          id: 'site_name',
          label: 'サイト名',
          type: 'text',
          _value: 'My CMS',
          description: 'システム全体で使用されるサイト名',
        },
        {
          id: 'admin_email',
          label: '管理者メールアドレス',
          type: 'email',
          _value: 'admin@example.com',
          description: 'システム通知の送信先メールアドレス',
        },
        {
          id: 'timezone',
          label: 'タイムゾーン',
          type: 'select',
          _value: 'Asia/Tokyo',
          options: [
            { _value: 'Asia/Tokyo', label: '東京 (UTC+9:00)' },
            { _value: 'America/New_York', label: 'ニューヨーク (UTC-5:00)' },
            { _value: 'Europe/London', label: 'ロンドン (UTC+0:00)' },
          ],
        },
      ],
    },
    {
      id: 'site',
      title: 'サイト設定',
      description: 'ウェブサイトの表示と機能を設定します',
      icon: <Globe size={20} />,
      fields: [
        {
          id: 'site_url',
          label: 'サイトURL',
          type: 'text',
          _value: 'https://example.com',
          description: 'メインサイトのURL',
        },
        {
          id: 'maintenance_mode',
          label: 'メンテナンスモード',
          type: 'toggle',
          _value: false,
          description: 'サイトをメンテナンスモードに切り替え',
        },
        {
          id: 'meta_description',
          label: 'メタ説明',
          type: 'textarea',
          _value: 'サイトのデフォルトメタ説明',
          description: 'デフォルトのメタ説明文',
        },
      ],
    },
    {
      id: 'security',
      title: 'セキュリティ設定',
      description: 'セキュリティ関連の設定を管理します',
      icon: <Shield size={20} />,
      fields: [
        {
          id: 'two_factor',
          label: '二要素認証',
          type: 'toggle',
          _value: true,
          description: '管理者アカウントの二要素認証を有効化',
        },
        {
          id: 'session_timeout',
          label: 'セッションタイムアウト',
          type: 'number',
          _value: 30,
          description: '管理画面のセッションタイムアウト（分）',
        },
        {
          id: 'allowed_ips',
          label: '許可IPアドレス',
          type: 'textarea',
          _value: '',
          description: '管理画面へのアクセスを許可するIPアドレス（1行に1つ）',
        },
      ],
    },
    {
      id: 'cache',
      title: 'キャッシュ管理',
      description: 'システムキャッシュを管理します',
      icon: <Database size={20} />,
      fields: [
        {
          id: 'cache_enabled',
          label: 'キャッシュ有効化',
          type: 'toggle',
          _value: true,
          description: 'システム全体のキャッシュを有効化',
        },
        {
          id: 'cache_lifetime',
          label: 'キャッシュ有効期間',
          type: 'number',
          _value: 3600,
          description: 'キャッシュの有効期間（秒）',
        },
      ],
    },
    {
      id: 'backup',
      title: 'バックアップ・復元',
      description: 'データのバックアップと復元を管理します',
      icon: <Archive size={20} />,
      fields: [
        {
          id: 'auto_backup',
          label: '自動バックアップ',
          type: 'toggle',
          _value: true,
          description: '定期的な自動バックアップを有効化',
        },
        {
          id: 'backup_frequency',
          label: 'バックアップ頻度',
          type: 'select',
          _value: 'daily',
          options: [
            { _value: 'daily', label: '毎日' },
            { _value: 'weekly', label: '毎週' },
            { _value: 'monthly', label: '毎月' },
          ],
        },
        {
          id: 'backup_retention',
          label: '保持期間',
          type: 'number',
          _value: 30,
          description: 'バックアップの保持期間（日）',
        },
      ],
    },
  ]);

  const handleFieldChange = (
    _sectionId: string,
    _fieldId: string,
    _value: string | number | boolean
  ) => {
    setIsDirty(true);
    // Handle field _value change
  };

  const handleSave = () => {
    setIsDirty(false);
    // Handle settings save
  };

  const handleClearCache = () => {
    // Handle cache clearing
  };

  const handleBackupNow = () => {
    // Handle manual backup
  };

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">設定</h1>
          <p className="text-gray-600 dark:text-gray-400">システム全体の設定を管理します</p>
        </div>
        <div className="flex items-center gap-2">
          {isDirty && (
            <span className="text-sm text-yellow-600 dark:text-yellow-400">
              *保存されていない変更があります
            </span>
          )}
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Save size={20} />
            <span>保存</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="設定を検索..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 p-4 text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {section.icon}
                  <div>
                    <h3 className="font-medium">{section.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {section.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium">クイックアクション</h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              <button
                onClick={handleClearCache}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <RefreshCw size={20} />
                <span>キャッシュをクリア</span>
              </button>
              <button
                onClick={handleBackupNow}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Archive size={20} />
                <span>今すぐバックアップ</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {sections
            .filter(section => section.id === activeSection)
            .map(section => (
              <div
                key={section.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    {section.icon}
                    <div>
                      <h2 className="text-xl font-medium">{section.title}</h2>
                      <p className="text-gray-600 dark:text-gray-400">{section.description}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    {section.fields.map(field => (
                      <div key={field.id}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {field.label}
                        </label>
                        {field.type === 'text' ||
                        field.type === 'email' ||
                        field.type === 'number' ? (
                          <input
                            type={field.type}
                            _value={field._value}
                            onChange={e => handleFieldChange(section.id, field.id, e.target._value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent"
                          />
                        ) : field.type === 'select' ? (
                          <select
                            _value={field._value}
                            onChange={e => handleFieldChange(section.id, field.id, e.target._value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent"
                          >
                            {field.options?.map(option => (
                              <option key={option._value} _value={option._value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : field.type === 'toggle' ? (
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={field._value as boolean}
                              onChange={e =>
                                handleFieldChange(section.id, field.id, e.target.checked)
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        ) : field.type === 'textarea' ? (
                          <textarea
                            _value={field._value}
                            onChange={e => handleFieldChange(section.id, field.id, e.target._value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent"
                          />
                        ) : null}
                        {field.description && (
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {field.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsManagement;
