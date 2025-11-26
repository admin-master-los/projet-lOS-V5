import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient';
import {
  getDashboardStats,
  getRecentContacts,
  getRecentProjects,
  getRecentBlogPosts,
  getStatsEvolution,
} from '../services/statsService';

/**
 * Hooks React Query pour le dashboard
 * Gère le cache et les refetch automatiques
 */

/**
 * Hook pour récupérer les statistiques globales
 */
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: getDashboardStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });
};

/**
 * Hook pour récupérer les contacts récents
 */
export const useRecentContacts = (limit = 5) => {
  return useQuery({
    queryKey: ['dashboard', 'recent-contacts', limit],
    queryFn: () => getRecentContacts(limit),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

/**
 * Hook pour récupérer les projets récents
 * TEMPORAIREMENT DÉSACTIVÉ - Table projects sera créée en Phase 7
 */
export const useRecentProjects = (limit = 5) => {
  return useQuery({
    queryKey: ['dashboard', 'recent-projects', limit],
    queryFn: () => getRecentProjects(limit),
    staleTime: 1000 * 60 * 2, // 2 minutes
    enabled: false, // ⚠️ DÉSACTIVÉ - Table n'existe pas encore
  });
};

/**
 * Hook pour récupérer les articles récents
 * TEMPORAIREMENT DÉSACTIVÉ - Table blog_posts sera créée en Phase 8
 */
export const useRecentBlogPosts = (limit = 5) => {
  return useQuery({
    queryKey: ['dashboard', 'recent-blog-posts', limit],
    queryFn: () => getRecentBlogPosts(limit),
    staleTime: 1000 * 60 * 2, // 2 minutes
    enabled: false, // ⚠️ DÉSACTIVÉ - Table n'existe pas encore
  });
};

/**
 * Hook pour récupérer l'évolution des stats
 */
export const useStatsEvolution = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats-evolution'],
    queryFn: getStatsEvolution,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

/**
 * Hook pour récupérer les commentaires pending récents
 */
export const useRecentPendingComments = (limit = 5) => {
  return useQuery({
    queryKey: ['dashboard', 'recent-pending-comments', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_comments')
        .select(`
          *,
          post:blog_posts(title, slug)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 30, // 30 secondes (plus court pour commentaires pending)
    refetchInterval: 30000, // Refetch automatique toutes les 30 secondes
  });
};
