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
    <div className="flex items-center gap-4 p-4">
      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-lg font-medium text-gray-400">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-900 dark:text-white">
          <span className="font-medium">{user.name}</span> {action} <span className="font-medium">{target}</span>
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{time}</p>
      </div>
      {status && (
        <span className={`text-xs font-medium ${statusColors[status]}`}>{status}</span>
      )}
    </div>
  );
};

export default ActivityItem;
