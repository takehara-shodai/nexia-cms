import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Plus,
  Grid,
  List as ListIcon,
} from 'lucide-react';
import { Content } from '@/features/content/types';
import { fetchContents } from '@/features/content/api/contentApi';
import { ContentListItem } from '@/shared/ui/organisms/ContentListItem';
import { ContentGridItem } from '@/shared/ui/organisms/ContentGridItem';

interface ContentListFilters {
  status: Content['status'] | 'all';
  searchTerm: string;
  viewMode: 'list' | 'grid';
}

const ContentList: React.FC = () => {
  const navigate = useNavigate();
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ContentListFilters>({
    status: 'all',
    searchTerm: '',
    viewMode: 'list',
  });

  useEffect(() => {
    loadContents();
  }, []);

  const loadContents = async () => {
    try {
      setLoading(true);
      const data = await fetchContents();
      setContents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (id: string) => {
    navigate(`/content/${id}`);
  };

  const handlePreview = (url: string) => {
    window.open(url, '_blank');
  };

  const handleMenuClick = (id: string) => {
    // Handle menu click
    console.log('Menu clicked:', id);
  };

  const filteredContents = contents.filter(content => {
    const matchesStatus = filters.status === 'all' || content.status === filters.status;
    const matchesSearch = filters.searchTerm === '' || 
      content.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      content.description?.toLowerCase().includes(filters.searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">コンテンツ一覧</h1>
          <p className="text-gray-600 dark:text-gray-400">すべてのコンテンツを管理します</p>
        </div>
        <button
          onClick={() => navigate('/content/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          <span>新規作成</span>
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
                placeholder="コンテンツを検索..."
                value={filters.searchTerm}
                onChange={e => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Filter size={20} />
              <span>フィルター</span>
            </button>
            <div className="border-l border-gray-300 dark:border-gray-600"></div>
            <button
              onClick={() => setFilters(prev => ({ ...prev, viewMode: 'list' }))}
              className={`p-2 rounded-lg ${
                filters.viewMode === 'list'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <ListIcon size={20} />
            </button>
            <button
              onClick={() => setFilters(prev => ({ ...prev, viewMode: 'grid' }))}
              className={`p-2 rounded-lg ${
                filters.viewMode === 'grid'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Grid size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Content List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {filters.viewMode === 'list' ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredContents.map(content => (
              <ContentListItem
                key={content.id}
                content={content}
                onItemClick={handleItemClick}
                onPreviewClick={handlePreview}
                onMenuClick={handleMenuClick}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {filteredContents.map(content => (
              <ContentGridItem
                key={content.id}
                content={content}
                onItemClick={handleItemClick}
                onPreviewClick={handlePreview}
                onMenuClick={handleMenuClick}
              />
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