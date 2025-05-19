import { Content } from '@/features/content/types';

// TODO: Supabaseクライアントを使用した実装に置き換える
export const fetchContents = async (): Promise<Content[]> => {
  // ダミーデータ（後でSupabaseから取得するように変更）
  return [
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
  ];
}; 