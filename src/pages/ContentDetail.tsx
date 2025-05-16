import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Trash, Clock, User, Calendar } from 'lucide-react';
import { contentApi, Content } from '@/lib/api';
import { supabase } from '@/lib/supabase';

const ContentDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState<Content | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      if (!id) return;

      // Handle new content creation
      if (id === 'new' || id === 'create') {
        const { data: { user } } = await supabase.auth.getUser();
        
        setContent({
          title: '',
          content: '',
          created_at: new Date().toISOString(),
          status_id: null,
          author_id: user?.id || null,
          type_id: null,
          slug: '',
          excerpt: null,
          featured_image: null,
          category_id: null,
          published_at: null,
          metadata: {}
        } as Content);
        setIsEditing(true);
        setIsLoading(false);
        return;
      }

      // Validate UUID format before making the API call
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        setError('Invalid content ID');
        setIsLoading(false);
        return;
      }

      try {
        const data = await contentApi.getContent(id);
        setContent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [id]);

  const handleSave = async () => {
    if (!content) return;
    try {
      if (id === 'new' || id === 'create') {
        // Ensure author_id is set to current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('ユーザーが認証されていません');
        }
        
        const contentWithAuthor = {
          ...content,
          author_id: user.id,
          // Generate a slug if not provided
          slug: content.slug || content.title.toLowerCase().replace(/\s+/g, '-')
        };
        
        const newContent = await contentApi.createContent(contentWithAuthor);
        navigate(`/content/${newContent.id}`);
      } else {
        await contentApi.updateContent(id!, content);
        setIsEditing(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新に失敗しました');
    }
  };

  const handleDelete = async () => {
    if (!id || id === 'new' || id === 'create') return;
    try {
      await contentApi.deleteContent(id);
      navigate('/content');
    } catch (err) {
      setError(err instanceof Error ? err.message : '削除に失敗しました');
    }
  };

  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    return <div>エラー: {error}</div>;
  }

  if (!content) {
    return <div>コンテンツが見つかりません</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/content')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          戻る
        </button>
        <div className="flex gap-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              編集
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              <Save className="w-4 h-4 mr-2" />
              保存
            </button>
          )}
          {id !== 'new' && id !== 'create' && (
            <button
              onClick={handleDelete}
              className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              <Trash className="w-4 h-4 mr-2" />
              削除
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">
            {isEditing ? (
              <input
                type="text"
                value={content.title}
                onChange={(e) => setContent({ ...content, title: e.target.value })}
                className="border rounded px-2 py-1 w-full"
              />
            ) : (
              content.title
            )}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(content.created_at).toLocaleDateString()}
            </div>
            <div className="flex items-center text-gray-600">
              <User className="w-4 h-4 mr-1" />
              {content.author_id || '不明'}
            </div>
            <div className={`px-3 py-1 rounded-full ${content.status_id ? 'bg-blue-100' : 'bg-gray-100'}`}>
              {content.status_id || 'ステータスなし'}
            </div>
          </div>
        </div>

        <div className="prose max-w-none">
          {isEditing ? (
            <textarea
              value={content.content}
              onChange={(e) => setContent({ ...content, content: e.target.value })}
              className="border rounded p-2 w-full min-h-[200px]"
            />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: content.content }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentDetail;