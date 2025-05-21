import React from 'react';

export interface ActivityItemProps {
  user: {
    name: string;
    avatar?: string;
  };
  action: string;
  target: string;
  time: string;
  status?: 'success' | 'error' | 'pending';
}

const ActivityItem = ({ user, action, target, time, status }: ActivityItemProps) => {
  const statusColors = {
    success: 'text-green-600 dark:text-green-400',
    error: 'text-red-600 dark:text-red-400',
    pending: 'text-yellow-600 dark:text-yellow-400',
  };

  return (
    <div className="px-6 py-4 flex items-center space-x-4">
      {user.avatar ? (
        <img
          src={user.avatar}
          alt={user.name}
          className="h-8 w-8 rounded-full"
          width={32}
          height={32}
        />
      ) : (
        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 dark:text-white truncate">
          <span className="font-medium">{user.name}</span> <span>{action}</span>{' '}
          <span className="font-medium">{target}</span>
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{time}</p>
      </div>
      {status && (
        <span className={`text-sm ${statusColors[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      )}
    </div>
  );
};

export default ActivityItem;
