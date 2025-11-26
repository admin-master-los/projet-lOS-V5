import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllSectors,
  getSectorById,
  createSector,
  updateSector,
  deleteSector,
  checkSectorIdExists,
} from '../services/sectorsService';
import type { SectorCreateInput, SectorUpdateInput } from '../types/sector.types';

/**
 * Hooks React Query pour gérer les secteurs
 * 
 * Architecture:
 * - useQuery pour les lectures (GET) avec cache automatique
 * - useMutation pour les écritures (CREATE/UPDATE/DELETE) avec invalidation du cache
 * - QueryClient pour invalider le cache après les mutations
 * 
 * Avantages de React Query:
 * - Cache automatique des données
 * - Refetch automatique en arrière-plan
 * - Gestion optimiste des mises à jour
 * - États de chargement et d'erreur simplifiés
 */

/**
 * Hook pour récupérer tous les secteurs
 * Les données sont mises en cache avec la clé ['sectors']
 * Le cache reste valide pendant 5 minutes (staleTime)
 * 
 * @returns {
 *   data: Sector[] | undefined - Liste des secteurs
 *   isLoading: boolean - true pendant le chargement initial
 *   error: Error | null - Erreur éventuelle
 *   refetch: () => void - Fonction pour forcer un refetch
 * }
 * 
 * Exemple d'utilisation:
 * const { data: sectors, isLoading, error } = useSectors();
 * 
 * if (isLoading) return <LoadingSpinner />;
 * if (error) return <ErrorMessage />;
 * return <SectorList sectors={sectors} />;
 */
export const useSectors = () => {
  return useQuery({
    queryKey: ['sectors'],
    queryFn: getAllSectors,
    staleTime: 1000 * 60 * 5, // 5 minutes - Les données restent "fraîches" pendant ce temps
    refetchOnWindowFocus: true, // Refetch quand l'utilisateur revient sur l'onglet
  });
};

/**
 * Hook pour récupérer un secteur spécifique par son ID
 * Utile pour pré-remplir le formulaire d'édition
 * Le hook est désactivé si aucun ID n'est fourni (enabled: !!id)
 * 
 * @param id - Identifiant du secteur à récupérer
 * @returns {
 *   data: Sector | null - Le secteur trouvé ou null
 *   isLoading: boolean
 *   error: Error | null
 * }
 * 
 * Exemple d'utilisation:
 * const { data: sector, isLoading } = useSector(sectorId);
 * 
 * useEffect(() => {
 *   if (sector) {
 *     // Pré-remplir le formulaire avec les données du secteur
 *     setFormData(sector);
 *   }
 * }, [sector]);
 */
export const useSector = (id: string | null) => {
  return useQuery({
    queryKey: ['sectors', id],
    queryFn: () => (id ? getSectorById(id) : null),
    enabled: !!id, // Ne lance la requête que si un ID est fourni
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook pour vérifier si un ID de secteur existe déjà
 * Utilisé pour la validation en temps réel du formulaire de création
 * 
 * @param id - ID à vérifier
 * @param options - Options supplémentaires (enabled pour désactiver le hook)
 * @returns {
 *   data: boolean - true si l'ID existe
 *   isLoading: boolean
 * }
 * 
 * Exemple d'utilisation:
 * const { data: idExists, isLoading } = useSectorIdExists(
 *   formData.id,
 *   { enabled: formData.id.length >= 3 } // Ne vérifie que si l'ID a au moins 3 caractères
 * );
 * 
 * {idExists && <p className="text-red-500">Cet ID existe déjà</p>}
 */
export const useSectorIdExists = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['sectors', 'check-id', id],
    queryFn: () => checkSectorIdExists(id),
    enabled: options?.enabled !== undefined ? options.enabled : id.length >= 3,
    staleTime: 1000 * 60, // 1 minute
  });
};

/**
 * Hook pour créer un nouveau secteur
 * Invalide automatiquement le cache des secteurs après création réussie
 * 
 * @returns {
 *   mutate: (data: SectorCreateInput) => void - Fonction pour créer
 *   mutateAsync: (data: SectorCreateInput) => Promise<Sector> - Version async
 *   isLoading: boolean - true pendant la création
 *   error: Error | null - Erreur éventuelle
 * }
 * 
 * Exemple d'utilisation:
 * const createMutation = useCreateSector();
 * 
 * const handleSubmit = async (formData) => {
 *   try {
 *     await createMutation.mutateAsync(formData);
 *     toast.success('Secteur créé avec succès');
 *     closeModal();
 *   } catch (error) {
 *     toast.error('Erreur lors de la création');
 *   }
 * };
 */
export const useCreateSector = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSector,
    onSuccess: () => {
      // Invalide le cache pour forcer un refetch de la liste des secteurs
      queryClient.invalidateQueries({ queryKey: ['sectors'] });
    },
  });
};

/**
 * Hook pour mettre à jour un secteur existant
 * Invalide le cache après mise à jour réussie
 * 
 * @returns {
 *   mutate: (params: { id: string, data: SectorUpdateInput }) => void
 *   mutateAsync: (params) => Promise<Sector>
 *   isLoading: boolean
 *   error: Error | null
 * }
 * 
 * Exemple d'utilisation:
 * const updateMutation = useUpdateSector();
 * 
 * const handleUpdate = async () => {
 *   try {
 *     await updateMutation.mutateAsync({
 *       id: sectorId,
 *       data: formData
 *     });
 *     toast.success('Secteur mis à jour');
 *   } catch (error) {
 *     toast.error('Erreur lors de la mise à jour');
 *   }
 * };
 */
export const useUpdateSector = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SectorUpdateInput }) =>
      updateSector(id, data),
    onSuccess: (updatedSector) => {
      // Invalide le cache global des secteurs
      queryClient.invalidateQueries({ queryKey: ['sectors'] });
      // Invalide aussi le cache du secteur spécifique
      queryClient.invalidateQueries({ queryKey: ['sectors', updatedSector.id] });
    },
  });
};

/**
 * Hook pour supprimer un secteur
 * Invalide le cache après suppression réussie
 * 
 * @returns {
 *   mutate: (id: string) => void
 *   mutateAsync: (id: string) => Promise<void>
 *   isLoading: boolean
 *   error: Error | null
 * }
 * 
 * Exemple d'utilisation:
 * const deleteMutation = useDeleteSector();
 * 
 * const handleDelete = async (sectorId) => {
 *   if (confirm('Êtes-vous sûr de vouloir supprimer ce secteur ?')) {
 *     try {
 *       await deleteMutation.mutateAsync(sectorId);
 *       toast.success('Secteur supprimé');
 *     } catch (error) {
 *       toast.error('Erreur lors de la suppression');
 *     }
 *   }
 * };
 */
export const useDeleteSector = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSector,
    onSuccess: () => {
      // Invalide le cache pour refetch la liste des secteurs
      queryClient.invalidateQueries({ queryKey: ['sectors'] });
    },
  });
};
