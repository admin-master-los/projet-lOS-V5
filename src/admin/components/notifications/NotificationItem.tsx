/**
 * Component: NotificationItem
 * Élément de notification individuel
 */

import React from 'react';
import { X, Calendar, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { AppNotification, NotificationType } from '../../../services/notificationService';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface NotificationItemProps {
  notification: AppNotification;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
  onClick?: (notification: AppNotification) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onRead,
  onDelete,
  onClick,
}) => {
  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'meeting':
        return <Calendar className="w-5 h-5 text-cyan-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getBgColor = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/20';
      case 'error':
        return 'bg-red-500/10 border-red-500/20';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20';
      case 'meeting':
        return 'bg-cyan-500/10 border-cyan-500/20';
      default:
        return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  const handleClick = () => {
    if (!notification.read) {
      onRead(notification.id);
    }
    if (onClick) {
      onClick(notification);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        relative p-4 rounded-lg border cursor-pointer
        transition-all duration-200
        ${notification.read ? 'bg-white/5 border-white/10 opacity-60' : getBgColor(notification.type)}
        hover:bg-white/10
      `}
    >
      {/* Badge non lu */}
      {!notification.read && (
        <div className="absolute top-2 left-2 w-2 h-2 bg-cyan-400 rounded-full" />
      )}

      <div className="flex items-start gap-3 ml-4">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          {getIcon(notification.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-semibold text-white">
              {notification.title}
            </h4>
            
            {/* Delete button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(notification.id);
              }}
              className="flex-shrink-0 p-1 rounded hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-white" />
            </button>
          </div>

          <p className="text-sm text-gray-300 mt-1">
            {notification.message}
          </p>

          <p className="text-xs text-gray-500 mt-2">
            {formatDistanceToNow(new Date(notification.created_at), {
              addSuffix: true,
              locale: fr,
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
