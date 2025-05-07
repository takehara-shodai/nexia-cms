import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Trash, Clock, User, Calendar } from 'lucide-react';

interface ContentData {
  id: string;
  title: string;
  content: string;
  type: string;
  status: 'draft' | 'published' | 'archived';
  author: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

const ContentDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Mock data - replace with actual data fetching
  const [content, setContent] = useState<ContentData>({
    id: id || '1',
    title: '2024年のトレンド予測',
    content: 'ここに記事の本文が入ります...',
    type: 'article',
    status: 'published',
    author: '山田太郎',
    createdAt: '2024-03-01',
    updatedAt: '2024-03-10',
    tags: ['トレンド', '2024', '予測']
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // Implement save functionality
    setIsEditing(false);
  };

  const getStatusColor = (status: ContentData['status']) => {
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

  const getStatusText = (status: ContentData['status']) => {
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

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/content')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold mb-1">コンテンツ詳細</h1>
            <p className="text-gray-600 dark:text-gray-400">ID: {content.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <Eye size={20} />
            <span>{isEditing ? 'プレビュー' : '編集'}</span>
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <Save size={20} />
            <span>保存</span>
          </button>
          <button className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
            <Trash size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title and content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={content.title}
                  onChange={(e) => setContent({ ...content, title: e.target.value })}
                  className="w-full text-2xl font-bold mb-4 bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-0"
                />
                <textarea
                  value={content.content}
                  onChange={(e) => setContent({ ...content, content: e.target.value })}
                  className="w-full h-64 bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg p-4 focus:border-blue-500 focus:ring-0"
                />
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-4">{content.title}</h2>
                <p className="text-gray-600 dark:text-gray-400">{content.content}</p>
              </>
            )}
          </div>

          {/* Tags */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium mb-4">タグ</h3>
            <div className="flex flex-wrap gap-2">
              {content.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium mb-4">ステータス</h3>
            <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(content.status)}`}>
              {getStatusText(content.status)}
            </span>
          </div>

          {/* Metadata */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium mb-4">メタデータ</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User size={20} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">作成者</p>
                  <p className="font-medium">{content.author}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">作成日</p>
                  <p className="font-medium">{content.createdAt}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">最終更新日</p>
                  <p className="font-medium">{content.updatedAt}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentDetail;