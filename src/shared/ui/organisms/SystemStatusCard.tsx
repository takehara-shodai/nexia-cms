type StatusItemProps = {
  name: string;
  status: 'online' | 'warning' | 'error' | 'maintenance';
  details?: string;
};

type SystemStatusCardProps = {
  statuses: StatusItemProps[];
};

const SystemStatusCard = ({ statuses }: SystemStatusCardProps) => {
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

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">System Status</h2>
      </div>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {statuses.map((statusItem, index) => (
          <li key={index} className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{statusItem.name}</p>
              {statusItem.details && (
                <p className="text-xs text-gray-500 dark:text-gray-400">{statusItem.details}</p>
              )}
            </div>
            <span
              className={`w-3 h-3 rounded-full ${getStatusColor(statusItem.status)}`}
              title={statusItem.status}
            ></span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SystemStatusCard;
