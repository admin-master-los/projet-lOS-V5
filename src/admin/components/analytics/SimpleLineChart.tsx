import React from 'react';

interface SimpleLineChartProps {
  data: { label: string; value: number }[];
  color?: string;
}

const SimpleLineChart: React.FC<SimpleLineChartProps> = ({ 
  data, 
  color = '#06b6d4' 
}) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const minValue = Math.min(...data.map(d => d.value), 0);
  const range = maxValue - minValue || 1;

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((item.value - minValue) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="space-y-4">
      <svg className="w-full h-64" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>
        </defs>
        
        <polyline
          points={`0,100 ${points} 100,100`}
          fill="url(#lineGradient)"
        />
        
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="0.5"
          vectorEffect="non-scaling-stroke"
        />

        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 100 - ((item.value - minValue) / range) * 100;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="1"
              fill={color}
              className="hover:r-2 transition-all"
            />
          );
        })}
      </svg>

      <div className="flex items-center justify-between text-xs text-gray-400 px-2">
        <span>{data[0]?.label}</span>
        <span>{data[Math.floor(data.length / 2)]?.label}</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </div>
  );
};

export default SimpleLineChart;
