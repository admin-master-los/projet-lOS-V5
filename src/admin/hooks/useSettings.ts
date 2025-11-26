import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  // Admin Users
  getAllAdminUsers,
  getAdminUserById,
  getCurrentAdminUser,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  toggleAdminUserActive,
  changeAdminUserPassword,
  CreateAdminUserInput,
  UpdateAdminUserInput,
  
  // System Settings
  getAllSettings,
  getSettingsByCategory,
  getSettingByKey,
  updateSetting,
  updateMultipleSettings,
  UpdateSettingInput,
  SettingCategory,
  
  // Activity Logs
  getActivityLogs,
  logActivity,
  LogActivityInput,
  
  // Stats
  getAdminUsersStats,
} from '../services/settingsService';

/**
 * Hooks React Query pour les paramètres et utilisateurs admin
 */

// ============================================
// ADMIN USERS HOOKS
// ============================================

/**
 * Hook pour récupérer tous les utilisateurs admin
 */
export const useAdminUsers = () => {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: getAllAdminUsers,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook pour récupérer un utilisateur par ID
 */
export const useAdminUser = (id: string | undefined) => {
  return useQuery({
    queryKey: ['admin', 'users', id],
    queryFn: () => getAdminUserById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook pour récupérer l'utilisateur connecté
 */
export const useCurrentAdminUser = () => {
  return useQuery({
    queryKey: ['admin', 'current-user'],
    queryFn: getCurrentAdminUser,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook pour créer un utilisateur
 */
export const useCreateAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAdminUserInput) => createAdminUser(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
};

/**
 * Hook pour mettre à jour un utilisateur
 */
export const useUpdateAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateAdminUserInput }) =>
      updateAdminUser(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', data.id] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'current-user'] });
    },
  });
};

/**
 * Hook pour supprimer un utilisateur
 */
export const useDeleteAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAdminUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
};

/**
 * Hook pour activer/désactiver un utilisateur
 */
export const useToggleAdminUserActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => toggleAdminUserActive(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', data.id] });
    },
  });
};

/**
 * Hook pour changer le mot de passe
 */
export const useChangeAdminUserPassword = () => {
  return useMutation({
    mutationFn: ({ userId, newPassword }: { userId: string; newPassword: string }) =>
      changeAdminUserPassword(userId, newPassword),
  });
};

// ============================================
// SYSTEM SETTINGS HOOKS
// ============================================

/**
 * Hook pour récupérer tous les paramètres
 */
export const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: getAllSettings,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

/**
 * Hook pour récupérer les paramètres par catégorie
 */
export const useSettingsByCategory = (category: SettingCategory) => {
  return useQuery({
    queryKey: ['settings', 'category', category],
    queryFn: () => getSettingsByCategory(category),
    staleTime: 1000 * 60 * 10,
  });
};

/**
 * Hook pour récupérer un paramètre par clé
 */
export const useSetting = (key: string) => {
  return useQuery({
    queryKey: ['settings', 'key', key],
    queryFn: () => getSettingByKey(key),
    staleTime: 1000 * 60 * 10,
  });
};

/**
 * Hook pour mettre à jour un paramètre
 */
export const useUpdateSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, input }: { key: string; input: UpdateSettingInput }) =>
      updateSetting(key, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      queryClient.invalidateQueries({ queryKey: ['settings', 'key', data.key] });
      queryClient.invalidateQueries({ queryKey: ['settings', 'category', data.category] });
    },
  });
};

/**
 * Hook pour mettre à jour plusieurs paramètres
 */
export const useUpdateMultipleSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: Record<string, any>) => updateMultipleSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
};

// ============================================
// ACTIVITY LOGS HOOKS
// ============================================

/**
 * Hook pour récupérer les logs d'activité
 */
export const useActivityLogs = (limit: number = 100, userId?: string) => {
  return useQuery({
    queryKey: ['admin', 'activity-logs', limit, userId],
    queryFn: () => getActivityLogs(limit, userId),
    staleTime: 1000 * 60 * 2,
  });
};

/**
 * Hook pour logger une activité
 */
export const useLogActivity = () => {
  return useMutation({
    mutationFn: (input: LogActivityInput) => logActivity(input),
  });
};

// ============================================
// STATS HOOKS
// ============================================

/**
 * Hook pour récupérer les statistiques des utilisateurs
 */
export const useAdminUsersStats = () => {
  return useQuery({
    queryKey: ['admin', 'users', 'stats'],
    queryFn: getAdminUsersStats,
    staleTime: 1000 * 60 * 5,
  });
};
