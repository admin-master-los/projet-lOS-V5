import { supabase } from '../../lib/supabaseClient';

/**
 * Service CRUD pour les compétences techniques (skills)
 * Gère les opérations sur la table skills avec catégories et niveaux
 */

export type SkillCategory = 'frontend' | 'backend' | 'database' | 'cloud' | 'tools' | 'other';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface Skill {
  id: number;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  icon?: string;
  color: string;
  is_featured: boolean;
  description?: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface CreateSkillInput {
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  icon?: string;
  color?: string;
  is_featured?: boolean;
  description?: string;
  order_index?: number;
}

export interface UpdateSkillInput {
  name?: string;
  category?: SkillCategory;
  level?: SkillLevel;
  icon?: string;
  color?: string;
  is_featured?: boolean;
  description?: string;
  order_index?: number;
}

export interface SkillFilters {
  category?: SkillCategory;
  level?: SkillLevel;
  is_featured?: boolean;
  search?: string;
}

/**
 * Récupère toutes les compétences avec filtres optionnels
 */
export const getAllSkills = async (filters?: SkillFilters): Promise<Skill[]> => {
  try {
    let query = supabase
      .from('skills')
      .select('*')
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: true });

    // Appliquer les filtres
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.level) {
      query = query.eq('level', filters.level);
    }
    if (filters?.is_featured !== undefined) {
      query = query.eq('is_featured', filters.is_featured);
    }
    if (filters?.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des skills:', error);
    throw error;
  }
};

/**
 * Récupère une compétence par ID
 */
export const getSkillById = async (id: number): Promise<Skill | null> => {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du skill ${id}:`, error);
    throw error;
  }
};

/**
 * Récupère les compétences par catégorie
 */
export const getSkillsByCategory = async (): Promise<Record<SkillCategory, Skill[]>> => {
  try {
    const skills = await getAllSkills();
    
    const grouped: Record<SkillCategory, Skill[]> = {
      frontend: [],
      backend: [],
      database: [],
      cloud: [],
      tools: [],
      other: [],
    };

    skills.forEach(skill => {
      grouped[skill.category].push(skill);
    });

    return grouped;
  } catch (error) {
    console.error('Erreur lors du regroupement des skills:', error);
    throw error;
  }
};

/**
 * Crée une nouvelle compétence
 */
export const createSkill = async (input: CreateSkillInput): Promise<Skill> => {
  try {
    // Vérifier si le nom existe déjà
    const { data: existing } = await supabase
      .from('skills')
      .select('id')
      .eq('name', input.name)
      .single();

    if (existing) {
      throw new Error('Une compétence avec ce nom existe déjà');
    }

    const { data, error } = await supabase
      .from('skills')
      .insert({
        name: input.name,
        category: input.category,
        level: input.level,
        icon: input.icon,
        color: input.color || '#3b82f6',
        is_featured: input.is_featured || false,
        description: input.description,
        order_index: input.order_index || 0,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erreur lors de la création du skill:', error);
    throw error;
  }
};

/**
 * Met à jour une compétence
 */
export const updateSkill = async (
  id: number,
  input: UpdateSkillInput
): Promise<Skill> => {
  try {
    // Si le nom est modifié, vérifier l'unicité
    if (input.name) {
      const { data: existing } = await supabase
        .from('skills')
        .select('id')
        .eq('name', input.name)
        .neq('id', id)
        .single();

      if (existing) {
        throw new Error('Une compétence avec ce nom existe déjà');
      }
    }

    const { data, error } = await supabase
      .from('skills')
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
    console.error(`Erreur lors de la mise à jour du skill ${id}:`, error);
    throw error;
  }
};

/**
 * Supprime une compétence
 */
export const deleteSkill = async (id: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error(`Erreur lors de la suppression du skill ${id}:`, error);
    throw error;
  }
};

/**
 * Met à jour l'ordre des compétences (drag & drop)
 */
export const updateSkillsOrder = async (
  skillOrders: { id: number; order_index: number }[]
): Promise<void> => {
  try {
    const updates = skillOrders.map(({ id, order_index }) =>
      supabase
        .from('skills')
        .update({ order_index })
        .eq('id', id)
    );

    await Promise.all(updates);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'ordre:', error);
    throw error;
  }
};

/**
 * Toggle le statut featured d'une compétence
 */
export const toggleSkillFeatured = async (id: number): Promise<Skill> => {
  try {
    // Récupérer le statut actuel
    const skill = await getSkillById(id);
    if (!skill) throw new Error('Skill non trouvé');

    // Inverser le statut
    return updateSkill(id, { is_featured: !skill.is_featured });
  } catch (error) {
    console.error(`Erreur lors du toggle featured du skill ${id}:`, error);
    throw error;
  }
};

/**
 * Statistiques des compétences
 */
export const getSkillsStats = async () => {
  try {
    const skills = await getAllSkills();

    const stats = {
      total: skills.length,
      byCategory: {} as Record<SkillCategory, number>,
      byLevel: {} as Record<SkillLevel, number>,
      featured: skills.filter(s => s.is_featured).length,
    };

    // Compter par catégorie
    skills.forEach(skill => {
      stats.byCategory[skill.category] = (stats.byCategory[skill.category] || 0) + 1;
      stats.byLevel[skill.level] = (stats.byLevel[skill.level] || 0) + 1;
    });

    return stats;
  } catch (error) {
    console.error('Erreur lors du calcul des stats:', error);
    throw error;
  }
};
