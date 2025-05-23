import React, { useState, useEffect, useCallback } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Input } from '@/shared/ui/atoms/Input';
import { Textarea } from '@/shared/ui/atoms/Textarea';
import { Button } from '@/shared/ui/atoms/Button';
import { Label } from '@/shared/ui/atoms/Label';
import { Plus, GripVertical, Settings, Trash, ChevronDown, X } from 'lucide-react';
import { ContentModel, ContentField, FieldType } from '../types';
import { useAuth } from '@/shared/hooks/useAuth';

// フィールド設定モーダルのコンポーネント
interface FieldSettingsModalProps {
  field: ContentField;
  isOpen: boolean;
  onClose: () => void;
  onSave: (field: ContentField) => void;
  isEditing: boolean;
}

function FieldSettingsModal({ field, isOpen, onClose, onSave, isEditing }: FieldSettingsModalProps) {
  const [editingField, setEditingField] = useState<ContentField>(field);

  // フィールドが変更されたら編集中のフィールドを更新
  useEffect(() => {
    setEditingField(field);
  }, [field]);

  const handleSave = () => {
    onSave(editingField);
    onClose();
  };

  // フィールドタイプ固有の設定
  const renderFieldTypeSettings = () => {
    switch (editingField.type) {
      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="min-length">最小文字数</Label>
              <Input
                id="min-length"
                type="number"
                value={(editingField.settings.minLength as number) || ''}
                onChange={(e) =>
                  setEditingField({
                    ...editingField,
                    settings: {
                      ...editingField.settings,
                      minLength: e.target.value ? parseInt(e.target.value) : undefined,
                    },
                  })
                }
                placeholder="最小文字数"
              />
            </div>
            <div>
              <Label htmlFor="max-length">最大文字数</Label>
              <Input
                id="max-length"
                type="number"
                value={(editingField.settings.maxLength as number) || ''}
                onChange={(e) =>
                  setEditingField({
                    ...editingField,
                    settings: {
                      ...editingField.settings,
                      maxLength: e.target.value ? parseInt(e.target.value) : undefined,
                    },
                  })
                }
                placeholder="最大文字数"
              />
            </div>
            <div>
              <Label htmlFor="default-value">デフォルト値</Label>
              <Input
                id="default-value"
                type="text"
                value={(editingField.settings.defaultValue as string) || ''}
                onChange={(e) =>
                  setEditingField({
                    ...editingField,
                    settings: {
                      ...editingField.settings,
                      defaultValue: e.target.value,
                    },
                  })
                }
                placeholder="デフォルト値"
              />
            </div>
          </div>
        );
      case 'number':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="min-value">最小値</Label>
              <Input
                id="min-value"
                type="number"
                value={(editingField.settings.min as number) || ''}
                onChange={(e) =>
                  setEditingField({
                    ...editingField,
                    settings: {
                      ...editingField.settings,
                      min: e.target.value ? parseFloat(e.target.value) : undefined,
                    },
                  })
                }
                placeholder="最小値"
              />
            </div>
            <div>
              <Label htmlFor="max-value">最大値</Label>
              <Input
                id="max-value"
                type="number"
                value={(editingField.settings.max as number) || ''}
                onChange={(e) =>
                  setEditingField({
                    ...editingField,
                    settings: {
                      ...editingField.settings,
                      max: e.target.value ? parseFloat(e.target.value) : undefined,
                    },
                  })
                }
                placeholder="最大値"
              />
            </div>
            <div>
              <Label htmlFor="step-value">ステップ</Label>
              <Input
                id="step-value"
                type="number"
                value={(editingField.settings.step as number) || ''}
                onChange={(e) =>
                  setEditingField({
                    ...editingField,
                    settings: {
                      ...editingField.settings,
                      step: e.target.value ? parseFloat(e.target.value) : undefined,
                    },
                  })
                }
                placeholder="ステップ値"
              />
            </div>
          </div>
        );
      case 'date':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="date-format">日付フォーマット</Label>
              <Input
                id="date-format"
                type="text"
                value={(editingField.settings.format as string) || ''}
                onChange={(e) =>
                  setEditingField({
                    ...editingField,
                    settings: {
                      ...editingField.settings,
                      format: e.target.value,
                    },
                  })
                }
                placeholder="例: YYYY-MM-DD"
              />
            </div>
          </div>
        );
      case 'array':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="options">選択肢</Label>
              {(editingField.settings.options as { label: string; value: string }[] || []).map(
                (option, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <Input
                      placeholder="ラベル"
                      value={option.label}
                      onChange={(e) => {
                        const newOptions = [...(editingField.settings.options as { label: string; value: string }[] || [])];
                        newOptions[index] = { ...option, label: e.target.value };
                        setEditingField({
                          ...editingField,
                          settings: { ...editingField.settings, options: newOptions },
                        });
                      }}
                      className="flex-1"
                    />
                    <Input
                      placeholder="値"
                      value={option.value}
                      onChange={(e) => {
                        const newOptions = [...(editingField.settings.options as { label: string; value: string }[] || [])];
                        newOptions[index] = { ...option, value: e.target.value };
                        setEditingField({
                          ...editingField,
                          settings: { ...editingField.settings, options: newOptions },
                        });
                      }}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newOptions = [...(editingField.settings.options as { label: string; value: string }[] || [])];
                        newOptions.splice(index, 1);
                        setEditingField({
                          ...editingField,
                          settings: { ...editingField.settings, options: newOptions },
                        });
                      }}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                )
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const newOptions = [...(editingField.settings.options as { label: string; value: string }[] || [])];
                  newOptions.push({ label: '', value: '' });
                  setEditingField({
                    ...editingField,
                    settings: { ...editingField.settings, options: newOptions },
                  });
                }}
                className="w-full mt-2"
              >
                <Plus size={16} className="mr-2" />
                選択肢を追加
              </Button>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="multiple"
                checked={editingField.settings.multiple as boolean || false}
                onChange={(e) =>
                  setEditingField({
                    ...editingField,
                    settings: {
                      ...editingField.settings,
                      multiple: e.target.checked,
                    },
                  })
                }
                className="mr-2"
              />
              <Label htmlFor="multiple">複数選択を許可</Label>
            </div>
          </div>
        );
      case 'relation':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="relation-model">関連モデル</Label>
              <Input
                id="relation-model"
                type="text"
                value={(editingField.settings.relationModel as string) || ''}
                onChange={(e) =>
                  setEditingField({
                    ...editingField,
                    settings: {
                      ...editingField.settings,
                      relationModel: e.target.value,
                    },
                  })
                }
                placeholder="関連するモデルID"
              />
            </div>
          </div>
        );
      default:
        return <p className="text-sm text-gray-500">このフィールドタイプには設定オプションはありません。</p>;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-lg p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">
            {isEditing ? 'フィールドを編集' : '新規フィールド'}
          </h2>
          <Button type="button" variant="ghost" size="icon" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="field-name-edit">フィールド名</Label>
            <Input
              id="field-name-edit"
              value={editingField.name}
              onChange={(e) => setEditingField({ ...editingField, name: e.target.value })}
              placeholder="例: タイトル"
            />
          </div>

          <div>
            <Label htmlFor="field-type-edit">フィールドタイプ</Label>
            <div className="relative">
              <select
                id="field-type-edit"
                value={editingField.type}
                onChange={(e) =>
                  setEditingField({ ...editingField, type: e.target.value as FieldType })
                }
                className="w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 appearance-none"
              >
                <option value="text">テキスト</option>
                <option value="number">数値</option>
                <option value="boolean">真偽値</option>
                <option value="date">日付</option>
                <option value="image">画像</option>
                <option value="richtext">リッチテキスト</option>
                <option value="array">配列</option>
                <option value="relation">リレーション</option>
                <option value="json">JSON</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
            </div>
          </div>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="required-edit"
              checked={editingField.required}
              onChange={(e) => setEditingField({ ...editingField, required: e.target.checked })}
              className="mr-2"
            />
            <Label htmlFor="required-edit">必須フィールド</Label>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-sm font-medium mb-4">詳細設定</h3>
            {renderFieldTypeSettings()}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            キャンセル
          </Button>
          <Button type="button" onClick={handleSave}>
            保存
          </Button>
        </div>
      </div>
    </div>
  );
}

