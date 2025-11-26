/**
 * Service: Analytics
 * Statistiques et métriques avancées
 */

import { supabase } from '../../lib/supabaseClient';

export interface AnalyticsOverview {
  totalMeetings: number;
  totalThisMonth: number;
  totalLastMonth: number;
  growthRate: number;
  pendingMeetings: number;
  confirmedMeetings: number;
  completedMeetings: number;
  cancelledMeetings: number;
  conversionRate: number;
  averageDuration: number;
}

export interface MeetingsByStatus {
  status: string;
  count: number;
  percentage: number;
}

export interface MeetingsByService {
  service_id: string;
  service_name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface MeetingsByChannel {
  channel: string;
  count: number;
  percentage: number;
}

export interface MeetingsByDay {
  date: string;
  count: number;
  confirmed: number;
  pending: number;
  cancelled: number;
}

export interface MeetingsByHour {
  hour: string;
  count: number;
}

export interface MeetingsByMonth {
  month: string;
  count: number;
  confirmed: number;
  completed: number;
}

export interface TopClients {
  client_name: string;
  client_email: string;
  count: number;
  lastMeeting: string;
}

/**
 * Vue d'ensemble des statistiques
 */
export const getAnalyticsOverview = async (): Promise<AnalyticsOverview> => {
  const now = new Date();
  const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
  const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];

  // Total meetings
  const { data: allMeetings, error: errorAll } = await supabase
    .from('meetings')
    .select('*');

  if (errorAll) throw errorAll;

  // This month
  const { data: thisMonth, error: errorThisMonth } = await supabase
    .from('meetings')
    .select('*')
    .gte('meeting_date', firstDayThisMonth);

  if (errorThisMonth) throw errorThisMonth;

  // Last month
  const { data: lastMonth, error: errorLastMonth } = await supabase
    .from('meetings')
    .select('*')
    .gte('meeting_date', firstDayLastMonth)
    .lte('meeting_date', lastDayLastMonth);

  if (errorLastMonth) throw errorLastMonth;

  const total = allMeetings?.length || 0;
  const totalThisMonth = thisMonth?.length || 0;
  const totalLastMonth = lastMonth?.length || 0;

  const growthRate = totalLastMonth > 0 
    ? ((totalThisMonth - totalLastMonth) / totalLastMonth) * 100 
    : 0;

  const pending = allMeetings?.filter(m => m.status === 'pending').length || 0;
  const confirmed = allMeetings?.filter(m => m.status === 'confirmed').length || 0;
  const completed = allMeetings?.filter(m => m.status === 'completed').length || 0;
  const cancelled = allMeetings?.filter(m => m.status === 'cancelled').length || 0;

  const conversionRate = total > 0 ? ((confirmed + completed) / total) * 100 : 0;

  const totalDuration = allMeetings?.reduce((sum, m) => sum + (m.duration || 0), 0) || 0;
  const averageDuration = total > 0 ? totalDuration / total : 0;

  return {
    totalMeetings: total,
    totalThisMonth,
    totalLastMonth,
    growthRate: Math.round(growthRate * 10) / 10,
    pendingMeetings: pending,
    confirmedMeetings: confirmed,
    completedMeetings: completed,
    cancelledMeetings: cancelled,
    conversionRate: Math.round(conversionRate * 10) / 10,
    averageDuration: Math.round(averageDuration),
  };
};

/**
 * Répartition par statut
 */
export const getMeetingsByStatus = async (): Promise<MeetingsByStatus[]> => {
  const { data, error } = await supabase
    .from('meetings')
    .select('status');

  if (error) throw error;

  const total = data?.length || 0;
  const statusCounts: Record<string, number> = {};

  data?.forEach(meeting => {
    statusCounts[meeting.status] = (statusCounts[meeting.status] || 0) + 1;
  });

  return Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
    percentage: total > 0 ? Math.round((count / total) * 100 * 10) / 10 : 0,
  }));
};

/**
 * Répartition par service
 */
export const getMeetingsByService = async (): Promise<MeetingsByService[]> => {
  const { data, error } = await supabase
    .from('meetings')
    .select(`
      service_id,
      meeting_services (
        name,
        color
      )
    `);

  if (error) throw error;

  const total = data?.length || 0;
  const serviceCounts: Record<string, { count: number; name: string; color: string }> = {};

  data?.forEach(meeting => {
    const serviceId = meeting.service_id;
    const serviceName = meeting.meeting_services?.name || 'Sans service';
    const serviceColor = meeting.meeting_services?.color || '#6B7280';

    if (!serviceCounts[serviceId]) {
      serviceCounts[serviceId] = { count: 0, name: serviceName, color: serviceColor };
    }
    serviceCounts[serviceId].count++;
  });

  return Object.entries(serviceCounts).map(([service_id, data]) => ({
    service_id,
    service_name: data.name,
    count: data.count,
    percentage: total > 0 ? Math.round((data.count / total) * 100 * 10) / 10 : 0,
    color: data.color,
  }));
};

