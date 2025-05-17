import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Eye,
  Trash,
  Clock,
  User,
  Calendar,
  Wand2,
  Send,
  AlertCircle,
  CheckCircle,
  XCircle,
  MessageSquare,
  Share2,
  Globe,
  BarChart,
  ChevronDown,
} from 'lucide-react';

interface ContentData {
  id: string;
  title: string;
  content: string;
  type: string;
  status: 'draft' | 'review' | 'published' | 'scheduled';
  author: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  reviewers?: string[];
  tags: string[];
  seoData?: {
    title: string;
    description: string;
    keywords: string[];
    score: number;
  };
  metrics?: {
    views: number;
    engagement: number;
    leads: number;
  };
}

interface AIAssistant {
  isGenerating: boolean;
  suggestions: {
    title: string[];
    content: string[];
    seo: {
      score: number;
      improvements: string[];
    };
  };
}

const ContentDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(true);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);

  const [content, setContent] = useState<ContentData>({
    id: id || 'new',
    title: '',
    content: '',
    type: 'article',
    status: 'draft',
    author: '山田健一',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: [],
    reviewers: ['佐藤花子', '鈴木一郎'],
  });

  const [aiAssistant, setAIAssistant] = useState<AIAssistant>({
    isGenerating: false,
    suggestions: {
      title: [],
      content: [],
      seo: {
        score: 0,
        improvements: [],
      },
    },
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Save implementation
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  const handleRequestReview = () => {
    setShowWorkflowModal(true);
  };

  const handleGenerateWithAI = async () => {
    setAIAssistant(prev => ({ ...prev, isGenerating: true }));
    // AI generation implementation
    setTimeout(() => {
      setAIAssistant({
        isGenerating: false,
        suggestions: {
          title: [
            '製造業のデジタル革新：AIが実現する生産性向上',
            'スマートファクトリーへの道：製造業DXの実践ガイド',
          ],
          content: [
            '製造業におけるデジタルトランスフォーメーション（DX）は、...',
            'スマートファクトリーの実現に向けて、多くの製造業が...',
          ],
          seo: {
            score: 85,
            improvements: [
              'キーワード「製造業 DX」の使用頻度を増やすことを推奨します',
              '導入事例のセクションを追加することで、より説得力のあるコンテンツになります',
              'サブヘッディングを追加して、読みやすさを改善できます',
            ],
          },
        },
      });
    }, 2000);
  };

  const getStatusColor = (status: ContentData['status']) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'review':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusText = (status: ContentData['status']) => {
    switch (status) {
      case 'published':
        return '公開中';
      case 'review':
        return 'レビュー待ち';
      case 'scheduled':
        return '公開予定';
      case 'draft':
        return '下書き';
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
            <h1 className="text-2xl font-bold mb-1">コンテンツ編集</h1>
            <p className="text-gray-600 dark:text-gray-400">ID: {content.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAIPanel(!showAIPanel)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <Wand2 size={20} />
            <span>AI支援</span>
          </button>
          <button
            onClick={handleRequestReview}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <Send size={20} />
            <span>レビュー依頼</span>
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Save size={20} />
            <span>{isSaving ? '保存中...' : '保存'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title and Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <input
              type="text"
              value={content.title}
              onChange={e => setContent({ ...content, title: e.target.value })}
              placeholder="タイトルを入力..."
              className="w-full text-2xl font-bold mb-4 bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-0 px-0"
            />
            <textarea
              value={content.content}
              onChange={e => setContent({ ...content, content: e.target.value })}
              placeholder="本文を入力..."
              className="w-full h-96 bg-transparent border-0 focus:ring-0 resize-none"
            />
          </div>

          {/* SEO Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium mb-4">SEO設定</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  メタタイトル
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                  placeholder="SEO用のタイトルを入力..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  メタディスクリプション
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                  rows={3}
                  placeholder="検索結果に表示される説明文を入力..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  フォーカスキーワード
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                  placeholder="主要なキーワードをカンマ区切りで入力..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium mb-4">ステータス</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  現在のステータス
                </label>
                <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(content.status)}`}>
                  {getStatusText(content.status)}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  公開設定
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <option value="draft">下書き</option>
                  <option value="review">レビュー待ち</option>
                  <option value="scheduled">公開予定</option>
                  <option value="published">即時公開</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  公開日時
                </label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Workflow */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium mb-4">ワークフロー</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  レビュアー
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                  {content.reviewers?.map(reviewer => (
                    <option key={reviewer} value={reviewer}>
                      {reviewer}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  レビュー期限
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium mb-4">タグ</h3>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
              placeholder="タグを入力..."
            />
            <div className="mt-2 flex flex-wrap gap-2">
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
      </div>

      {/* AI Assistant Panel */}
      {showAIPanel && (
        <div className="fixed right-6 bottom-6 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wand2 size={20} className="text-purple-600 dark:text-purple-400" />
              <h3 className="font-medium">AI支援</h3>
            </div>
            <button
              onClick={() => setShowAIPanel(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <XCircle size={20} />
            </button>
          </div>
          <div className="p-4">
            <button
              onClick={handleGenerateWithAI}
              disabled={aiAssistant.isGenerating}
              className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <Wand2 size={20} />
              <span>{aiAssistant.isGenerating ? '生成中...' : 'AIに提案を依頼'}</span>
            </button>

            {aiAssistant.suggestions.title.length > 0 && (
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">タイトルの提案</h4>
                  <div className="space-y-2">
                    {aiAssistant.suggestions.title.map((title, index) => (
                      <button
                        key={index}
                        onClick={() => setContent(prev => ({ ...prev, title }))}
                        className="w-full p-2 text-left text-sm bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        {title}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">SEO改善提案</h4>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">SEOスコア</span>
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        {aiAssistant.suggestions.seo.score}
                      </span>
                    </div>
                    <ul className="space-y-2 text-sm">
                      {aiAssistant.suggestions.seo.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Workflow Modal */}
      {showWorkflowModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowWorkflowModal(false)}
          />
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md m-4">
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">レビュー依頼</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    レビュアーを選択
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                    {content.reviewers?.map(reviewer => (
                      <option key={reviewer} value={reviewer}>
                        {reviewer}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    レビュー期限
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    コメント
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                    rows={3}
                    placeholder="レビュアーへのメッセージを入力..."
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setShowWorkflowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={() => {
                    setShowWorkflowModal(false);
                    // Handle review request
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  レビューを依頼
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentDetail;