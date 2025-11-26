/**
 * Hooks: Meeting Settings (Configuration)
 * React Query hooks pour la configuration du système
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  getAllSettings,
  getSettings,
  getSetting,
  updateSetting,
  updateSettings,
  resetToDefaults,
  validateSettings,
  SettingKey,
} from '../services/meetingSettingsService';

// Query keys
export const SETTINGS_KEYS = {
  all: ['meeting-settings'] as const,
  formatted: ['meeting-settings', 'formatted'] as const,
  single: (key: SettingKey) => ['meeting-settings', key] as const,
  validation: ['meeting-settings', 'validation'] as const,
};

/**
 * Hook: Récupérer tous les paramètres
 */
export const useAllSettings = () => {
  return useQuery({
    queryKey: SETTINGS_KEYS.all,
    queryFn: getAllSettings,
  });
};

/**
 * Hook: Récupérer paramètres formatés
 */
export const useSettings = () => {
  return useQuery({
    queryKey: SETTINGS_KEYS.formatted,
    queryFn: getSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook: Récupérer un paramètre spécifique
 */
export const useSetting = (key: SettingKey) => {
  return useQuery({
    queryKey: SETTINGS_KEYS.single(key),
    queryFn: () => getSetting(key),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook: Valider la configuration
 */
export const useValidateSettings = () => {
  return useQuery({
    queryKey: SETTINGS_KEYS.validation,
    queryFn: validateSettings,
    staleTime: 60000, // 1 minute
  });
};

/**
 * Hook: Mettre à jour un paramètre (admin)
 */
export const useUpdateSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, value }: { key: SettingKey; value: string }) =>
      updateSetting(key, value),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEYS.formatted });
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEYS.single(variables.key) });
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEYS.validation });
      toast.success('Paramètre mis à jour');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
};

/**
 * Hook: Mettre à jour plusieurs paramètres (admin)
 */
export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: Partial<Record<SettingKey, string>>) => updateSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEYS.formatted });
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEYS.validation });
      toast.success('Paramètres mis à jour');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
};

/**
 * Hook: Réinitialiser aux valeurs par défaut (admin)
 */
export const useResetSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resetToDefaults,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEYS.formatted });
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEYS.validation });
      toast.success('Paramètres réinitialisés');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
};

/**
 * Hook: Buffer time (temps de battement)
 */
export const useBufferTime = () => {
  const { data: settings } = useSettings();
  return settings?.buffer_time || 15;
};

/**
 * Hook: Max advance days (jours max à l'avance)
 */
export const useMaxAdvanceDays = () => {
  const { data: settings } = useSettings();
  return settings?.max_advance_days || 90;
};

/**
 * Hook: Min advance hours (délai min réservation)
 */
export const useMinAdvanceHours = () => {
  const { data: settings } = useSettings();
  return settings?.min_advance_hours || 24;
};

/**
 * Hook: Slot duration (durée créneaux)
 */
export const useSlotDuration = () => {
  const { data: settings } = useSettings();
  return settings?.slot_duration || 45;
};

/**
 * Hook: Admin email
 */
export const useAdminEmail = () => {
  const { data: settings } = useSettings();
  return settings?.admin_email || 'contact@leonce-ouattara.com';
};

/**
 * Hook: Timezone
 */
export const useTimezone = () => {
  const { data: settings } = useSettings();
  return settings?.timezone || 'Africa/Abidjan';
};
