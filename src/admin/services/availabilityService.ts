/**
 * Service: Availability (Disponibilités)
 * Gestion des plages horaires et dates bloquées
 */

import { supabase } from '../../lib/supabaseClient';

export interface Availability {
  id: string;
  day_of_week: number; // 0=Dimanche, 6=Samedi
  start_time: string; // HH:MM:SS
  end_time: string; // HH:MM:SS
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlockedDate {
  id: string;
  blocked_date: string; // YYYY-MM-DD
  reason: string | null;
  created_at: string;
}

export interface CreateAvailabilityInput {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available?: boolean;
}

export interface CreateBlockedDateInput {
  blocked_date: string;
  reason?: string;
}

/**
 * Récupérer toutes les disponibilités
 */
export const getAllAvailabilities = async (): Promise<Availability[]> => {
  const { data, error } = await supabase
    .from('meeting_availability')
    .select('*')
    .eq('is_available', true)
    .order('day_of_week', { ascending: true })
    .order('start_time', { ascending: true });

  if (error) throw error;
  return data || [];
};

/**
 * Récupérer disponibilités par jour
 */
export const getAvailabilityByDay = async (dayOfWeek: number): Promise<Availability[]> => {
  const { data, error } = await supabase
    .from('meeting_availability')
    .select('*')
    .eq('day_of_week', dayOfWeek)
    .eq('is_available', true)
    .order('start_time', { ascending: true });

  if (error) throw error;
  return data || [];
};

/**
 * Créer une nouvelle disponibilité (admin)
 */
export const createAvailability = async (
  input: CreateAvailabilityInput
): Promise<Availability> => {
  const { data, error } = await supabase
    .from('meeting_availability')
    .insert([input])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Mettre à jour une disponibilité (admin)
 */
export const updateAvailability = async (
  id: string,
  input: Partial<CreateAvailabilityInput>
): Promise<Availability> => {
  const { data, error } = await supabase
    .from('meeting_availability')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Supprimer une disponibilité (admin)
 */
export const deleteAvailability = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('meeting_availability')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

/**
 * Récupérer toutes les dates bloquées
 */
export const getAllBlockedDates = async (): Promise<BlockedDate[]> => {
  const { data, error } = await supabase
    .from('meeting_blocked_dates')
    .select('*')
    .order('blocked_date', { ascending: true });

  if (error) throw error;
  return data || [];
};

/**
 * Récupérer dates bloquées à venir
 */
export const getUpcomingBlockedDates = async (): Promise<BlockedDate[]> => {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('meeting_blocked_dates')
    .select('*')
    .gte('blocked_date', today)
    .order('blocked_date', { ascending: true });

  if (error) throw error;
  return data || [];
};

/**
 * Vérifier si une date est bloquée
 */
export const isDateBlocked = async (date: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('meeting_blocked_dates')
    .select('id')
    .eq('blocked_date', date)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
  return !!data;
};

/**
 * Créer une date bloquée (admin)
 */
export const createBlockedDate = async (
  input: CreateBlockedDateInput
): Promise<BlockedDate> => {
  const { data, error } = await supabase
    .from('meeting_blocked_dates')
    .insert([input])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Supprimer une date bloquée (admin)
 */
export const deleteBlockedDate = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('meeting_blocked_dates')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

/**
 * Bloquer plusieurs dates (vacances) (admin)
 */
export const blockDateRange = async (
  startDate: string,
  endDate: string,
  reason?: string
): Promise<void> => {
  const dates: CreateBlockedDateInput[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Générer toutes les dates entre start et end
  for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
    dates.push({
      blocked_date: date.toISOString().split('T')[0],
      reason: reason || 'Date bloquée',
    });
  }

  const { error } = await supabase.from('meeting_blocked_dates').insert(dates);

  if (error) throw error;
};

/**
 * Récupérer planning complet pour un mois (admin)
 */
export const getMonthSchedule = async (
  year: number,
  month: number
): Promise<{
  availabilities: Availability[];
  blockedDates: BlockedDate[];
  meetings: any[];
}> => {
  // Date début et fin du mois
  const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
  const endDate = new Date(year, month, 0).toISOString().split('T')[0];

  // Récupérer toutes les données en parallèle
  const [availabilitiesResult, blockedDatesResult, meetingsResult] = await Promise.all([
    supabase.from('meeting_availability').select('*').eq('is_available', true),
    supabase
      .from('meeting_blocked_dates')
      .select('*')
      .gte('blocked_date', startDate)
      .lte('blocked_date', endDate),
    supabase
      .from('meetings')
      .select('*')
      .gte('meeting_date', startDate)
      .lte('meeting_date', endDate)
      .in('status', ['pending', 'confirmed']),
  ]);

  if (availabilitiesResult.error) throw availabilitiesResult.error;
  if (blockedDatesResult.error) throw blockedDatesResult.error;
  if (meetingsResult.error) throw meetingsResult.error;

  return {
    availabilities: availabilitiesResult.data || [],
    blockedDates: blockedDatesResult.data || [],
    meetings: meetingsResult.data || [],
  };
};
