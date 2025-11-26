import React from 'react';

interface SimpleBarChartProps {
  data: { label: string; value: number; color: string }[];
  maxValue?: number;
}

const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ data, maxValue }) => {
  const max = maxValue || Math.max(...data.map(d => d.value), 1);

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">{item.label}</span>
            <span className="text-sm font-bold text-white">{item.value}</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(item.value / max) * 100}%`,
                backgroundColor: item.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SimpleBarChart;
