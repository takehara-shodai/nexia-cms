import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Trash, Clock, User, Calendar } from 'lucide-react';
import { contentApi, Content } from '@/lib/api';

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
    if (!content || !id) return;
    try {
      await contentApi.updateContent(id, content);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新に失敗しました');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
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

  // 残りのコンポーネントのレンダリング部分は同じ
  return (
    // ... 既存のJSXコード
  );
};

export default ContentDetail;