/**
 * Répartition par canal
 */
export const getMeetingsByChannel = async (): Promise<MeetingsByChannel[]> => {
  const { data, error } = await supabase
    .from('meetings')
    .select('meeting_channel');

  if (error) throw error;

  const total = data?.length || 0;
  const channelCounts: Record<string, number> = {};

  data?.forEach(meeting => {
    const channel = meeting.meeting_channel || 'zoom';
    channelCounts[channel] = (channelCounts[channel] || 0) + 1;
  });

  return Object.entries(channelCounts).map(([channel, count]) => ({
    channel,
    count,
    percentage: total > 0 ? Math.round((count / total) * 100 * 10) / 10 : 0,
  }));
};

/**
 * Rendez-vous par jour (30 derniers jours)
 */
export const getMeetingsByDay = async (days: number = 30): Promise<MeetingsByDay[]> => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('meetings')
    .select('meeting_date, status')
    .gte('meeting_date', startDate.toISOString().split('T')[0])
    .lte('meeting_date', endDate.toISOString().split('T')[0])
    .order('meeting_date');

  if (error) throw error;

  const dayData: Record<string, { count: number; confirmed: number; pending: number; cancelled: number }> = {};

  // Initialiser tous les jours
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    const dateStr = date.toISOString().split('T')[0];
    dayData[dateStr] = { count: 0, confirmed: 0, pending: 0, cancelled: 0 };
  }

  // Compter les meetings
  data?.forEach(meeting => {
    const date = meeting.meeting_date;
    if (dayData[date]) {
      dayData[date].count++;
      if (meeting.status === 'confirmed') dayData[date].confirmed++;
      if (meeting.status === 'pending') dayData[date].pending++;
      if (meeting.status === 'cancelled') dayData[date].cancelled++;
    }
  });

  return Object.entries(dayData).map(([date, counts]) => ({
    date,
    ...counts,
  }));
};

/**
 * Rendez-vous par heure de la journée
 */
export const getMeetingsByHour = async (): Promise<MeetingsByHour[]> => {
  const { data, error } = await supabase
    .from('meetings')
    .select('meeting_time');

  if (error) throw error;

  const hourCounts: Record<string, number> = {};

  // Initialiser toutes les heures (8h-18h)
  for (let h = 8; h <= 18; h++) {
    const hour = `${h.toString().padStart(2, '0')}:00`;
    hourCounts[hour] = 0;
  }

  data?.forEach(meeting => {
    const hour = meeting.meeting_time.substring(0, 2) + ':00';
    if (hourCounts[hour] !== undefined) {
      hourCounts[hour]++;
    }
  });

  return Object.entries(hourCounts).map(([hour, count]) => ({
    hour,
    count,
  }));
};

/**
 * Rendez-vous par mois (12 derniers mois)
 */
export const getMeetingsByMonth = async (): Promise<MeetingsByMonth[]> => {
  const { data, error } = await supabase
    .from('meetings')
    .select('meeting_date, status');

  if (error) throw error;

  const monthData: Record<string, { count: number; confirmed: number; completed: number }> = {};
  const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

  // Initialiser les 12 derniers mois
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    const monthLabel = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    monthData[monthKey] = { count: 0, confirmed: 0, completed: 0 };
  }

  data?.forEach(meeting => {
    const monthKey = meeting.meeting_date.substring(0, 7);
    if (monthData[monthKey]) {
      monthData[monthKey].count++;
      if (meeting.status === 'confirmed') monthData[monthKey].confirmed++;
      if (meeting.status === 'completed') monthData[monthKey].completed++;
    }
  });

  return Object.entries(monthData).map(([key, counts]) => {
    const [year, month] = key.split('-');
    const monthIndex = parseInt(month) - 1;
    return {
      month: `${monthNames[monthIndex]} ${year}`,
      ...counts,
    };
  });
};

/**
 * Clients les plus actifs
 */
export const getTopClients = async (limit: number = 10): Promise<TopClients[]> => {
  const { data, error } = await supabase
    .from('meetings')
    .select('client_name, client_email, meeting_date')
    .order('meeting_date', { ascending: false });

  if (error) throw error;

  const clientData: Record<string, { count: number; lastMeeting: string; email: string }> = {};

  data?.forEach(meeting => {
    const name = meeting.client_name;
    if (!clientData[name]) {
      clientData[name] = {
        count: 0,
        lastMeeting: meeting.meeting_date,
        email: meeting.client_email,
      };
    }
    clientData[name].count++;
  });

  return Object.entries(clientData)
    .map(([client_name, data]) => ({
      client_name,
      client_email: data.email,
      count: data.count,
      lastMeeting: data.lastMeeting,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};
