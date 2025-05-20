import { Content } from '../types';

export const demoContents: Content[] = [
  {
    id: '1',
    title: '2024年のトレンド予測',
    type: 'article',
    status: 'published',
    content: '2024年のトレンドを徹底予測します。',
    tags: [
      { id: 'tag1', name: 'トレンド' },
      { id: 'tag2', name: '予測' },
    ],
    updated_at: '2024-03-10',
    created_at: '2024-03-01',
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
    content: '新製品発表会の詳細レポート。',
    tags: [
      { id: 'tag3', name: 'レポート' },
    ],
    updated_at: '2024-03-09',
    created_at: '2024-03-09',
    dueDate: '2024-03-20',
    description: '新製品発表会の詳細レポート。画像の追加が必要。',
  },
  {
    id: '3',
    title: 'サービス利用ガイド改訂版',
    type: 'guide',
    status: 'published',
    content: 'サービス利用ガイドの改訂版です。',
    tags: [
      { id: 'tag4', name: 'ガイド' },
    ],
    updated_at: '2024-03-08',
    created_at: '2024-03-05',
    publishedAt: '2024-03-08',
    url: '/guides/service',
    views: 567,
    likes: 23,
    comments: 5,
  },
];