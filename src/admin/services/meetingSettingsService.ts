/**
 * Service: Meeting Settings (Configuration)
 * Gestion de la configuration du système de rendez-vous
 */

import { supabase } from '../../lib/supabaseClient';

export interface MeetingSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  description: string | null;
  updated_at: string;
}

export type SettingKey =
  | 'buffer_time'
  | 'max_advance_days'
  | 'min_advance_hours'
  | 'slot_duration'
  | 'admin_email'
  | 'timezone';

export interface MeetingSettings {
  buffer_time: number; // minutes
  max_advance_days: number; // jours
  min_advance_hours: number; // heures
  slot_duration: number; // minutes
  admin_email: string;
  timezone: string;
}

/**
 * Récupérer tous les paramètres
 */
export const getAllSettings = async (): Promise<MeetingSetting[]> => {
  const { data, error } = await supabase
    .from('meeting_settings')
    .select('*')
    .order('setting_key', { ascending: true });

  if (error) throw error;
  return data || [];
};

/**
 * Récupérer paramètres formatés
 */
export const getSettings = async (): Promise<MeetingSettings> => {
  const settings = await getAllSettings();

  const config: MeetingSettings = {
    buffer_time: 15,
    max_advance_days: 90,
    min_advance_hours: 24,
    slot_duration: 45,
    admin_email: 'contact@leonce-ouattara.com',
    timezone: 'Africa/Abidjan',
  };

  settings.forEach((setting) => {
    const key = setting.setting_key as keyof MeetingSettings;
    const value = setting.setting_value;

    if (key === 'admin_email' || key === 'timezone') {
      config[key] = value;
    } else {
      config[key] = parseInt(value, 10);
    }
  });

  return config;
};

/**
 * Récupérer un paramètre spécifique
 */
export const getSetting = async (key: SettingKey): Promise<string> => {
  const { data, error } = await supabase
    .from('meeting_settings')
    .select('setting_value')
    .eq('setting_key', key)
    .single();

  if (error) throw error;
  return data.setting_value;
};

/**
 * Mettre à jour un paramètre (admin)
 */
export const updateSetting = async (key: SettingKey, value: string): Promise<MeetingSetting> => {
  const { data, error } = await supabase
    .from('meeting_settings')
    .update({ setting_value: value })
    .eq('setting_key', key)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Mettre à jour plusieurs paramètres (admin)
 */
export const updateSettings = async (
  settings: Partial<Record<SettingKey, string>>
): Promise<void> => {
  const updates = Object.entries(settings).map(([key, value]) =>
    supabase
      .from('meeting_settings')
      .update({ setting_value: value })
      .eq('setting_key', key)
  );

  const results = await Promise.all(updates);

  const error = results.find((result) => result.error);
  if (error) throw error.error;
};

/**
 * Réinitialiser aux valeurs par défaut (admin)
 */
export const resetToDefaults = async (): Promise<void> => {
  const defaults: Record<SettingKey, string> = {
    buffer_time: '15',
    max_advance_days: '90',
    min_advance_hours: '24',
    slot_duration: '45',
    admin_email: 'contact@leonce-ouattara.com',
    timezone: 'Africa/Abidjan',
  };

  await updateSettings(defaults);
};

/**
 * Valider configuration (admin)
 */
export const validateSettings = async (): Promise<{
  valid: boolean;
  errors: string[];
}> => {
  const settings = await getSettings();
  const errors: string[] = [];

  if (settings.buffer_time < 0 || settings.buffer_time > 60) {
    errors.push('Buffer time doit être entre 0 et 60 minutes');
  }

  if (settings.max_advance_days < 1 || settings.max_advance_days > 365) {
    errors.push('Max advance days doit être entre 1 et 365 jours');
  }

  if (settings.min_advance_hours < 1 || settings.min_advance_hours > 168) {
    errors.push('Min advance hours doit être entre 1 et 168 heures (7 jours)');
  }

  if (settings.slot_duration < 15 || settings.slot_duration > 240) {
    errors.push('Slot duration doit être entre 15 et 240 minutes');
  }

  if (!settings.admin_email || !settings.admin_email.includes('@')) {
    errors.push('Admin email invalide');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
