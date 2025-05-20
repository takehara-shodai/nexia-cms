import React, { useState } from 'react';
import {
  ListChecks,
  Search,
  Filter,
  Plus,
  Clock,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronDown,
  Settings,
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  priority: 'high' | 'medium' | 'low';
  assignee: string;
  dueDate: string;
  createdAt: string;
}

interface Approval {
  id: string;
  contentTitle: string;
  requestedBy: string;
  status: 'pending' | 'approved' | 'rejected';
  type: 'publish' | 'update' | 'delete';
  requestedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

const WorkflowManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'approvals' | 'settings'>('tasks');

  const [tasks] = useState<Task[]>([
    {
      id: '1',
      title: '新製品ページの作成',
      description: '新製品のランディングページを作成する',
      status: 'in_progress',
      priority: 'high',
      assignee: '山田太郎',
      dueDate: '2024-03-20',
      createdAt: '2024-03-15',
    },
    {
      id: '2',
      title: 'ブログ記事の校正',
      description: '最新のブログ記事の校正作業',
      status: 'pending',
      priority: 'medium',
      assignee: '佐藤花子',
      dueDate: '2024-03-18',
      createdAt: '2024-03-14',
    },
    {
      id: '3',
      title: 'お問い合わせフォームの更新',
      description: '問い合わせフォームに新しい項目を追加',
      status: 'completed',
      priority: 'low',
      assignee: '鈴木一郎',
      dueDate: '2024-03-16',
      createdAt: '2024-03-13',
    },
  ]);

  const [approvals] = useState<Approval[]>([
    {
      id: '1',
      contentTitle: '2024年度の展望',
      requestedBy: '山田太郎',
      status: 'pending',
      type: 'publish',
      requestedAt: '2024-03-15 10:30',
    },
    {
      id: '2',
      contentTitle: '製品マニュアル',
      requestedBy: '佐藤花子',
      status: 'approved',
      type: 'update',
      requestedAt: '2024-03-14 15:45',
      reviewedBy: '鈴木一郎',
      reviewedAt: '2024-03-14 16:30',
    },
    {
      id: '3',
      contentTitle: '古いブログ記事',
      requestedBy: '田中次郎',
      status: 'rejected',
      type: 'delete',
      requestedAt: '2024-03-13 09:15',
      reviewedBy: '山田太郎',
      reviewedAt: '2024-03-13 11:20',
    },
  ]);

  const getStatusColor = (status: Task['status'] | Approval['status']) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'in_progress':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusText = (status: Task['status'] | Approval['status']) => {
    switch (status) {
      case 'completed':
        return '完了';
      case 'in_progress':
        return '進行中';
      case 'pending':
        return '待機中';
      case 'rejected':
        return '却下';
      case 'approved':
        return '承認済み';
      default:
        return status;
    }
  };

  const getTypeText = (type: Approval['type']) => {
    switch (type) {
      case 'publish':
        return '公開';
      case 'update':
        return '更新';
      case 'delete':
        return '削除';
      default:
        return type;
    }
  };

  const _getStatusIcon = (status: Task['status'] | Approval['status']) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return <CheckCircle size={16} className="text-green-600 dark:text-green-400" />;
      case 'rejected':
        return <XCircle size={16} className="text-red-600 dark:text-red-400" />;
      case 'in_progress':
      case 'pending':
        return <AlertTriangle size={16} className="text-yellow-600 dark:text-yellow-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">ワークフロー管理</h1>
          <p className="text-gray-600 dark:text-gray-400">タスクと承認フローの管理</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={20} />
          <span>新規タスク</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${
              activeTab === 'tasks'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <ListChecks size={18} />
            タスク
          </button>
          <button
            onClick={() => setActiveTab('approvals')}
            className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${
              activeTab === 'approvals'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <CheckCircle size={18} />
            承認
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Settings size={18} />
            設定
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="検索..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Filter size={20} />
            <span>フィルター</span>
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'tasks' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {tasks.map(task => (
              <div
                key={task.id}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-lg font-medium">{task.title}</h2>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}
                      >
                        {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}
                      >
                        {getStatusText(task.status)}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{task.description}</p>
                  </div>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                    <ChevronDown size={20} />
                  </button>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span>{task.assignee}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>期限: {task.dueDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>作成: {task.createdAt}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'approvals' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {approvals.map(approval => (
              <div
                key={approval.id}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-lg font-medium">{approval.contentTitle}</h2>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusColor(approval.status)}`}
                      >
                        {getStatusText(approval.status)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">申請タイプ:</span>
                      <span>{getTypeText(approval.type)}</span>
                    </div>
                  </div>
                  {approval.status === 'pending' && (
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                        <span>承認</span>
                      </button>
                      <button className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                        <span>却下</span>
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span>申請者: {approval.requestedBy}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>申請日時: {approval.requestedAt}</span>
                  </div>
                  {approval.reviewedBy && (
                    <>
                      <div className="flex items-center gap-2">
                        <User size={16} />
                        <span>レビュアー: {approval.reviewedBy}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>レビュー日時: {approval.reviewedAt}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">承認フロー設定</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="default-approver">デフォルトの承認者</label>
                    <select id="default-approver" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <option>管理者グループ</option>
                      <option>編集者グループ</option>
                      <option>承認者グループ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="approval-actions">承認必要なアクション</label>
                    <div className="space-y-2" id="approval-actions">
                      <label className="flex items-center" htmlFor="approve-publish">
                        <input id="approve-publish" type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">コンテンツの公開</span>
                      </label>
                      <label className="flex items-center" htmlFor="approve-update">
                        <input id="approve-update" type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">コンテンツの更新</span>
                      </label>
                      <label className="flex items-center" htmlFor="approve-delete">
                        <input id="approve-delete" type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">コンテンツの削除</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4">通知設定</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="notification-method">通知方法</label>
                    <div className="space-y-2" id="notification-method">
                      <label className="flex items-center" htmlFor="notify-email">
                        <input id="notify-email" type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">メール通知</span>
                      </label>
                      <label className="flex items-center" htmlFor="notify-system">
                        <input id="notify-system" type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">システム内通知</span>
                      </label>
                      <label className="flex items-center" htmlFor="notify-slack">
                        <input id="notify-slack" type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Slack通知</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="notification-timing">通知タイミング</label>
                    <div className="space-y-2" id="notification-timing">
                      <label className="flex items-center" htmlFor="timing-assign">
                        <input id="timing-assign" type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">タスク割り当て時</span>
                      </label>
                      <label className="flex items-center" htmlFor="timing-before-deadline">
                        <input id="timing-before-deadline" type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">期限前日</span>
                      </label>
                      <label className="flex items-center" htmlFor="timing-expired">
                        <input id="timing-expired" type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">期限切れ時</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowManagement;
