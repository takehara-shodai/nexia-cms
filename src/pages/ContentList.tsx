import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [contents, setContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const data = await contentApi.getContents();
        setContents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContents();
  }, []);

  const handleContentClick = (id: string) => {
    navigate(`/content/${id}`);
  };

  const handlePreview = (url: string) => {
    window.open(url, '_blank');
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
    const matchesStatus = filterStatus === 'all' || content.status?.name === filterStatus;
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    return <div>エラー: {error}</div>;
  }

  // 残りのコンポーネントのレンダリング部分は同じ
  return (
    // ... 既存のJSXコード
  );
};

export default ContentList;