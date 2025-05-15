import ActivityItem, { ActivityItemProps } from './ActivityItem';

type ActivityLogProps = {
  activities: ActivityItemProps[];
  title: string;
};

const ActivityLog = ({ activities, title }: ActivityLogProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[400px] overflow-y-auto">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <ActivityItem
              key={index}
              user={activity.user}
              action={activity.action}
              target={activity.target}
              time={activity.time}
              status={activity.status}
            />
          ))
        ) : (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            アクティビティはありません
          </div>
        )}
      </div>
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700">
        <a href="#" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
          すべてのアクティビティを表示
        </a>
      </div>
    </div>
  );
};

export default ActivityLog;