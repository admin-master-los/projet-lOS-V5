/**
 * Hooks: Meeting Services
 * React Query hooks pour la gestion des services/prestations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  getActiveServices,
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  toggleServiceStatus,
  getServicesByCategory,
  CreateMeetingServiceInput,
  UpdateMeetingServiceInput,
} from '../services/meetingServicesService';

// Query keys
export const MEETING_SERVICES_KEYS = {
  all: ['meeting-services'] as const,
  active: ['meeting-services', 'active'] as const,
  detail: (id: string) => ['meeting-services', id] as const,
  byCategory: (category: string) => ['meeting-services', 'category', category] as const,
};

/**
 * Hook: Récupérer services actifs (public)
 */
export const useActiveServices = () => {
  return useQuery({
    queryKey: MEETING_SERVICES_KEYS.active,
    queryFn: getActiveServices,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook: Récupérer tous les services (admin)
 */
export const useAllServices = () => {
  return useQuery({
    queryKey: MEETING_SERVICES_KEYS.all,
    queryFn: getAllServices,
  });
};

/**
 * Hook: Récupérer un service par ID
 */
export const useServiceById = (id: string | null) => {
  return useQuery({
    queryKey: MEETING_SERVICES_KEYS.detail(id || ''),
    queryFn: () => getServiceById(id!),
    enabled: !!id,
  });
};

/**
 * Hook: Récupérer services par catégorie
 */
export const useServicesByCategory = (category: string) => {
  return useQuery({
    queryKey: MEETING_SERVICES_KEYS.byCategory(category),
    queryFn: () => getServicesByCategory(category),
    enabled: !!category,
  });
};

/**
 * Hook: Créer un service (admin)
 */
export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateMeetingServiceInput) => createService(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEETING_SERVICES_KEYS.all });
      queryClient.invalidateQueries({ queryKey: MEETING_SERVICES_KEYS.active });
      toast.success('Service créé avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
};

/**
 * Hook: Mettre à jour un service (admin)
 */
export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateMeetingServiceInput) => updateService(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: MEETING_SERVICES_KEYS.all });
      queryClient.invalidateQueries({ queryKey: MEETING_SERVICES_KEYS.active });
      queryClient.invalidateQueries({ queryKey: MEETING_SERVICES_KEYS.detail(data.id) });
      toast.success('Service mis à jour');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
};

/**
 * Hook: Supprimer un service (admin)
 */
export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEETING_SERVICES_KEYS.all });
      queryClient.invalidateQueries({ queryKey: MEETING_SERVICES_KEYS.active });
      toast.success('Service supprimé');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
};

/**
 * Hook: Activer/Désactiver un service (admin)
 */
export const useToggleServiceStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      toggleServiceStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEETING_SERVICES_KEYS.all });
      queryClient.invalidateQueries({ queryKey: MEETING_SERVICES_KEYS.active });
      toast.success('Statut mis à jour');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
};
