import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Grid,
  List as ListIcon,
  Calendar,
  User,
  Clock,
  Edit2,
  Eye,
  Globe,
  ArrowUpRight,
  Wand2,
  Share2,
  BarChart,
  MessageSquare,
  Heart,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Content {
  id: string;
  title: string;
  type: string;
  status: 'draft' | 'review' | 'published' | 'scheduled' | 'archived';
  author: string;
  updatedAt: string;
  createdAt: string;
  publishedAt?: string;
  dueDate?: string;
  description?: string;
  url?: string;
  metrics?: {
    views: number;
    engagement: number;
    leads: number;
    seoScore: number;
  };
  aiSuggestions?: {
    seoScore: number;
    readabilityScore: number;
    suggestions: string[];
  };
}

const ContentList: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'review' | 'published' | 'scheduled' | 'archived'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [contents] = useState<Content[]>([
    {
      id: '1',
      title: '製造業のデジタルトランスフォーメーション最前線',
      type: 'blog',
      status: 'published',
      author: '山田健一',
      updatedAt: '2024-03-15 14:30',
      createdAt: '2024-03-15 10:00',
      publishedAt: '2024-03-15 15:00',
      url: '/blog/manufacturing-dx-trends',
      description: '製造業におけるDXの最新トレンドと導入事例について解説します。',
      metrics: {
        views: 1234,
        engagement: 78,
        leads: 12,
        seoScore: 85,
      },
      aiSuggestions: {
        seoScore: 85,
        readabilityScore: 92,
        suggestions: [
          'キーワード「製造業 DX 事例」の使用頻度を増やすことで、さらにSEOスコアを改善できます',
          '導入事例のセクションを先頭に移動することで、エンゲージメント率が向上する可能性があります',
          'CTAボタンの配置を最適化することで、リード獲得率を改善できます'
        ]
      }
    },
    {
      id: '2',
      title: '新製品発表：次世代自動化ソリューション',
      type: 'press',
      status: 'review',
      author: '佐藤花子',
      updatedAt: '2024-03-14 16:45',
      createdAt: '2024-03-14 13:20',
      description: '当社の新製品に関するプレスリリース。承認待ち。',
      metrics: {
        views: 0,
        engagement: 0,
        leads: 0,
        seoScore: 78,
      },
      aiSuggestions: {
        seoScore: 78,
        readabilityScore: 85,
        suggestions: [
          '製品の具体的な数値やベネフィットを追加することで、説得力が増します',
          '競合製品との差別化ポイントをより明確に示すことを推奨します'
        ]
      }
    },
    {
      id: '3',
      title: '製造現場の生産性を向上させる5つの方法',
      type: 'article',
      status: 'scheduled',
      author: '山田健一',
      updatedAt: '2024-03-13 11:30',
      createdAt: '2024-03-13 09:15',
      publishedAt: '2024-03-20 10:00',
      description: '製造業の生産性向上に関する実践的なガイド記事。',
      metrics: {
        views: 0,
        engagement: 0,
        leads: 0,
        seoScore: 92,
      },
      aiSuggestions: {
        seoScore: 92,
        readabilityScore: 88,
        suggestions: [
          '実際の導入事例や具体的な数値を追加することで、より説得力のあるコンテンツになります',
          'インフォグラフィックの追加を検討してください'
        ]
      }
    }
  ]);

  const handleContentClick = (id: string) => {
    navigate(`/content/${id}`);
  };

  const getStatusColor = (status: Content['status']) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'review':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      case 'archived':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusText = (status: Content['status']) => {
    switch (status) {
      case 'published':
        return '公開中';
      case 'review':
        return 'レビュー待ち';
      case 'scheduled':
        return '公開予定';
      case 'draft':
        return '下書き';
      case 'archived':
        return 'アーカイブ';
      default:
        return status;
    }
  };

  const getSEOScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const filteredContents = contents.filter(content => {
    const matchesStatus = filterStatus === 'all' || content.status === filterStatus;
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">コンテンツ管理</h1>
          <p className="text-gray-600 dark:text-gray-400">AIを活用したコンテンツ作成・管理</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors">
            <Wand2 size={20} />
            <span>AI作成</span>
          </button>
          <button onClick={() => navigate('/content/create')} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors">
            <Plus size={20} />
            <span>新規作成</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">総ページビュー</p>
              <h3 className="text-2xl font-bold">24,521</h3>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
              <BarChart size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
            <ArrowUpRight size={16} />
            12.5% 増加
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">獲得リード数</p>
              <h3 className="text-2xl font-bold">142</h3>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
              <MessageSquare size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
            <ArrowUpRight size={16} />
            8.3% 増加
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">平均エンゲージメント</p>
              <h3 className="text-2xl font-bold">18.5%</h3>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
              <Heart size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
            <ArrowUpRight size={16} />
            5.2% 増加
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">平均SEOスコア</p>
              <h3 className="text-2xl font-bold">85</h3>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-lg">
              <Sparkles size={24} />
            </div>
          </div>
          <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2 flex items-center gap-1">
            <ArrowUpRight size={16} />
            3.1% 増加
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="タイトル、説明文、作成者で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                公開中
              </button>
              <button
                onClick={() => setFilterStatus('review')}
                className={`px-3 py-1 rounded-full text-sm ${
                  filterStatus === 'review'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                レビュー待ち
              </button>
              <button
                onClick={() => setFilterStatus('scheduled')}
                className={`px-3 py-1 rounded-full text-sm ${
                  filterStatus === 'scheduled'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                公開予定
              </button>
              <button
                onClick={() => setFilterStatus('draft')}
                className={`px-3 py-1 rounded-full text-sm ${
                  filterStatus === 'draft'
                    ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                下書き
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
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium">{content.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(content.status)}`}>
                        {getStatusText(content.status)}
                      </span>
                    </div>
                    {content.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-3">{content.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <User size={16} />
                        {content.author}
                      </span>
                      {content.publishedAt ? (
                        <span className="flex items-center gap-1">
                          <Globe size={16} />
                          公開: {content.publishedAt}
                        </span>
                      ) : (
                        content.dueDate && (
                          <span className="flex items-center gap-1">
                            <Calendar size={16} />
                            期限: {content.dueDate}
                          </span>
                        )
                      )}
                      <span className="flex items-center gap-1">
                        <Clock size={16} />
                        更新: {content.updatedAt}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    {/* Metrics */}
                    {content.metrics && (
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="text-sm">
                            <p className="text-gray-500 dark:text-gray-400">SEOスコア</p>
                            <p className={`font-medium ${getSEOScoreColor(content.metrics.seoScore)}`}>
                              {content.metrics.seoScore}
                            </p>
                          </div>
                          <div className="text-sm">
                            <p className="text-gray-500 dark:text-gray-400">PV数</p>
                            <p className="font-medium">{content.metrics.views.toLocaleString()}</p>
                          </div>
                          <div className="text-sm">
                            <p className="text-gray-500 dark:text-gray-400">リード</p>
                            <p className="font-medium">{content.metrics.leads}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                        <Share2 size={18} />
                      </button>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                        <Edit2 size={18} />
                      </button>
                      {content.url && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(content.url, '_blank');
                          }}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-1 text-blue-600 dark:text-blue-400"
                        >
                          <Eye size={18} />
                          <ArrowUpRight size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* AI Suggestions */}
                {content.aiSuggestions && (
                  <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-100 dark:border-purple-800/20">
                    <div className="flex items-start gap-2 text-purple-700 dark:text-purple-400">
                      <Wand2 size={18} className="mt-0.5" />
                      <div>
                        <p className="font-medium mb-2">AIによる改善提案</p>
                        <ul className="space-y-1 text-sm">
                          {content.aiSuggestions.suggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <AlertCircle size={14} className="mt-1 flex-shrink-0" />
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredContents.map(content => (
              <div
                key={content.id}
                onClick={() => handleContentClick(content.id)}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-medium line-clamp-2">{content.title}</h3>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(content.status)}`}>
                      {getStatusText(content.status)}
                    </span>
                  </div>
                  {content.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {content.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      <User size={14} />
                      {content.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {content.updatedAt}
                    </span>
                  </div>

                  {/* Metrics */}
                  {content.metrics && (
                    <div className="grid grid-cols-3 gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg mb-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">SEOスコア</p>
                        <p className={`text-sm font-medium ${getSEOScoreColor(content.metrics.seoScore)}`}>
                          {content.metrics.seoScore}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">PV数</p>
                        <p className="text-sm font-medium">{content.metrics.views.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">リード</p>
                        <p className="text-sm font-medium">{content.metrics.leads}</p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                        <Share2 size={18} />
                      </button>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                        <Edit2 size={18} />
                      </button>
                    </div>
                    {content.url && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(content.url, '_blank');
                        }}
                        className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        プレビュー
                        <ArrowUpRight size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* AI Suggestions Preview */}
                {content.aiSuggestions && (
                  <div className="px-4 py-3 bg-purple-50 dark:bg-purple-900/10 border-t border-purple-100 dark:border-purple-800/20">
                    <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
                      <Wand2 size={16} />
                      <span className="text-sm font-medium">
                        {content.aiSuggestions.suggestions.length}件の改善提案があります
                      </span>
                    </div>
                  </div>
                )}
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