export interface FormControlHandle {
  addField: () => void;
  getFormData: () => { model: Omit<ContentModel, 'id'>; fields: ContentField[] };
  submit: () => void;
}

interface ContentModelFormProps {
  onSubmit: (model: Omit<ContentModel, 'id'>, fields: ContentField[]) => Promise<void>;
  initialModel?: ContentModel | null;
  initialFields?: ContentField[];
  formRef?: React.RefObject<FormControlHandle>;
}

function SortableField({ field, index, onFieldChange, onRemoveField, onOpenSettings }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: `field-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
    >
      <div className="flex flex-col gap-4">
        {/* ドラッグハンドルと操作ボタンの行 */}
        <div className="flex justify-between items-center">
          <div
            {...attributes}
            {...listeners}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-move"
          >
            <GripVertical size={20} />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onFieldChange(index, { required: !field.required })}
              className={`px-3 py-1 rounded-full text-xs ${
                field.required
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
              }`}
            >
              {field.required ? '必須' : 'オプション'}
            </button>
            <button
              type="button"
              onClick={() => onOpenSettings(field, index)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Settings size={18} />
            </button>
            <button
              type="button"
              onClick={() => onRemoveField(index)}
              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            >
              <Trash size={18} />
            </button>
          </div>
        </div>
        
        {/* フィールド入力部分 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`field-name-${index}`}>フィールド名</Label>
            <Input
              id={`field-name-${index}`}
              value={field.name}
              onChange={e => onFieldChange(index, { name: e.target.value })}
              placeholder="例: タイトル"
              required
            />
          </div>
          <div>
            <Label htmlFor={`field-type-${index}`}>タイプ</Label>
            <div className="relative">
              <select
                id={`field-type-${index}`}
                value={field.type}
                onChange={e => onFieldChange(index, { type: e.target.value as FieldType })}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 appearance-none text-sm"
              >
                <option value="text">テキスト</option>
                <option value="number">数値</option>
                <option value="boolean">真偽値</option>
                <option value="date">日付</option>
                <option value="image">画像</option>
                <option value="richtext">リッチテキスト</option>
                <option value="array">配列</option>
                <option value="relation">リレーション</option>
                <option value="json">JSON</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ContentModelForm({ onSubmit, initialModel, initialFields, formRef }: ContentModelFormProps) {
  const { user } = useAuth();
  // 内部用のフォーム要素参照
  const internalFormRef = React.useRef<HTMLFormElement>(null);
  
  const [model, setModel] = useState<Omit<ContentModel, 'id'>>({
    name: '',
    slug: '',
    description: '',
    tenant_id: user?.tenant_id || null,
    settings: {},
  });

  const [fields, setFields] = useState<ContentField[]>([]);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<ContentField | null>(null);
  const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(null);

  // Initialize form with initial data if provided
  useEffect(() => {
    if (initialModel) {
      setModel({
        name: initialModel.name,
        slug: initialModel.slug,
        description: initialModel.description || '',
        tenant_id: initialModel.tenant_id,
        settings: initialModel.settings,
      });
    }
    if (initialFields) {
      // 既存のフィールドを正しく扱うために、initialFieldsを完全なContentFieldとして扱う
      setFields(initialFields as ContentField[]);
    }
  }, [initialModel, initialFields]);

  // 外部からアクセスできるようにする
  const handleAddField = useCallback(() => {
    setFields(prevFields => [
      ...prevFields,
      {
        id: `temp-${new Date().getTime()}-${prevFields.length}`, // 一時的なIDを作成
        name: '',
        type: 'text',
        required: false,
        settings: {},
        order_position: prevFields.length,
        model_id: '', // Will be set after model creation
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);
  }, []);

  // handleSubmit関数を先に定義
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(model, fields);
  }, [onSubmit, model, fields]);

  // フォームのコントローラーを外部に公開
  React.useImperativeHandle(
    formRef,
    () => ({
      addField: handleAddField,
      getFormData: () => ({ model, fields }),
      submit: () => {
        if (internalFormRef.current) {
          // HTMLFormElement.submit()メソッドはフォームのsubmitイベントを発火しないため
          // 代わりにカスタムsubmitイベントを作成して発火する
          const submitEvent = new Event('submit', { cancelable: true, bubbles: true });
          internalFormRef.current.dispatchEvent(submitEvent);
        } else {
          // フォーム要素が取得できない場合は直接onSubmitを呼び出す
          onSubmit(model, fields);
        }
      }
    }),
    [handleAddField, model, fields, onSubmit]
  );

  const handleFieldChange = (index: number, field: Partial<ContentField>) => {
    setFields(fields.map((f, i) => (i === index ? { ...f, ...field } : f)));
  };

  const handleRemoveField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const oldIndex = fields.findIndex((_, i) => `field-${i}` === active.id);
    const newIndex = fields.findIndex((_, i) => `field-${i}` === over.id);

    if (oldIndex !== newIndex) {
      const newFields = [...fields];
      const [movedField] = newFields.splice(oldIndex, 1);
      newFields.splice(newIndex, 0, movedField);
      
      setFields(
        newFields.map((field, index) => ({
          ...field,
          order_position: index,
        }))
      );
    }
  };

  const openSettingsModal = (field: ContentField, index: number) => {
    setEditingField(field);
    setEditingFieldIndex(index);
    setIsSettingsModalOpen(true);
  };

  const closeSettingsModal = () => {
    setIsSettingsModalOpen(false);
    setEditingField(null);
    setEditingFieldIndex(null);
  };

  const saveFieldSettings = (field: ContentField) => {
    if (editingFieldIndex !== null) {
      handleFieldChange(editingFieldIndex, field);
    }
  };

  return (
    <>
      <form ref={internalFormRef} onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name">モデル名</Label>
            <Input
              id="name"
              value={model.name}
              onChange={e => {
                const name = e.target.value;
                setModel({ ...model, name });
                
                // モデル名が入力され、スラッグが空の場合は自動生成する
                if (name && (!model.slug || model.slug === '')) {
                  // スペースをハイフンに置き換え、小文字化し、特殊文字を削除
                  const autoSlug = name
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^a-z0-9-]/g, '');
                
                  if (autoSlug) {
                    setModel(prev => ({ ...prev, slug: autoSlug }));
                  }
                }
              }}
              placeholder="例: ブログ記事"
              required
            />
          </div>
          <div>
            <Label htmlFor="slug">スラッグ</Label>
            <Input
              id="slug"
              value={model.slug || ''}
              onChange={e => setModel({ ...model, slug: e.target.value })}
              placeholder="例: blog-posts"
              // required属性を削除
            />
            <p className="text-xs text-gray-500 mt-1">任意項目です。空のままにすると空として保存されます</p>
          </div>
        </div>

        <div>
          <Label htmlFor="description">説明</Label>
          <Textarea
            id="description"
            value={model.description}
            onChange={e => setModel({ ...model, description: e.target.value })}
            placeholder="このモデルの説明を入力してください"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>フィールド</Label>
            <Button type="button" onClick={handleAddField} variant="outline" size="sm" className="flex items-center">
              <Plus size={16} className="mr-0 sm:mr-2" />
              <span className="hidden sm:inline">フィールドを追加</span>
            </Button>
          </div>

          <DndContext onDragEnd={handleDragEnd}>
            <SortableContext items={fields.map((_, i) => `field-${i}`)} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <SortableField
                    key={`field-${index}`}
                    field={field}
                    index={index}
                    onFieldChange={handleFieldChange}
                    onRemoveField={handleRemoveField}
                    onOpenSettings={openSettingsModal}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
        {/* 保存ボタンを削除 - フッターに移動 */}
      </form>

      {isSettingsModalOpen && editingField && (
        <FieldSettingsModal
          field={editingField}
          isOpen={isSettingsModalOpen}
          onClose={closeSettingsModal}
          onSave={saveFieldSettings}
          isEditing={initialModel !== null && initialModel !== undefined}
        />
      )}
    </>
  );
}
