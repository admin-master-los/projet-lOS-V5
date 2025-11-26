import React, { useState } from 'react';
import { useSkills, useCreateSkill, useUpdateSkill, useDeleteSkill, useToggleSkillFeatured } from '../hooks/useSkills';
import { useToast } from '../hooks/useToast';
import Button from '../components/common/Button';
import { LoadingSpinner, ErrorMessage } from '../components/common/LoadingSpinner';
import ConfirmDialog from '../components/common/ConfirmDialog';
import SkillFormModal from '../components/skills/SkillFormModal';
import { Plus, Edit2, Trash2, Code2, Star, StarOff, Filter } from 'lucide-react';
import { Skill, SkillCategory, SkillLevel } from '../services/skillsService';
import * as Icons from 'lucide-react';

const Skills: React.FC = () => {
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<SkillCategory | 'all'>('all');
  const [levelFilter, setLevelFilter] = useState<SkillLevel | 'all'>('all');

  const { data: skills, isLoading, error, refetch } = useSkills(
    categoryFilter !== 'all' || levelFilter !== 'all'
      ? {
          category: categoryFilter !== 'all' ? categoryFilter : undefined,
          level: levelFilter !== 'all' ? levelFilter : undefined,
        }
      : undefined
  );

  const createMutation = useCreateSkill();
  const updateMutation = useUpdateSkill();
  const deleteMutation = useDeleteSkill();
  const toggleFeaturedMutation = useToggleSkillFeatured();

  const handleCreate = () => {
    setSelectedSkill(null);
    setIsModalOpen(true);
  };

  const handleEdit = (skill: Skill) => {
    setSelectedSkill(skill);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success('Compétence supprimée !');
      setDeleteId(null);
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleToggleFeatured = async (id: number) => {
    try {
      await toggleFeaturedMutation.mutateAsync(id);
      toast.success('Statut modifié !');
    } catch (error) {
      toast.error('Erreur lors de la modification');
    }
  };

  const getIconComponent = (iconName?: string) => {
    if (!iconName) return Code2;
    const iconKey = iconName.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('');
    return (Icons as any)[iconKey] || Code2;
  };

  const getCategoryLabel = (category: SkillCategory) => {
    const labels: Record<SkillCategory, string> = {
      frontend: 'Frontend',
      backend: 'Backend',
      database: 'Base de données',
      cloud: 'Cloud',
      tools: 'Outils',
      other: 'Autre',
    };
    return labels[category];
  };

  const getLevelLabel = (level: SkillLevel) => {
    const labels: Record<SkillLevel, string> = {
      beginner: 'Débutant',
      intermediate: 'Intermédiaire',
      advanced: 'Avancé',
      expert: 'Expert',
    };
    return labels[level];
  };

  const getLevelColor = (level: SkillLevel) => {
    const colors: Record<SkillLevel, string> = {
      beginner: 'bg-green-500/10 text-green-400',
      intermediate: 'bg-blue-500/10 text-blue-400',
      advanced: 'bg-purple-500/10 text-purple-400',
      expert: 'bg-amber-500/10 text-amber-400',
    };
    return colors[level];
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Chargement des compétences..." />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        title="Erreur"
        message="Impossible de charger les compétences."
        onRetry={refetch}
      />
    );
  }

  const filteredSkills = skills || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Compétences Techniques</h1>
          <p className="text-gray-400 mt-1">
            {filteredSkills.length} compétence{filteredSkills.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button variant="primary" icon={<Plus size={20} />} onClick={handleCreate}>
          Ajouter
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white/5 border border-gray-700/50 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={16} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-400">Filtres</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Catégorie</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as SkillCategory | 'all')}
              className="w-full px-4 py-2 bg-white/5 border border-gray-700/50 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="all">Toutes les catégories</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="database">Base de données</option>
              <option value="cloud">Cloud</option>
              <option value="tools">Outils</option>
              <option value="other">Autre</option>
            </select>
          </div>

          {/* Level Filter */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Niveau</label>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value as SkillLevel | 'all')}
              className="w-full px-4 py-2 bg-white/5 border border-gray-700/50 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="all">Tous les niveaux</option>
              <option value="beginner">Débutant</option>
              <option value="intermediate">Intermédiaire</option>
              <option value="advanced">Avancé</option>
              <option value="expert">Expert</option>
            </select>
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      {filteredSkills.length === 0 ? (
        <div className="bg-white/5 border border-gray-700/50 rounded-xl p-12 text-center">
          <Code2 size={48} className="text-cyan-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Aucune compétence</h3>
          <p className="text-gray-400 mb-4">Commencez par ajouter vos compétences techniques</p>
          <Button variant="primary" icon={<Plus size={20} />} onClick={handleCreate}>
            Ajouter une compétence
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSkills.map((skill) => {
            const IconComponent = getIconComponent(skill.icon);
            return (
              <div
                key={skill.id}
                className="bg-white/5 border border-gray-700/50 rounded-xl p-5 hover:border-cyan-500/50 transition-all relative group"
              >
                {/* Featured Badge */}
                {skill.is_featured && (
                  <div className="absolute top-3 right-3">
                    <Star size={16} className="text-amber-400 fill-amber-400" />
                  </div>
                )}

                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${skill.color}20` }}
                >
                  <IconComponent size={24} style={{ color: skill.color }} />
                </div>

                {/* Name */}
                <h3 className="text-lg font-semibold text-white mb-2">{skill.name}</h3>

                {/* Description */}
                {skill.description && (
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">{skill.description}</p>
                )}

                {/* Meta */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded">
                    {getCategoryLabel(skill.category)}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${getLevelColor(skill.level)}`}>
                    {getLevelLabel(skill.level)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={skill.is_featured ? <StarOff size={16} /> : <Star size={16} />}
                    onClick={() => handleToggleFeatured(skill.id)}
                    title={skill.is_featured ? 'Retirer de la mise en avant' : 'Mettre en avant'}
                    className="flex-1"
                  >
                    {skill.is_featured ? 'Featured' : 'Feature'}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Edit2 size={16} />}
                    onClick={() => handleEdit(skill)}
                    title="Éditer"
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    icon={<Trash2 size={16} />}
                    onClick={() => setDeleteId(skill.id)}
                    title="Supprimer"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Form */}
      <SkillFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSkill(null);
        }}
        skill={selectedSkill}
        onSuccess={() => {
          setIsModalOpen(false);
          setSelectedSkill(null);
          toast.success(selectedSkill ? 'Compétence mise à jour !' : 'Compétence créée !');
        }}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Supprimer la compétence"
        message="Êtes-vous sûr de vouloir supprimer cette compétence ? Cette action est irréversible."
        confirmText="Supprimer"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default Skills;
