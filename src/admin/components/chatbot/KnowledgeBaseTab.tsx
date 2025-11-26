import React, { useState } from 'react';
import {
  Database,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Tag,
  ArrowUp,
  Filter,
} from 'lucide-react';
import {
  useKnowledge,
  useCreateKnowledge,
  useUpdateKnowledge,
  useDeleteKnowledge,
  useToggleKnowledgeActive,
} from '../../hooks/useChatbot';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import Select from '../common/Select';
import { useToast } from '../../hooks/useToast';
import DeleteConfirmModal from '../common/DeleteConfirmModal';

type KnowledgeCategory = 'services' | 'portfolio' | 'contact' | 'about' | 'technical' | 'general';

interface KnowledgeFormData {
  question: string;
  answer: string;
  category: KnowledgeCategory;
  tags: string[];
  priority: number;
  is_active: boolean;
}

const CATEGORIES = [
  { value: 'services', label: 'Services' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'contact', label: 'Contact' },
  { value: 'about', label: 'À propos' },
  { value: 'technical', label: 'Technique' },
  { value: 'general', label: 'Général' },
];

const KnowledgeBaseTab: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKnowledge, setEditingKnowledge] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [tagsInput, setTagsInput] = useState('');

  const { showToast } = useToast();

  // Hooks
  const { data: knowledge, isLoading } = useKnowledge();
  const createMutation = useCreateKnowledge();
  const updateMutation = useUpdateKnowledge();
  const deleteMutation = useDeleteKnowledge();
  const toggleActiveMutation = useToggleKnowledgeActive();

  const [formData, setFormData] = useState<KnowledgeFormData>({
    question: '',
    answer: '',
    category: 'general',
    tags: [],
    priority: 5,
    is_active: true,
  });

  // Filtrer les connaissances
  const filteredKnowledge = knowledge?.filter((item) => {
    const matchesSearch =
      searchQuery === '' ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === 'all' || item.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleOpenModal = (knowledge?: any) => {
    if (knowledge) {
      setEditingKnowledge(knowledge);
      setFormData({
        question: knowledge.question,
        answer: knowledge.answer,
        category: knowledge.category,
        tags: knowledge.tags || [],
        priority: knowledge.priority || 5,
        is_active: knowledge.is_active,
      });
      setTagsInput((knowledge.tags || []).join(', '));
    } else {
      setEditingKnowledge(null);
      setFormData({
        question: '',
        answer: '',
        category: 'general',
        tags: [],
        priority: 5,
        is_active: true,
      });
      setTagsInput('');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingKnowledge(null);
    setTagsInput('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Parser les tags
    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const data = {
      ...formData,
      tags,
    };

    try {
      if (editingKnowledge) {
        await updateMutation.mutateAsync({
          id: editingKnowledge.id,
          data,
        });
        showToast('Connaissance mise à jour avec succès', 'success');
      } else {
        await createMutation.mutateAsync(data);
        showToast('Connaissance créée avec succès', 'success');
      }
      handleCloseModal();
    } catch (error) {
      showToast(
        `Erreur lors de ${editingKnowledge ? 'la mise à jour' : 'la création'}`,
        'error'
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteMutation.mutateAsync(deleteId);
      showToast('Connaissance supprimée avec succès', 'success');
      setDeleteId(null);
    } catch (error) {
      showToast('Erreur lors de la suppression', 'error');
    }
  };

  const handleToggleActive = async (id: string, currentState: boolean) => {
    try {
      await toggleActiveMutation.mutateAsync({ id, isActive: !currentState });
      showToast(
        `Connaissance ${!currentState ? 'activée' : 'désactivée'}`,
        'success'
      );
    } catch (error) {
      showToast('Erreur lors du changement de statut', 'error');
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      services: 'bg-blue-100 text-blue-800',
      portfolio: 'bg-purple-100 text-purple-800',
      contact: 'bg-green-100 text-green-800',
      about: 'bg-yellow-100 text-yellow-800',
      technical: 'bg-red-100 text-red-800',
      general: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.general;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Base de Connaissances
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {filteredKnowledge?.length || 0} question(s) dans la base
          </p>
        </div>
        <Button onClick={() => handleOpenModal()} icon={Plus}>
          Ajouter une connaissance
        </Button>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher une question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">Toutes les catégories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Database className="w-4 h-4" />
            <span>
              {knowledge?.filter((k) => k.is_active).length || 0} actives
            </span>
          </div>
        </div>
      </div>

      {/* Liste des connaissances */}
      <div className="space-y-4">
        {filteredKnowledge && filteredKnowledge.length > 0 ? (
          filteredKnowledge.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-lg border p-6 hover:shadow-md transition-shadow ${
                !item.is_active ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  {/* Header avec catégorie et priorité */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                        item.category
                      )}`}
                    >
                      {CATEGORIES.find((c) => c.value === item.category)
                        ?.label || item.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <ArrowUp className="w-3 h-3" />
                      Priorité {item.priority}
                    </span>
                    {!item.is_active && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        Désactivée
                      </span>
                    )}
                  </div>

                  {/* Question */}
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.question}
                  </h3>

                  {/* Réponse */}
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {item.answer}
                  </p>

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <Tag className="w-4 h-4 text-gray-400" />
                      {item.tags.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Stats d'utilisation */}
                  {item.usage_count > 0 && (
                    <div className="text-xs text-gray-500">
                      Utilisée {item.usage_count} fois
                      {item.last_used_at &&
                        ` • Dernière utilisation: ${new Date(
                          item.last_used_at
                        ).toLocaleDateString()}`}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(item.id, item.is_active)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title={item.is_active ? 'Désactiver' : 'Activer'}
                  >
                    {item.is_active ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleOpenModal(item)}
                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(item.id)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucune connaissance trouvée
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || categoryFilter !== 'all'
                ? 'Aucun résultat ne correspond à vos critères'
                : 'Commencez par ajouter des questions-réponses'}
            </p>
            {!searchQuery && categoryFilter === 'all' && (
              <Button onClick={() => handleOpenModal()} icon={Plus}>
                Ajouter une connaissance
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Modal de création/édition */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          editingKnowledge
            ? 'Modifier la connaissance'
            : 'Ajouter une connaissance'
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Question"
            value={formData.question}
            onChange={(e) =>
              setFormData({ ...formData, question: e.target.value })
            }
            required
            placeholder="Quels services proposez-vous ?"
          />

          <Textarea
            label="Réponse"
            value={formData.answer}
            onChange={(e) =>
              setFormData({ ...formData, answer: e.target.value })
            }
            required
            rows={4}
            placeholder="Nous proposons des services de développement web..."
          />

          <Select
            label="Catégorie"
            value={formData.category}
            onChange={(e) =>
              setFormData({
                ...formData,
                category: e.target.value as KnowledgeCategory,
              })
            }
            options={CATEGORIES}
            required
          />

          <Input
            label="Tags (séparés par des virgules)"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="développement, web, react"
          />

          <Input
            label="Priorité (1-10)"
            type="number"
            min="1"
            max="10"
            value={formData.priority}
            onChange={(e) =>
              setFormData({ ...formData, priority: parseInt(e.target.value) })
            }
            required
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData({ ...formData, is_active: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="is_active" className="text-sm text-gray-700">
              Active (disponible pour le chatbot)
            </label>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Annuler
            </Button>
            <Button
              type="submit"
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {editingKnowledge ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal de confirmation de suppression */}
      <DeleteConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Supprimer cette connaissance ?"
        message="Cette action est irréversible. La connaissance sera définitivement supprimée."
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default KnowledgeBaseTab;
