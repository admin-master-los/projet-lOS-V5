import * as LucideIcons from 'lucide-react';

/**
 * Liste des icônes disponibles pour les services
 * Utilisé dans le formulaire de création/édition
 */

export const availableIcons = [
  { name: 'Code', label: 'Code', icon: LucideIcons.Code },
  { name: 'Smartphone', label: 'Mobile', icon: LucideIcons.Smartphone },
  { name: 'Globe', label: 'Web', icon: LucideIcons.Globe },
  { name: 'Database', label: 'Base de données', icon: LucideIcons.Database },
  { name: 'Cloud', label: 'Cloud', icon: LucideIcons.Cloud },
  { name: 'Server', label: 'Serveur', icon: LucideIcons.Server },
  { name: 'Shield', label: 'Sécurité', icon: LucideIcons.Shield },
  { name: 'Zap', label: 'Performance', icon: LucideIcons.Zap },
  { name: 'Layout', label: 'Design', icon: LucideIcons.Layout },
  { name: 'Palette', label: 'UI/UX', icon: LucideIcons.Palette },
  { name: 'ShoppingCart', label: 'E-commerce', icon: LucideIcons.ShoppingCart },
  { name: 'Users', label: 'Utilisateurs', icon: LucideIcons.Users },
  { name: 'Settings', label: 'Configuration', icon: LucideIcons.Settings },
  { name: 'Rocket', label: 'Lancement', icon: LucideIcons.Rocket },
  { name: 'Search', label: 'Recherche', icon: LucideIcons.Search },
  { name: 'MessageSquare', label: 'Chat', icon: LucideIcons.MessageSquare },
  { name: 'Mail', label: 'Email', icon: LucideIcons.Mail },
  { name: 'BarChart', label: 'Analytiques', icon: LucideIcons.BarChart },
  { name: 'TrendingUp', label: 'Croissance', icon: LucideIcons.TrendingUp },
  { name: 'Target', label: 'Objectifs', icon: LucideIcons.Target },
  { name: 'Layers', label: 'Architecture', icon: LucideIcons.Layers },
  { name: 'Box', label: 'Package', icon: LucideIcons.Box },
  { name: 'Cpu', label: 'Processeur', icon: LucideIcons.Cpu },
  { name: 'HardDrive', label: 'Stockage', icon: LucideIcons.HardDrive },
  { name: 'Briefcase', label: 'Business', icon: LucideIcons.Briefcase },
  { name: 'Lightbulb', label: 'Innovation', icon: LucideIcons.Lightbulb },
  { name: 'Monitor', label: 'Desktop', icon: LucideIcons.Monitor },
  { name: 'Tablet', label: 'Tablette', icon: LucideIcons.Tablet },
  { name: 'Wifi', label: 'Réseau', icon: LucideIcons.Wifi },
  { name: 'Lock', label: 'Verrouillage', icon: LucideIcons.Lock },
];

/**
 * Obtenir le composant icône par son nom
 */
export const getIconComponent = (iconName: string) => {
  const icon = availableIcons.find((i) => i.name === iconName);
  return icon ? icon.icon : LucideIcons.Code; // Default: Code
};
