/**
 * Hooks: Meetings (Rendez-vous)
 * React Query hooks pour la gestion des rendez-vous
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  getAllMeetings,
  getMeetingById,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  updateMeetingStatus,
  checkSlotAvailability,
  getMeetingsByDate,
  getUpcomingMeetings,
  getMeetingsStats,
  CreateMeetingInput,
  UpdateMeetingInput,
  MeetingFilters,
  MeetingStatus,
} from '../services/meetingsService';

// Query keys
export const MEETINGS_KEYS = {
  all: ['meetings'] as const,
  list: (filters?: MeetingFilters) => ['meetings', 'list', filters] as const,
  detail: (id: string) => ['meetings', id] as const,
  byDate: (date: string) => ['meetings', 'date', date] as const,
  upcoming: ['meetings', 'upcoming'] as const,
  stats: ['meetings', 'stats'] as const,
  slotAvailable: (date: string, time: string) =>
    ['meetings', 'slot-available', date, time] as const,
};

/**
 * Hook: Récupérer tous les rendez-vous (admin)
 */
export const useAllMeetings = (filters?: MeetingFilters) => {
  return useQuery({
    queryKey: MEETINGS_KEYS.list(filters),
    queryFn: () => getAllMeetings(filters),
  });
};

/**
 * Hook: Récupérer un rendez-vous par ID
 */
export const useMeetingById = (id: string | null) => {
  return useQuery({
    queryKey: MEETINGS_KEYS.detail(id || ''),
    queryFn: () => getMeetingById(id!),
    enabled: !!id,
  });
};

/**
 * Hook: Récupérer rendez-vous par date
 */
export const useMeetingsByDate = (date: string) => {
  return useQuery({
    queryKey: MEETINGS_KEYS.byDate(date),
    queryFn: () => getMeetingsByDate(date),
    enabled: !!date,
  });
};

/**
 * Hook: Récupérer rendez-vous à venir (dashboard)
 */
export const useUpcomingMeetings = (limit: number = 5) => {
  return useQuery({
    queryKey: MEETINGS_KEYS.upcoming,
    queryFn: () => getUpcomingMeetings(limit),
    refetchInterval: 60000, // Rafraîchir toutes les minutes
  });
};

/**
 * Hook: Récupérer statistiques (dashboard)
 */
export const useMeetingsStats = () => {
  return useQuery({
    queryKey: MEETINGS_KEYS.stats,
    queryFn: getMeetingsStats,
    staleTime: 60000, // 1 minute
  });
};

/**
 * Hook: Vérifier disponibilité créneau
 */
export const useSlotAvailability = (date: string, time: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: MEETINGS_KEYS.slotAvailable(date, time),
    queryFn: () => isSlotAvailable(date, time),
    enabled: enabled && !!date && !!time,
    staleTime: 30000, // 30 secondes
  });
};

/**
 * Hook: Créer un rendez-vous (public)
 */
export const useCreateMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateMeetingInput) => createMeeting(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: MEETINGS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: MEETINGS_KEYS.stats });
      queryClient.invalidateQueries({
        queryKey: MEETINGS_KEYS.byDate(data.meeting_date),
      });
      toast.success('Rendez-vous créé ! Vous recevrez une confirmation par email.');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
};

/**
 * Hook: Mettre à jour un rendez-vous (admin)
 */
export const useUpdateMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateMeetingInput) => updateMeeting(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: MEETINGS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: MEETINGS_KEYS.detail(data.id) });
      queryClient.invalidateQueries({
        queryKey: MEETINGS_KEYS.byDate(data.meeting_date),
      });
      toast.success('Rendez-vous mis à jour');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
};

/**
 * Hook: Supprimer un rendez-vous (admin)
 */
export const useDeleteMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMeeting(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEETINGS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: MEETINGS_KEYS.stats });
      toast.success('Rendez-vous supprimé');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
};

/**
 * Hook: Changer le statut d'un rendez-vous (admin)
 */
export const useUpdateMeetingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      reason,
    }: {
      id: string;
      status: MeetingStatus;
      reason?: string;
    }) => updateMeetingStatus(id, status, reason),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: MEETINGS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: MEETINGS_KEYS.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: MEETINGS_KEYS.stats });
      queryClient.invalidateQueries({ queryKey: MEETINGS_KEYS.upcoming });

      const statusMessages: Record<MeetingStatus, string> = {
        pending: 'Rendez-vous en attente',
        confirmed: 'Rendez-vous confirmé',
        completed: 'Rendez-vous terminé',
        cancelled: 'Rendez-vous annulé',
        no_show: 'Marqué comme absence',
      };

      toast.success(statusMessages[data.status]);
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
};

/**
 * Hook: Confirmer un rendez-vous (admin)
 */
export const useConfirmMeeting = () => {
  const { mutate: updateStatus, ...rest } = useUpdateMeetingStatus();

  return {
    ...rest,
    mutate: (id: string) => updateStatus({ id, status: 'confirmed' }),
  };
};

/**
 * Hook: Annuler un rendez-vous (admin)
 */
export const useCancelMeeting = () => {
  const { mutate: updateStatus, ...rest } = useUpdateMeetingStatus();

  return {
    ...rest,
    mutate: (id: string, reason?: string) =>
      updateStatus({ id, status: 'cancelled', reason }),
  };
};

/**
 * Hook: Marquer comme terminé (admin)
 */
export const useCompleteMeeting = () => {
  const { mutate: updateStatus, ...rest } = useUpdateMeetingStatus();

  return {
    ...rest,
    mutate: (id: string) => updateStatus({ id, status: 'completed' }),
  };
};

/**
 * Hook: Marquer comme absence (admin)
 */
export const useMarkNoShow = () => {
  const { mutate: updateStatus, ...rest } = useUpdateMeetingStatus();

  return {
    ...rest,
    mutate: (id: string) => updateStatus({ id, status: 'no_show' }),
  };
};
