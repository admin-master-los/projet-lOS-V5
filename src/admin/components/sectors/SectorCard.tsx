import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import type { Sector } from '../../types/sector.types';

/**
 * Composant SectorCard - Affiche un secteur sous forme de card
 * 
 * Architecture:
 * - Image en arrière-plan avec overlay gradient
 * - Icône du secteur en haut à gauche
 * - Titre et description au centre
 * - Liste des services en badges
 * - Boutons d'action (éditer/supprimer) en bas
 * 
 * Design:
 * - Card avec effet hover et transition
 * - Image de fond avec overlay pour le contraste
 * - Badges colorés pour les services
 * - Icônes Lucide-react dynamiques
 */

interface SectorCardProps {
  sector: Sector;
  onEdit: () => void;
  onDelete: () => void;
}

const SectorCard: React.FC<SectorCardProps> = ({ sector, onEdit, onDelete }) => {
  // Récupérer le composant d'icône dynamiquement depuis lucide-react
  // Si l'icône n'existe pas, on utilise une icône par défaut (Briefcase)
  const IconComponent = (Icons as any)[sector.icon] || Icons.Briefcase;

  return (
    <div className="group relative bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden hover:border-pink-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/10">
      {/* Image de fond avec overlay gradient */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={sector.image}
          alt={sector.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Overlay gradient pour améliorer la lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
        
        {/* Icône du secteur */}
        <div className="absolute top-4 left-4 w-12 h-12 bg-pink-500/20 backdrop-blur-sm border border-pink-500/30 rounded-lg flex items-center justify-center">
          <IconComponent size={24} className="text-pink-400" />
        </div>
      </div>

      {/* Contenu de la card */}
      <div className="p-6 space-y-4">
        {/* Titre du secteur */}
        <div>
          <h3 className="text-xl font-semibold text-gray-100 mb-2 line-clamp-1">
            {sector.title}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-2">
            {sector.description}
          </p>
        </div>

        {/* Liste des services en badges */}
        {sector.services && sector.services.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {sector.services.slice(0, 3).map((service, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-pink-500/10 text-pink-300 text-xs rounded-md border border-pink-500/20"
              >
                {service}
              </span>
            ))}
            {sector.services.length > 3 && (
              <span className="px-2 py-1 bg-gray-700/50 text-gray-400 text-xs rounded-md">
                +{sector.services.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex items-center gap-2 pt-4 border-t border-gray-700">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-pink-500/20 text-gray-300 hover:text-pink-300 rounded-lg transition-all duration-200 border border-transparent hover:border-pink-500/30"
          >
            <Edit2 size={16} />
            <span className="text-sm font-medium">Éditer</span>
          </button>
          <button
            onClick={onDelete}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-red-500/20 text-gray-300 hover:text-red-300 rounded-lg transition-all duration-200 border border-transparent hover:border-red-500/30"
          >
            <Trash2 size={16} />
            <span className="text-sm font-medium">Supprimer</span>
          </button>
        </div>
      </div>

      {/* Badge ID du secteur (visible au hover) */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="px-2 py-1 bg-gray-900/90 backdrop-blur-sm text-gray-300 text-xs rounded border border-gray-700 font-mono">
          {sector.id}
        </span>
      </div>
    </div>
  );
};

export default SectorCard;
