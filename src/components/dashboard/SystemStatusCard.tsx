import React from 'react';

interface StatusItemProps {
  name: string;
  status: 'online' | 'warning' | 'error' | 'maintenance';
  details?: string;
}

interface SystemStatusCardProps {
  statuses: StatusItemProps[];
}

const SystemStatusCard: React.FC<SystemStatusCardProps> = ({ statuses }) => {
  const getStatusColor = (status: StatusItemProps['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      case 'maintenance':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: StatusItemProps['status']) => {
    switch (status) {
      case 'online':
        return '正常';
      case 'warning':
        return '警告';
      case 'error':
        return 'エラー';
      case 'maintenance':
        return 'メンテナンス中';
      default:
        return '不明';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">システムステータス</h3>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {statuses.map((item, index) => (
          <div key={index} className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(item.status)}`}></div>
              <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white">{item.name}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                {getStatusText(item.status)}
              </span>
              {item.details && (
                <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                  {item.details}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemStatusCard;