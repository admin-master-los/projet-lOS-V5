import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useNavigationItem,
  useUpdateNavigationItem,
} from '../../hooks/useNavigation';
import { useToast } from '../../hooks/useToast';
import NavigationForm from '../../components/forms/NavigationForm';
import Button from '../../components/common/Button';
import { LoadingSpinner, ErrorMessage } from '../../components/common/LoadingSpinner';
import { NavigationFormData } from '../../utils/navigationValidation';
import { ArrowLeft } from 'lucide-react';

/**
 * Page d'édition d'un item de navigation
 * CRUD : Update
 */

const NavigationEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  // Hooks
  const { data: item, isLoading, error } = useNavigationItem(id);
  const updateMutation = useUpdateNavigationItem();

  /**
   * Gérer la soumission du formulaire
   */
  const handleSubmit = async (data: NavigationFormData) => {
    if (!id) return;

    try {
      await updateMutation.mutateAsync({ id, input: data });
      toast.success('Item de navigation modifié avec succès !');
      navigate('/admin/navigation');
    } catch (error) {
      toast.error('Erreur lors de la modification');
      console.error('Erreur modification:', error);
    }
  };

  /**
   * Affichage du loading
   */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Chargement de l'item..." />
      </div>
    );
  }

  /**
   * Affichage de l'erreur
   */
  if (error || !item) {
    return (
      <div className="max-w-2xl">
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowLeft size={16} />}
          onClick={() => navigate('/admin/navigation')}
          className="mb-4"
        >
          Retour à la liste
        </Button>
        <ErrorMessage
          title="Item introuvable"
          message="Cet item de navigation n'existe pas ou a été supprimé."
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowLeft size={16} />}
          onClick={() => navigate('/admin/navigation')}
          className="mb-4"
        >
          Retour à la liste
        </Button>

        <h1 className="text-2xl font-bold text-white">Modifier l'item de navigation</h1>
        <p className="text-gray-400 mt-1">
          Mettre à jour les informations de "{item.label}"
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white/5 border border-gray-700/50 rounded-xl p-6">
        <NavigationForm
          initialData={{
            label: item.label,
            href: item.href,
            order: item.order,
            is_external: item.is_external,
          }}
          onSubmit={handleSubmit}
          isLoading={updateMutation.isPending}
          submitLabel="Enregistrer les modifications"
        />
      </div>

      {/* Info Card */}
      <div className="bg-gray-700/30 border border-gray-600/50 rounded-xl p-4">
        <p className="text-gray-400 text-sm">
          <strong className="text-white">ID :</strong> <span className="font-mono">{item.id}</span>
        </p>
        <p className="text-gray-400 text-sm mt-1">
          <strong className="text-white">Créé le :</strong>{' '}
          {new Date(item.created_at).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
        {item.updated_at && item.updated_at !== item.created_at && (
          <p className="text-gray-400 text-sm mt-1">
            <strong className="text-white">Modifié le :</strong>{' '}
            {new Date(item.updated_at).toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        )}
      </div>
    </div>
  );
};

export default NavigationEdit;
