import ActivityItem, { ActivityItemProps } from '@/shared/ui/molecules/ActivityItem';

type ActivityLogProps = {
  activities: ActivityItemProps[];
  title: string;
};

const ActivityLog = ({ activities, title }: ActivityLogProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h2>
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
          <p className="text-sm text-gray-500 dark:text-gray-400 p-4">No activities found.</p>
        )}
      </div>
    </div>
  );
};

export default ActivityLog;
