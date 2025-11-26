import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Edit,
  Trash2,
  Folder,
  X,
  Save,
  FileText,
} from 'lucide-react';
import {
  useBlogCategories,
  useCreateBlogCategory,
  useUpdateBlogCategory,
  useDeleteBlogCategory,
} from '../hooks/useBlogCategories';
import { generateSlug } from '../hooks/useBlogPosts';
import { toast } from 'react-hot-toast';
import * as LucideIcons from 'lucide-react';

/**
 * Page de gestion des catégories de blog
 * CRUD complet avec modal
 */

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
}

// Liste des icônes disponibles
const AVAILABLE_ICONS = [
  'FileText', 'Code2', 'Brain', 'Cloud', 'Database', 'BookOpen',
  'Briefcase', 'Rocket', 'Zap', 'Globe', 'Terminal', 'Lightbulb',
  'Heart', 'Star', 'Award', 'Target', 'TrendingUp', 'Activity',
  'Settings', 'Tool', 'Cpu', 'Server', 'Layers', 'Package',
];

// Couleurs prédéfinies
const PRESET_COLORS = [
  '#3B82F6', // Bleu
  '#8B5CF6', // Violet
  '#10B981', // Vert
  '#F59E0B', // Orange
  '#EC4899', // Rose
  '#06B6D4', // Cyan
  '#EF4444', // Rouge
  '#84CC16', // Lime
  '#6366F1', // Indigo
  '#14B8A6', // Teal
];

const BlogCategories: React.FC = () => {
  const { data: categories, isLoading: loading } = useBlogCategories();
  const createMutation = useCreateBlogCategory();
  const updateMutation = useUpdateBlogCategory();
  const deleteMutation = useDeleteBlogCategory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    description: '',
    color: '#3B82F6',
    icon: 'FileText',
  });

  const openCreateModal = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      color: '#3B82F6',
      icon: 'FileText',
    });
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const openEditModal = (category: any) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      color: category.color || '#3B82F6',
      icon: category.icon || 'FileText',
    });
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  // Générer slug auto depuis le nom
  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: !editingCategory ? generateSlug(name) : formData.slug,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!formData.name.trim()) {
        toast.error('Le nom est requis');
        return;
      }

      if (editingCategory) {
        // Modification
        await updateMutation.mutateAsync({
          id: editingCategory.id,
          data: formData,
        });
        toast.success('✅ Catégorie modifiée avec succès !');
      } else {
        // Création
        await createMutation.mutateAsync(formData);
        toast.success('✅ Catégorie créée avec succès !');
      }

      closeModal();
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error(`❌ Erreur: ${error.message || 'Une erreur est survenue'}`);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('✅ Catégorie supprimée avec succès !');
      setDeleteConfirm(null);
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error(`❌ Erreur: ${error.message || 'Impossible de supprimer cette catégorie'}`);
    }
  };

  const renderIcon = (iconName: string, size = 24, className = '') => {
    const Icon = (LucideIcons as any)[iconName] || LucideIcons.FileText;
    return <Icon size={size} className={className} />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Folder className="text-cyan-400" size={32} />
            Catégories de Blog
          </h1>
          <p className="text-gray-400 mt-2">
            Organisez vos articles par catégories thématiques
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
        >
          <Plus size={20} />
          Nouvelle Catégorie
        </button>
      </div>

      {/* Stats */}
      <div className="bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/20 rounded-lg">
            <Folder className="text-cyan-400" size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Catégories</p>
            <p className="text-2xl font-bold text-white">{categories?.length || 0}</p>
          </div>
        </div>
      </div>

      {/* Liste des catégories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories?.map((category: any) => (
          <div
            key={category.id}
            className="bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-white/10 transition-all"
          >
            {/* Header catégorie */}
            <div className="flex items-start justify-between mb-4">
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: `${category.color}20` }}
              >
                {renderIcon(category.icon, 24, '')}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(category)}
                  className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                  title="Modifier"
                >
                  <Edit size={16} />
                </button>
                {deleteConfirm === category.id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="px-2 py-1 text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors text-xs"
                    >
                      OK
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-2 py-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(category.id)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Nom */}
            <h3 className="text-xl font-bold text-white mb-2">
              {category.name}
            </h3>

            {/* Description */}
            {category.description && (
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                {category.description}
              </p>
            )}

            {/* Slug */}
            <div className="text-xs text-gray-500 mb-3">
              /{category.slug}
            </div>

            {/* Badge couleur */}
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: category.color }}
              ></div>
              <span className="text-xs text-gray-400">{category.color}</span>
            </div>

            {/* Nombre d'articles (TODO: à implémenter) */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <FileText size={14} />
              <span>0 articles</span>
            </div>
          </div>
        ))}
      </div>

      {categories?.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          Aucune catégorie pour le moment. Créez-en une !
        </div>
      )}

      {/* Modal Créer/Modifier */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">
                {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="text-gray-400" size={24} />
              </button>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Nom */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Nom de la catégorie *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                  placeholder="Ex: Développement Web"
                  required
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                  placeholder="developpement-web"
                />
                <p className="text-sm text-gray-400 mt-2">
                  URL: /blog/category/{formData.slug || 'slug-auto'}
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 resize-none"
                  placeholder="Description de la catégorie..."
                />
              </div>

              {/* Couleur */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Couleur
                </label>
                <div className="flex gap-3 mb-3">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-10 h-10 rounded-lg transition-all ${
                        formData.color === color
                          ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900'
                          : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  className="w-full h-12 rounded-xl cursor-pointer"
                />
                <p className="text-sm text-gray-400 mt-2">
                  Couleur sélectionnée: {formData.color}
                </p>
              </div>

              {/* Icône */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Icône
                </label>
                <div className="grid grid-cols-6 gap-3">
                  {AVAILABLE_ICONS.map((iconName) => (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: iconName })}
                      className={`p-3 rounded-lg transition-all ${
                        formData.icon === iconName
                          ? 'bg-cyan-500 text-white'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                      }`}
                      title={iconName}
                    >
                      {renderIcon(iconName, 24)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="p-4 bg-white/5 border border-gray-700/50 rounded-xl">
                <p className="text-sm text-gray-400 mb-3">Aperçu :</p>
                <div className="flex items-center gap-3">
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${formData.color}20` }}
                  >
                    {renderIcon(formData.icon, 24)}
                  </div>
                  <div>
                    <p className="text-white font-bold">
                      {formData.name || 'Nom de la catégorie'}
                    </p>
                    <p className="text-sm text-gray-400">
                      {formData.description || 'Description...'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 border border-gray-600 text-white rounded-xl hover:bg-white/5 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                >
                  <Save size={20} />
                  {editingCategory ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogCategories;
