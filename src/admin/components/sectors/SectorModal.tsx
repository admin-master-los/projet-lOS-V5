import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, AlertCircle } from 'lucide-react';
import * as Icons from 'lucide-react';
import IconPicker from '../services/IconPicker';
import ImageUploader from '../common/ImageUploader';
import { useSectorIdExists } from '../../hooks/useSectors';
import type { Sector, SectorFormData, SectorHighlight } from '../../types/sector.types';

/**
 * Modal de création/édition de secteur
 * 
 * Ce composant gère un formulaire complexe avec plusieurs sections:
 * 1. Informations de base (ID, titre, description, icône, image)
 * 2. Services offerts (tableau dynamique)
 * 3. Contenu modal - Hero (titres et description longue)
 * 4. Contenu modal - Highlights (4 points forts avec icône, titre, description)
 * 5. Contenu modal - Tech Stack (tableau de technologies)
 * 6. Contenu modal - Case Study (titre et résultats)
 * 7. Contenu modal - CTA (texte du bouton)
 * 
 * Architecture:
 * - Formulaire organisé en sections avec titres
 * - Champs dynamiques pour les tableaux (services, highlights, tech_stack, results)
 * - Validation en temps réel de l'ID
 * - Pré-remplissage automatique en mode édition
 * - Gestion d'état locale avec useState
 */

interface SectorModalProps {
  sector: Sector | null; // null = création, Sector = édition
  onClose: () => void;
  onSubmit: (data: SectorFormData) => Promise<void>;
  isLoading: boolean;
}

