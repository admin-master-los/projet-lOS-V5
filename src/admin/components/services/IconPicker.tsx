import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { Search } from 'lucide-react';

/**
 * Composant IconPicker - Sélecteur d'icônes visuelles
 * 
 * Ce composant affiche une grille d'icônes Lucide-react avec une barre de recherche
 * permettant de filtrer les icônes par nom. L'utilisateur peut cliquer sur une icône
 * pour la sélectionner. L'icône actuellement sélectionnée est mise en évidence avec
 * un style différent.
 * 
 * Architecture:
 * - Liste prédéfinie d'icônes couramment utilisées
 * - Recherche en temps réel par nom d'icône
 * - Affichage en grille responsive
 * - Mise en évidence de l'icône sélectionnée
 * 
 * Utilisation:
 * <IconPicker
 *   selectedIcon="ShoppingCart"
 *   onSelectIcon={(iconName) => setIcon(iconName)}
 * />
 */

interface IconPickerProps {
  selectedIcon: string;               // Nom de l'icône actuellement sélectionnée
  onSelectIcon: (iconName: string) => void;  // Callback appelé quand une icône est sélectionnée
}

/**
 * Liste des icônes disponibles dans le picker
 * 
 * Cette liste contient les icônes les plus couramment utilisées dans l'application.
 * Les icônes sont organisées par catégories pour faciliter la recherche:
 * - E-commerce: ShoppingCart, ShoppingBag, Package, CreditCard
 * - Éducation: GraduationCap, BookOpen, Users, Calendar
 * - Finance: Banknote, TrendingUp, BarChart, PieChart
 * - Communication: Mail, MessageSquare, Phone, Send
 * - Navigation: Home, MapPin, Compass, Navigation
 * - Général: Check, Star, Heart, Award, etc.
 */
const availableIcons = [
  // E-commerce & Shopping
  'ShoppingCart',
  'ShoppingBag',
  'Package',
  'CreditCard',
  'DollarSign',
  'Tag',
  'Gift',
  
  // Éducation & Learning
  'GraduationCap',
  'BookOpen',
  'Book',
  'FileText',
  'PenTool',
  'Edit',
  
  // Business & Finance
  'Banknote',
  'TrendingUp',
  'TrendingDown',
  'BarChart',
  'PieChart',
  'LineChart',
  'Building2',
  
  // Communication
  'Mail',
  'MessageSquare',
  'Phone',
  'Send',
  'Users',
  'User',
  
  // Navigation & Location
  'Home',
  'MapPin',
  'Map',
  'Compass',
  'Navigation',
  'Globe',
  
  // Food & Hospitality
  'Utensils',
  'Coffee',
  'Pizza',
  'Wine',
  
  // Technology
  'Laptop',
  'Smartphone',
  'Tablet',
  'Monitor',
  'Cpu',
  'Database',
  'Cloud',
  'Server',
  
  // Design & Creative
  'Palette',
  'Brush',
  'Image',
  'Camera',
  'Video',
  'Music',
  
  // General UI
  'Check',
  'X',
  'Plus',
  'Minus',
  'Star',
  'Heart',
  'Award',
  'Target',
  'Flag',
  'Shield',
  'Lock',
  'Unlock',
  'Eye',
  'EyeOff',
  'Bell',
  'Settings',
  'Zap',
  'Clock',
  'Calendar',
  
  // Social & Media
  'Share',
  'Link',
  'Bookmark',
  'Download',
  'Upload',
  
  // Actions
  'Play',
  'Pause',
  'StopCircle',
  'SkipForward',
  'SkipBack',
  'Repeat',
  'Shuffle',
  
  // Business & Professional
  'Briefcase',
  // 'FileText', ❌ DOUBLON SUPPRIMÉ - déjà ligne 57
  'Folder',
  'FolderOpen',
  'File',
  'Archive',
  
  // Health & Wellness
  'Activity',
  'HeartPulse',
  'Pill',
  
  // Weather & Nature
  'Sun',
  'Moon',
  // 'Cloud', ❌ DOUBLON SUPPRIMÉ - déjà ligne 99
  'CloudRain',
  // 'Zap', ❌ DOUBLON SUPPRIMÉ - déjà ligne 127
  'Wind',
  
  // Transport
  'Car',
  'Truck',
  'Plane',
  'Ship',
  
  // Misc
  'Lightbulb',
  'Rocket',
  'Trophy',
  'Crown',
  'Diamond',
];

const IconPicker: React.FC<IconPickerProps> = ({ selectedIcon, onSelectIcon }) => {
  // État local pour la recherche
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Filtre les icônes en fonction de la recherche
   * La recherche est insensible à la casse et vérifie si le nom de l'icône
   * contient la chaîne de recherche
   */
  const filteredIcons = availableIcons.filter((iconName) =>
    iconName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-4 space-y-4">
      {/* Barre de recherche */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher une icône..."
          className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-pink-500 focus:ring-pink-500/50 text-sm"
        />
      </div>

      {/* Compteur de résultats */}
      <div className="text-xs text-gray-400">
        {filteredIcons.length} icône{filteredIcons.length > 1 ? 's' : ''} trouvée
        {filteredIcons.length > 1 ? 's' : ''}
      </div>

      {/* Grille d'icônes */}
      <div className="grid grid-cols-6 gap-2 max-h-64 overflow-y-auto">
        {filteredIcons.length > 0 ? (
          filteredIcons.map((iconName) => {
            // Récupérer le composant d'icône depuis lucide-react
            const IconComponent = (Icons as any)[iconName];
            const isSelected = iconName === selectedIcon;

            return (
              <button
                key={iconName}
                type="button"
                onClick={() => onSelectIcon(iconName)}
                className={`
                  p-3 rounded-lg border transition-all duration-200
                  hover:scale-110 hover:shadow-lg
                  ${
                    isSelected
                      ? 'bg-pink-500/20 border-pink-500 text-pink-300 shadow-lg shadow-pink-500/20'
                      : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:border-pink-500/50 hover:text-pink-300'
                  }
                `}
                title={iconName}
              >
                <IconComponent size={20} className="mx-auto" />
              </button>
            );
          })
        ) : (
          /* Message si aucune icône ne correspond à la recherche */
          <div className="col-span-6 text-center py-8 text-gray-400 text-sm">
            Aucune icône ne correspond à votre recherche
          </div>
        )}
      </div>
    </div>
  );
};

export default IconPicker;
