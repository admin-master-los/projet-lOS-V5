import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateNavigationItem } from '../../hooks/useNavigation';
import { useToast } from '../../hooks/useToast';
import NavigationForm from '../../components/forms/NavigationForm';
import Button from '../../components/common/Button';
import { NavigationFormData } from '../../utils/navigationValidation';
import { ArrowLeft } from 'lucide-react';

/**
 * Page de création d'un item de navigation
 * CRUD : Create
 */

const NavigationCreate: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const createMutation = useCreateNavigationItem();

  /**
   * Gérer la soumission du formulaire
   */
  const handleSubmit = async (data: NavigationFormData) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success('Item de navigation créé avec succès !');
      navigate('/admin/navigation');
    } catch (error) {
      toast.error('Erreur lors de la création');
      console.error('Erreur création:', error);
    }
  };

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

        <h1 className="text-2xl font-bold text-white">Créer un item de navigation</h1>
        <p className="text-gray-400 mt-1">
          Ajouter un nouveau lien dans le menu de navigation
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white/5 border border-gray-700/50 rounded-xl p-6">
        <NavigationForm
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending}
          submitLabel="Créer l'item"
        />
      </div>

      {/* Helper Card */}
      <div className="bg-blue-500/10 border border-blue-500/50 rounded-xl p-4">
        <h3 className="text-blue-400 font-semibold mb-2 text-sm">💡 Conseils</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Utilisez des libellés courts et clairs</li>
          <li>• Pour un lien interne, commencez par "/" (ex: /about)</li>
          <li>• Pour un lien externe, utilisez l'URL complète (ex: https://example.com)</li>
          <li>• L'ordre détermine la position dans le menu (0 = premier)</li>
        </ul>
      </div>
    </div>
  );
};

export default NavigationCreate;
