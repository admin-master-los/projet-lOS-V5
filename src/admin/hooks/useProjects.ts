import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient';

/**
 * Hooks React Query pour gérer les projets du portfolio
 * 
 * Architecture:
 * - useQuery pour les lectures (GET) avec cache automatique
 * - useMutation pour les écritures (CREATE/UPDATE/DELETE) avec invalidation du cache
 * - QueryClient pour invalider le cache après les mutations
 */

// Types
interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tech: string[];
  results: string[];
  link: string;
  content_project_modal: any;
  created_at: string;
}

interface ProjectCreateInput {
  id: string;
  title: string;
  description: string;
  image: string;
  tech: string[];
  results: string[];
  link: string;
  content_project_modal: any;
}

interface ProjectUpdateInput {
  title: string;
  description: string;
  image: string;
  tech: string[];
  results: string[];
  link: string;
  content_project_modal: any;
}

/**
 * Récupère tous les projets
 */
const getAllProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

/**
 * Récupère un projet par son ID
 */
const getProjectById = async (id: string): Promise<Project | null> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Crée un nouveau projet
 */
const createProject = async (projectData: ProjectCreateInput): Promise<Project> => {
  const { data, error } = await supabase
    .from('projects')
    .insert(projectData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Met à jour un projet existant
 */
const updateProject = async (id: string, projectData: ProjectUpdateInput): Promise<Project> => {
  const { data, error } = await supabase
    .from('projects')
    .update(projectData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Supprime un projet
 */
const deleteProject = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

/**
 * Hook pour récupérer tous les projets
 * Les données sont mises en cache avec la clé ['projects']
 */
export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: getAllProjects,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });
};

/**
 * Hook pour récupérer un projet spécifique par son ID
 */
export const useProject = (id: string | null) => {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => (id ? getProjectById(id) : null),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook pour créer un nouveau projet
 * Invalide automatiquement le cache des projets après création réussie
 */
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      // Invalide le cache pour forcer un refetch de la liste des projets
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

/**
 * Hook pour mettre à jour un projet existant
 * Invalide le cache après mise à jour réussie
 */
export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProjectUpdateInput }) =>
      updateProject(id, data),
    onSuccess: (updatedProject) => {
      // Invalide le cache global des projets
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      // Invalide aussi le cache du projet spécifique
      queryClient.invalidateQueries({ queryKey: ['projects', updatedProject.id] });
    },
  });
};

/**
 * Hook pour supprimer un projet
 * Invalide le cache après suppression réussie
 */
export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      // Invalide le cache pour refetch la liste des projets
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};
