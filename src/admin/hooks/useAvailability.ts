/**
 * Hooks: Availability (Disponibilités)
 * React Query hooks pour la gestion des disponibilités
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  getAllAvailabilities,
  getAvailabilityByDay,
  createAvailability,
  updateAvailability,
  deleteAvailability,
  getAllBlockedDates,
  getUpcomingBlockedDates,
  isDateBlocked,
  createBlockedDate,
  deleteBlockedDate,
  blockDateRange,
  getMonthSchedule,
  CreateAvailabilityInput,
  CreateBlockedDateInput,
} from '../services/availabilityService';

// Query keys
export const AVAILABILITY_KEYS = {
  all: ['availability'] as const,
  byDay: (day: number) => ['availability', 'day', day] as const,
  blockedDates: ['blocked-dates'] as const,
  upcomingBlocked: ['blocked-dates', 'upcoming'] as const,
  isBlocked: (date: string) => ['blocked-dates', 'is-blocked', date] as const,
  monthSchedule: (year: number, month: number) =>
    ['schedule', 'month', year, month] as const,
};

/**
 * Hook: Récupérer toutes les disponibilités
 */
export const useAllAvailabilities = () => {
  return useQuery({
    queryKey: AVAILABILITY_KEYS.all,
    queryFn: getAllAvailabilities,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook: Récupérer disponibilités par jour
 */
export const useAvailabilityByDay = (dayOfWeek: number | null) => {
  return useQuery({
    queryKey: AVAILABILITY_KEYS.byDay(dayOfWeek || 0),
    queryFn: () => getAvailabilityByDay(dayOfWeek!),
    enabled: dayOfWeek !== null,
  });
};

/**
 * Hook: Récupérer toutes les dates bloquées
 */
export const useAllBlockedDates = () => {
  return useQuery({
    queryKey: AVAILABILITY_KEYS.blockedDates,
    queryFn: getAllBlockedDates,
  });
};

/**
 * Hook: Récupérer dates bloquées à venir
 */
export const useUpcomingBlockedDates = () => {
  return useQuery({
    queryKey: AVAILABILITY_KEYS.upcomingBlocked,
    queryFn: getUpcomingBlockedDates,
  });
};

/**
 * Hook: Vérifier si une date est bloquée
 */
export const useIsDateBlocked = (date: string | null) => {
  return useQuery({
    queryKey: AVAILABILITY_KEYS.isBlocked(date || ''),
    queryFn: () => isDateBlocked(date!),
    enabled: !!date,
    staleTime: 60000, // 1 minute
  });
};

/**
 * Hook: Récupérer planning complet du mois
 */
export const useMonthSchedule = (year: number, month: number) => {
  return useQuery({
    queryKey: AVAILABILITY_KEYS.monthSchedule(year, month),
    queryFn: () => getMonthSchedule(year, month),
    staleTime: 60000, // 1 minute
  });
};

/**
 * Hook: Créer une disponibilité (admin)
 */
export const useCreateAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAvailabilityInput) => createAvailability(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: AVAILABILITY_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: AVAILABILITY_KEYS.byDay(data.day_of_week),
      });
      toast.success('Disponibilité ajoutée');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
};

/**
 * Hook: Mettre à jour une disponibilité (admin)
 */
export const useUpdateAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<CreateAvailabilityInput> }) =>
      updateAvailability(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: AVAILABILITY_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: AVAILABILITY_KEYS.byDay(data.day_of_week),
      });
      toast.success('Disponibilité mise à jour');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
};

/**
 * Hook: Supprimer une disponibilité (admin)
 */
export const useDeleteAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAvailability(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AVAILABILITY_KEYS.all });
      toast.success('Disponibilité supprimée');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
};

/**
 * Hook: Créer une date bloquée (admin)
 */
export const useCreateBlockedDate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateBlockedDateInput) => createBlockedDate(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AVAILABILITY_KEYS.blockedDates });
      queryClient.invalidateQueries({ queryKey: AVAILABILITY_KEYS.upcomingBlocked });
      toast.success('Date bloquée');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
};

/**
 * Hook: Supprimer une date bloquée (admin)
 */
export const useDeleteBlockedDate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBlockedDate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AVAILABILITY_KEYS.blockedDates });
      queryClient.invalidateQueries({ queryKey: AVAILABILITY_KEYS.upcomingBlocked });
      toast.success('Date débloquée');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
};

/**
 * Hook: Bloquer une plage de dates (admin)
 */
export const useBlockDateRange = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      startDate,
      endDate,
      reason,
    }: {
      startDate: string;
      endDate: string;
      reason?: string;
    }) => blockDateRange(startDate, endDate, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AVAILABILITY_KEYS.blockedDates });
      queryClient.invalidateQueries({ queryKey: AVAILABILITY_KEYS.upcomingBlocked });
      toast.success('Dates bloquées');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
};
