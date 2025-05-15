import { DivideIcon as LucideIcon } from 'lucide-react';

type StatCardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: {
    value: string;
    isPositive: boolean;
  };
  bgColor: string;
  textColor: string;
};

const StatCard = ({
  title,
  value,
  icon,
  change,
  bgColor,
  textColor
}: StatCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
            {change && (
              <div className="flex items-center mt-1">
                <span
                  className={`text-xs font-medium ${
                    change.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {change.isPositive ? '↑ ' : '↓ '}{change.value}
                </span>
              </div>
            )}
          </div>
          <div className={`rounded-full p-3 ${bgColor} ${textColor}`}>
            {icon}
          </div>
        </div>
      </div>
      <div className="h-1 w-full bg-gray-100 dark:bg-gray-700">
        <div className={`h-full ${bgColor.replace('bg-', 'bg-opacity-70 ')} w-3/4`}></div>
      </div>
    </div>
  );
};

export default StatCard;