import React from 'react';
import { Edit2, User, Globe, Calendar, Clock, Eye, ArrowUpRight, MoreVertical } from 'lucide-react';
import { Content } from '@/features/content/types';

interface ContentListItemProps {
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

export const ContentListItem: React.FC<ContentListItemProps> = ({
  content,
  onItemClick,
  onPreviewClick,
  onMenuClick,
}) => {
  return (
    <div
      onClick={() => content.id && onItemClick(content.id)}
      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-medium">{content.title}</h2>
            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(content.status)}`}>
              {getStatusText(content.status)}
            </span>
          </div>
          {content.description && (
            <p className="text-gray-600 dark:text-gray-400 mt-1">{content.description}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-2">
            <span className="flex items-center gap-1">
              <Edit2 size={14} />
              {content.type}
            </span>
            <span className="flex items-center gap-1">
              <User size={14} />
              {content.author_id}
            </span>
            {content.publishedAt ? (
              <span className="flex items-center gap-1">
                <Globe size={14} />
                公開: {content.publishedAt}
              </span>
            ) : (
              content.dueDate && (
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  期限: {content.dueDate}
                </span>
              )
            )}
            <span className="flex items-center gap-1">
              <Clock size={14} />
              更新: {content.updated_at}
            </span>
          </div>
          {content.status === 'published' && content.views !== undefined && (
            <div className="flex items-center gap-6 mt-2 text-sm text-gray-500 dark:text-gray-400">
              <span>閲覧数: {content.views.toLocaleString()}</span>
              <span>いいね: {content.likes}</span>
              <span>コメント: {content.comments}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {content.status === 'published' && content.url && (
            <button
              onClick={e => {
                e.stopPropagation();
                if (typeof content.url === 'string') {
                  onPreviewClick(content.url);
                }
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-1 text-blue-600 dark:text-blue-400"
            >
              <Eye size={18} />
              <ArrowUpRight size={14} />
            </button>
          )}
          <button
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            onClick={e => {
              e.stopPropagation();
              if (content.id) {
                onMenuClick(content.id);
              }
            }}
          >
            <MoreVertical size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
