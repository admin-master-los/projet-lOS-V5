import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Composant Breadcrumbs
 * Fil d'Ariane pour la navigation hiérarchique
 */

interface Breadcrumb {
  label: string;
  path?: string;
}

const pathLabels: Record<string, string> = {
  admin: 'Admin',
  dashboard: 'Dashboard',
  navigation: 'Navigation',
  services: 'Services',
  sectors: 'Secteurs',
  projects: 'Projets',
  blog: 'Blog',
  chatbot: 'Chatbot KB',
  skills: 'Compétences',
  contacts: 'Contacts',
  settings: 'Paramètres',
  create: 'Créer',
  edit: 'Modifier',
};

const Breadcrumbs: React.FC = () => {
  const location = useLocation();

  // Générer les breadcrumbs depuis le pathname
  const generateBreadcrumbs = (): Breadcrumb[] => {
    const paths = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: Breadcrumb[] = [];

    let currentPath = '';
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      
      // Ne pas afficher les IDs dans les breadcrumbs
      const isId = /^[a-f0-9-]{36}$/.test(path) || /^\d+$/.test(path);
      if (isId) {
        return;
      }

      const label = pathLabels[path] || path;
      
      // Le dernier élément n'a pas de lien
      breadcrumbs.push({
        label,
        path: index === paths.length - 1 ? undefined : currentPath,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm">
      {/* Home icon */}
      <Link
        to="/admin/dashboard"
        className="text-gray-400 hover:text-cyan-400 transition-colors"
        aria-label="Dashboard"
      >
        <Home size={16} />
      </Link>

      {/* Breadcrumb items */}
      {breadcrumbs.map((breadcrumb, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={16} className="text-gray-600" />
          
          {breadcrumb.path ? (
            <Link
              to={breadcrumb.path}
              className="text-gray-400 hover:text-cyan-400 transition-colors"
            >
              {breadcrumb.label}
            </Link>
          ) : (
            <span className="text-white font-medium">{breadcrumb.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
