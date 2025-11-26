/**
 * Component: NotificationCenter
 * Centre de notifications avec dropdown
 */

import React, { useState, useRef, useEffect } from 'react';
import { BellOff, CheckCheck, Trash2 } from 'lucide-react';
import { useNotifications } from '../../../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import NotificationBadge from './NotificationBadge';
import NotificationItem from './NotificationItem';

const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const {
    notifications,
    unreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotificationById,
    clearAll,
  } = useNotifications();

  // Fermer au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleNotificationClick = (notification: any) => {
    if (notification.link) {
      navigate(notification.link);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Badge */}
      <NotificationBadge
        count={unreadCount}
        onClick={() => setIsOpen(!isOpen)}
      />

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="bg-gray-900/50 px-4 py-3 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold">Notifications</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {unreadCount > 0
                    ? `${unreadCount} non lue${unreadCount > 1 ? 's' : ''}`
                    : 'Aucune notification'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Marquer toutes comme lues */}
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    title="Tout marquer comme lu"
                  >
                    <CheckCheck className="w-4 h-4 text-gray-400 hover:text-cyan-400" />
                  </button>
                )}

                {/* Supprimer toutes */}
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    title="Tout supprimer"
                  >
                    <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Liste */}
          <div className="max-h-[500px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <BellOff className="w-12 h-12 text-gray-600 mb-3" />
                <p className="text-gray-400 text-sm text-center">
                  Aucune notification pour le moment
                </p>
              </div>
            ) : (
              <div className="p-2 space-y-2">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onRead={markNotificationAsRead}
                    onDelete={deleteNotificationById}
                    onClick={handleNotificationClick}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
