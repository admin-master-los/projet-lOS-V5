/**
 * Service: Meetings
 * Gestion complète des rendez-vous
 */

import { supabase } from '../../lib/supabaseClient';

// Types
export type MeetingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

export interface Meeting {
  id: string;
  service_id: string;
  meeting_date: string;
  meeting_time: string;
  duration: number;
  client_name: string;
  client_email: string;
  client_phone: string;
  client_country_code: string;
  client_company: string | null;
  client_notes: string | null;
  meeting_channel: string | null;
  meeting_link: string | null;
  status: MeetingStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  meeting_services?: {
    name: string;
    color: string;
  };
}

export interface CreateMeetingInput {
  service_id: string;
  meeting_date: string;
  meeting_time: string;
  duration: number;
  client_name: string;
  client_email: string;
  client_phone: string;
  client_country_code: string;
  client_company?: string;
  client_notes?: string;
  meeting_channel?: string;
  meeting_link?: string;
}

export interface UpdateMeetingInput {
  service_id?: string;
  meeting_date?: string;
  meeting_time?: string;
  duration?: number;
  client_name?: string;
  client_email?: string;
  client_phone?: string;
  client_country_code?: string;
  client_company?: string;
  client_notes?: string;
  meeting_channel?: string;
  meeting_link?: string;
  status?: MeetingStatus;
  admin_notes?: string;
}

export interface MeetingFilters {
  status?: MeetingStatus;
  service_id?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface MeetingStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  no_show: number;
}

/**
 * Récupérer tous les rendez-vous avec filtres
 */
