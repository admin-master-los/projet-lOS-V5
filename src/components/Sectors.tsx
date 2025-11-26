import React, { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { useSectors } from '../lib/useSupabaseData';

// 🎯 Interface TypeScript pour le contenu modal
interface ModalContent {
  hero_title: string;
  hero_subtitle: string;
  description: string;
  highlights: {
    icon: string;
    title: string;
    description: string;
  }[];
  case_study: {
    title: string;
    results: string[];
  };
  cta_text: string;
  tech_stack: string[];
}

interface Sector {
  id: string;
  title: string;
  description: string;
  services: string[];
  icon: string;
  image: string; // ✨ Ajout du champ image
  content_modal: ModalContent;
}

const Sectors: React.FC = () => {
  const { data: sectorsRaw, loading } = useSectors();
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const [selectedSectorIndex, setSelectedSectorIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // 🔄 Parser les données Supabase correctement
  useEffect(() => {
    if (sectorsRaw && sectorsRaw.length > 0) {
      const parsedSectors = sectorsRaw.map((sector: any) => ({
        ...sector,
        // S'assurer que services est un tableau
        services: Array.isArray(sector.services) 
          ? sector.services 
          : [],
        // S'assurer que content_modal est un objet (déjà parsé par Supabase normalement)
        content_modal: sector.content_modal || {}
      }));
      setSectors(parsedSectors);
      
      // Debug: Afficher les données dans la console
      console.log('✅ Secteurs chargés:', parsedSectors);
      console.log('✅ Content modal du premier secteur:', parsedSectors[0]?.content_modal);
      console.log('🖼️ Images des secteurs:', parsedSectors.map(s => ({ id: s.id, image: s.image })));
    }
  }, [sectorsRaw]);

  // 🎨 Helper pour récupérer les icônes Lucide
  const getIcon = (iconName: string) => {
    const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons];
    return IconComponent || LucideIcons.Building2;
  };

  // 🖼️ Images des secteurs - SUPPRIMÉ
  // Maintenant on utilise sector.image de la base de données

  // 🚀 Fonction pour ouvrir la modale
  const openModal = (sector: Sector, index: number) => {
    console.log('🔍 Ouverture modale pour:', sector.title);
    console.log('📦 Content modal:', sector.content_modal);
    console.log('🖼️ URL de l\'image:', sector.image);
    
    // Vérifier que content_modal existe
    if (!sector.content_modal || Object.keys(sector.content_modal).length === 0) {
      console.error('❌ content_modal manquant ou vide pour:', sector.id);
      alert('Erreur: Les données de ce secteur sont incomplètes.');
      return;
    }
    
    setSelectedSector(sector);
    setSelectedSectorIndex(index);
    setIsAnimating(true);
    setTimeout(() => setIsModalOpen(true), 50);
  };

  // 🔒 Fonction pour fermer la modale
  const closeModal = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsModalOpen(false);
      setSelectedSector(null);
    }, 300);
  };

  // 🔐 Bloquer le scroll quand la modale est ouverte
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  // ⌨️ Fermer avec la touche Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isModalOpen]);

  // 🔄 Loading state
  if (loading) {
    return (
      <section id="sectors" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
            <p className="text-gray-400 mt-4">Chargement des secteurs...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="sectors" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Secteurs{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Spécialisés
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Expertise métier approfondie pour des solutions parfaitement
            adaptées à votre domaine
          </p>
        </div>

        {/* Sectors Immersive Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {sectors.map((sector, index) => {
            const IconComponent = getIcon(sector.icon);

            return (
              <div
                key={sector.id}
                className="relative bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-3xl overflow-hidden hover:border-cyan-500/50 hover:bg-white/10 transition-all duration-500 group hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Background Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={sector.image || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920'}
                    alt={sector.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      // Fallback si l'image ne charge pas
                      e.currentTarget.src = 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  {/* Icon Overlay */}
                  <div className="absolute top-4 right-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                      <IconComponent size={24} className="text-white" />
                    </div>
                  </div>

                  {/* Title Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">
                      {sector.title}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-gray-400 mb-4 leading-relaxed">
                    {sector.description}
                  </p>

                  {/* Services List */}
                  <div className="space-y-2 mb-6">
                    {sector.services && sector.services.map((service, serviceIndex) => (
                      <div
                        key={serviceIndex}
                        className="flex items-center gap-3"
                      >
                        <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse" />
                        <span className="text-gray-300 text-sm font-medium">
                          {service}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => openModal(sector, index)}
                    className="w-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/50 text-cyan-400 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-500 hover:text-white transition-all duration-300 font-semibold hover:scale-105 flex items-center justify-center gap-2 group/btn"
                  >
                    <LucideIcons.ArrowRight
                      size={18}
                      className="group-hover/btn:translate-x-1 transition-transform duration-300"
                    />
                    Découvrir nos solutions
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-4">
            Votre secteur n'est pas listé ?
          </h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Nous nous adaptons à tous les domaines d'activité. Contactez-nous
            pour discuter de vos besoins spécifiques.
          </p>
          <button
            onClick={() =>
              document
                .querySelector('#contact')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
            className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-4 rounded-full hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300 font-semibold text-lg hover:scale-105 inline-flex items-center gap-2 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-2">
              <LucideIcons.Calendar size={20} />
              Planifier un échange
            </span>
          </button>
        </div>
      </div>

      {/* 🎭 MODALE IMMERSIVE FULL-SCREEN */}
      {isModalOpen && selectedSector && selectedSector.content_modal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* 🖼️ Image de couverture fixe */}
          <div className="fixed inset-0">
            <img
              src={selectedSector.image || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920'}
              alt={selectedSector.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('❌ Erreur de chargement de l\'image:', selectedSector.image);
                // Fallback vers une image par défaut
                e.currentTarget.src = 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920';
              }}
              onLoad={() => {
                console.log('✅ Image chargée avec succès:', selectedSector.image);
              }}
            />
          </div>

          {/* Overlay transparent avec gradient */}
          <div className="fixed inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/90" />

          {/* Contenu du modal */}
          <div className="relative z-10 min-h-screen">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-black/20 backdrop-blur-xl border-b border-white/10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {(() => {
                      const IconComponent = getIcon(selectedSector.icon);
                      return (
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center">
                          <IconComponent size={32} className="text-cyan-400" />
                        </div>
                      );
                    })()}
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">
                        {selectedSector.content_modal?.hero_title || selectedSector.title}
                      </h2>
                      <p className="text-gray-300 text-lg">
                        {selectedSector.content_modal?.hero_subtitle || ''}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/40 rounded-xl flex items-center justify-center transition-all duration-200 group"
                  >
                    <LucideIcons.X
                      size={24}
                      className="text-gray-300 group-hover:text-white"
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Contenu principal */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              {/* Description principale */}
              <div className="mb-12">
                <p className="text-xl text-gray-200 leading-relaxed max-w-4xl mx-auto text-center">
                  {selectedSector.content_modal?.description || ''}
                </p>
              </div>

              {/* 💎 Highlights - Points forts */}
              {selectedSector.content_modal?.highlights && selectedSector.content_modal.highlights.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm border border-cyan-500/30 rounded-xl flex items-center justify-center">
                      <LucideIcons.Lightbulb
                        className="text-yellow-400"
                        size={24}
                      />
                    </div>
                    Solutions Spécialisées
                  </h3>

                  <div className="grid lg:grid-cols-2 gap-8">
                    {selectedSector.content_modal.highlights.map(
                      (highlight: any, index: number) => {
                        const HighlightIcon = getIcon(highlight.icon);
                        return (
                          <div
                            key={index}
                            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 hover:bg-white/15 hover:border-cyan-500/50 transition-all duration-500 group"
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/30 to-purple-500/30 border border-cyan-500/50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                <HighlightIcon
                                  size={28}
                                  className="text-cyan-400"
                                />
                              </div>
                              <div>
                                <h4 className="text-2xl font-bold text-cyan-400 mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                                  {highlight.title}
                                </h4>
                                <p className="text-gray-300 leading-relaxed text-lg">
                                  {highlight.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}

              {/* 📊 Case Study - Étude de cas */}
              {selectedSector.content_modal?.case_study && (
                <div className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 backdrop-blur-md border border-cyan-500/40 rounded-3xl p-8 md:p-12 mb-12">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/30 to-purple-500/30 border border-cyan-500/50 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <LucideIcons.TrendingUp
                        size={36}
                        className="text-cyan-400"
                      />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                      {selectedSector.content_modal.case_study.title}
                    </h2>
                  </div>

                  {/* Résultats chiffrés */}
                  <div className="grid md:grid-cols-3 gap-6">
                    {selectedSector.content_modal.case_study.results?.map(
                      (result: string, index: number) => (
                        <div
                          key={index}
                          className="bg-black/40 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6 text-center hover:scale-105 transition-transform duration-300"
                        >
                          <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                            {result.split(' ')[0]}
                          </div>
                          <p className="text-gray-200 text-sm font-medium">
                            {result.split(' ').slice(1).join(' ')}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* 🛠️ Tech Stack */}
              {selectedSector.content_modal?.tech_stack && selectedSector.content_modal.tech_stack.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-white mb-6 text-center">
                    Technologies Utilisées
                  </h3>
                  <div className="flex flex-wrap justify-center gap-4">
                    {selectedSector.content_modal.tech_stack.map(
                      (tech: string, index: number) => (
                        <div
                          key={index}
                          className="bg-white/10 backdrop-blur-sm border border-gray-500/30 rounded-full px-6 py-3 text-gray-200 hover:border-cyan-500/50 hover:text-cyan-400 transition-all duration-300 hover:scale-110 font-medium"
                        >
                          {tech}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Footer CTA */}
              <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-md border border-cyan-500/30 rounded-3xl p-12 text-center">
                <h4 className="text-3xl font-bold text-white mb-4">
                  Prêt à transformer votre activité{' '}
                  {selectedSector.title.toLowerCase()} ?
                </h4>
                <p className="text-gray-300 mb-8 text-xl max-w-3xl mx-auto leading-relaxed">
                  Discutons de vos besoins spécifiques et créons ensemble la
                  solution parfaite pour votre secteur d'activité.
                </p>
                <button
                  onClick={() => {
                    closeModal();
                    document
                      .querySelector('#contact')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-10 py-4 rounded-full hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 font-bold text-lg inline-flex items-center gap-3 hover:scale-105 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 flex items-center gap-3">
                    <LucideIcons.MessageCircle size={20} />
                    {selectedSector.content_modal?.cta_text || 'Nous contacter'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Sectors;