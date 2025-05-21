import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@dnd-kit/core';
import { Input } from '@/shared/ui/atoms/Input';
import { Textarea } from '@/shared/ui/atoms/Textarea';
import { Button } from '@/shared/ui/atoms/Button';
import { Label } from '@/shared/ui/atoms/Label';
import { Plus, GripVertical, Settings, Trash } from 'lucide-react';
import { ContentModel, ContentField, FieldType } from '../types';
import { useAuth } from '@/shared/hooks/useAuth';

interface ContentModelFormProps {
  onSubmit: (model: Omit<ContentModel, 'id'>, fields: Omit<ContentField, 'id'>[]) => Promise<void>;
}

export function ContentModelForm({ onSubmit }: ContentModelFormProps) {
  const { user } = useAuth();
  const [model, setModel] = useState<Omit<ContentModel, 'id'>>({
    name: '',
    slug: '',
    description: '',
    tenant_id: user?.tenant_id || null,
    settings: {},
  });

  const [fields, setFields] = useState<Omit<ContentField, 'id'>[]>([]);

  const handleAddField = () => {
    setFields([
      ...fields,
      {
        name: '',
        type: 'text',
        required: false,
        settings: {},
        order_position: fields.length,
        model_id: '', // Will be set after model creation
      },
    ]);
  };

  const handleFieldChange = (index: number, field: Partial<ContentField>) => {
    setFields(fields.map((f, i) => (i === index ? { ...f, ...field } : f)));
  };

  const handleRemoveField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(fields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFields(
      items.map((item, index) => ({
        ...item,
        order_position: index,
      }))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(model, fields);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
            value={model.slug}
            onChange={e => setModel({ ...model, slug: e.target.value })}
            placeholder="例: blog-posts"
            required
          />
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

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="fields">
            {provided => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {fields.map((field, index) => (
                  <Draggable key={index} draggableId={`field-${index}`} index={index}>
                    {provided => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                      >
                        <div className="flex items-start gap-4">
                          <div
                            {...provided.dragHandleProps}
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
                                onChange={e => handleFieldChange(index, { name: e.target.value })}
                                placeholder="例: タイトル"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor={`field-type-${index}`}>タイプ</Label>
                              <select
                                id={`field-type-${index}`}
                                value={field.type}
                                onChange={e =>
                                  handleFieldChange(index, { type: e.target.value as FieldType })
                                }
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
                              onClick={() => handleFieldChange(index, { required: !field.required })}
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
                              onClick={() => handleRemoveField(index)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            >
                              <Trash size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" variant="primaryFilled">
          保存
        </Button>
      </div>
    </form>
  );
}