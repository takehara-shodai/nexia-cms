import React, { useState } from 'react';
import { PieChart, Search, Filter, Download, Calendar, ArrowUpRight, ArrowDownRight, Users, Globe, Zap, Clock, ChevronDown, BarChart3, LineChart, Table as TableIcon } from 'lucide-react';

interface AnalyticsData {
  id: string;
  metric: string;
  value: number;
  change: {
    value: number;
    isPositive: boolean;
  };
  trend: 'up' | 'down' | 'stable';
}

interface ChartData {
  id: string;
  title: string;
  description: string;
  type: 'line' | 'bar' | 'pie' | 'table';
}

const AnalyticsManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'content' | 'access' | 'api' | 'performance'>('content');
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  const [metrics] = useState<AnalyticsData[]>([
    {
      id: '1',
      metric: '総ページビュー',
      value: 125463,
      change: { value: 12.5, isPositive: true },
      trend: 'up'
    },
    {
      id: '2',
      metric: 'ユニークユーザー',
      value: 45789,
      change: { value: 8.3, isPositive: true },
      trend: 'up'
    },
    {
      id: '3',
      metric: '平均滞在時間',
      value: 245,
      change: { value: 3.2, isPositive: false },
      trend: 'down'
    },
    {
      id: '4',
      metric: 'バウンス率',
      value: 42.5,
      change: { value: 1.5, isPositive: true },
      trend: 'down'
    }
  ]);

  const [charts] = useState<ChartData[]>([
    {
      id: '1',
      title: 'ページビューの推移',
      description: '過去30日間のページビュー数の推移',
      type: 'line'
    },
    {
      id: '2',
      title: 'コンテンツタイプ別アクセス',
      description: 'コンテンツタイプ別のアクセス割合',
      type: 'pie'
    },
    {
      id: '3',
      title: '時間帯別アクセス数',
      description: '24時間の時間帯別アクセス数',
      type: 'bar'
    },
    {
      id: '4',
      title: '人気ページランキング',
      description: '最もアクセスの多いページTop 10',
      type: 'table'
    }
  ]);

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case '総ページビュー':
        return <Globe size={24} />;
      case 'ユニークユーザー':
        return <Users size={24} />;
      case '平均滞在時間':
        return <Clock size={24} />;
      case 'バウンス率':
        return <Zap size={24} />;
      default:
        return <PieChart size={24} />;
    }
  };

  const getChartIcon = (type: ChartData['type']) => {
    switch (type) {
      case 'line':
        return <LineChart size={20} />;
      case 'bar':
        return <BarChart3 size={20} />;
      case 'pie':
        return <PieChart size={20} />;
      case 'table':
        return <TableIcon size={20} />;
      default:
        return <PieChart size={20} />;
    }
  };

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">分析・レポート</h1>
          <p className="text-gray-600 dark:text-gray-400">サイトのパフォーマンスと利用状況の分析</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Calendar size={20} />
            <span>期間: 過去7日間</span>
            <ChevronDown size={16} />
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors">
            <Download size={20} />
            <span>レポート出力</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('content')}
            className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${
              activeTab === 'content'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <PieChart size={18} />
            コンテンツ分析
          </button>
          <button
            onClick={() => setActiveTab('access')}
            className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${
              activeTab === 'access'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Users size={18} />
            アクセス統計
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${
              activeTab === 'api'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Zap size={18} />
            API使用状況
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${
              activeTab === 'performance'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <LineChart size={18} />
            パフォーマンス
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                {getMetricIcon(metric.metric)}
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                metric.change.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {metric.change.isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                <span>{metric.change.value}%</span>
              </div>
            </div>
            <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">{metric.metric}</h3>
            <p className="text-2xl font-bold">{metric.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {charts.map((chart) => (
          <div
            key={chart.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium mb-1">{chart.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{chart.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  {getChartIcon(chart.type)}
                </div>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
              <span className="text-gray-500 dark:text-gray-400">チャートがここに表示されます</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsManagement;