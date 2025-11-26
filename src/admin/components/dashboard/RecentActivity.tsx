import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Mail, FolderOpen, FileText, ExternalLink, MessageCircle } from 'lucide-react';

/**
 * Composant RecentActivity
 * Affiche une liste des dernières activités (contacts, projets, articles)
 */

interface ActivityItem {
  id: string;
  type: 'contact' | 'project' | 'blog' | 'comment';
  title: string;
  subtitle?: string;
  timestamp: string;
  link: string;
}

interface RecentActivityProps {
  items: ActivityItem[];
  isLoading?: boolean;
}

const activityConfig = {
  contact: {
    icon: Mail,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
  },
  project: {
    icon: FolderOpen,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
  },
  blog: {
    icon: FileText,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
  },
  comment: {
    icon: MessageCircle,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
  },
};

const RecentActivity: React.FC<RecentActivityProps> = ({ items, isLoading = false }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="bg-white/5 border border-gray-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Activité récente</h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-700 rounded-lg" />
              <div className="flex-1">
                <div className="w-32 h-4 bg-gray-700 rounded mb-2" />
                <div className="w-48 h-3 bg-gray-700 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white/5 border border-gray-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Activité récente</h3>
        <div className="text-center py-8">
          <p className="text-gray-400">Aucune activité récente</p>
          <p className="text-sm text-gray-500 mt-2">
            Les dernières modifications apparaîtront ici
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-gray-700/50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Activité récente</h3>
      
      <div className="space-y-3">
        {items.map((item) => {
          const config = activityConfig[item.type];
          const Icon = config.icon;
          
          return (
            <div
              key={item.id}
              onClick={() => navigate(item.link)}
              className={`
                flex items-center gap-4 p-3 rounded-lg border ${config.borderColor}
                ${config.bgColor} cursor-pointer hover:scale-[1.02] transition-all
              `}
            >
              {/* Icon */}
              <div className={`flex-shrink-0 w-10 h-10 ${config.bgColor} rounded-lg flex items-center justify-center`}>
                <Icon size={20} className={config.color} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{item.title}</p>
                {item.subtitle && (
                  <p className="text-sm text-gray-400 truncate">{item.subtitle}</p>
                )}
                <p className="text-xs text-gray-500 mt-0.5">
                  {formatDistanceToNow(new Date(item.timestamp), {
                    addSuffix: true,
                    locale: fr,
                  })}
                </p>
              </div>

              {/* Link icon */}
              <ExternalLink size={16} className="text-gray-500 flex-shrink-0" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;
