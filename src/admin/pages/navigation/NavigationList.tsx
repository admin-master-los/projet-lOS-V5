import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useNavigationItems,
  useDeleteNavigationItem,
} from '../../hooks/useNavigation';
import { useToast } from '../../hooks/useToast';
import Button from '../../components/common/Button';
import { LoadingSpinner, ErrorMessage } from '../../components/common/LoadingSpinner';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink as ExternalLinkIcon,
  Link as LinkIcon,
  ArrowUpDown,
} from 'lucide-react';

/**
 * Page de liste des items de navigation
 * CRUD : Read + Delete
 */

const NavigationList: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  // État
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Hooks
  const { data: items, isLoading, error, refetch } = useNavigationItems();
  const deleteMutation = useDeleteNavigationItem();

  /**
   * Gérer la suppression
   */
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success('Item de navigation supprimé avec succès !');
      setDeleteId(null);
    } catch (error) {
      toast.error('Erreur lors de la suppression');
      console.error('Erreur suppression:', error);
    }
  };

  /**
   * Affichage du loading
   */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Chargement des items de navigation..." />
      </div>
    );
  }

  /**
   * Affichage de l'erreur
   */
  if (error) {
    return (
      <ErrorMessage
        title="Erreur de chargement"
        message="Impossible de charger les items de navigation. Veuillez réessayer."
        onRetry={refetch}
      />
    );
  }

  /**
   * Liste vide
   */
  if (!items || items.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Navigation</h1>
            <p className="text-gray-400 mt-1">Gérer les liens du menu de navigation</p>
          </div>
          <Button
            variant="primary"
            icon={<Plus size={20} />}
            onClick={() => navigate('/admin/navigation/create')}
          >
            Créer un item
          </Button>
        </div>

        {/* Empty state */}
        <div className="bg-white/5 border border-gray-700/50 rounded-xl p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500/10 rounded-full mb-4">
            <LinkIcon size={32} className="text-cyan-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Aucun item de navigation
          </h3>
          <p className="text-gray-400 mb-6">
            Commencez par créer votre premier item de navigation
          </p>
          <Button
            variant="primary"
            icon={<Plus size={20} />}
            onClick={() => navigate('/admin/navigation/create')}
          >
            Créer un item
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Navigation</h1>
          <p className="text-gray-400 mt-1">
            {items.length} item{items.length > 1 ? 's' : ''} de navigation
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Plus size={20} />}
          onClick={() => navigate('/admin/navigation/create')}
        >
          Créer un item
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-gray-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown size={14} />
                    Ordre
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Libellé
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Lien
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-white/5 transition-colors"
                >
                  {/* Order */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-cyan-500/10 border border-cyan-500/50 rounded-lg text-cyan-400 font-semibold text-sm">
                      {item.order}
                    </span>
                  </td>

                  {/* Label */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-white font-medium">{item.label}</span>
                  </td>

                  {/* Href */}
                  <td className="px-6 py-4">
                    <a
                      href={item.href}
                      target={item.is_external ? '_blank' : undefined}
                      rel={item.is_external ? 'noopener noreferrer' : undefined}
                      className="text-cyan-400 hover:text-cyan-300 font-mono text-sm flex items-center gap-1 max-w-md truncate"
                    >
                      {item.href}
                      {item.is_external && <ExternalLinkIcon size={12} />}
                    </a>
                  </td>

                  {/* Type */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.is_external ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-500/10 border border-purple-500/50 rounded-lg text-purple-400 text-xs font-medium">
                        <ExternalLinkIcon size={12} />
                        Externe
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/50 rounded-lg text-cyan-400 text-xs font-medium">
                        <LinkIcon size={12} />
                        Interne
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Edit2 size={16} />}
                        onClick={() => navigate(`/admin/navigation/${item.id}/edit`)}
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        icon={<Trash2 size={16} />}
                        onClick={() => setDeleteId(item.id)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Supprimer cet item ?"
        message="Cette action est irréversible. L'item de navigation sera définitivement supprimé."
        confirmText="Supprimer"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default NavigationList;
