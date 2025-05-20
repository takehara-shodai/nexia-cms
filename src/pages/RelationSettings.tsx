import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  ArrowRight,
  Settings,
  Trash,
  CircleDot as DragHandleDots2,
} from 'lucide-react';
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Relation {
  id: string;
  name: string;
  sourceModel: string;
  targetModel: string;
  type: 'oneToOne' | 'oneToMany' | 'manyToOne' | 'manyToMany';
  description?: string;
  isRequired: boolean;
  onDelete: 'cascade' | 'setNull' | 'restrict';
}

interface ContentModel {
  id: string;
  name: string;
  description: string;
  fields: number;
}

interface SortableRelationItemProps {
  relation: Relation;
  onEdit: (relation: Relation) => void;
  onDelete: (id: string) => void;
}

const SortableRelationItem: React.FC<SortableRelationItemProps> = ({
  relation,
  onEdit,
  onDelete,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: relation.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2 : 1,
  };

  const getRelationTypeText = (type: Relation['type']) => {
    switch (type) {
      case 'oneToOne':
        return '1:1';
      case 'oneToMany':
        return '1:N';
      case 'manyToOne':
        return 'N:1';
      case 'manyToMany':
        return 'N:N';
      default:
        return type;
    }
  };

  const getRelationTypeColor = (type: Relation['type']) => {
    switch (type) {
      case 'oneToOne':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'oneToMany':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'manyToOne':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'manyToMany':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            {...attributes}
            {...listeners}
            className="cursor-move p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <DragHandleDots2 size={20} className="text-gray-400" />
          </div>
          <div>
            <h2 className="text-lg font-medium mb-1">{relation.name}</h2>
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <span>{relation.sourceModel}</span>
              <ArrowRight size={16} />
              <span>{relation.targetModel}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs ${getRelationTypeColor(relation.type)}`}>
            {getRelationTypeText(relation.type)}
          </span>
          <button
            onClick={() => onEdit(relation)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Settings size={18} />
          </button>
          <button
            onClick={() => onDelete(relation.id)}
            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
          >
            <Trash size={18} />
          </button>
        </div>
      </div>
      {relation.description && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{relation.description}</p>
      )}
      <div className="mt-3 flex items-center gap-4 text-sm">
        <span
          className={`${relation.isRequired ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}
        >
          {relation.isRequired ? '必須' : 'オプション'}
        </span>
        <span className="text-gray-500 dark:text-gray-400">
          削除時:{' '}
          {relation.onDelete === 'cascade'
            ? 'カスケード'
            : relation.onDelete === 'setNull'
              ? 'NULL設定'
              : '制限'}
        </span>
      </div>
    </div>
  );
};

const RelationSettings: React.FC = () => {
  const [relations, setRelations] = useState<Relation[]>([
    {
      id: '1',
      name: '記事とカテゴリー',
      sourceModel: '記事',
      targetModel: 'カテゴリー',
      type: 'manyToOne',
      description: '記事は1つのカテゴリーに属します',
      isRequired: true,
      onDelete: 'restrict',
    },
    {
      id: '2',
      name: '記事とタグ',
      sourceModel: '記事',
      targetModel: 'タグ',
      type: 'manyToMany',
      description: '記事は複数のタグを持つことができます',
      isRequired: false,
      onDelete: 'cascade',
    },
    {
      id: '3',
      name: 'ユーザーとプロフィール',
      sourceModel: 'ユーザー',
      targetModel: 'プロフィール',
      type: 'oneToOne',
      description: 'ユーザーは1つのプロフィールを持ちます',
      isRequired: true,
      onDelete: 'cascade',
    },
  ]);

  const [models] = useState<ContentModel[]>([
    { id: '1', name: '記事', description: 'ブログ記事', fields: 8 },
    { id: '2', name: 'カテゴリー', description: '記事のカテゴリー', fields: 3 },
    { id: '3', name: 'タグ', description: '記事のタグ', fields: 2 },
    { id: '4', name: 'ユーザー', description: 'システムユーザー', fields: 6 },
    { id: '5', name: 'プロフィール', description: 'ユーザープロフィール', fields: 10 },
  ]);

  const [showRelationModal, setShowRelationModal] = useState(false);
  const [editingRelation, setEditingRelation] = useState<Relation | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setRelations(items => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleEdit = (relation: Relation) => {
    setEditingRelation(relation);
    setShowRelationModal(true);
  };

  const handleDelete = (id: string) => {
    setRelations(relations.filter(relation => relation.id !== id));
  };

  const _handleSaveRelation = (relation: Relation) => {
    if (editingRelation) {
      setRelations(relations.map(r => (r.id === relation.id ? relation : r)));
    } else {
      setRelations([...relations, { ...relation, id: Date.now().toString() }]);
    }
    setShowRelationModal(false);
    setEditingRelation(null);
  };

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">リレーション設定</h1>
          <p className="text-gray-600 dark:text-gray-400">モデル間の関連を定義・管理します</p>
        </div>
        <button
          onClick={() => setShowRelationModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          <span>新規リレーション</span>
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
                placeholder="リレーションを検索..."
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

      {/* Relations List */}
      <div className="space-y-4">
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <SortableContext items={relations} strategy={verticalListSortingStrategy}>
            {relations.map(relation => (
              <SortableRelationItem
                key={relation.id}
                relation={relation}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {/* Relation Modal */}
      {showRelationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowRelationModal(false)}
          ></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl m-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium">
                {editingRelation ? 'リレーションを編集' : '新規リレーション'}
              </h2>
              <button
                onClick={() => setShowRelationModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Trash size={20} />
              </button>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="relation-name">リレーション名</label>
                  <input id="relation-name" type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent" placeholder="例: 記事とカテゴリー" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="relation-source">ソースモデル</label>
                    <select id="relation-source" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent">
                      {models.map(model => (
                        <option key={model.id} value={model.name}>{model.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="relation-target">ターゲットモデル</label>
                    <select id="relation-target" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent">
                      {models.map(model => (
                        <option key={model.id} value={model.name}>{model.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="relation-type">リレーションタイプ</label>
                  <select id="relation-type" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent">
                    <option value="oneToOne">1対1 (One-to-One)</option>
                    <option value="oneToMany">1対多 (One-to-Many)</option>
                    <option value="manyToOne">多対1 (Many-to-One)</option>
                    <option value="manyToMany">多対多 (Many-to-Many)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="relation-description">説明</label>
                  <textarea id="relation-description" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent" rows={3} placeholder="リレーションの説明を入力..."></textarea>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center" htmlFor="relation-required">
                    <input id="relation-required" type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">必須フィールド</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="relation-ondelete">削除時の動作</label>
                  <select id="relation-ondelete" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent">
                    <option value="cascade">カスケード (関連レコードも削除)</option>
                    <option value="setNull">NULL設定 (関連を解除)</option>
                    <option value="restrict">制限 (削除を禁止)</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowRelationModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={() => setShowRelationModal(false)}
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

export default RelationSettings;
