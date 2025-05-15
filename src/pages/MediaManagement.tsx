import React, { useState } from 'react';
import {
  Image,
  Search,
  Filter,
  Plus,
  Grid,
  List as ListIcon,
  Folder,
  FileType,
  Clock,
  User,
  Trash,
  Download,
  Edit,
  MoreVertical,
} from 'lucide-react';
import UploadModal from '@/components/upload/UploadModal';

interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  url: string;
  size: string;
  dimensions?: string;
  uploadedBy: string;
  uploadedAt: string;
  folder: string;
}

const MediaManagement: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const [mediaItems] = useState<MediaItem[]>([
    {
      id: '1',
      name: 'hero-image.jpg',
      type: 'image',
      url: 'https://images.pexels.com/photos/2387418/pexels-photo-2387418.jpeg',
      size: '2.4 MB',
      dimensions: '1920x1080',
      uploadedBy: '山田太郎',
      uploadedAt: '2024-03-15',
      folder: 'ヒーロー画像',
    },
    {
      id: '2',
      name: 'product-catalog.pdf',
      type: 'document',
      url: '#',
      size: '5.1 MB',
      uploadedBy: '佐藤花子',
      uploadedAt: '2024-03-14',
      folder: 'カタログ',
    },
    {
      id: '3',
      name: 'promotional-video.mp4',
      type: 'video',
      url: '#',
      size: '15.8 MB',
      dimensions: '1920x1080',
      uploadedBy: '鈴木一郎',
      uploadedAt: '2024-03-13',
      folder: 'プロモーション',
    },
  ]);

  const folders = [
    { id: 'all', name: 'すべて', count: 156 },
    { id: 'hero', name: 'ヒーロー画像', count: 12 },
    { id: 'products', name: '製品画像', count: 45 },
    { id: 'blog', name: 'ブログ', count: 78 },
    { id: 'documents', name: 'ドキュメント', count: 21 },
  ];

  const handleUpload = (files: File[]) => {
    // Handle file upload logic here
    console.log('Uploading files:', files);
    setIsUploadModalOpen(false);
  };

  const getTypeIcon = (type: MediaItem['type']) => {
    switch (type) {
      case 'image':
        return <Image size={20} />;
      case 'video':
        return <FileType size={20} />;
      case 'document':
        return <FileType size={20} />;
      default:
        return <FileType size={20} />;
    }
  };

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">メディア管理</h1>
          <p className="text-gray-600 dark:text-gray-400">画像、動画、ドキュメントの管理</p>
        </div>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          <span>アップロード</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Folders Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="font-medium">フォルダ</h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {folders.map(folder => (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.id)}
                  className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    selectedFolder === folder.id ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Folder
                      size={20}
                      className={
                        selectedFolder === folder.id ? 'text-blue-600 dark:text-blue-400' : ''
                      }
                    />
                    <span>{folder.name}</span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{folder.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="メディアを検索..."
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
          </div>

          {/* Media Items */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mediaItems.map(item => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  {item.type === 'image' ? (
                    <div className="aspect-video bg-gray-100 dark:bg-gray-700">
                      <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      {getTypeIcon(item.type)}
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium truncate">{item.name}</h3>
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                      <div className="flex items-center justify-between">
                        <span>{item.size}</span>
                        {item.dimensions && <span>{item.dimensions}</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <User size={14} />
                        <span>{item.uploadedBy}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        <span>{item.uploadedAt}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {mediaItems.map(item => (
                  <div
                    key={item.id}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {item.type === 'image' ? (
                        <img
                          src={item.url}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                          {getTypeIcon(item.type)}
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{item.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span>{item.size}</span>
                          {item.dimensions && <span>{item.dimensions}</span>}
                          <span>フォルダ: {item.folder}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                          <Download size={18} />
                        </button>
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                          <Edit size={18} />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                          <Trash size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
      />
    </div>
  );
};

export default MediaManagement;
