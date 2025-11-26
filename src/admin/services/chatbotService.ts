import { supabase } from '../../lib/supabaseClient';

/**
 * Service pour gérer le chatbot: knowledge base et conversations
 */

// ============================================
// TYPES - KNOWLEDGE BASE
// ============================================

export type KnowledgeCategory = 'services' | 'portfolio' | 'contact' | 'about' | 'technical' | 'general';

export interface ChatbotKnowledge {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category: KnowledgeCategory;
  priority: number;
  is_active: boolean;
  usage_count: number;
  last_used_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateKnowledgeInput {
  title: string;
  content: string;
  tags?: string[];
  category?: KnowledgeCategory;
  priority?: number;
  is_active?: boolean;
}

export interface UpdateKnowledgeInput {
  title?: string;
  content?: string;
  tags?: string[];
  category?: KnowledgeCategory;
  priority?: number;
  is_active?: boolean;
}

// ============================================
// TYPES - CONVERSATIONS
// ============================================

export type MessageType = 'question' | 'feedback' | 'greeting' | 'other';
export type Sentiment = 'positive' | 'negative' | 'neutral';

export interface ChatbotConversation {
  id: string;
  session_id: string;
  visitor_id?: string;
  message: string;
  response: string;
  message_type: MessageType;
  sentiment?: Sentiment;
  user_agent?: string;
  ip_address?: string;
  page_url?: string;
  is_resolved: boolean;
  needs_review: boolean;
  is_flagged: boolean;
  flag_reason?: string;
  user_rating?: number;
  user_feedback?: string;
  keywords?: string[];
  matched_knowledge_ids?: string[];
  confidence_score?: number;
  created_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

export interface CreateConversationInput {
  session_id: string;
  visitor_id?: string;
  message: string;
  response: string;
  message_type?: MessageType;
  sentiment?: Sentiment;
  user_agent?: string;
  ip_address?: string;
  page_url?: string;
  keywords?: string[];
  matched_knowledge_ids?: string[];
  confidence_score?: number;
}

export interface ConversationFilters {
  session_id?: string;
  visitor_id?: string;
  message_type?: MessageType;
  sentiment?: Sentiment;
  needs_review?: boolean;
  is_flagged?: boolean;
  date_from?: string;
  date_to?: string;
  search?: string;
}

// ============================================
// KNOWLEDGE BASE - CRUD
// ============================================

/**
 * Récupère toutes les connaissances
 */
export const getAllKnowledge = async (): Promise<ChatbotKnowledge[]> => {
  try {
    const { data, error } = await supabase
      .from('chatbot_knowledge')
      .select('*')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des connaissances:', error);
    throw error;
  }
};

/**
 * Récupère les connaissances actives seulement
 */
export const getActiveKnowledge = async (): Promise<ChatbotKnowledge[]> => {
  try {
    const { data, error } = await supabase
      .from('chatbot_knowledge')
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des connaissances actives:', error);
    throw error;
  }
};

/**
 * Récupère une connaissance par ID
 */
export const getKnowledgeById = async (id: string): Promise<ChatbotKnowledge | null> => {
  try {
    const { data, error } = await supabase
      .from('chatbot_knowledge')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de la connaissance ${id}:`, error);
    throw error;
  }
};

/**
 * Crée une nouvelle connaissance
 */
export const createKnowledge = async (input: CreateKnowledgeInput): Promise<ChatbotKnowledge> => {
  try {
    // Générer un ID unique basé sur le titre
    const generateId = (title: string): string => {
      return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    };

    let baseId = generateId(input.title);
    let id = baseId;
    let counter = 1;

    // Vérifier l'unicité
    while (true) {
      const { data: existing } = await supabase
        .from('chatbot_knowledge')
        .select('id')
        .eq('id', id)
        .single();

      if (!existing) break;
      id = `${baseId}-${counter}`;
      counter++;
    }

    const { data, error } = await supabase
      .from('chatbot_knowledge')
      .insert({
        id,
        title: input.title,
        content: input.content,
        tags: input.tags || [],
        category: input.category || 'general',
        priority: input.priority || 0,
        is_active: input.is_active !== undefined ? input.is_active : true,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erreur lors de la création de la connaissance:', error);
    throw error;
  }
};

/**
 * Met à jour une connaissance
 */
export const updateKnowledge = async (
  id: string,
  input: UpdateKnowledgeInput
): Promise<ChatbotKnowledge> => {
  try {
    const { data, error } = await supabase
      .from('chatbot_knowledge')
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de la connaissance ${id}:`, error);
    throw error;
  }
};

/**
 * Supprime une connaissance
 */
export const deleteKnowledge = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('chatbot_knowledge')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error(`Erreur lors de la suppression de la connaissance ${id}:`, error);
    throw error;
  }
};

/**
 * Toggle le statut actif d'une connaissance
 */
export const toggleKnowledgeActive = async (id: string): Promise<ChatbotKnowledge> => {
  try {
    const knowledge = await getKnowledgeById(id);
    if (!knowledge) throw new Error('Connaissance non trouvée');

    return updateKnowledge(id, { is_active: !knowledge.is_active });
  } catch (error) {
    console.error(`Erreur lors du toggle actif de la connaissance ${id}:`, error);
    throw error;
  }
};

// ============================================
// CONVERSATIONS - CRUD & QUERIES
// ============================================

/**
 * Récupère toutes les conversations avec filtres
 */
