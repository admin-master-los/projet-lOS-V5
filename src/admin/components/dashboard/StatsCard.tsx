import React from 'react';
import { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Composant StatsCard
 * Affiche une statistique avec icône, valeur et tendance
 */

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  link?: string;
  isLoading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  icon: Icon,
  color,
  bgColor,
  borderColor,
  trend,
  link,
  isLoading = false,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (link) {
      navigate(link);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        bg-white/5 border ${borderColor} rounded-xl p-6 
        transition-all duration-300
        ${link ? 'cursor-pointer hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/10' : ''}
      `}
    >
      {isLoading ? (
        // Skeleton loader
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${bgColor} rounded-lg`} />
            <div className="w-8 h-4 bg-gray-700 rounded" />
          </div>
          <div className="w-16 h-8 bg-gray-700 rounded mb-2" />
          <div className="w-24 h-4 bg-gray-700 rounded" />
        </div>
      ) : (
        <>
          {/* Header: Icon + Trend */}
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
              <Icon size={24} className="text-white" />
            </div>
            {trend && (
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  trend.isPositive ? 'text-green-400' : 'text-red-400'
                }`}
              >
                <span>{trend.isPositive ? '↑' : '↓'}</span>
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>

          {/* Value */}
          <p className="text-3xl font-bold text-white mb-1">
            {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
          </p>

          {/* Label */}
          <p className="text-sm text-gray-400">{label}</p>
        </>
      )}
    </div>
  );
};

export default StatsCard;
