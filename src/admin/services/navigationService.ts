import { supabase } from '../../lib/supabaseClient';

/**
 * Service CRUD pour les items de navigation
 * Gère les opérations sur la table navigation_items
 */

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  order: number;
  is_external: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateNavigationInput {
  label: string;
  href: string;
  order?: number;
  is_external?: boolean;
}

export interface UpdateNavigationInput {
  label?: string;
  href?: string;
  order?: number;
  is_external?: boolean;
}

/**
 * Récupère tous les items de navigation
 */
export const getAllNavigationItems = async (): Promise<NavigationItem[]> => {
  try {
    const { data, error } = await supabase
      .from('navigation')
      .select('*')
      .order('order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des items de navigation:', error);
    throw error;
  }
};

/**
 * Récupère un item de navigation par ID
 */
export const getNavigationItemById = async (id: string): Promise<NavigationItem | null> => {
  try {
    const { data, error } = await supabase
      .from('navigation')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'item ${id}:`, error);
    throw error;
  }
};

/**
 * Crée un nouvel item de navigation
 */
export const createNavigationItem = async (
  input: CreateNavigationInput
): Promise<NavigationItem> => {
  try {
    // Générer un ID unique basé sur le label (slug format)
    const generateId = (label: string): string => {
      return label
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Remplacer les caractères spéciaux par des tirets
        .replace(/^-+|-+$/g, ''); // Enlever les tirets en début/fin
    };

    // Si order n'est pas fourni, utiliser le prochain numéro disponible
    if (input.order === undefined) {
      const { data: maxOrderData } = await supabase
        .from('navigation')
        .select('order')
        .order('order', { ascending: false })
        .limit(1);

      const maxOrder = maxOrderData && maxOrderData.length > 0 ? maxOrderData[0].order : 0;
      input.order = maxOrder + 1;
    }

    // Générer un ID unique
    let baseId = generateId(input.label);
    let id = baseId;
    let counter = 1;

    // Vérifier si l'ID existe déjà, sinon ajouter un suffixe
    while (true) {
      const { data: existing } = await supabase
        .from('navigation')
        .select('id')
        .eq('id', id)
        .single();

      if (!existing) break; // ID disponible
      id = `${baseId}-${counter}`;
      counter++;
    }

    const { data, error } = await supabase
      .from('navigation')
      .insert({
        id,
        label: input.label,
        href: input.href,
        order: input.order,
        is_external: input.is_external || false,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erreur lors de la création de l\'item de navigation:', error);
    throw error;
  }
};

/**
 * Met à jour un item de navigation
 */
export const updateNavigationItem = async (
  id: string,
  input: UpdateNavigationInput
): Promise<NavigationItem> => {
  try {
    const { data, error } = await supabase
      .from('navigation')
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
    console.error(`Erreur lors de la mise à jour de l'item ${id}:`, error);
    throw error;
  }
};

/**
 * Supprime un item de navigation
 */
export const deleteNavigationItem = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('navigation')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'item ${id}:`, error);
    throw error;
  }
};

/**
 * Réorganise l'ordre des items de navigation
 */
export const reorderNavigationItems = async (
  items: { id: string; order: number }[]
): Promise<void> => {
  try {
    // Mettre à jour l'ordre de chaque item
    const updates = items.map((item) =>
      supabase
        .from('navigation')
        .update({ order: item.order, updated_at: new Date().toISOString() })
        .eq('id', item.id)
    );

    const results = await Promise.all(updates);

    // Vérifier les erreurs
    const errors = results.filter((result) => result.error);
    if (errors.length > 0) {
      throw new Error('Erreur lors de la réorganisation des items');
    }
  } catch (error) {
    console.error('Erreur lors de la réorganisation:', error);
    throw error;
  }
};
