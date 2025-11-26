import React, { useState } from 'react';
import {
  Activity,
  Search,
  Filter,
  Calendar,
  User,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  Download,
} from 'lucide-react';
import { useActivityLogs } from '../../hooks/useSettings';
import Button from '../common/Button';

interface LogStatusBadgeProps {
  status: string;
}

const LogStatusBadge: React.FC<LogStatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'success':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          className: 'bg-green-100 text-green-800',
          label: 'Succès',
        };
      case 'failed':
        return {
          icon: <XCircle className="w-4 h-4" />,
          className: 'bg-red-100 text-red-800',
          label: 'Échec',
        };
      case 'pending':
        return {
          icon: <Clock className="w-4 h-4" />,
          className: 'bg-yellow-100 text-yellow-800',
          label: 'En attente',
        };
      default:
        return {
          icon: <Activity className="w-4 h-4" />,
          className: 'bg-gray-100 text-gray-800',
          label: status,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
};

interface LogActionBadgeProps {
  action: string;
}

const LogActionBadge: React.FC<LogActionBadgeProps> = ({ action }) => {
  const getActionConfig = (action: string) => {
    switch (action) {
      case 'create':
        return { className: 'bg-blue-100 text-blue-800', label: 'Création' };
      case 'update':
        return { className: 'bg-purple-100 text-purple-800', label: 'Modification' };
      case 'delete':
        return { className: 'bg-red-100 text-red-800', label: 'Suppression' };
      case 'login':
        return { className: 'bg-green-100 text-green-800', label: 'Connexion' };
      case 'logout':
        return { className: 'bg-gray-100 text-gray-800', label: 'Déconnexion' };
      default:
        return { className: 'bg-gray-100 text-gray-800', label: action };
    }
  };

  const config = getActionConfig(action);

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
};

const ActivityLogsTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [limit, setLimit] = useState<number>(50);

  // Hooks
  const { data: logs, isLoading } = useActivityLogs(limit);

  // Filtrer les logs
  const filteredLogs = logs?.filter((log) => {
    const matchesSearch =
      searchQuery === '' ||
      log.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource_type?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;

    return matchesSearch && matchesAction && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getResourceIcon = (resourceType: string) => {
    switch (resourceType) {
      case 'blog_post':
        return <FileText className="w-4 h-4" />;
      case 'user':
        return <User className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const exportLogs = () => {
    if (!filteredLogs) return;

    const csv = [
      ['Date', 'Utilisateur', 'Action', 'Ressource', 'Statut', 'IP'].join(','),
      ...filteredLogs.map((log) =>
        [
          formatDate(log.created_at),
          log.user_email || 'N/A',
          log.action,
          `${log.resource_type} ${log.resource_id || ''}`,
          log.status,
          log.ip_address || 'N/A',
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Journal d'Activité
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {filteredLogs?.length || 0} entrée(s) affichée(s)
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
          >
            <option value={50}>50 derniers</option>
            <option value={100}>100 derniers</option>
            <option value={200}>200 derniers</option>
            <option value={500}>500 derniers</option>
          </select>
          <Button onClick={exportLogs} icon={Download} variant="secondary">
            Exporter
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par utilisateur, action..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">Toutes les actions</option>
              <option value="create">Création</option>
              <option value="update">Modification</option>
              <option value="delete">Suppression</option>
              <option value="login">Connexion</option>
              <option value="logout">Déconnexion</option>
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="all">Tous les statuts</option>
            <option value="success">Succès</option>
            <option value="failed">Échec</option>
            <option value="pending">En attente</option>
          </select>
        </div>
      </div>

      {/* Liste des logs */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filteredLogs && filteredLogs.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Icon */}
                    <div className="p-2 bg-gray-100 rounded-lg text-gray-600 flex-shrink-0">
                      {getResourceIcon(log.resource_type)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <LogActionBadge action={log.action} />
                        <span className="text-sm text-gray-600">
                          {log.resource_type}
                          {log.resource_id && (
                            <span className="text-gray-400">
                              {' '}
                              #{log.resource_id.substring(0, 8)}
                            </span>
                          )}
                        </span>
                        <LogStatusBadge status={log.status} />
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {log.user_email || 'Système'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(log.created_at)}
                        </div>
                        {log.ip_address && (
                          <div className="flex items-center gap-1 text-xs">
                            IP: {log.ip_address}
                          </div>
                        )}
                      </div>

                      {log.error_message && (
                        <div className="flex items-start gap-2 mt-2 p-2 bg-red-50 rounded text-xs text-red-800">
                          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span>{log.error_message}</span>
                        </div>
                      )}

                      {log.changes && Object.keys(log.changes).length > 0 && (
                        <details className="mt-2">
                          <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700 flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            Voir les modifications
                          </summary>
                          <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-x-auto">
                            {JSON.stringify(log.changes, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucune activité trouvée
            </h3>
            <p className="text-gray-500">
              {searchQuery || actionFilter !== 'all' || statusFilter !== 'all'
                ? 'Aucun résultat ne correspond à vos critères'
                : 'Aucune activité enregistrée pour le moment'}
            </p>
          </div>
        )}
      </div>

      {/* Info sur la rétention des logs */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Rétention des logs</p>
            <p>
              Les logs d'activité sont conservés pendant 90 jours. Les entrées
              plus anciennes sont automatiquement archivées.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogsTab;
