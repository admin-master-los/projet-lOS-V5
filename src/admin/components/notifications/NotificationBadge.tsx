/**
 * Component: NotificationBadge
 * Badge avec compteur de notifications non lues
 */

import React from 'react';
import { Bell } from 'lucide-react';

interface NotificationBadgeProps {
  count: number;
  onClick?: () => void;
  className?: string;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  onClick,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      className={`relative p-2 rounded-lg hover:bg-white/10 transition-all ${className}`}
    >
      <Bell className={`w-6 h-6 ${count > 0 ? 'text-cyan-400' : 'text-gray-400'}`} />
      
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
};

export default NotificationBadge;