export const getAllMeetings = async (filters?: MeetingFilters): Promise<Meeting[]> => {
  let query = supabase
    .from('meetings')
    .select(`
      *,
      meeting_services (
        name,
        color
      )
    `)
    .order('meeting_date', { ascending: false })
    .order('meeting_time', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.service_id) {
    query = query.eq('service_id', filters.service_id);
  }

  if (filters?.date_from) {
    query = query.gte('meeting_date', filters.date_from);
  }

  if (filters?.date_to) {
    query = query.lte('meeting_date', filters.date_to);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
};

/**
 * Récupérer un rendez-vous par ID
 */
export const getMeetingById = async (id: string): Promise<Meeting> => {
  const { data, error } = await supabase
    .from('meetings')
    .select(`
      *,
      meeting_services (
        name,
        color,
        duration
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  if (!data) throw new Error('Rendez-vous non trouvé');
  return data;
};

/**
 * Récupérer rendez-vous par date
 */
export const getMeetingsByDate = async (date: string): Promise<Meeting[]> => {
  const { data, error } = await supabase
    .from('meetings')
    .select(`
      *,
      meeting_services (
        name,
        color
      )
    `)
    .eq('meeting_date', date)
    .order('meeting_time');

  if (error) throw error;
  return data || [];
};

/**
 * Récupérer prochains rendez-vous
 */
export const getUpcomingMeetings = async (limit: number = 10): Promise<Meeting[]> => {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('meetings')
    .select(`
      *,
      meeting_services (
        name,
        color
      )
    `)
    .gte('meeting_date', today)
    .in('status', ['pending', 'confirmed'])
    .order('meeting_date')
    .order('meeting_time')
    .limit(limit);

  if (error) throw error;
  return data || [];
};

/**
 * Récupérer statistiques rendez-vous
 */
export const getMeetingsStats = async (): Promise<MeetingStats> => {
  const { data, error } = await supabase
    .from('meetings')
    .select('status');

  if (error) throw error;

  const stats: MeetingStats = {
    total: data?.length || 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    no_show: 0,
  };

  data?.forEach((meeting) => {
    switch (meeting.status) {
      case 'pending':
        stats.pending++;
        break;
      case 'confirmed':
        stats.confirmed++;
        break;
      case 'completed':
        stats.completed++;
        break;
      case 'cancelled':
        stats.cancelled++;
        break;
      case 'no_show':
        stats.no_show++;
        break;
    }
  });

  return stats;
};

/**
 * Vérifier disponibilité d'un créneau
 */
export const checkSlotAvailability = async (
  date: string,
  time: string,
  duration: number
): Promise<boolean> => {
  const { data, error } = await supabase
    .from('meetings')
    .select('id, meeting_time, duration')
    .eq('meeting_date', date)
    .in('status', ['pending', 'confirmed']);

  if (error) throw error;

  // Pas de rendez-vous ce jour-là
  if (!data || data.length === 0) return true;

  // Vérifier les conflits d'horaire
  const requestedStart = timeToMinutes(time);
  const requestedEnd = requestedStart + duration;

  for (const meeting of data) {
    const meetingStart = timeToMinutes(meeting.meeting_time);
    const meetingEnd = meetingStart + meeting.duration;

    // Vérifier chevauchement
    if (
      (requestedStart >= meetingStart && requestedStart < meetingEnd) ||
      (requestedEnd > meetingStart && requestedEnd <= meetingEnd) ||
      (requestedStart <= meetingStart && requestedEnd >= meetingEnd)
    ) {
      return false;
    }
  }

  return true;
};

/**
 * Créer un rendez-vous
 */
export const createMeeting = async (input: CreateMeetingInput): Promise<Meeting> => {
  // Vérifier disponibilité
  const isAvailable = await checkSlotAvailability(
    input.meeting_date,
    input.meeting_time,
    input.duration
  );

  if (!isAvailable) {
    throw new Error('Ce créneau horaire n\'est plus disponible');
  }

  const { data, error } = await supabase
    .from('meetings')
    .insert({
      service_id: input.service_id,
      meeting_date: input.meeting_date,
      meeting_time: input.meeting_time,
      duration: input.duration,
      client_name: input.client_name,
      client_email: input.client_email,
      client_phone: input.client_phone,
      client_country_code: input.client_country_code,
      client_company: input.client_company || null,
      client_notes: input.client_notes || null,
      meeting_channel: input.meeting_channel || 'zoom',
      meeting_link: input.meeting_link || null,
      status: 'pending',
    })
    .select(`
      *,
      meeting_services (
        name,
        color
      )
    `)
    .single();

  if (error) throw error;
  if (!data) throw new Error('Erreur lors de la création du rendez-vous');
  return data;
};

/**
 * Mettre à jour un rendez-vous
 */
export const updateMeeting = async (
  id: string,
  input: UpdateMeetingInput
): Promise<Meeting> => {
  const { data, error } = await supabase
    .from('meetings')
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select(`
      *,
      meeting_services (
        name,
        color
      )
    `)
    .single();

  if (error) throw error;
  if (!data) throw new Error('Rendez-vous non trouvé');
  return data;
};

/**
 * Supprimer un rendez-vous
 */
export const deleteMeeting = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('meetings')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

/**
 * Changer le statut d'un rendez-vous
 */
export const updateMeetingStatus = async (
  id: string,
  status: MeetingStatus
): Promise<Meeting> => {
  return updateMeeting(id, { status });
};

/**
 * Confirmer un rendez-vous
 */
export const confirmMeeting = async (id: string): Promise<Meeting> => {
  return updateMeetingStatus(id, 'confirmed');
};

/**
 * Annuler un rendez-vous
 */
export const cancelMeeting = async (id: string): Promise<Meeting> => {
  return updateMeetingStatus(id, 'cancelled');
};

/**
 * Marquer rendez-vous comme complété
 */
export const completeMeeting = async (id: string): Promise<Meeting> => {
  return updateMeetingStatus(id, 'completed');
};

/**
 * Marquer absence (no-show)
 */
export const markNoShow = async (id: string): Promise<Meeting> => {
  return updateMeetingStatus(id, 'no_show');
};

// Helper function
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}