const SectorModal: React.FC<SectorModalProps> = ({ sector, onClose, onSubmit, isLoading }) => {
  // État pour le sélecteur d'icônes
  const [showIconPicker, setShowIconPicker] = useState(false);

  // État initial du formulaire avec valeurs par défaut
  const initialFormData: SectorFormData = {
    id: '',
    title: '',
    description: '',
    services: [''],
    icon: 'Briefcase',
    image: '',
    hero_title: '',
    hero_subtitle: '',
    modal_description: '',
    highlights: [
      { icon: 'Check', title: '', description: '' },
      { icon: 'Check', title: '', description: '' },
      { icon: 'Check', title: '', description: '' },
      { icon: 'Check', title: '', description: '' },
    ],
    tech_stack: [''],
    case_study_title: '',
    case_study_results: [''],
    cta_text: 'En savoir plus',
  };

  const [formData, setFormData] = useState<SectorFormData>(initialFormData);

  // Vérification de l'unicité de l'ID (seulement en mode création)
  const { data: idExists, isLoading: checkingId } = useSectorIdExists(formData.id, {
    enabled: !sector && formData.id.length >= 3,
  });

  /**
   * Pré-remplit le formulaire avec les données du secteur en mode édition
   * Décompose le content_modal JSONB en champs individuels pour l'édition
   */
  useEffect(() => {
    if (sector) {
      setFormData({
        id: sector.id,
        title: sector.title,
        description: sector.description,
        services: sector.services.length > 0 ? sector.services : [''],
        icon: sector.icon,
        image: sector.image,
        hero_title: sector.content_modal.hero_title,
        hero_subtitle: sector.content_modal.hero_subtitle,
        modal_description: sector.content_modal.description,
        highlights: sector.content_modal.highlights,
        tech_stack: sector.content_modal.tech_stack.length > 0 
          ? sector.content_modal.tech_stack 
          : [''],
        case_study_title: sector.content_modal.case_study.title,
        case_study_results: sector.content_modal.case_study.results.length > 0 
          ? sector.content_modal.case_study.results 
          : [''],
        cta_text: sector.content_modal.cta_text,
      });
    }
  }, [sector]);

  /**
   * Gère les changements des champs simples (input, textarea)
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Si c'est le champ image et que c'est une URL Pexels, optimiser automatiquement
    if (name === 'image' && value.includes('images.pexels.com')) {
      const optimizedUrl = optimizePexelsUrl(value);
      setFormData((prev) => ({ ...prev, [name]: optimizedUrl }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  /**
   * Optimise une URL Pexels en ajoutant les paramètres de compression
   * Si l'URL a déjà des paramètres, ne rien faire
   */
  const optimizePexelsUrl = (url: string): string => {
    // Si l'URL a déjà des paramètres, la retourner telle quelle
    if (url.includes('?')) {
      return url;
    }
    
    // Ajouter les paramètres d'optimisation pour Pexels
    if (url.includes('images.pexels.com')) {
      return `${url}?auto=compress&cs=tinysrgb&w=1920`;
    }
    
    return url;
  };

  /**
   * Gère la sélection d'une icône depuis le IconPicker
   */
  const handleIconSelect = (iconName: string) => {
    setFormData((prev) => ({ ...prev, icon: iconName }));
    setShowIconPicker(false);
  };

  /**
   * Gère les changements dans le tableau des services
   */
  const handleServiceChange = (index: number, value: string) => {
    const newServices = [...formData.services];
    newServices[index] = value;
    setFormData((prev) => ({ ...prev, services: newServices }));
  };

  /**
   * Ajoute un nouveau champ service vide
   */
  const handleAddService = () => {
    setFormData((prev) => ({
      ...prev,
      services: [...prev.services, ''],
    }));
  };

  /**
   * Supprime un service du tableau
   */
  const handleRemoveService = (index: number) => {
    if (formData.services.length > 1) {
      const newServices = formData.services.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, services: newServices }));
    }
  };

  /**
   * Gère les changements dans un highlight (point fort)
   */
  const handleHighlightChange = (
    index: number,
    field: keyof SectorHighlight,
    value: string
  ) => {
    const newHighlights = [...formData.highlights];
    newHighlights[index] = { ...newHighlights[index], [field]: value };
    setFormData((prev) => ({ ...prev, highlights: newHighlights }));
  };

  /**
   * Gère les changements dans le tableau tech_stack
   */
  const handleTechStackChange = (index: number, value: string) => {
    const newTechStack = [...formData.tech_stack];
    newTechStack[index] = value;
    setFormData((prev) => ({ ...prev, tech_stack: newTechStack }));
  };

  /**
   * Ajoute une nouvelle technologie au stack
   */
  const handleAddTech = () => {
    setFormData((prev) => ({
      ...prev,
      tech_stack: [...prev.tech_stack, ''],
    }));
  };

  /**
   * Supprime une technologie du stack
   */
  const handleRemoveTech = (index: number) => {
    if (formData.tech_stack.length > 1) {
      const newTechStack = formData.tech_stack.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, tech_stack: newTechStack }));
    }
  };

  /**
   * Gère les changements dans les résultats de l'étude de cas
   */
  const handleResultChange = (index: number, value: string) => {
    const newResults = [...formData.case_study_results];
    newResults[index] = value;
    setFormData((prev) => ({ ...prev, case_study_results: newResults }));
  };

  /**
   * Ajoute un nouveau résultat
   */
  const handleAddResult = () => {
    setFormData((prev) => ({
      ...prev,
      case_study_results: [...prev.case_study_results, ''],
    }));
  };

  /**
   * Supprime un résultat
   */
  const handleRemoveResult = (index: number) => {
    if (formData.case_study_results.length > 1) {
      const newResults = formData.case_study_results.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, case_study_results: newResults }));
    }
  };

  /**
   * Validation du formulaire avant soumission
   */
  const isFormValid = () => {
    // Vérifier les champs obligatoires de base
    if (!formData.id.trim() || !formData.title.trim() || !formData.description.trim()) {
      return false;
    }

    // En mode création, vérifier que l'ID n'existe pas déjà
    if (!sector && idExists) {
      return false;
    }

    // Vérifier qu'au moins un service est renseigné
    const hasService = formData.services.some(s => s.trim() !== '');
    if (!hasService) {
      return false;
    }

    // Vérifier les champs du content_modal
    if (!formData.hero_title.trim() || !formData.hero_subtitle.trim() || 
        !formData.modal_description.trim()) {
      return false;
    }

    // Vérifier que tous les highlights ont au moins un titre
    const allHighlightsValid = formData.highlights.every(h => h.title.trim() !== '');
    if (!allHighlightsValid) {
      return false;
    }

    return true;
  };

  /**
   * Soumet le formulaire
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      return;
    }

    // Nettoyer les tableaux en retirant les entrées vides
    const cleanedData: SectorFormData = {
      ...formData,
      services: formData.services.filter(s => s.trim() !== ''),
      tech_stack: formData.tech_stack.filter(t => t.trim() !== ''),
      case_study_results: formData.case_study_results.filter(r => r.trim() !== ''),
    };

    await onSubmit(cleanedData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl my-8 border border-gray-700">
        {/* Header du modal */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
            {sector ? 'Modifier le secteur' : 'Nouveau secteur'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-8 max-h-[calc(100vh-12rem)] overflow-y-auto">
          {/* Section 1: Informations de base */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-pink-300 flex items-center gap-2">
              📋 Informations de base
            </h3>

            {/* ID du secteur */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                ID du secteur *
                <span className="text-xs text-gray-500 ml-2">
                  (format: mon-secteur, pas d'espaces ni caractères spéciaux)
                </span>
              </label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleChange}
                disabled={!!sector} // Désactiver en mode édition
                className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                  sector
                    ? 'border-gray-600 cursor-not-allowed opacity-60'
                    : idExists
                    ? 'border-red-500 focus:ring-red-500/50'
                    : 'border-gray-600 focus:border-pink-500 focus:ring-pink-500/50'
                }`}
                placeholder="ecommerce-pme"
                required
              />
              {!sector && formData.id.length >= 3 && (
                <div className="mt-2">
                  {checkingId ? (
                    <p className="text-sm text-gray-400">Vérification...</p>
                  ) : idExists ? (
                    <p className="text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle size={14} />
                      Cet ID existe déjà
                    </p>
                  ) : (
                    <p className="text-sm text-green-400">✓ ID disponible</p>
                  )}
                </div>
              )}
            </div>

            {/* Titre */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Titre du secteur *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-pink-500 focus:ring-pink-500/50"
                placeholder="Boutique en Ligne PME/PMI"
                required
              />
            </div>

            {/* Description courte */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description courte *
                <span className="text-xs text-gray-500 ml-2">
                  (affichée sur la card du secteur)
                </span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-pink-500 focus:ring-pink-500/50 resize-none"
                placeholder="Solutions e-commerce complètes avec gestion des stocks et paiements"
                required
              />
            </div>

            {/* Sélecteur d'icône */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Icône *
              </label>
              <button
                type="button"
                onClick={() => setShowIconPicker(!showIconPicker)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-left hover:border-pink-500 transition-colors flex items-center justify-between"
              >
                <span className="flex items-center gap-3">
                  {(() => {
                    const IconComponent = (Icons as any)[formData.icon] || Icons.Briefcase;
                    return <IconComponent size={20} className="text-pink-400" />;
                  })()}
                  <span className="text-white">{formData.icon}</span>
                </span>
                <span className="text-gray-400 text-sm">Cliquer pour changer</span>
              </button>
              {showIconPicker && (
                <div className="mt-2">
                  <IconPicker
                    selectedIcon={formData.icon}
                    onSelectIcon={handleIconSelect}
                  />
                </div>
              )}
            </div>

            {/* URL de l'image - Nouveau composant avec upload */}
            <ImageUploader
              value={formData.image}
              onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
              folder="sectors"
              label="Image du secteur"
              helpText="Format recommandé : 1920×1080px, max 5MB"
              required
              previewHeight="h-64"
            />
          </div>

          {/* Section 2: Services offerts */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-pink-300 flex items-center gap-2">
              🛠️ Services offerts
            </h3>
            <p className="text-sm text-gray-400">
              Listez les services principaux offerts dans ce secteur
            </p>

            {formData.services.map((service, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={service}
                  onChange={(e) => handleServiceChange(index, e.target.value)}
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-pink-500 focus:ring-pink-500/50"
                  placeholder={`Service ${index + 1}`}
                />
                {formData.services.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveService(index)}
                    className="px-3 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddService}
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 border-dashed rounded-lg text-gray-300 hover:text-pink-300 hover:border-pink-500/50 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Ajouter un service
            </button>
          </div>

          {/* Section 3: Contenu Modal - Hero */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-pink-300 flex items-center gap-2">
              🎯 Contenu Modal - En-tête
            </h3>
            <p className="text-sm text-gray-400">
              Contenu affiché en haut de la modal de détail du secteur
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Titre principal de la modal *
              </label>
              <input
                type="text"
                name="hero_title"
                value={formData.hero_title}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-pink-500 focus:ring-pink-500/50"
                placeholder="E-commerce performant pour PME"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sous-titre de la modal *
              </label>
              <input
                type="text"
                name="hero_subtitle"
                value={formData.hero_subtitle}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-pink-500 focus:ring-pink-500/50"
                placeholder="Vendez en ligne avec une boutique professionnelle"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description complète *
                <span className="text-xs text-gray-500 ml-2">
                  (description détaillée du secteur pour la modal)
                </span>
              </label>
              <textarea
                name="modal_description"
                value={formData.modal_description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-pink-500 focus:ring-pink-500/50 resize-none"
                placeholder="Lancez ou optimisez votre boutique en ligne avec une solution complète..."
                required
              />
            </div>
          </div>

          {/* Section 4: Highlights (Points forts) */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-pink-300 flex items-center gap-2">
              ⭐ Points forts (Highlights)
            </h3>
            <p className="text-sm text-gray-400">
              Présentez 4 fonctionnalités ou avantages clés de ce secteur
            </p>

            {formData.highlights.map((highlight, index) => (
              <div key={index} className="p-4 bg-gray-700/30 border border-gray-600 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-pink-300">
                    Point fort #{index + 1}
                  </span>
                </div>

                {/* Icône du highlight */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">
                    Icône
                  </label>
                  <input
                    type="text"
                    value={highlight.icon}
                    onChange={(e) => handleHighlightChange(index, 'icon', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-pink-500 focus:ring-pink-500/50 text-sm"
                    placeholder="Check, Star, Zap..."
                  />
                </div>

                {/* Titre du highlight */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">
                    Titre *
                  </label>
                  <input
                    type="text"
                    value={highlight.title}
                    onChange={(e) => handleHighlightChange(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-pink-500 focus:ring-pink-500/50 text-sm"
                    placeholder="Boutique Clé en Main"
                    required
                  />
                </div>

                {/* Description du highlight */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">
                    Description
                  </label>
                  <textarea
                    value={highlight.description}
                    onChange={(e) => handleHighlightChange(index, 'description', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-pink-500 focus:ring-pink-500/50 resize-none text-sm"
                    placeholder="Description détaillée de ce point fort..."
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Section 5: Tech Stack */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-pink-300 flex items-center gap-2">
              💻 Stack technologique
            </h3>
            <p className="text-sm text-gray-400">
              Technologies et outils utilisés pour ce secteur
            </p>

            {formData.tech_stack.map((tech, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={tech}
                  onChange={(e) => handleTechStackChange(index, e.target.value)}
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-pink-500 focus:ring-pink-500/50"
                  placeholder={`Technologie ${index + 1}`}
                />
                {formData.tech_stack.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(index)}
                    className="px-3 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddTech}
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 border-dashed rounded-lg text-gray-300 hover:text-pink-300 hover:border-pink-500/50 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Ajouter une technologie
            </button>
          </div>

          {/* Section 6: Étude de cas (Case Study) */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-pink-300 flex items-center gap-2">
              📊 Étude de cas (Case Study)
            </h3>
            <p className="text-sm text-gray-400">
              Présentez un exemple concret de réussite client avec résultats chiffrés
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Titre de l'étude de cas *
              </label>
              <input
                type="text"
                name="case_study_title"
                value={formData.case_study_title}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-pink-500 focus:ring-pink-500/50"
                placeholder="Cas Client : Boutique Mode AfroChic"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Résultats chiffrés *
                <span className="text-xs text-gray-500 ml-2">
                  (ex: "+500K€ de CA en 12 mois", "+280% de conversion")
                </span>
              </label>

              {formData.case_study_results.map((result, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={result}
                    onChange={(e) => handleResultChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-pink-500 focus:ring-pink-500/50"
                    placeholder={`Résultat ${index + 1}`}
                  />
                  {formData.case_study_results.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveResult(index)}
                      className="px-3 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddResult}
                className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 border-dashed rounded-lg text-gray-300 hover:text-pink-300 hover:border-pink-500/50 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Ajouter un résultat
              </button>
            </div>
          </div>

          {/* Section 7: Call-to-Action */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-pink-300 flex items-center gap-2">
              🎯 Appel à l'action (CTA)
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Texte du bouton *
              </label>
              <input
                type="text"
                name="cta_text"
                value={formData.cta_text}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-pink-500 focus:ring-pink-500/50"
                placeholder="Lancer votre boutique en ligne"
                required
              />
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex items-center gap-3 pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading || !isFormValid()}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-500/20"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {sector ? 'Mise à jour...' : 'Création...'}
                </span>
              ) : sector ? (
                'Mettre à jour'
              ) : (
                'Créer le secteur'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SectorModal;
