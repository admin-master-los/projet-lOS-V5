import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllNavigationItems,
  getNavigationItemById,
  createNavigationItem,
  updateNavigationItem,
  deleteNavigationItem,
  reorderNavigationItems,
  CreateNavigationInput,
  UpdateNavigationInput,
} from '../services/navigationService';

/**
 * Hooks React Query pour la navigation
 * Gère le cache et les mutations avec invalidation automatique
 */

/**
 * Hook pour récupérer tous les items de navigation
 */
export const useNavigationItems = () => {
  return useQuery({
    queryKey: ['navigation', 'items'],
    queryFn: getAllNavigationItems,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook pour récupérer un item de navigation par ID
 */
export const useNavigationItem = (id: string | undefined) => {
  return useQuery({
    queryKey: ['navigation', 'item', id],
    queryFn: () => getNavigationItemById(id!),
    enabled: !!id, // Ne lance la requête que si id existe
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook pour créer un item de navigation
 */
export const useCreateNavigationItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateNavigationInput) => createNavigationItem(input),
    onSuccess: () => {
      // Invalider le cache pour refetch la liste
      queryClient.invalidateQueries({ queryKey: ['navigation', 'items'] });
      // Invalider les stats du dashboard
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
    },
  });
};

/**
 * Hook pour mettre à jour un item de navigation
 */
export const useUpdateNavigationItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateNavigationInput }) =>
      updateNavigationItem(id, input),
    onSuccess: (data) => {
      // Invalider le cache de la liste
      queryClient.invalidateQueries({ queryKey: ['navigation', 'items'] });
      // Invalider le cache de l'item spécifique
      queryClient.invalidateQueries({ queryKey: ['navigation', 'item', data.id] });
    },
  });
};

/**
 * Hook pour supprimer un item de navigation
 */
export const useDeleteNavigationItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteNavigationItem(id),
    onSuccess: () => {
      // Invalider le cache pour refetch la liste
      queryClient.invalidateQueries({ queryKey: ['navigation', 'items'] });
      // Invalider les stats du dashboard
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
    },
  });
};

/**
 * Hook pour réorganiser les items de navigation
 */
export const useReorderNavigationItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items: { id: string; order: number }[]) => reorderNavigationItems(items),
    onSuccess: () => {
      // Invalider le cache pour refetch la liste
      queryClient.invalidateQueries({ queryKey: ['navigation', 'items'] });
    },
  });
};
