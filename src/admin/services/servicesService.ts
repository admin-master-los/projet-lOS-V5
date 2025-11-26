import { supabase } from '../../lib/supabaseClient';

/**
 * Service CRUD pour les services
 * Gère les opérations sur la table services
 */

export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateServiceInput {
  icon: string;
  title: string;
  description: string;
  features: string[];
}

export interface UpdateServiceInput {
  icon?: string;
  title?: string;
  description?: string;
  features?: string[];
}

/**
 * Récupère tous les services
 */
export const getAllServices = async (): Promise<Service[]> => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des services:', error);
    throw error;
  }
};

/**
 * Récupère un service par ID
 */
export const getServiceById = async (id: string): Promise<Service | null> => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du service ${id}:`, error);
    throw error;
  }
};

/**
 * Crée un nouveau service
 */
export const createService = async (
  input: CreateServiceInput
): Promise<Service> => {
  try {
    // Générer un ID unique basé sur le titre (slug format)
    const generateId = (title: string): string => {
      return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    };

    // Générer ID de base
    let baseId = generateId(input.title);
    let id = baseId;
    let counter = 1;

    // Vérifier unicité (boucle si nécessaire)
    while (true) {
      const { data: existing } = await supabase
        .from('services')
        .select('id')
        .eq('id', id)
        .single();

      if (!existing) break; // ID disponible
      id = `${baseId}-${counter}`;
      counter++;
    }

    const { data, error } = await supabase
      .from('services')
      .insert({
        id,
        icon: input.icon,
        title: input.title,
        description: input.description,
        features: input.features,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erreur lors de la création du service:', error);
    throw error;
  }
};

/**
 * Met à jour un service
 */
export const updateService = async (
  id: string,
  input: UpdateServiceInput
): Promise<Service> => {
  try {
    const { data, error } = await supabase
      .from('services')
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
    console.error(`Erreur lors de la mise à jour du service ${id}:`, error);
    throw error;
  }
};

/**
 * Supprime un service
 */
export const deleteService = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error(`Erreur lors de la suppression du service ${id}:`, error);
    throw error;
  }
};
