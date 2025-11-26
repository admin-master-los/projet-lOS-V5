import { supabase } from '../../lib/supabaseClient';

/**
 * Service pour récupérer les statistiques du dashboard
 * Compte le nombre d'éléments dans chaque table
 */

export interface DashboardStats {
  contactsCount: number;
  projectsCount: number;
  blogPostsCount: number;
  servicesCount: number;
  sectorsCount: number;
  navigationItemsCount: number;
  skillsCount: number;
  chatbotKnowledgeCount: number;
  commentsCount: number;
  pendingCommentsCount: number;
}

/**
 * Récupère toutes les statistiques du dashboard
 * Gère gracieusement les tables qui n'existent pas encore
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // Helper pour compter avec gestion d'erreur
    const safeCount = async (tableName: string): Promise<number> => {
      try {
        const { count, error } = await supabase
          .from(tableName)
          .select('id', { count: 'exact', head: true });
        
        if (error) {
          // Si la table n'existe pas, retourner 0 au lieu de crash
          console.warn(`Table '${tableName}' n'existe pas encore:`, error.message);
          return 0;
        }
        return count || 0;
      } catch (err) {
        console.warn(`Erreur lors du comptage de '${tableName}':`, err);
        return 0;
      }
    };

    // Exécuter toutes les requêtes en parallèle
    const [
      contactsCount,
      projectsCount,
      blogPostsCount,
      servicesCount,
      sectorsCount,
      navigationCount,
      skillsCount,
      chatbotCount,
      commentsCount,
      pendingCommentsCount,
    ] = await Promise.all([
      safeCount('contact'),
      safeCount('projects'),        
      safeCount('blog_posts'),      
      safeCount('services'),
      safeCount('sectors'),
      safeCount('navigation'),
      safeCount('skills'),           
      safeCount('chatbot_knowledge'), 
      safeCount('blog_comments'),    // ✅ Commentaires
      (async () => {                 // ✅ Commentaires pending
        try {
          const { count, error } = await supabase
            .from('blog_comments')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'pending');
          if (error) return 0;
          return count || 0;
        } catch {
          return 0;
        }
      })(),
    ]);

    return {
      contactsCount,
      projectsCount,
      blogPostsCount,
      servicesCount,
      sectorsCount,
      navigationItemsCount: navigationCount,
      skillsCount,
      chatbotKnowledgeCount: chatbotCount,
      commentsCount,
      pendingCommentsCount,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    // Retourner des stats à 0 plutôt que crash
    return {
      contactsCount: 0,
      projectsCount: 0,
      blogPostsCount: 0,
      servicesCount: 0,
      sectorsCount: 0,
      navigationItemsCount: 0,
      skillsCount: 0,
      chatbotKnowledgeCount: 0,
      commentsCount: 0,
      pendingCommentsCount: 0,
    };
  }
};

/**
 * Récupère les derniers contacts (activité récente)
 */
export const getRecentContacts = async (limit = 5) => {
  try {
    const { data, error } = await supabase
      .from('contact')
      .select('id, name, email, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des contacts récents:', error);
    return [];
  }
};

/**
 * Récupère les derniers projets créés
 */
export const getRecentProjects = async (limit = 5) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('id, title, status, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des projets récents:', error);
    return [];
  }
};

/**
 * Récupère les derniers articles de blog
 */
export const getRecentBlogPosts = async (limit = 5) => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, status, published_at, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des articles récents:', error);
    return [];
  }
};

/**
 * Récupère les statistiques d'évolution sur 30 jours
 * (pour graphique optionnel)
 */
export const getStatsEvolution = async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [contactsData, projectsData, blogPostsData] = await Promise.all([
      supabase
        .from('contact')
        .select('created_at')
        .gte('created_at', thirtyDaysAgo.toISOString()),
      supabase
        .from('projects')
        .select('created_at')
        .gte('created_at', thirtyDaysAgo.toISOString()),
      supabase
        .from('blog_posts')
        .select('created_at')
        .gte('created_at', thirtyDaysAgo.toISOString()),
    ]);

    // Grouper par jour
    const groupByDay = (data: any[]) => {
      const grouped: Record<string, number> = {};
      data.forEach((item) => {
        const date = new Date(item.created_at).toLocaleDateString('fr-FR');
        grouped[date] = (grouped[date] || 0) + 1;
      });
      return grouped;
    };

    return {
      contacts: groupByDay(contactsData.data || []),
      projects: groupByDay(projectsData.data || []),
      blogPosts: groupByDay(blogPostsData.data || []),
    };
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'évolution:', error);
    return { contacts: {}, projects: {}, blogPosts: {} };
  }
};
