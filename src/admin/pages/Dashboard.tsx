import React from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  useDashboardStats,
  useRecentContacts,
  useRecentProjects,
  useRecentBlogPosts,
} from '../hooks/useDashboard';
import StatsCard from '../components/dashboard/StatsCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import QuickActions from '../components/dashboard/QuickActions';
import { LoadingSpinner, ErrorMessage } from '../components/common/LoadingSpinner';
import {
  Mail,
  FolderOpen,
  FileText,
  Briefcase,
  Building2,
  Navigation as NavigationIcon,
  Target,
  MessageSquare,
  MessageCircle,
} from 'lucide-react';

/**
 * Dashboard admin - Vue d'ensemble avec statistiques réelles
 * Affiche les stats, l'activité récente et les actions rapides
 */

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Récupérer les statistiques
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats();
  const { data: recentContacts, isLoading: contactsLoading } = useRecentContacts(3);
  const { data: recentProjects, isLoading: projectsLoading } = useRecentProjects(3);
  const { data: recentBlogPosts, isLoading: blogLoading } = useRecentBlogPosts(3);

  // Combiner l'activité récente
  const recentActivity = React.useMemo(() => {
    const activities: any[] = [];

    if (recentContacts) {
      recentContacts.forEach((contact) => {
        activities.push({
          id: contact.id,
          type: 'contact',
          title: contact.name,
          subtitle: contact.email,
          timestamp: contact.created_at,
          link: `/admin/contacts`,
        });
      });
    }

    if (recentProjects) {
      recentProjects.forEach((project) => {
        activities.push({
          id: project.id,
          type: 'project',
          title: project.title,
          subtitle: `Statut: ${project.status}`,
          timestamp: project.created_at,
          link: `/admin/projects`,
        });
      });
    }

    if (recentBlogPosts) {
      recentBlogPosts.forEach((post) => {
        activities.push({
          id: post.id,
          type: 'blog',
          title: post.title,
          subtitle: `Statut: ${post.status}`,
          timestamp: post.published_at || post.created_at,
          link: `/admin/blog`,
        });
      });
    }

    // Trier par date décroissante
    return activities.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ).slice(0, 5);
  }, [recentContacts, recentProjects, recentBlogPosts]);

  // Configuration des stats cards
  const statsCards = stats
    ? [
        {
          label: 'Contacts',
          value: stats.contactsCount,
          icon: Mail,
          color: 'from-cyan-500 to-blue-500',
          bgColor: 'bg-cyan-500/10',
          borderColor: 'border-cyan-500/50',
          link: '/admin/contacts',
        },
        {
          label: 'Projets',
          value: stats.projectsCount,
          icon: FolderOpen,
          color: 'from-purple-500 to-pink-500',
          bgColor: 'bg-purple-500/10',
          borderColor: 'border-purple-500/50',
          link: '/admin/projects',
        },
        {
          label: 'Articles',
          value: stats.blogPostsCount,
          icon: FileText,
          color: 'from-green-500 to-emerald-500',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/50',
          link: '/admin/blog',
        },
        {
          label: 'Commentaires',
          value: stats.commentsCount,
          badge: stats.pendingCommentsCount > 0 ? stats.pendingCommentsCount : undefined,
          icon: MessageCircle,
          color: 'from-yellow-500 to-orange-500',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/50',
          link: '/admin/comments',
        },
        {
          label: 'Services',
          value: stats.servicesCount,
          icon: Briefcase,
          color: 'from-orange-500 to-red-500',
          bgColor: 'bg-orange-500/10',
          borderColor: 'border-orange-500/50',
          link: '/admin/services',
        },
        {
          label: 'Secteurs',
          value: stats.sectorsCount,
          icon: Building2,
          color: 'from-pink-500 to-rose-500',
          bgColor: 'bg-pink-500/10',
          borderColor: 'border-pink-500/50',
          link: '/admin/sectors',
        },
        {
          label: 'Navigation',
          value: stats.navigationItemsCount,
          icon: NavigationIcon,
          color: 'from-yellow-500 to-amber-500',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/50',
          link: '/admin/navigation',
        },
        {
          label: 'Compétences',
          value: stats.skillsCount,
          icon: Target,
          color: 'from-indigo-500 to-purple-500',
          bgColor: 'bg-indigo-500/10',
          borderColor: 'border-indigo-500/50',
          link: '/admin/skills',
        },
        {
          label: 'Chatbot KB',
          value: stats.chatbotKnowledgeCount,
          icon: MessageSquare,
          color: 'from-teal-500 to-cyan-500',
          bgColor: 'bg-teal-500/10',
          borderColor: 'border-teal-500/50',
          link: '/admin/chatbot',
        },
      ]
    : [];

  // Gestion des erreurs
  if (statsError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-gray-400">
            Bienvenue, {user?.email?.split('@')[0] || 'Admin'}
          </p>
        </div>
        <ErrorMessage
          title="Erreur de chargement"
          message="Impossible de charger les statistiques. Vérifiez votre connexion."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
          Dashboard
        </h1>
        <p className="text-gray-400">
          Bienvenue, {user?.email?.split('@')[0] || 'Admin'} ! Voici un aperçu de votre activité.
        </p>
      </div>

      {/* Stats Grid */}
      {statsLoading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" text="Chargement des statistiques..." />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Activity */}
      <RecentActivity
        items={recentActivity}
        isLoading={contactsLoading || projectsLoading || blogLoading}
      />

      {/* Info Card - Si aucune donnée */}
      {stats &&
        stats.contactsCount === 0 &&
        stats.projectsCount === 0 &&
        stats.blogPostsCount === 0 && (
          <div className="bg-blue-500/10 border border-blue-500/50 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="text-blue-400 font-semibold mb-2">
                  🎉 Bienvenue dans votre interface admin !
                </h3>
                <p className="text-gray-300 text-sm mb-3">
                  Votre dashboard est prêt. Commencez par créer du contenu en utilisant les
                  actions rapides ci-dessus ou en naviguant dans le menu.
                </p>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>→ Créez vos premiers services</li>
                  <li>→ Ajoutez des projets à votre portfolio</li>
                  <li>→ Rédigez des articles de blog</li>
                  <li>→ Configurez la navigation</li>
                </ul>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default Dashboard;
