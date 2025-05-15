import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Grid,
  List as ListIcon,
  Calendar,
  User,
  Clock,
  Edit2,
  Eye,
  Globe,
  ArrowUpRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Content {
  id: string;
  title: string;
  type: string;
  status: 'draft' | 'published' | 'archived';
  author: string;
  updatedAt: string;
  createdAt: string;
  publishedAt?: string;
  dueDate?: string;
  description?: string;
  url?: string;
  views?: number;
  likes?: number;
  comments?: number;
}

const ContentList: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published' | 'archived'>(
    'published'
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [contents] = useState<Content[]>([
    {
      id: '1',
      title: '2024年のトレンド予測',
      type: 'article',
      status: 'published',
      author: '山田太郎',
      updatedAt: '2024-03-10',
      createdAt: '2024-03-01',
      publishedAt: '2024-03-05',
      url: '/blog/2024-trends',
      views: 1234,
      likes: 56,
      comments: 12,
    },
    {
      id: '2',
      title: '新製品発表会レポート（下書き）',
      type: 'report',
      status: 'draft',
      author: '佐藤花子',
      updatedAt: '2024-03-09',
      createdAt: '2024-03-09',
      dueDate: '2024-03-20',
      description: '新製品発表会の詳細レポート。画像の追加が必要。',
    },
    {
      id: '3',
      title: 'サービス利用ガイド改訂版',
      type: 'guide',
      status: 'published',
      author: '鈴木一郎',
      updatedAt: '2024-03-08',
      createdAt: '2024-03-05',
      publishedAt: '2024-03-08',
      url: '/guides/service',
      views: 567,
      likes: 23,
      comments: 5,
    },
    {
      id: '4',
      title: '2023年度総括',
      type: 'report',
      status: 'archived',
      author: '田中次郎',
      updatedAt: '2024-01-15',
      createdAt: '2024-01-10',
    },
  ]);

  const handleContentClick = (id: string) => {
    navigate(`/content/${id}`);
  };

  const handlePreview = (url: string) => {
    window.open(url, '_blank');
  };

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

  const filteredContents = contents.filter(content => {
    const matchesStatus = filterStatus === 'all' || content.status === filterStatus;
    const matchesSearch =
      content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">コンテンツ一覧</h1>
          <p className="text-gray-600 dark:text-gray-400">すべてのコンテンツを管理します</p>
        </div>
        <button
          onClick={() => navigate('/content/create')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          <span>新規作成</span>
        </button>
      </div>

      {/* Filters and Search */}
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
                placeholder="コンテンツを検索..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Filter size={20} />
              <span>フィルター</span>
            </button>
            <div className="border-l border-gray-300 dark:border-gray-600"></div>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <ListIcon size={20} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <Grid size={20} />
            </button>
          </div>
        </div>

        {/* Extended Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1 rounded-full text-sm ${
                  filterStatus === 'all'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                すべて
              </button>
              <button
                onClick={() => setFilterStatus('published')}
                className={`px-3 py-1 rounded-full text-sm ${
                  filterStatus === 'published'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                公開済み
              </button>
              <button
                onClick={() => setFilterStatus('draft')}
                className={`px-3 py-1 rounded-full text-sm ${
                  filterStatus === 'draft'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                下書き
              </button>
              <button
                onClick={() => setFilterStatus('archived')}
                className={`px-3 py-1 rounded-full text-sm ${
                  filterStatus === 'archived'
                    ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                アーカイブ
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {viewMode === 'list' ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredContents.map(content => (
              <div
                key={content.id}
                onClick={() => handleContentClick(content.id)}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-medium">{content.title}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusColor(content.status)}`}
                      >
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
                        {content.author}
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
                        更新: {content.updatedAt}
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
                          handlePreview(content.url!);
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
                        // Handle menu click
                      }}
                    >
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {filteredContents.map(content => (
              <div
                key={content.id}
                onClick={() => handleContentClick(content.id)}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium">{content.title}</h3>
                  <div className="flex items-center gap-2">
                    {content.status === 'published' && content.url && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handlePreview(content.url!);
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
                        // Handle menu click
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
                    {content.author}
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
                    更新: {content.updatedAt}
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
            ))}
          </div>
        )}

        {filteredContents.length === 0 && (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <p>コンテンツが見つかりませんでした</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentList;