export const getAllConversations = async (
  filters?: ConversationFilters
): Promise<ChatbotConversation[]> => {
  try {
    let query = supabase
      .from('chatbot_conversations')
      .select('*')
      .order('created_at', { ascending: false });

    // Appliquer les filtres
    if (filters?.session_id) {
      query = query.eq('session_id', filters.session_id);
    }
    if (filters?.visitor_id) {
      query = query.eq('visitor_id', filters.visitor_id);
    }
    if (filters?.message_type) {
      query = query.eq('message_type', filters.message_type);
    }
    if (filters?.sentiment) {
      query = query.eq('sentiment', filters.sentiment);
    }
    if (filters?.needs_review !== undefined) {
      query = query.eq('needs_review', filters.needs_review);
    }
    if (filters?.is_flagged !== undefined) {
      query = query.eq('is_flagged', filters.is_flagged);
    }
    if (filters?.date_from) {
      query = query.gte('created_at', filters.date_from);
    }
    if (filters?.date_to) {
      query = query.lte('created_at', filters.date_to);
    }
    if (filters?.search) {
      query = query.or(`message.ilike.%${filters.search}%,response.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des conversations:', error);
    throw error;
  }
};

/**
 * Récupère une conversation par ID
 */
export const getConversationById = async (id: string): Promise<ChatbotConversation | null> => {
  try {
    const { data, error } = await supabase
      .from('chatbot_conversations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de la conversation ${id}:`, error);
    throw error;
  }
};

/**
 * Crée une nouvelle conversation (appelé par le chatbot public)
 */
export const createConversation = async (
  input: CreateConversationInput
): Promise<ChatbotConversation> => {
  try {
    const { data, error } = await supabase
      .from('chatbot_conversations')
      .insert({
        ...input,
        message_type: input.message_type || 'question',
        is_resolved: true,
        needs_review: false,
        is_flagged: false,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erreur lors de la création de la conversation:', error);
    throw error;
  }
};

/**
 * Met à jour une conversation (pour review, flagging, etc.)
 */
export const updateConversation = async (
  id: string,
  updates: Partial<ChatbotConversation>
): Promise<ChatbotConversation> => {
  try {
    const { data, error } = await supabase
      .from('chatbot_conversations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de la conversation ${id}:`, error);
    throw error;
  }
};

/**
 * Marque une conversation comme révisée
 */
export const markAsReviewed = async (id: string): Promise<ChatbotConversation> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    return updateConversation(id, {
      needs_review: false,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user?.id,
    });
  } catch (error) {
    console.error(`Erreur lors du marquage de la conversation ${id} comme révisée:`, error);
    throw error;
  }
};

/**
 * Flag une conversation
 */
export const flagConversation = async (
  id: string,
  reason: string
): Promise<ChatbotConversation> => {
  try {
    return updateConversation(id, {
      is_flagged: true,
      flag_reason: reason,
      needs_review: true,
    });
  } catch (error) {
    console.error(`Erreur lors du flagging de la conversation ${id}:`, error);
    throw error;
  }
};

/**
 * Supprime une conversation
 */
export const deleteConversation = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('chatbot_conversations')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error(`Erreur lors de la suppression de la conversation ${id}:`, error);
    throw error;
  }
};

// ============================================
// STATISTIQUES
// ============================================

/**
 * Récupère les statistiques du chatbot
 */
export const getChatbotStats = async (days: number = 30) => {
  try {
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);

    const conversations = await getAllConversations({
      date_from: dateFrom.toISOString(),
    });

    const stats = {
      total_conversations: conversations.length,
      unique_visitors: new Set(conversations.map(c => c.visitor_id).filter(Boolean)).size,
      avg_confidence: conversations.reduce((sum, c) => sum + (c.confidence_score || 0), 0) / conversations.length,
      flagged_count: conversations.filter(c => c.is_flagged).length,
      needs_review_count: conversations.filter(c => c.needs_review).length,
      by_type: {
        question: conversations.filter(c => c.message_type === 'question').length,
        feedback: conversations.filter(c => c.message_type === 'feedback').length,
        greeting: conversations.filter(c => c.message_type === 'greeting').length,
        other: conversations.filter(c => c.message_type === 'other').length,
      },
      by_sentiment: {
        positive: conversations.filter(c => c.sentiment === 'positive').length,
        negative: conversations.filter(c => c.sentiment === 'negative').length,
        neutral: conversations.filter(c => c.sentiment === 'neutral').length,
      },
      ratings: {
        avg_rating: conversations.filter(c => c.user_rating).reduce((sum, c) => sum + (c.user_rating || 0), 0) / conversations.filter(c => c.user_rating).length,
        total_ratings: conversations.filter(c => c.user_rating).length,
      },
    };

    return stats;
  } catch (error) {
    console.error('Erreur lors du calcul des stats:', error);
    throw error;
  }
};

/**
 * Récupère les mots-clés les plus fréquents
 */
export const getTopKeywords = async (limit: number = 20) => {
  try {
    const conversations = await getAllConversations();
    
    const keywordCount: Record<string, number> = {};
    
    conversations.forEach(conv => {
      conv.keywords?.forEach(keyword => {
        keywordCount[keyword] = (keywordCount[keyword] || 0) + 1;
      });
    });

    return Object.entries(keywordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([keyword, count]) => ({ keyword, count }));
  } catch (error) {
    console.error('Erreur lors de la récupération des top keywords:', error);
    throw error;
  }
};
