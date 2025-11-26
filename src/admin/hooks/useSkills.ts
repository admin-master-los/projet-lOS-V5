import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
  toggleSkillFeatured,
  updateSkillsOrder,
  getSkillsByCategory,
  getSkillsStats,
  CreateSkillInput,
  UpdateSkillInput,
  SkillFilters,
} from '../services/skillsService';

/**
 * Hooks React Query pour les skills
 * Gère le cache et les mutations avec invalidation automatique
 */

/**
 * Hook pour récupérer toutes les compétences
 */
export const useSkills = (filters?: SkillFilters) => {
  return useQuery({
    queryKey: ['skills', filters],
    queryFn: () => getAllSkills(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook pour récupérer une compétence par ID
 */
export const useSkill = (id: number | undefined) => {
  return useQuery({
    queryKey: ['skills', id],
    queryFn: () => getSkillById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook pour récupérer les compétences groupées par catégorie
 */
export const useSkillsByCategory = () => {
  return useQuery({
    queryKey: ['skills', 'by-category'],
    queryFn: getSkillsByCategory,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook pour récupérer les statistiques des compétences
 */
export const useSkillsStats = () => {
  return useQuery({
    queryKey: ['skills', 'stats'],
    queryFn: getSkillsStats,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook pour créer une compétence
 */
export const useCreateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateSkillInput) => createSkill(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
    },
  });
};

/**
 * Hook pour mettre à jour une compétence
 */
export const useUpdateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateSkillInput }) =>
      updateSkill(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      queryClient.invalidateQueries({ queryKey: ['skills', data.id] });
    },
  });
};

/**
 * Hook pour supprimer une compétence
 */
export const useDeleteSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteSkill(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
    },
  });
};

/**
 * Hook pour toggle le statut featured
 */
export const useToggleSkillFeatured = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => toggleSkillFeatured(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      queryClient.invalidateQueries({ queryKey: ['skills', data.id] });
    },
  });
};

/**
 * Hook pour mettre à jour l'ordre des compétences
 */
export const useUpdateSkillsOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (skillOrders: { id: number; order_index: number }[]) =>
      updateSkillsOrder(skillOrders),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
  });
};
