import { DivideIcon as _LucideIcon } from 'lucide-react';

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

const StatCard = ({ title, value, icon, change, bgColor, textColor }: StatCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
            <p className="text-2xl font-bold" style={{ color: textColor }}>{value}</p>
          </div>
          <div className="flex items-center gap-2">
            {icon}
            {change && (
              <span
                className={`text-sm font-medium ${change.isPositive ? 'text-green-500' : 'text-red-500'}`}
              >
                {change.value}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
