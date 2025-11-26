/**
 * Service: Notifications
 * Gestion des notifications système avec Supabase
 */

import { supabase } from '../lib/supabaseClient';

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'meeting';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  data?: any;
  created_at: string;
  updated_at?: string;
}

/**
 * Récupérer les notifications non lues
 */
export const getUnreadNotifications = async (): Promise<AppNotification[]> => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('read', false)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erreur chargement notifications:', error);
    return [];
  }

  return data || [];
};

/**
 * Récupérer toutes les notifications
 */
export const getAllNotifications = async (limit: number = 50): Promise<AppNotification[]> => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Erreur chargement notifications:', error);
    return [];
  }

  return data || [];
};

/**
 * Marquer une notification comme lue
 */
export const markAsRead = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', id);

  if (error) {
    console.error('Erreur marquage notification:', error);
  }
};

/**
 * Marquer toutes comme lues
 */
export const markAllAsRead = async (): Promise<void> => {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('read', false);

  if (error) {
    console.error('Erreur marquage toutes notifications:', error);
  }
};

/**
 * Supprimer une notification
 */
export const deleteNotification = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erreur suppression notification:', error);
  }
};

/**
 * Supprimer toutes les notifications
 */
export const clearAllNotifications = async (): Promise<void> => {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

  if (error) {
    console.error('Erreur suppression toutes notifications:', error);
  }
};

/**
 * Créer une notification
 */
export const createNotification = async (
  type: NotificationType,
  title: string,
  message: string,
  link?: string,
  data?: any
): Promise<AppNotification | null> => {
  const { data: notification, error } = await supabase
    .from('notifications')
    .insert({
      type,
      title,
      message,
      link,
      data,
      read: false,
    })
    .select()
    .single();

  if (error) {
    console.error('Erreur création notification:', error);
    return null;
  }

  return notification;
};

/**
 * S'abonner aux nouvelles notifications (Realtime)
 */
export const subscribeToNotifications = (
  callback: (notification: AppNotification) => void
): (() => void) => {
  const channel = supabase
    .channel('notifications-realtime')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
      },
      (payload) => {
        const notification = payload.new as AppNotification;
        callback(notification);
      }
    )
    .subscribe();

  // Retourner fonction de désabonnement
  return () => {
    supabase.removeChannel(channel);
  };
};

/**
 * Demander permission pour notifications navigateur
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) {
    console.warn('Notifications navigateur non supportées');
    return 'denied';
  }

  return await Notification.requestPermission();
};

/**
 * Afficher notification navigateur
 */
export const showBrowserNotification = (
  title: string,
  options?: NotificationOptions
): void => {
  if (!('Notification' in window)) return;

  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options,
    });
  }
};

/**
 * Jouer son notification
 */
export const playNotificationSound = (): void => {
  try {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTUHGGS57OmhTQ0PUKXh8LNoHgU2jdXxz3ksBSh+zO/bizsKElyx6OyrWBUIQ5zm8L1hGwIjb8bh2c1bCg==');
    audio.volume = 0.3;
    audio.play().catch(() => {
      // Ignorer erreurs autoplay
    });
  } catch (error) {
    console.error('Erreur lecture son:', error);
  }
};

/**
 * Compter notifications non lues
 */
export const getUnreadCount = async (): Promise<number> => {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('read', false);

  if (error) {
    console.error('Erreur comptage notifications:', error);
    return 0;
  }

  return count || 0;
};
