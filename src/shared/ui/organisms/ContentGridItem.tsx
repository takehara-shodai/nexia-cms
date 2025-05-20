import React from 'react';
import {
  Edit2,
  User,
  Globe,
  Calendar,
  Clock,
  Eye,
  ArrowUpRight,
  MoreVertical,
} from 'lucide-react';
import { Content } from '@/features/content/types';

interface ContentGridItemProps {
  content: Content;
  onItemClick: (id: string) => void;
  onPreviewClick: (url: string) => void;
  onMenuClick: (id: string) => void;
}

const getStatusColor = (status: Content['status']) => {
  switch (status) {
    case 'published':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'draft':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'archived':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  }
};

const getStatusText = (status: Content['status']) => {
  switch (status) {
    case 'published':
      return '公開中';
    case 'draft':
      return '下書き';
    case 'archived':
      return 'アーカイブ';
    default:
      return status;
  }
};

export const ContentGridItem: React.FC<ContentGridItemProps> = ({
  content,
  onItemClick,
  onPreviewClick,
  onMenuClick,
}) => {
  return (
    <div
      onClick={() => content.id && onItemClick(content.id)}
      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
    >
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-lg font-medium">{content.title}</h2>
        <div className="flex items-center gap-2">
          {content.status === 'published' && content.url && (
            <button
              onClick={e => {
                e.stopPropagation();
                if (typeof content.url === 'string') {
                  onPreviewClick(content.url);
                }
              }}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-1 text-blue-600 dark:text-blue-400"
            >
              <Eye size={16} />
              <ArrowUpRight size={12} />
            </button>
          )}
          <button
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            onClick={e => {
              e.stopPropagation();
              if (content.id) {
                onMenuClick(content.id);
              }
            }}
          >
            <MoreVertical size={18} />
          </button>
        </div>
      </div>
      {content.description && (
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
          {content.description}
        </p>
      )}
      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Edit2 size={14} />
            {content.type}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs ${getStatusColor(content.status)}`}
          >
            {getStatusText(content.status)}
          </span>
        </div>
        <p className="flex items-center gap-1">
          <User size={14} />
          {content.author_id}
        </p>
        {content.publishedAt ? (
          <p className="flex items-center gap-1">
            <Globe size={14} />
            公開: {content.publishedAt}
          </p>
        ) : (
          content.dueDate && (
            <p className="flex items-center gap-1">
              <Calendar size={14} />
              期限: {content.dueDate}
            </p>
          )
        )}
        <p className="flex items-center gap-1">
          <Clock size={14} />
          更新: {content.updated_at}
        </p>
        {content.status === 'published' && content.views !== undefined && (
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700 grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">閲覧数</p>
              <p className="font-medium">{content.views.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">いいね</p>
              <p className="font-medium">{content.likes}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">コメント</p>
              <p className="font-medium">{content.comments}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 