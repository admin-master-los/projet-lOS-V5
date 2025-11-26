import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  X,
  Plus,
  Image as ImageIcon,
  Link as LinkIcon,
  Tag,
  FileText,
  Award,
  Code,
  MessageSquare,
  TrendingUp,
} from 'lucide-react';
import { useProject, useCreateProject, useUpdateProject } from '../hooks/useProjects';
import { toast } from 'react-hot-toast';
import ImageUploader from '../components/common/ImageUploader';

/**
 * Page de création/édition de projet
 * Formulaire complet avec toutes les sections
 */

interface ProjectFormData {
  title: string;
  description: string;
  image: string;
  tech: string[];
  results: string[];
  link: string;
  content_project_modal: {
    hero_title: string;
    hero_subtitle: string;
    description: string;
    demo_link: string;
    github_link?: string;
    challenge: {
      title: string;
      description: string;
    };
    solution: {
      title: string;
      description: string;
      features: string[];
    };
    technologies: {
      frontend: string[];
      backend: string[];
      infrastructure: string[];
    };
    metrics: Array<{
      label: string;
      value: string;
      description: string;
    }>;
    testimonial: {
      author: string;
      role: string;
      company: string;
      quote: string;
    };
    gallery: string[];
    cta_text: string;
  };
}

const ProjectForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Hooks React Query
  const { data: projectData, isLoading: loadingData } = useProject(id || null);
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  
  // Nouveau champ pour la technologie à ajouter
  const [newTech, setNewTech] = useState('');
  const [newResult, setNewResult] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [newMetric, setNewMetric] = useState({ label: '', value: '', description: '' });
  const [newGalleryImage, setNewGalleryImage] = useState('');

  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    image: '',
    tech: [],
    results: [],
    link: '#',
    content_project_modal: {
      hero_title: '',
      hero_subtitle: '',
      description: '',
      demo_link: '#',
      github_link: '#',
      challenge: {
        title: 'Le Défi',
        description: '',
      },
      solution: {
        title: 'La Solution',
        description: '',
        features: [],
      },
      technologies: {
        frontend: [],
        backend: [],
        infrastructure: [],
      },
      metrics: [],
      testimonial: {
        author: '',
        role: '',
        company: '',
        quote: '',
      },
      gallery: [],
      cta_text: 'Discuter de votre projet',
    },
  });

  // Charger les données en mode édition
  useEffect(() => {
    if (projectData) {
      setFormData({
        title: projectData.title || '',
        description: projectData.description || '',
        image: projectData.image || '',
        tech: projectData.tech || [],
        results: projectData.results || [],
        link: projectData.link || '#',
        content_project_modal: projectData.content_project_modal || formData.content_project_modal,
      });
    }
  }, [projectData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const projectData = {
        title: formData.title,
        description: formData.description,
        image: formData.image,
        tech: formData.tech,
        results: formData.results,
        link: formData.link,
        content_project_modal: formData.content_project_modal,
      };

      if (isEditMode && id) {
        // Mise à jour
        await updateMutation.mutateAsync({
          id,
          data: projectData,
        });
        toast.success('✅ Projet modifié avec succès !');
      } else {
        // Création
        await createMutation.mutateAsync({
          id: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          ...projectData,
        });
        toast.success('✅ Projet créé avec succès !');
      }

      navigate('/admin/projects');
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error(`❌ Erreur: ${error.message || 'Une erreur est survenue'}`);
    } finally {
      setLoading(false);
    }
  };

  // Fonctions pour gérer les tableaux
  const addTech = () => {
    if (newTech.trim()) {
      setFormData({
        ...formData,
        tech: [...formData.tech, newTech.trim()],
      });
      setNewTech('');
    }
  };

  const removeTech = (index: number) => {
    setFormData({
      ...formData,
      tech: formData.tech.filter((_, i) => i !== index),
    });
  };

  const addResult = () => {
    if (newResult.trim()) {
      setFormData({
        ...formData,
        results: [...formData.results, newResult.trim()],
      });
      setNewResult('');
    }
  };

  const removeResult = (index: number) => {
    setFormData({
      ...formData,
      results: formData.results.filter((_, i) => i !== index),
    });
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        content_project_modal: {
          ...formData.content_project_modal,
          solution: {
            ...formData.content_project_modal.solution,
            features: [...formData.content_project_modal.solution.features, newFeature.trim()],
          },
        },
      });
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      content_project_modal: {
        ...formData.content_project_modal,
        solution: {
          ...formData.content_project_modal.solution,
          features: formData.content_project_modal.solution.features.filter((_, i) => i !== index),
        },
      },
    });
  };

  const addMetric = () => {
    if (newMetric.label && newMetric.value) {
      setFormData({
        ...formData,
        content_project_modal: {
          ...formData.content_project_modal,
          metrics: [...formData.content_project_modal.metrics, newMetric],
        },
      });
      setNewMetric({ label: '', value: '', description: '' });
    }
  };

  const removeMetric = (index: number) => {
    setFormData({
      ...formData,
      content_project_modal: {
        ...formData.content_project_modal,
        metrics: formData.content_project_modal.metrics.filter((_, i) => i !== index),
      },
    });
  };

  const addGalleryImage = () => {
    if (newGalleryImage.trim()) {
      setFormData({
        ...formData,
        content_project_modal: {
          ...formData.content_project_modal,
          gallery: [...formData.content_project_modal.gallery, newGalleryImage.trim()],
        },
      });
      setNewGalleryImage('');
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData({
      ...formData,
      content_project_modal: {
        ...formData.content_project_modal,
        gallery: formData.content_project_modal.gallery.filter((_, i) => i !== index),
      },
    });
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'basic', label: 'Infos de base', icon: FileText },
    { id: 'modal', label: 'Contenu Modal', icon: Award },
    { id: 'tech', label: 'Technologies', icon: Code },
    { id: 'testimonial', label: 'Témoignage', icon: MessageSquare },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/projects')}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <ArrowLeft className="text-gray-400" size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">
              {isEditMode ? 'Modifier le projet' : 'Nouveau projet'}
            </h1>
            <p className="text-gray-400 mt-1">
              {isEditMode ? 'Modifiez les informations du projet' : 'Créez un nouveau projet pour votre portfolio'}
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/projects')}
            className="px-6 py-3 border border-gray-600 text-white rounded-xl hover:bg-white/5 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-xl p-2">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors
                  ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8">
        {/* TAB 1: Infos de base */}
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Informations de base</h2>

            {/* Titre */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Titre du projet *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                placeholder="Site Institutionnel Bancaire"
                required
              />
            </div>

            {/* Description courte */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Description courte *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 resize-none"
                placeholder="Refonte complète avec espace client sécurisé et conformité RGPD"
                required
              />
            </div>

            {/* Image principale */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Image principale du projet *
              </label>
              <ImageUploader
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                folder="projects"
                label="Image principale"
                helpText="Recommandé : 1200×800px minimum, format JPG ou PNG"
                required
              />
            </div>

            {/* Technologies */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Technologies utilisées *
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                  className="flex-1 px-4 py-2 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                  placeholder="Ex: Next.js, React, PostgreSQL..."
                />
                <button
                  type="button"
                  onClick={addTech}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tech.map((tech, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-2 px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-lg"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTech(index)}
                      className="hover:text-red-400"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Résultats */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Résultats clés
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newResult}
                  onChange={(e) => setNewResult(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addResult())}
                  className="flex-1 px-4 py-2 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                  placeholder="Ex: +200% trafic, -50% coûts..."
                />
                <button
                  type="button"
                  onClick={addResult}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="space-y-2">
                {formData.results.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-3 py-2 bg-purple-500/20 text-purple-400 rounded-lg"
                  >
                    <span>{result}</span>
                    <button
                      type="button"
                      onClick={() => removeResult(index)}
                      className="hover:text-red-400"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Lien projet */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Lien du projet
              </label>
              <input
                type="text"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                placeholder="https://projet.com ou # si non disponible"
              />
            </div>
          </div>
        )}

        {/* TAB 2: Contenu Modal */}
        {activeTab === 'modal' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Contenu de la modal détaillée</h2>

            {/* Hero */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-cyan-400">Hero Section</h3>
              
              <div>
                <label className="block text-white font-semibold mb-2">Titre Hero</label>
                <input
                  type="text"
                  value={formData.content_project_modal.hero_title}
                  onChange={(e) => setFormData({
                    ...formData,
                    content_project_modal: {
                      ...formData.content_project_modal,
                      hero_title: e.target.value,
                    },
                  })}
                  className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                  placeholder="Plateforme Bancaire Sécurisée Nouvelle Génération"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Sous-titre Hero</label>
                <input
                  type="text"
                  value={formData.content_project_modal.hero_subtitle}
                  onChange={(e) => setFormData({
                    ...formData,
                    content_project_modal: {
                      ...formData.content_project_modal,
                      hero_subtitle: e.target.value,
                    },
                  })}
                  className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                  placeholder="Refonte digitale d'une institution financière africaine"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Description longue</label>
                <textarea
                  value={formData.content_project_modal.description}
                  onChange={(e) => setFormData({
                    ...formData,
                    content_project_modal: {
                      ...formData.content_project_modal,
                      description: e.target.value,
                    },
                  })}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 resize-none"
                  placeholder="Description détaillée du projet, contexte, enjeux..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-2">Lien démo</label>
                  <input
                    type="text"
                    value={formData.content_project_modal.demo_link}
                    onChange={(e) => setFormData({
                      ...formData,
                      content_project_modal: {
                        ...formData.content_project_modal,
                        demo_link: e.target.value,
                      },
                    })}
                    className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                    placeholder="https://demo.projet.com"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Lien GitHub</label>
                  <input
                    type="text"
                    value={formData.content_project_modal.github_link || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      content_project_modal: {
                        ...formData.content_project_modal,
                        github_link: e.target.value,
                      },
                    })}
                    className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>
            </div>

            {/* Défi */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-orange-400">Le Défi</h3>
              
              <div>
                <label className="block text-white font-semibold mb-2">Description du défi</label>
                <textarea
                  value={formData.content_project_modal.challenge.description}
                  onChange={(e) => setFormData({
                    ...formData,
                    content_project_modal: {
                      ...formData.content_project_modal,
                      challenge: {
                        ...formData.content_project_modal.challenge,
                        description: e.target.value,
                      },
                    },
                  })}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 resize-none"
                  placeholder="Quel était le problème à résoudre ? Contexte initial..."
                />
              </div>
            </div>

            {/* Solution */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-green-400">La Solution</h3>
              
              <div>
                <label className="block text-white font-semibold mb-2">Description de la solution</label>
                <textarea
                  value={formData.content_project_modal.solution.description}
                  onChange={(e) => setFormData({
                    ...formData,
                    content_project_modal: {
                      ...formData.content_project_modal,
                      solution: {
                        ...formData.content_project_modal.solution,
                        description: e.target.value,
                      },
                    },
                  })}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 resize-none"
                  placeholder="Comment avez-vous résolu le problème..."
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Fonctionnalités clés</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    className="flex-1 px-4 py-2 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                    placeholder="Ex: Architecture moderne avec Next.js..."
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.content_project_modal.solution.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between px-3 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm"
                    >
                      <span className="flex-1">{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="hover:text-red-400 ml-2 flex-shrink-0"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Métriques */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-blue-400">Métriques de succès</h3>
              
              <div className="grid grid-cols-3 gap-3 mb-3">
                <input
                  type="text"
                  value={newMetric.label}
                  onChange={(e) => setNewMetric({ ...newMetric, label: e.target.value })}
                  className="px-4 py-2 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                  placeholder="Label (ex: Trafic Web)"
                />
                <input
                  type="text"
                  value={newMetric.value}
                  onChange={(e) => setNewMetric({ ...newMetric, value: e.target.value })}
                  className="px-4 py-2 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                  placeholder="Valeur (ex: +200%)"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMetric.description}
                    onChange={(e) => setNewMetric({ ...newMetric, description: e.target.value })}
                    className="flex-1 px-4 py-2 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                    placeholder="Description"
                  />
                  <button
                    type="button"
                    onClick={addMetric}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {formData.content_project_modal.metrics.map((metric, index) => (
                  <div
                    key={index}
                    className="p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm text-blue-300">{metric.label}</p>
                        <p className="text-2xl font-bold text-blue-400">{metric.value}</p>
                        <p className="text-xs text-gray-400 mt-1">{metric.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMetric(index)}
                        className="text-gray-400 hover:text-red-400"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Galerie */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-purple-400">Galerie d'images</h3>
              
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newGalleryImage}
                  onChange={(e) => setNewGalleryImage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGalleryImage())}
                  className="flex-1 px-4 py-2 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                  placeholder="URL de l'image..."
                />
                <button
                  type="button"
                  onClick={addGalleryImage}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {formData.content_project_modal.gallery.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div>
              <label className="block text-white font-semibold mb-2">Texte du bouton CTA</label>
              <input
                type="text"
                value={formData.content_project_modal.cta_text}
                onChange={(e) => setFormData({
                  ...formData,
                  content_project_modal: {
                    ...formData.content_project_modal,
                    cta_text: e.target.value,
                  },
                })}
                className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                placeholder="Discuter de votre projet"
              />
            </div>
          </div>
        )}

        {/* TAB 3: Technologies */}
        {activeTab === 'tech' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Stack Technique Détaillé</h2>

            {/* Frontend */}
            <div>
              <label className="block text-white font-semibold mb-2">Frontend</label>
              <input
                type="text"
                value={formData.content_project_modal.technologies.frontend.join(', ')}
                onChange={(e) => setFormData({
                  ...formData,
                  content_project_modal: {
                    ...formData.content_project_modal,
                    technologies: {
                      ...formData.content_project_modal.technologies,
                      frontend: e.target.value.split(',').map(t => t.trim()).filter(Boolean),
                    },
                  },
                })}
                className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                placeholder="Next.js 14, TypeScript, TailwindCSS, Framer Motion (séparés par virgules)"
              />
            </div>

            {/* Backend */}
            <div>
              <label className="block text-white font-semibold mb-2">Backend</label>
              <input
                type="text"
                value={formData.content_project_modal.technologies.backend.join(', ')}
                onChange={(e) => setFormData({
                  ...formData,
                  content_project_modal: {
                    ...formData.content_project_modal,
                    technologies: {
                      ...formData.content_project_modal.technologies,
                      backend: e.target.value.split(',').map(t => t.trim()).filter(Boolean),
                    },
                  },
                })}
                className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                placeholder="Strapi CMS, PostgreSQL, Auth0, Node.js, Prisma ORM (séparés par virgules)"
              />
            </div>

            {/* Infrastructure */}
            <div>
              <label className="block text-white font-semibold mb-2">Infrastructure</label>
              <input
                type="text"
                value={formData.content_project_modal.technologies.infrastructure.join(', ')}
                onChange={(e) => setFormData({
                  ...formData,
                  content_project_modal: {
                    ...formData.content_project_modal,
                    technologies: {
                      ...formData.content_project_modal.technologies,
                      infrastructure: e.target.value.split(',').map(t => t.trim()).filter(Boolean),
                    },
                  },
                })}
                className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                placeholder="AWS ECS, RDS, S3, CloudFront, WAF, GuardDuty (séparés par virgules)"
              />
            </div>
          </div>
        )}

        {/* TAB 4: Témoignage */}
        {activeTab === 'testimonial' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Témoignage Client</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-semibold mb-2">Nom du client</label>
                <input
                  type="text"
                  value={formData.content_project_modal.testimonial.author}
                  onChange={(e) => setFormData({
                    ...formData,
                    content_project_modal: {
                      ...formData.content_project_modal,
                      testimonial: {
                        ...formData.content_project_modal.testimonial,
                        author: e.target.value,
                      },
                    },
                  })}
                  className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                  placeholder="Dr. Amadou Koné"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Fonction</label>
                <input
                  type="text"
                  value={formData.content_project_modal.testimonial.role}
                  onChange={(e) => setFormData({
                    ...formData,
                    content_project_modal: {
                      ...formData.content_project_modal,
                      testimonial: {
                        ...formData.content_project_modal.testimonial,
                        role: e.target.value,
                      },
                    },
                  })}
                  className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                  placeholder="Directeur des Systèmes d'Information"
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Entreprise</label>
              <input
                type="text"
                value={formData.content_project_modal.testimonial.company}
                onChange={(e) => setFormData({
                  ...formData,
                  content_project_modal: {
                    ...formData.content_project_modal,
                    testimonial: {
                      ...formData.content_project_modal.testimonial,
                      company: e.target.value,
                    },
                  },
                })}
                className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                placeholder="Banque Internationale d'Afrique"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Citation (témoignage)</label>
              <textarea
                value={formData.content_project_modal.testimonial.quote}
                onChange={(e) => setFormData({
                  ...formData,
                  content_project_modal: {
                    ...formData.content_project_modal,
                    testimonial: {
                      ...formData.content_project_modal.testimonial,
                      quote: e.target.value,
                    },
                  },
                })}
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 resize-none"
                placeholder="Ce projet a marqué un tournant dans notre stratégie digitale..."
              />
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default ProjectForm;
