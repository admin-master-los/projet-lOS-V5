import React, { useEffect, useState } from 'react';
import { useCreateSkill, useUpdateSkill } from '../../hooks/useSkills';
import Button from '../common/Button';
import { X, Code2 } from 'lucide-react';
import { Skill, SkillCategory, SkillLevel } from '../../services/skillsService';
import * as Icons from 'lucide-react';

interface SkillFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill: Skill | null;
  onSuccess: () => void;
}

const POPULAR_ICONS = [
  'Code2', 'Database', 'Server', 'Cloud', 'Container', 'Terminal',
  'FileCode2', 'Braces', 'Binary', 'Cpu', 'HardDrive', 'Network',
  'Shield', 'Lock', 'Zap', 'Sparkles', 'Rocket', 'Atom',
];

const COLORS = [
  { name: 'Bleu', value: '#3b82f6' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Vert', value: '#10b981' },
  { name: 'Jaune', value: '#f59e0b' },
  { name: 'Rouge', value: '#ef4444' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Rose', value: '#ec4899' },
  { name: 'Orange', value: '#f97316' },
];

const SkillFormModal: React.FC<SkillFormModalProps> = ({ isOpen, onClose, skill, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'other' as SkillCategory,
    level: 'intermediate' as SkillLevel,
    icon: 'Code2',
    color: '#3b82f6',
    is_featured: false,
    description: '',
    order_index: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useCreateSkill();
  const updateMutation = useUpdateSkill();

  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name,
        category: skill.category,
        level: skill.level,
        icon: skill.icon || 'Code2',
        color: skill.color,
        is_featured: skill.is_featured,
        description: skill.description || '',
        order_index: skill.order_index,
      });
    } else {
      setFormData({
        name: '',
        category: 'other',
        level: 'intermediate',
        icon: 'Code2',
        color: '#3b82f6',
        is_featured: false,
        description: '',
        order_index: 0,
      });
    }
    setErrors({});
  }, [skill, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      if (skill) {
        await updateMutation.mutateAsync({
          id: skill.id,
          input: formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
      onSuccess();
    } catch (error: any) {
      setErrors({ submit: error.message || 'Une erreur est survenue' });
    }
  };

  const getIconComponent = (iconName: string) => {
    return (Icons as any)[iconName] || Code2;
  };

  if (!isOpen) return null;

  const SelectedIcon = getIconComponent(formData.icon);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1b] border border-gray-700/50 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <h2 className="text-xl font-bold text-white">
            {skill ? 'Éditer la compétence' : 'Nouvelle compétence'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nom de la compétence *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-gray-700/50 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
              placeholder="Ex: React, Python, Docker..."
            />
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Category & Level */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Catégorie</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as SkillCategory })}
                className="w-full px-4 py-2 bg-white/5 border border-gray-700/50 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="database">Base de données</option>
                <option value="cloud">Cloud</option>
                <option value="tools">Outils</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Niveau</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value as SkillLevel })}
                className="w-full px-4 py-2 bg-white/5 border border-gray-700/50 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="beginner">Débutant</option>
                <option value="intermediate">Intermédiaire</option>
                <option value="advanced">Avancé</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          </div>

          {/* Icon */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Icône</label>
            <div className="flex items-center gap-4 mb-3">
              <div
                className="w-16 h-16 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${formData.color}20` }}
              >
                <SelectedIcon size={32} style={{ color: formData.color }} />
              </div>
              <div className="flex-1">
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-gray-700/50 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                >
                  {POPULAR_ICONS.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Couleur</label>
            <div className="grid grid-cols-8 gap-2">
              {COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  className={`w-10 h-10 rounded-lg border-2 transition-all ${
                    formData.color === color.value ? 'border-white scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description (optionnel)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-white/5 border border-gray-700/50 rounded-lg text-white focus:border-cyan-500 focus:outline-none resize-none"
              placeholder="Description courte de la compétence..."
            />
          </div>

          {/* Options */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-5 h-5 rounded border-gray-700 bg-white/5 text-cyan-500 focus:ring-cyan-500"
              />
              <span className="text-sm text-gray-300">
                Mettre en avant (afficher sur la page d'accueil)
              </span>
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ordre d'affichage
              </label>
              <input
                type="number"
                value={formData.order_index}
                onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 bg-white/5 border border-gray-700/50 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                placeholder="0"
              />
              <p className="text-xs text-gray-500 mt-1">Plus le nombre est élevé, plus il apparaît en premier</p>
            </div>
          </div>

          {/* Error */}
          {errors.submit && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-400 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={createMutation.isPending || updateMutation.isPending}
              className="flex-1"
            >
              {skill ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SkillFormModal;
