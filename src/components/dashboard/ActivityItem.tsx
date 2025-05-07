import React from 'react';

export interface ActivityItemProps {
  user: {
    name: string;
    avatar?: string;
    initial?: string;
  };
  action: string;
  target: string;
  time: string;
  status?: 'success' | 'warning' | 'error' | 'info';
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  user,
  action,
  target,
  time,
  status = 'info'
}) => {
  const statusColors = {
    success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    error: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
  };

  return (
    <div className="flex items-start p-4 border-b border-gray-200 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
      <div className="flex-shrink-0">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
            {user.initial || user.name.charAt(0)}
          </div>
        )}
      </div>
      <div className="ml-3 flex-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">
            <span className="text-gray-900 dark:text-white">{user.name}</span>
            <span className="text-gray-600 dark:text-gray-300"> {action} </span>
            <span className="font-medium text-gray-900 dark:text-white">{target}</span>
          </p>
          <span className="text-xs text-gray-500 dark:text-gray-400">{time}</span>
        </div>
        <div className="mt-1">
          <span className={`inline-block px-2 py-1 text-xs rounded-full ${statusColors[status]}`}>
            {status === 'success' && '成功'}
            {status === 'warning' && '警告'}
            {status === 'error' && 'エラー'}
            {status === 'info' && '情報'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;