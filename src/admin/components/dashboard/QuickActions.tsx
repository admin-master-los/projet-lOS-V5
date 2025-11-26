import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  FileText,
  FolderOpen,
  Briefcase,
  Building2,
  Navigation,
} from 'lucide-react';

/**
 * Composant QuickActions
 * Boutons d'actions rapides pour créer du contenu
 */

interface QuickAction {
  label: string;
  icon: React.ElementType;
  link: string;
  color: string;
  description: string;
}

const quickActions: QuickAction[] = [
  {
    label: 'Nouvel article',
    icon: FileText,
    link: '/admin/blog/create',
    color: 'from-green-500 to-emerald-500',
    description: 'Rédiger un article de blog',
  },
  {
    label: 'Nouveau projet',
    icon: FolderOpen,
    link: '/admin/projects/create',
    color: 'from-purple-500 to-pink-500',
    description: 'Ajouter un projet portfolio',
  },
  {
    label: 'Nouveau service',
    icon: Briefcase,
    link: '/admin/services/create',
    color: 'from-cyan-500 to-blue-500',
    description: 'Créer un service',
  },
  {
    label: 'Nouveau secteur',
    icon: Building2,
    link: '/admin/sectors/create',
    color: 'from-orange-500 to-red-500',
    description: 'Ajouter un secteur',
  },
  {
    label: 'Navigation',
    icon: Navigation,
    link: '/admin/navigation/create',
    color: 'from-yellow-500 to-amber-500',
    description: 'Ajouter un lien de navigation',
  },
];

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white/5 border border-gray-700/50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Plus size={20} className="text-cyan-400" />
        Actions rapides
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={() => navigate(action.link)}
              className={`
                p-4 rounded-xl border border-gray-700/50 
                bg-gradient-to-br ${action.color} bg-opacity-10
                hover:scale-105 transition-all duration-300
                text-left group
              `}
            >
              <div className="flex flex-col items-start gap-2">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Icon size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{action.label}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{action.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
