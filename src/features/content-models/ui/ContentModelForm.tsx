import React, { useState, useEffect, useCallback } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Input } from '@/shared/ui/atoms/Input';
import { Textarea } from '@/shared/ui/atoms/Textarea';
import { Button } from '@/shared/ui/atoms/Button';
import { Label } from '@/shared/ui/atoms/Label';
import { Plus, GripVertical, Settings, Trash } from 'lucide-react';
import { ContentModel, ContentField, FieldType } from '../types';
import { useAuth } from '@/shared/hooks/useAuth';

export interface FormControlHandle {
  addField: () => void;
  getFormData: () => { model: Omit<ContentModel, 'id'>; fields: Omit<ContentField, 'id'>[] };
  submit: () => void;
}

interface ContentModelFormProps {
  onSubmit: (model: Omit<ContentModel, 'id'>, fields: Omit<ContentField, 'id'>[]) => Promise<void>;
  initialModel?: ContentModel | null;
  initialFields?: Omit<ContentField, 'id'>[];
  formRef?: React.RefObject<FormControlHandle>;
}

function SortableField({ field, index, onFieldChange, onRemoveField }: any) {
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
      <div className="flex items-start gap-4">
        <div
          {...attributes}
          {...listeners}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-move"
        >
          <GripVertical size={20} />
        </div>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <select
              id={`field-type-${index}`}
              value={field.type}
              onChange={e => onFieldChange(index, { type: e.target.value as FieldType })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
              required
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
          </div>
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

  const [fields, setFields] = useState<Omit<ContentField, 'id'>[]>([]);

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
      setFields(initialFields);
    }
  }, [initialModel, initialFields]);

  // 外部からアクセスできるようにする
  const handleAddField = useCallback(() => {
    setFields(prevFields => [
      ...prevFields,
      {
        name: '',
        type: 'text',
        required: false,
        settings: {},
        order_position: prevFields.length,
        model_id: '', // Will be set after model creation
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

  return (
    <form ref={internalFormRef} onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name">モデル名</Label>
          <Input
            id="name"
            value={model.name}
            onChange={e => setModel({ ...model, name: e.target.value })}
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
          <p className="text-xs text-gray-500 mt-1">任意項目です。空のままにするとスラッグなしで保存されます</p>
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
          <Button type="button" onClick={handleAddField} variant="outline" size="sm">
            <Plus size={16} className="mr-2" />
            フィールドを追加
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
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
      {/* 保存ボタンを削除 - フッターに移動 */}
    </form>
  );
}
