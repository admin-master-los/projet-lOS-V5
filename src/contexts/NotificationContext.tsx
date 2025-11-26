/**
 * Context: Notifications
 * Gestion globale des notifications avec Supabase
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  AppNotification,
  getUnreadNotifications,
  getAllNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  createNotification,
  subscribeToNotifications,
  requestNotificationPermission,
  showBrowserNotification,
  playNotificationSound,
  NotificationType,
} from '../services/notificationService';
import toast from 'react-hot-toast';

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;
  refreshNotifications: () => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  deleteNotificationById: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  addNotification: (
    type: NotificationType,
    title: string,
    message: string,
    link?: string,
    data?: any
  ) => Promise<void>;
  requestPermission: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Charger notifications
  const refreshNotifications = useCallback(async () => {
    try {
      const [all, unread] = await Promise.all([
        getAllNotifications(),
        getUnreadNotifications(),
      ]);

      setNotifications(all);
      setUnreadCount(unread.length);
    } catch (error) {
      console.error('Erreur chargement notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Marquer comme lu
  const markNotificationAsRead = useCallback(async (id: string) => {
    await markAsRead(id);
    await refreshNotifications();
  }, [refreshNotifications]);

  // Marquer toutes comme lues
  const markAllNotificationsAsRead = useCallback(async () => {
    await markAllAsRead();
    await refreshNotifications();
    toast.success('Toutes les notifications marquées comme lues');
  }, [refreshNotifications]);

  // Supprimer une notification
  const deleteNotificationById = useCallback(async (id: string) => {
    await deleteNotification(id);
    await refreshNotifications();
  }, [refreshNotifications]);

  // Supprimer toutes
  const clearAll = useCallback(async () => {
    await clearAllNotifications();
    await refreshNotifications();
    toast.success('Toutes les notifications supprimées');
  }, [refreshNotifications]);

  // Ajouter notification
  const addNotification = useCallback(async (
    type: NotificationType,
    title: string,
    message: string,
    link?: string,
    data?: any
  ) => {
    const notification = await createNotification(type, title, message, link, data);
    if (!notification) return;

    await refreshNotifications();

    // Toast
    const toastOptions = {
      duration: 4000,
      icon: type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : type === 'meeting' ? '📅' : 'ℹ️',
    };

    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-white">{title}</p>
                <p className="mt-1 text-sm text-gray-300">{message}</p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-700">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-cyan-400 hover:text-cyan-300"
            >
              Fermer
            </button>
          </div>
        </div>
      ),
      toastOptions
    );

    // Notification navigateur
    if (Notification.permission === 'granted') {
      showBrowserNotification(title, {
        body: message,
        tag: notification.id,
      });
    }

    // Son
    playNotificationSound();
  }, [refreshNotifications]);

  // Demander permission
  const requestPermission = useCallback(async () => {
    const permission = await requestNotificationPermission();
    if (permission === 'granted') {
      toast.success('Notifications activées !');
    } else {
      toast.error('Notifications refusées');
    }
  }, []);

  // Charger au montage
  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  // S'abonner aux nouvelles notifications (Realtime)
  useEffect(() => {
    const unsubscribe = subscribeToNotifications(async (notification) => {
      // Rafraîchir la liste
      await refreshNotifications();

      // Toast
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-white">{notification.title}</p>
                  <p className="mt-1 text-sm text-gray-300">{notification.message}</p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-700">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-cyan-400 hover:text-cyan-300"
              >
                Fermer
              </button>
            </div>
          </div>
        ),
        { duration: 4000, icon: '📅' }
      );

      // Notification navigateur
      if (Notification.permission === 'granted') {
        showBrowserNotification(notification.title, {
          body: notification.message,
          tag: notification.id,
        });
      }

      // Son
      playNotificationSound();
    });

    return unsubscribe;
  }, [refreshNotifications]);

  // Rafraîchir toutes les 60 secondes (backup)
  useEffect(() => {
    const interval = setInterval(refreshNotifications, 60000);
    return () => clearInterval(interval);
  }, [refreshNotifications]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    isLoading,
    refreshNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotificationById,
    clearAll,
    addNotification,
    requestPermission,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};
