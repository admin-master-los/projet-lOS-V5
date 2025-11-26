import React from 'react';

interface StatusBadgeProps {
  status: string;
  count: number;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'En attente', color: 'bg-yellow-500/20 text-yellow-400' },
  confirmed: { label: 'Confirmé', color: 'bg-green-500/20 text-green-400' },
  completed: { label: 'Terminé', color: 'bg-blue-500/20 text-blue-400' },
  cancelled: { label: 'Annulé', color: 'bg-red-500/20 text-red-400' },
  no_show: { label: 'Absent', color: 'bg-gray-500/20 text-gray-400' },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, count }) => {
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <div className={`px-3 py-2 rounded-lg ${config.color} flex items-center justify-between`}>
      <span className="text-sm font-medium">{config.label}</span>
      <span className="text-lg font-bold ml-2">{count}</span>
    </div>
  );
};

export default StatusBadge;
