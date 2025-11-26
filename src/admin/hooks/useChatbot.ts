import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  // Knowledge Base
  getAllKnowledge,
  getActiveKnowledge,
  getKnowledgeById,
  createKnowledge,
  updateKnowledge,
  deleteKnowledge,
  toggleKnowledgeActive,
  CreateKnowledgeInput,
  UpdateKnowledgeInput,
  
  // Conversations
  getAllConversations,
  getConversationById,
  createConversation,
  updateConversation,
  markAsReviewed,
  flagConversation,
  deleteConversation,
  CreateConversationInput,
  ConversationFilters,
  
  // Stats
  getChatbotStats,
  getTopKeywords,
} from '../services/chatbotService';

/**
 * Hooks React Query pour le chatbot
 */

// ============================================
// KNOWLEDGE BASE HOOKS
// ============================================

/**
 * Hook pour récupérer toutes les connaissances
 */
export const useKnowledge = () => {
  return useQuery({
    queryKey: ['chatbot', 'knowledge'],
    queryFn: getAllKnowledge,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook pour récupérer les connaissances actives seulement
 */
export const useActiveKnowledge = () => {
  return useQuery({
    queryKey: ['chatbot', 'knowledge', 'active'],
    queryFn: getActiveKnowledge,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook pour récupérer une connaissance par ID
 */
export const useKnowledgeById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['chatbot', 'knowledge', id],
    queryFn: () => getKnowledgeById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook pour créer une connaissance
 */
export const useCreateKnowledge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateKnowledgeInput) => createKnowledge(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatbot', 'knowledge'] });
    },
  });
};

/**
 * Hook pour mettre à jour une connaissance
 */
export const useUpdateKnowledge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateKnowledgeInput }) =>
      updateKnowledge(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['chatbot', 'knowledge'] });
      queryClient.invalidateQueries({ queryKey: ['chatbot', 'knowledge', data.id] });
    },
  });
};

/**
 * Hook pour supprimer une connaissance
 */
export const useDeleteKnowledge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteKnowledge(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatbot', 'knowledge'] });
    },
  });
};

/**
 * Hook pour toggle le statut actif
 */
export const useToggleKnowledgeActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => toggleKnowledgeActive(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['chatbot', 'knowledge'] });
      queryClient.invalidateQueries({ queryKey: ['chatbot', 'knowledge', data.id] });
    },
  });
};

// ============================================
// CONVERSATIONS HOOKS
// ============================================

/**
 * Hook pour récupérer les conversations avec filtres
 */
export const useConversations = (filters?: ConversationFilters) => {
  return useQuery({
    queryKey: ['chatbot', 'conversations', filters],
    queryFn: () => getAllConversations(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes (plus court car données temps réel)
  });
};

/**
 * Hook pour récupérer une conversation par ID
 */
export const useConversationById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['chatbot', 'conversations', id],
    queryFn: () => getConversationById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
  });
};

/**
 * Hook pour créer une conversation (utilisé par le chatbot public)
 */
export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateConversationInput) => createConversation(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatbot', 'conversations'] });
      queryClient.invalidateQueries({ queryKey: ['chatbot', 'stats'] });
    },
  });
};

/**
 * Hook pour mettre à jour une conversation
 */
export const useUpdateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      updateConversation(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['chatbot', 'conversations'] });
      queryClient.invalidateQueries({ queryKey: ['chatbot', 'conversations', data.id] });
    },
  });
};

/**
 * Hook pour marquer comme révisé
 */
export const useMarkAsReviewed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markAsReviewed(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['chatbot', 'conversations'] });
      queryClient.invalidateQueries({ queryKey: ['chatbot', 'conversations', data.id] });
    },
  });
};

/**
 * Hook pour flag une conversation
 */
export const useFlagConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      flagConversation(id, reason),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['chatbot', 'conversations'] });
      queryClient.invalidateQueries({ queryKey: ['chatbot', 'conversations', data.id] });
    },
  });
};

/**
 * Hook pour supprimer une conversation
 */
export const useDeleteConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteConversation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatbot', 'conversations'] });
      queryClient.invalidateQueries({ queryKey: ['chatbot', 'stats'] });
    },
  });
};

// ============================================
// STATS HOOKS
// ============================================

/**
 * Hook pour récupérer les statistiques du chatbot
 */
export const useChatbotStats = (days: number = 30) => {
  return useQuery({
    queryKey: ['chatbot', 'stats', days],
    queryFn: () => getChatbotStats(days),
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook pour récupérer les mots-clés les plus fréquents
 */
export const useTopKeywords = (limit: number = 20) => {
  return useQuery({
    queryKey: ['chatbot', 'keywords', limit],
    queryFn: () => getTopKeywords(limit),
    staleTime: 1000 * 60 * 10,
  });
};
