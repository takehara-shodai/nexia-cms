import React from 'react';
import StatCard from '../components/dashboard/StatCard';
import ActivityLog from '../components/dashboard/ActivityLog';
import MetricChart from '../components/dashboard/MetricChart';
import SystemStatusCard from '../components/dashboard/SystemStatusCard';
import { FileText, Users, Server, Zap, Globe, Database } from 'lucide-react';
import { ActivityItemProps } from '../components/dashboard/ActivityItem';

const Dashboard: React.FC = () => {
  // Activity log data
  const recentActivities: ActivityItemProps[] = [
    {
      user: { name: '山田太郎', initial: 'Y' },
      action: 'が記事を公開しました:',
      target: '2024年の最新トレンド',
      time: '15分前',
      status: 'success'
    },
    {
      user: { name: '佐藤花子', initial: 'S' },
      action: 'がメディアをアップロードしました:',
      target: 'hero-image.jpg',
      time: '30分前',
      status: 'info'
    },
    {
      user: { name: '鈴木一郎', initial: 'S' },
      action: 'がユーザーを追加しました:',
      target: '田中次郎',
      time: '1時間前',
      status: 'info'
    },
    {
      user: { name: 'システム', initial: 'S' },
      action: 'がバックアップを完了しました:',
      target: 'daily-backup-20240610',
      time: '3時間前',
      status: 'success'
    },
    {
      user: { name: '高橋悠', initial: 'T' },
      action: 'のAPIリクエストが制限を超えました:',
      target: '/api/content',
      time: '5時間前',
      status: 'warning'
    }
  ];

  // System status data
  const systemStatuses = [
    { name: 'CMS サービス', status: 'online' },
    { name: 'API サービス', status: 'online' },
    { name: 'メディアストレージ', status: 'online' },
    { name: 'データベース', status: 'warning', details: '高負荷' },
    { name: 'バックアップサービス', status: 'online' }
  ];

  return (
    <div className="fade-in">
      <div className="flex flex-col mb-6">
        <h1 className="text-2xl font-bold mb-1">ダッシュボード</h1>
        <p className="text-gray-600 dark:text-gray-400">CMSシステムの概要と最新情報</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="コンテンツ数"
          value="1,243"
          icon={<FileText size={24} />}
          change={{ value: "12%", isPositive: true }}
          bgColor="bg-blue-100"
          textColor="text-blue-600"
        />
        <StatCard
          title="アクティブユーザー"
          value="48"
          icon={<Users size={24} />}
          change={{ value: "5%", isPositive: true }}
          bgColor="bg-green-100"
          textColor="text-green-600"
        />
        <StatCard
          title="APIリクエスト/日"
          value="142,857"
          icon={<Zap size={24} />}
          change={{ value: "23%", isPositive: true }}
          bgColor="bg-purple-100"
          textColor="text-purple-600"
        />
        <StatCard
          title="ストレージ使用量"
          value="68%"
          icon={<Server size={24} />}
          bgColor="bg-orange-100"
          textColor="text-orange-600"
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Activity log - wider column */}
        <div className="lg:col-span-2">
          <ActivityLog activities={recentActivities} title="最近のアクティビティ" />
        </div>
        
        {/* System status - narrower column */}
        <div>
          <SystemStatusCard statuses={systemStatuses} />
        </div>
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MetricChart 
          title="コンテンツ作成統計" 
          description="過去30日間のコンテンツタイプ別作成数"
        />
        <MetricChart 
          title="API使用状況" 
          description="過去7日間のエンドポイント別API呼び出し数"
        />
      </div>
    </div>
  );
};

export default Dashboard;