import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  LayoutDashboard,
  Navigation,
  Briefcase,
  Building2,
  FolderOpen,
  FileText,
  MessageSquare,
  MessageCircle,
  Target,
  Mail,
  Send,
  Settings,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Calendar,
  BarChart3,
} from 'lucide-react';

/**
 * Composant Sidebar pour la navigation admin
 * Menu latéral avec liens et état collapsed
 */

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/admin/dashboard',
  },
  {
    id: 'navigation',
    label: 'Navigation',
    icon: Navigation,
    path: '/admin/navigation',
  },
  {
    id: 'services',
    label: 'Services',
    icon: Briefcase,
    path: '/admin/services',
  },
  {
    id: 'sectors',
    label: 'Secteurs',
    icon: Building2,
    path: '/admin/sectors',
  },
  {
    id: 'projects',
    label: 'Projets',
    icon: FolderOpen,
    path: '/admin/projects',
  },
  {
    id: 'blog',
    label: 'Blog',
    icon: FileText,
    path: '/admin/blog',
  },
  {
    id: 'comments',
    label: 'Commentaires',
    icon: MessageCircle,
    path: '/admin/comments',
  },
  {
    id: 'meetings',
    label: 'Rendez-vous',
    icon: Calendar,
    path: '/admin/meetings',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    path: '/admin/analytics',
  },
  {
    id: 'chatbot',
    label: 'Chatbot KB',
    icon: MessageSquare,
    path: '/admin/chatbot',
  },
  {
    id: 'skills',
    label: 'Compétences',
    icon: Target,
    path: '/admin/skills',
  },
  {
    id: 'contacts',
    label: 'Contacts',
    icon: Mail,
    path: '/admin/contacts',
  },
  {
    id: 'newsletters',
    label: 'Newsletters',
    icon: Send,
    path: '/admin/newsletters',
  },
  {
    id: 'settings',
    label: 'Paramètres',
    icon: Settings,
    path: '/admin/settings',
  },
];

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const queryClient = useQueryClient();

  // Fonction pour rafraîchir le cache lors de la navigation
  const handleNavigation = () => {
    // Invalider toutes les queries pour forcer un refetch
    queryClient.invalidateQueries();
    console.log('🔄 Cache invalidé lors de la navigation');
  };

  return (
    <aside
      className={`
        flex flex-col bg-[#0A0A0B] border-r border-gray-700/50
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-700/50 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <span className="text-white font-bold text-sm">lOS</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Admin</h1>
              <p className="text-gray-500 text-xs">Panel</p>
            </div>
          </div>
        )}

        {/* Toggle button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors ml-auto"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={handleNavigation}
              className={({ isActive }) =>
                `
                  flex items-center gap-3 px-3 py-2.5 rounded-lg
                  transition-all duration-200
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `
              }
              title={isCollapsed ? item.label : undefined}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!isCollapsed && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer - Retour au site */}
      <div className="p-4 border-t border-gray-700/50">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className={`
            flex items-center gap-3 px-3 py-2.5 rounded-lg
            text-gray-400 hover:text-cyan-400 hover:bg-white/5
            transition-all duration-200
            ${isCollapsed ? 'justify-center' : ''}
          `}
          title={isCollapsed ? 'Retour au site' : undefined}
        >
          <ExternalLink size={20} className="flex-shrink-0" />
          {!isCollapsed && (
            <span className="font-medium text-sm">Retour au site</span>
          )}
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
