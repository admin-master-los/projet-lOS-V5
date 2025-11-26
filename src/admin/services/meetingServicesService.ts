/**
 * Service: Meeting Services
 * Gestion des services/prestations proposés pour les rendez-vous
 */

import { supabase } from '../../lib/supabaseClient';

// Types
export interface MeetingService {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  category: string;
  color: string;
  icon: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateMeetingServiceInput {
  name: string;
  description?: string;
  duration: number;
  category: string;
  color: string;
  icon?: string;
}

export interface UpdateMeetingServiceInput {
  name?: string;
  description?: string;
  duration?: number;
  category?: string;
  color?: string;
  icon?: string;
  is_active?: boolean;
}

/**
 * Récupérer tous les services (admin)
 */
export const getAllServices = async (): Promise<MeetingService[]> => {
  const { data, error } = await supabase
    .from('meeting_services')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
};

/**
 * Récupérer uniquement les services actifs (public)
 */
export const getActiveServices = async (): Promise<MeetingService[]> => {
  const { data, error } = await supabase
    .from('meeting_services')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) throw error;
  return data || [];
};

/**
 * Récupérer un service par ID
 */
export const getServiceById = async (id: string): Promise<MeetingService> => {
  const { data, error } = await supabase
    .from('meeting_services')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  if (!data) throw new Error('Service non trouvé');
  return data;
};

/**
 * Récupérer services par catégorie
 */
export const getServicesByCategory = async (category: string): Promise<MeetingService[]> => {
  const { data, error } = await supabase
    .from('meeting_services')
    .select('*')
    .eq('category', category)
    .eq('is_active', true)
    .order('name');

  if (error) throw error;
  return data || [];
};

/**
 * Créer un nouveau service
 */
export const createService = async (
  input: CreateMeetingServiceInput
): Promise<MeetingService> => {
  const { data, error } = await supabase
    .from('meeting_services')
    .insert({
      name: input.name,
      description: input.description || null,
      duration: input.duration,
      category: input.category,
      color: input.color,
      icon: input.icon || null,
      is_active: true,
    })
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('Erreur lors de la création du service');
  return data;
};

/**
 * Mettre à jour un service
 */
export const updateService = async (
  id: string,
  input: UpdateMeetingServiceInput
): Promise<MeetingService> => {
  const { data, error } = await supabase
    .from('meeting_services')
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('Service non trouvé');
  return data;
};

/**
 * Supprimer un service
 */
export const deleteService = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('meeting_services')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

/**
 * Activer/Désactiver un service
 */
export const toggleServiceStatus = async (
  id: string,
  isActive: boolean
): Promise<MeetingService> => {
  const { data, error } = await supabase
    .from('meeting_services')
    .update({
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('Service non trouvé');
  return data;
};
