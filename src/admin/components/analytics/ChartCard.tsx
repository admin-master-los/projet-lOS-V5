import React from 'react';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  subtitle?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children, subtitle }) => {
  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
      </div>
      <div className="min-h-[300px]">{children}</div>
    </div>
  );
};

export default ChartCard;
