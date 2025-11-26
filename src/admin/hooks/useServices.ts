import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  CreateServiceInput,
  UpdateServiceInput,
} from '../services/servicesService';

/**
 * Hooks React Query pour les services
 * Gère le cache et les mutations avec invalidation automatique
 */

/**
 * Hook pour récupérer tous les services
 */
export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: getAllServices,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook pour récupérer un service par ID
 */
export const useService = (id: string | undefined) => {
  return useQuery({
    queryKey: ['services', id],
    queryFn: () => getServiceById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook pour créer un service
 */
export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateServiceInput) => createService(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
    },
  });
};

/**
 * Hook pour mettre à jour un service
 */
export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateServiceInput }) =>
      updateService(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['services', data.id] });
    },
  });
};

/**
 * Hook pour supprimer un service
 */
export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
    },
  });
};
