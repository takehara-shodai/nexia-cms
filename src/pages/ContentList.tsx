import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { contentApi, Content } from '@/lib/api';

const ContentList: React.FC = () => {
  const navigate = useNavigate();
  const { status: urlStatus } = useParams<{ status?: string }>();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [filterStatus, setFilterStatus] = useState<string>(urlStatus || 'all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [contents, setContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        let data;
        if (filterStatus === 'all') {
          data = await contentApi.getContents();
        } else {
          data = await contentApi.getContentsByStatus(filterStatus);
        }
        
        setContents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'コンテンツの取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContents();
  }, [filterStatus]);

  const handleContentClick = (id: string) => {
    navigate(`/content/${id}`);
  };

  const handlePreview = (url: string) => {
    window.open(url, '_blank');
  };

  const handleStatusChange = (status: string) => {
    setFilterStatus(status);
    navigate(`/content${status === 'all' ? '' : `/${status}`}`);
  };

  const getStatusColor = (status: string) => {
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

  const filteredContents = contents.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">読み込み中...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-700">エラー: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">コンテンツ一覧</h1>
        <button
          onClick={() => navigate('/content/new')}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          新規作成
        </button>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border rounded hover:bg-gray-50"
            >
              <Filter className="w-4 h-4 mr-2" />
              フィルター
            </button>
            <div className="flex border rounded">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
              >
                <ListIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
              >
                <Grid className="w-5 h-5" />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleStatusChange('all')}
                className={`px-3 py-1 rounded ${
                  filterStatus === 'all' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
                }`}
              >
                すべて
              </button>
              <button
                onClick={() => handleStatusChange('published')}
                className={`px-3 py-1 rounded ${
                  filterStatus === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100'
                }`}
              >
                公開中
              </button>
              <button
                onClick={() => handleStatusChange('draft')}
                className={`px-3 py-1 rounded ${
                  filterStatus === 'draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100'
                }`}
              >
                下書き
              </button>
              <button
                onClick={() => handleStatusChange('archived')}
                className={`px-3 py-1 rounded ${
                  filterStatus === 'archived' ? 'bg-gray-100 text-gray-800' : 'bg-gray-100'
                }`}
              >
                アーカイブ
              </button>
            </div>
          )}
        </div>

        {filteredContents.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            コンテンツが見つかりませんでした
          </div>
        ) : viewMode === 'list' ? (
          <div className="divide-y">
            {filteredContents.map((content) => (
              <div
                key={content.id}
                className="p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleContentClick(content.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{content.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(content.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {content.author?.name || '不明'}
                      </div>
                      <div className={`px-2 py-0.5 rounded-full ${getStatusColor(content.status?.name || '')}`}>
                        {content.status?.name || 'ステータスなし'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreview(content.url || '');
                      }}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {filteredContents.map((content) => (
              <div
                key={content.id}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleContentClick(content.id)}
              >
                <div className="p-4">
                  <h3 className="text-lg font-medium mb-2">{content.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(content.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {content.author?.name || '不明'}
                    </div>
                  </div>
                  <div className={`inline-block px-2 py-0.5 rounded-full ${getStatusColor(content.status?.name || '')}`}>
                    {content.status?.name || 'ステータスなし'}
                  </div>
                </div>
                <div className="border-t px-4 py-2 bg-gray-50 flex justify-end gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreview(content.url || '');
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentList;