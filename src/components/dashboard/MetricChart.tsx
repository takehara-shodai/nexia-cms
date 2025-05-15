import { ReactNode } from 'react';

type MetricChartProps = {
  title: string;
  description?: string;
  height?: number;
  children?: ReactNode;
};

const MetricChart = ({ title, description, height = 300, children }: MetricChartProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
        )}
      </div>
      <div style={{ height }} className="p-4">
        {children ? (
          children
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-750 rounded border border-dashed border-gray-300 dark:border-gray-600">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              チャートデータがここに表示されます
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricChart;
