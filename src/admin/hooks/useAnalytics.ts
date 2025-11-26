/**
 * Hook: Analytics
 * React Query hooks pour les statistiques
 */

import { useQuery } from '@tanstack/react-query';
import {
  getAnalyticsOverview,
  getMeetingsByStatus,
  getMeetingsByService,
  getMeetingsByChannel,
  getMeetingsByDay,
  getMeetingsByHour,
  getMeetingsByMonth,
  getTopClients,
} from '../services/analyticsService';

// Query keys
export const ANALYTICS_KEYS = {
  all: ['analytics'] as const,
  overview: ['analytics', 'overview'] as const,
  byStatus: ['analytics', 'by-status'] as const,
  byService: ['analytics', 'by-service'] as const,
  byChannel: ['analytics', 'by-channel'] as const,
  byDay: (days: number) => ['analytics', 'by-day', days] as const,
  byHour: ['analytics', 'by-hour'] as const,
  byMonth: ['analytics', 'by-month'] as const,
  topClients: (limit: number) => ['analytics', 'top-clients', limit] as const,
};

/**
 * Hook: Vue d'ensemble analytics
 */
export const useAnalyticsOverview = () => {
  return useQuery({
    queryKey: ANALYTICS_KEYS.overview,
    queryFn: getAnalyticsOverview,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Rafraîchir toutes les 5 min
  });
};

/**
 * Hook: Rendez-vous par statut
 */
export const useMeetingsByStatus = () => {
  return useQuery({
    queryKey: ANALYTICS_KEYS.byStatus,
    queryFn: getMeetingsByStatus,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook: Rendez-vous par service
 */
export const useMeetingsByService = () => {
  return useQuery({
    queryKey: ANALYTICS_KEYS.byService,
    queryFn: getMeetingsByService,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook: Rendez-vous par canal
 */
export const useMeetingsByChannel = () => {
  return useQuery({
    queryKey: ANALYTICS_KEYS.byChannel,
    queryFn: getMeetingsByChannel,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook: Rendez-vous par jour
 */
export const useMeetingsByDay = (days: number = 30) => {
  return useQuery({
    queryKey: ANALYTICS_KEYS.byDay(days),
    queryFn: () => getMeetingsByDay(days),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook: Rendez-vous par heure
 */
export const useMeetingsByHour = () => {
  return useQuery({
    queryKey: ANALYTICS_KEYS.byHour,
    queryFn: getMeetingsByHour,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook: Rendez-vous par mois
 */
export const useMeetingsByMonth = () => {
  return useQuery({
    queryKey: ANALYTICS_KEYS.byMonth,
    queryFn: getMeetingsByMonth,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook: Clients les plus actifs
 */
export const useTopClients = (limit: number = 10) => {
  return useQuery({
    queryKey: ANALYTICS_KEYS.topClients(limit),
    queryFn: () => getTopClients(limit),
    staleTime: 5 * 60 * 1000,
  });
};
