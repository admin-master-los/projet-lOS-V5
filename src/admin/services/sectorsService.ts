import { supabase } from '../../lib/supabaseClient';
import type { Sector, SectorCreateInput, SectorUpdateInput } from '../types/sector.types';

/**
 * Service pour gérer les opérations CRUD sur les secteurs
 * Toutes les fonctions sont asynchrones et retournent des promesses
 * 
 * Architecture:
 * - getAllSectors: Récupère tous les secteurs triés par date de création
 * - getSectorById: Récupère un secteur spécifique par son ID
 * - createSector: Crée un nouveau secteur
 * - updateSector: Met à jour un secteur existant
 * - deleteSector: Supprime un secteur
 */

/**
 * Récupère tous les secteurs depuis Supabase
 * Les secteurs sont triés par date de création (plus récents en premier)
 * 
 * @returns Promise<Sector[]> - Liste de tous les secteurs
 * @throws Error si la requête échoue
 */
export const getAllSectors = async (): Promise<Sector[]> => {
  try {
    const { data, error } = await supabase
      .from('sectors')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des secteurs:', error);
    throw error;
  }
};

/**
 * Récupère un secteur spécifique par son ID
 * Utilisé pour afficher les détails d'un secteur ou pré-remplir le formulaire d'édition
 * 
 * @param id - Identifiant unique du secteur (ex: 'ecommerce-pme')
 * @returns Promise<Sector | null> - Le secteur trouvé ou null
 * @throws Error si la requête échoue
 */
export const getSectorById = async (id: string): Promise<Sector | null> => {
  try {
    const { data, error } = await supabase
      .from('sectors')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      // Si le secteur n'existe pas, on retourne null au lieu de throw
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }
    return data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du secteur ${id}:`, error);
    throw error;
  }
};

/**
 * Crée un nouveau secteur dans Supabase
 * L'ID doit être unique et au format slug (ex: 'mon-nouveau-secteur')
 * Les champs created_at et updated_at sont automatiquement gérés par Supabase
 * 
 * @param sector - Données du secteur à créer
 * @returns Promise<Sector> - Le secteur créé avec ses métadonnées
 * @throws Error si la création échoue (ex: ID déjà existant)
 * 
 * Exemple d'utilisation:
 * const newSector = await createSector({
 *   id: 'agriculture',
 *   title: 'Agriculture & Agritech',
 *   description: 'Solutions digitales pour le secteur agricole',
 *   services: ['Gestion des exploitations', 'Traçabilité'],
 *   icon: 'Sprout',
 *   image: 'https://images.pexels.com/...',
 *   content_modal: { ... }
 * });
 */
export const createSector = async (sector: SectorCreateInput): Promise<Sector> => {
  try {
    const { data, error } = await supabase
      .from('sectors')
      .insert([sector])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erreur lors de la création du secteur:', error);
    throw error;
  }
};

/**
 * Met à jour un secteur existant dans Supabase
 * Seuls les champs fournis dans l'objet updateData seront modifiés
 * Le champ updated_at est automatiquement mis à jour par le trigger Supabase
 * 
 * @param id - Identifiant du secteur à modifier
 * @param updateData - Données à mettre à jour (peut être partiel)
 * @returns Promise<Sector> - Le secteur mis à jour
 * @throws Error si la mise à jour échoue ou si le secteur n'existe pas
 * 
 * Exemple d'utilisation:
 * // Mise à jour partielle (seulement le titre et la description)
 * const updatedSector = await updateSector('ecommerce-pme', {
 *   id: 'ecommerce-pme',
 *   title: 'Nouveau titre',
 *   description: 'Nouvelle description'
 * });
 */
export const updateSector = async (
  id: string,
  updateData: SectorUpdateInput
): Promise<Sector> => {
  try {
    // On s'assure que l'ID dans updateData correspond à l'ID du paramètre
    const dataToUpdate = { ...updateData, id };

    const { data, error } = await supabase
      .from('sectors')
      .update(dataToUpdate)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du secteur ${id}:`, error);
    throw error;
  }
};

/**
 * Supprime un secteur de Supabase
 * Cette action est irréversible, il est recommandé de demander confirmation
 * avant d'appeler cette fonction
 * 
 * @param id - Identifiant du secteur à supprimer
 * @returns Promise<void>
 * @throws Error si la suppression échoue
 * 
 * Note de sécurité:
 * Les politiques RLS de Supabase doivent autoriser la suppression uniquement
 * pour les utilisateurs authentifiés (admins)
 */
export const deleteSector = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('sectors')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error(`Erreur lors de la suppression du secteur ${id}:`, error);
    throw error;
  }
};

/**
 * Vérifie si un ID de secteur existe déjà dans la base
 * Utile pour valider l'unicité de l'ID avant création
 * 
 * @param id - ID à vérifier
 * @returns Promise<boolean> - true si l'ID existe, false sinon
 */
export const checkSectorIdExists = async (id: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('sectors')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data !== null;
  } catch (error) {
    console.error(`Erreur lors de la vérification de l'ID ${id}:`, error);
    return false;
  }
};

/**
 * Compte le nombre total de secteurs
 * Utilisé pour les statistiques du dashboard
 * 
 * @returns Promise<number> - Nombre de secteurs
 */
export const getSectorsCount = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('sectors')
      .select('id', { count: 'exact', head: true });

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Erreur lors du comptage des secteurs:', error);
    return 0;
  }
};
