import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  SeparatorVertical as DragIndicator,
  Settings,
  Copy,
  Trash,
  X,
} from 'lucide-react';

interface Field {
  id: string;
  name: string;
  type: FieldType;
  required: boolean;
  description?: string;
  defaultValue?: unknown;
  settings: FieldSettings;
}

type FieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'boolean'
  | 'select'
  | 'relation'
  | 'media'
  | 'json'
  | 'markdown'
  | 'color';

interface FieldSettings {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  options?: { label: string; value: string }[];
  min?: number;
  max?: number;
  step?: number;
  multiple?: boolean;
  allowedTypes?: string[];
  relationModel?: string;
  format?: string;
  [key: string]: unknown;
}

const FieldSettings: React.FC = () => {
  const [fields, setFields] = useState<Field[]>([
    {
      id: '1',
      name: 'タイトル',
      type: 'text',
      required: true,
      description: '記事のタイトル',
      settings: {
        minLength: 1,
        maxLength: 100,
      },
    },
    {
      id: '2',
      name: '本文',
      type: 'markdown',
      required: true,
      description: '記事の本文',
      settings: {},
    },
    {
      id: '3',
      name: '公開日',
      type: 'date',
      required: true,
      description: '記事の公開日',
      settings: {
        format: 'YYYY-MM-DD',
      },
    },
  ]);

  const [editingField, setEditingField] = useState<Field | null>(null);
  const [showFieldModal, setShowFieldModal] = useState(false);

  const fieldTypes: { type: FieldType; label: string; description: string }[] = [
    { type: 'text', label: 'テキスト', description: '単一行または複数行のテキスト' },
    { type: 'number', label: '数値', description: '整数または小数点数値' },
    { type: 'date', label: '日付', description: '日付と時刻' },
    { type: 'boolean', label: '真偽値', description: 'はい/いいえの選択' },
    { type: 'select', label: '選択肢', description: '単一または複数選択' },
    { type: 'relation', label: 'リレーション', description: '他のモデルとの関連付け' },
    { type: 'media', label: 'メディア', description: '画像、動画、ファイル' },
    { type: 'json', label: 'JSON', description: 'JSONデータ構造' },
    { type: 'markdown', label: 'Markdown', description: 'リッチテキストエディタ' },
    { type: 'color', label: 'カラー', description: '色選択' },
  ];

  const handleAddField = () => {
    setEditingField({
      id: Date.now().toString(),
      name: '',
      type: 'text',
      required: false,
      settings: {},
    });
    setShowFieldModal(true);
  };

  const handleEditField = (field: Field) => {
    setEditingField({ ...field });
    setShowFieldModal(true);
  };

  const handleSaveField = () => {
    if (!editingField) return;

    setFields(prev => {
      const _index = prev.findIndex(f => f.id === editingField.id);
      if (_index === -1) {
        return [...prev, editingField];
      }
      const newFields = [...prev];
      newFields[_index] = editingField;
      return newFields;
    });

    setShowFieldModal(false);
    setEditingField(null);
  };

  const handleDeleteField = (id: string) => {
    setFields(prev => prev.filter(f => f.id !== id));
  };

  const handleDuplicateField = (field: Field) => {
    const newField = {
      ...field,
      id: Date.now().toString(),
      name: `${field.name} (コピー)`,
    };
    setFields(prev => [...prev, newField]);
  };

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">フィールド設定</h1>
          <p className="text-gray-600 dark:text-gray-400">
            コンテンツモデルのフィールドを定義・管理します
          </p>
        </div>
        <button
          onClick={handleAddField}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          <span>新規フィールド</span>
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
                placeholder="フィールドを検索..."
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

      {/* Fields List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {fields.map((field, _index) => (
            <div
              key={field.id}
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg cursor-move">
                    <DragIndicator size={20} />
                  </button>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-lg font-medium">{field.name}</h2>
                      {field.required && (
                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded-full">
                          必須
                        </span>
                      )}
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full">
                        {fieldTypes.find(t => t.type === field.type)?.label}
                      </span>
                    </div>
                    {field.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {field.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditField(field)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <Settings size={20} />
                  </button>
                  <button
                    onClick={() => handleDuplicateField(field)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <Copy size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteField(field.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <Trash size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Field Modal */}
      {showFieldModal && editingField && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowFieldModal(false)}
          ></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl m-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium">
                {editingField.id ? 'フィールドを編集' : '新規フィールド'}
              </h2>
              <button
                onClick={() => setShowFieldModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    htmlFor="field-name"
                  >
                    フィールド名
                  </label>
                  <input
                    id="field-name"
                    type="text"
                    value={editingField.name}
                    onChange={e => setEditingField({ ...editingField, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    htmlFor="field-type"
                  >
                    フィールドタイプ
                  </label>
                  <select
                    id="field-type"
                    value={editingField.type}
                    onChange={e =>
                      setEditingField({ ...editingField, type: e.target.value as FieldType })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent"
                  >
                    {fieldTypes.map(type => (
                      <option key={type.type} value={type.type}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    htmlFor="field-description"
                  >
                    説明
                  </label>
                  <textarea
                    id="field-description"
                    value={editingField.description || ''}
                    onChange={e =>
                      setEditingField({ ...editingField, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="required"
                    checked={editingField.required}
                    onChange={e => setEditingField({ ...editingField, required: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="required"
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    必須フィールド
                  </label>
                </div>

                {/* Field Type Specific Settings */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    詳細設定
                  </h3>
                  {editingField.type === 'text' && (
                    <div className="space-y-4">
                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          htmlFor="min-length"
                        >
                          最小文字数
                        </label>
                        <input
                          id="min-length"
                          type="number"
                          value={editingField.settings.minLength || ''}
                          onChange={e =>
                            setEditingField({
                              ...editingField,
                              settings: {
                                ...editingField.settings,
                                minLength: parseInt(e.target.value),
                              },
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          htmlFor="max-length"
                        >
                          最大文字数
                        </label>
                        <input
                          id="max-length"
                          type="number"
                          value={editingField.settings.maxLength || ''}
                          onChange={e =>
                            setEditingField({
                              ...editingField,
                              settings: {
                                ...editingField.settings,
                                maxLength: parseInt(e.target.value),
                              },
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}

                  {editingField.type === 'select' && (
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="option-label-0"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          選択肢
                        </label>
                        {(editingField.settings.options || []).map((option, _index) => (
                          <div key={_index} className="flex items-center gap-2 mb-2">
                            <input
                              id={`option-label-${_index}`}
                              type="text"
                              value={option.label}
                              onChange={e => {
                                const newOptions = [...(editingField.settings.options || [])];
                                newOptions[_index] = { ...option, label: e.target.value };
                                setEditingField({
                                  ...editingField,
                                  settings: { ...editingField.settings, options: newOptions },
                                });
                              }}
                              placeholder="ラベル"
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent"
                            />
                            <input
                              id={`option-value-${_index}`}
                              type="text"
                              value={option.value}
                              onChange={e => {
                                const newOptions = [...(editingField.settings.options || [])];
                                newOptions[_index] = { ...option, value: e.target.value };
                                setEditingField({
                                  ...editingField,
                                  settings: { ...editingField.settings, options: newOptions },
                                });
                              }}
                              placeholder="値"
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent"
                            />
                            <button
                              onClick={() => {
                                const newOptions = [...(editingField.settings.options || [])];
                                newOptions.splice(_index, 1);
                                setEditingField({
                                  ...editingField,
                                  settings: { ...editingField.settings, options: newOptions },
                                });
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            >
                              <X size={20} />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const newOptions = [...(editingField.settings.options || [])];
                            newOptions.push({ label: '', value: '' });
                            setEditingField({
                              ...editingField,
                              settings: { ...editingField.settings, options: newOptions },
                            });
                          }}
                          className="mt-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Plus size={20} />
                          <span>選択肢を追加</span>
                        </button>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="multiple"
                          checked={editingField.settings.multiple || false}
                          onChange={e =>
                            setEditingField({
                              ...editingField,
                              settings: { ...editingField.settings, multiple: e.target.checked },
                            })
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label
                          htmlFor="multiple"
                          className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                        >
                          複数選択を許可
                        </label>
                      </div>
                    </div>
                  )}

                  {editingField.type === 'number' && (
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="min-value"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          最小値
                        </label>
                        <input
                          id="min-value"
                          type="number"
                          value={editingField.settings.min || ''}
                          onChange={e =>
                            setEditingField({
                              ...editingField,
                              settings: {
                                ...editingField.settings,
                                min: parseFloat(e.target.value),
                              },
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="max-value"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          最大値
                        </label>
                        <input
                          id="max-value"
                          type="number"
                          value={editingField.settings.max || ''}
                          onChange={e =>
                            setEditingField({
                              ...editingField,
                              settings: {
                                ...editingField.settings,
                                max: parseFloat(e.target.value),
                              },
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="step-value"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          ステップ
                        </label>
                        <input
                          id="step-value"
                          type="number"
                          value={editingField.settings.step || ''}
                          onChange={e =>
                            setEditingField({
                              ...editingField,
                              settings: {
                                ...editingField.settings,
                                step: parseFloat(e.target.value),
                              },
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}

                  {editingField.type === 'media' && (
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="allowed-file-types"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          許可するファイルタイプ
                        </label>
                        <div className="space-y-2">
                          {['image/*', 'video/*', 'audio/*', 'application/pdf'].map(type => (
                            <label key={type} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={(editingField.settings.allowedTypes || []).includes(type)}
                                onChange={e => {
                                  const types = new Set(editingField.settings.allowedTypes || []);
                                  if (e.target.checked) {
                                    types.add(type);
                                  } else {
                                    types.delete(type);
                                  }
                                  setEditingField({
                                    ...editingField,
                                    settings: {
                                      ...editingField.settings,
                                      allowedTypes: Array.from(types),
                                    },
                                  });
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                {type === 'image/*'
                                  ? '画像'
                                  : type === 'video/*'
                                    ? '動画'
                                    : type === 'audio/*'
                                      ? '音声'
                                      : 'PDF'}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="multiple-media"
                          checked={editingField.settings.multiple || false}
                          onChange={e =>
                            setEditingField({
                              ...editingField,
                              settings: { ...editingField.settings, multiple: e.target.checked },
                            })
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label
                          htmlFor="multiple-media"
                          className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                        >
                          複数ファイルを許可
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowFieldModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleSaveField}
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

export default FieldSettings;
