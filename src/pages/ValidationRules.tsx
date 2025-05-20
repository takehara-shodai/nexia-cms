import React, { useState } from 'react';
import { Search, Filter, Plus, Settings, Trash, Code, AlertCircle } from 'lucide-react';

interface ValidationRule {
  id: string;
  name: string;
  description: string;
  model: string;
  field: string;
  type: ValidationRuleType;
  settings: ValidationRuleSettings;
  isActive: boolean;
  errorMessage: string;
}

type ValidationRuleType =
  | 'required'
  | 'minLength'
  | 'maxLength'
  | 'pattern'
  | 'email'
  | 'url'
  | 'min'
  | 'max'
  | 'enum'
  | 'unique'
  | 'custom';

interface ValidationRuleSettings {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
  values?: string[];
  customFunction?: string;
}

const ValidationRules: React.FC = () => {
  const [rules, setRules] = useState<ValidationRule[]>([
    {
      id: '1',
      name: 'タイトル必須',
      description: '記事のタイトルは必須項目です',
      model: '記事',
      field: 'タイトル',
      type: 'required',
      settings: {},
      isActive: true,
      errorMessage: 'タイトルは必須項目です',
    },
    {
      id: '2',
      name: 'タイトル文字数制限',
      description: 'タイトルは100文字以内である必要があります',
      model: '記事',
      field: 'タイトル',
      type: 'maxLength',
      settings: { maxLength: 100 },
      isActive: true,
      errorMessage: 'タイトルは100文字以内で入力してください',
    },
    {
      id: '3',
      name: 'メールアドレス形式',
      description: '有効なメールアドレス形式である必要があります',
      model: 'ユーザー',
      field: 'メールアドレス',
      type: 'email',
      settings: {},
      isActive: true,
      errorMessage: '有効なメールアドレスを入力してください',
    },
    {
      id: '4',
      name: 'カスタムバリデーション',
      description: '公開日は未来の日付である必要があります',
      model: '記事',
      field: '公開日',
      type: 'custom',
      settings: {
        customFunction: `
function validatePublishDate(value) {
  const date = new Date(value);
  return date > new Date();
}
`,
      },
      isActive: true,
      errorMessage: '公開日は未来の日付を指定してください',
    },
  ]);

  const [showRuleModal, setShowRuleModal] = useState(false);
  const [editingRule, setEditingRule] = useState<ValidationRule | null>(null);

  const getTypeText = (type: ValidationRuleType): string => {
    switch (type) {
      case 'required':
        return '必須';
      case 'minLength':
        return '最小文字数';
      case 'maxLength':
        return '最大文字数';
      case 'pattern':
        return 'パターン';
      case 'email':
        return 'メールアドレス';
      case 'url':
        return 'URL';
      case 'min':
        return '最小値';
      case 'max':
        return '最大値';
      case 'enum':
        return '列挙型';
      case 'unique':
        return '一意';
      case 'custom':
        return 'カスタム';
      default:
        return type;
    }
  };

  const handleEdit = (rule: ValidationRule) => {
    setEditingRule(rule);
    setShowRuleModal(true);
  };

  const handleDelete = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  const _handleSave = (rule: ValidationRule) => {
    if (editingRule) {
      setRules(rules.map(r => (r.id === rule.id ? rule : r)));
    } else {
      setRules([...rules, { ...rule, id: Date.now().toString() }]);
    }
    setShowRuleModal(false);
    setEditingRule(null);
  };

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">バリデーションルール</h1>
          <p className="text-gray-600 dark:text-gray-400">データの検証ルールを定義・管理します</p>
        </div>
        <button
          onClick={() => setShowRuleModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          <span>新規ルール</span>
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
                placeholder="ルールを検索..."
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

      {/* Rules List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {rules.map(rule => (
            <div
              key={rule.id}
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-lg font-medium">{rule.name}</h2>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        rule.isActive
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                      }`}
                    >
                      {rule.isActive ? '有効' : '無効'}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full text-xs">
                      {getTypeText(rule.type)}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">{rule.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>モデル: {rule.model}</span>
                    <span>フィールド: {rule.field}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(rule)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <Settings size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(rule.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </div>

              {rule.type === 'custom' && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Code size={16} className="text-gray-500 dark:text-gray-400" />
                    <span className="text-sm font-medium">カスタムバリデーション関数</span>
                  </div>
                  <pre className="text-sm bg-gray-100 dark:bg-gray-700 p-3 rounded-lg overflow-x-auto">
                    <code>{rule.settings.customFunction}</code>
                  </pre>
                </div>
              )}

              <div className="mt-4 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                <AlertCircle size={16} />
                <span>エラーメッセージ: {rule.errorMessage}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rule Modal */}
      {showRuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowRuleModal(false)}
          ></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl m-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium">
                {editingRule ? 'バリデーションルールを編集' : '新規バリデーションルール'}
              </h2>
              <button
                onClick={() => setShowRuleModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Trash size={20} />
              </button>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="rule-name">ルール名</label>
                  <input id="rule-name" type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent" placeholder="例: タイトル必須" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="rule-description">説明</label>
                  <textarea id="rule-description" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent" rows={3} placeholder="ルールの説明を入力..."></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="rule-model">モデル</label>
                    <select id="rule-model" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent">
                      <option value="article">記事</option>
                      <option value="user">ユーザー</option>
                      <option value="category">カテゴリー</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="rule-field">フィールド</label>
                    <select id="rule-field" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent">
                      <option value="title">タイトル</option>
                      <option value="content">本文</option>
                      <option value="email">メールアドレス</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="rule-type">バリデーションタイプ</label>
                  <select id="rule-type" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent">
                    <option value="required">必須</option>
                    <option value="minLength">最小文字数</option>
                    <option value="maxLength">最大文字数</option>
                    <option value="pattern">パターン</option>
                    <option value="email">メールアドレス</option>
                    <option value="url">URL</option>
                    <option value="min">最小値</option>
                    <option value="max">最大値</option>
                    <option value="enum">列挙型</option>
                    <option value="unique">一意</option>
                    <option value="custom">カスタム</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="rule-error-message">エラーメッセージ</label>
                  <input id="rule-error-message" type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent" placeholder="バリデーションエラー時のメッセージ" />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center" htmlFor="rule-active">
                    <input id="rule-active" type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">ルールを有効化</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowRuleModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={() => setShowRuleModal(false)}
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

export default ValidationRules;
