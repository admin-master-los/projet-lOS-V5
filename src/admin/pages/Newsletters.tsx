/**
 * Page: Newsletters Admin
 * Gestion des abonnés newsletter
 */

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient';
import {
  Mail,
  Users,
  TrendingUp,
  Clock,
  Search,
  Eye,
  Edit2,
  Trash2,
  Download,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  XCircle,
  X,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import ExportButton from '../components/common/ExportButton';

interface Subscriber {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  source: string;
  tags: string[];
  status: 'pending' | 'subscribed' | 'unsubscribed';
  ip_address: string | null;
  user_agent: string | null;
  confirmed_at: string | null;
  unsubscribed_at: string | null;
  created_at: string;
  updated_at: string;
}

type SortColumn = 'email' | 'created_at' | 'status';
type SortDirection = 'asc' | 'desc';

const Newsletters: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sortColumn, setSortColumn] = useState<SortColumn>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(''); // Un seul champ nom complet

  const queryClient = useQueryClient();

  // Charger abonnés
  const { data: subscribers, isLoading } = useQuery({
    queryKey: ['newsletter-subscribers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Subscriber[];
    },
  });

  // Charger stats
  const { data: stats } = useQuery({
    queryKey: ['newsletter-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('newsletter_stats')
        .select('*')
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Supprimer abonné
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletter-subscribers'] });
      queryClient.invalidateQueries({ queryKey: ['newsletter-stats'] });
      setShowDeleteModal(false);
      setSelectedSubscriber(null);
    },
  });

  // Mettre à jour abonné (nom + statut)
  const updateMutation = useMutation({
    mutationFn: async (data: { id: string; name?: string; status?: string }) => {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({
          first_name: data.name, // Stocke dans first_name
          last_name: null, // Vide last_name
          status: data.status,
          confirmed_at: data.status === 'subscribed' ? new Date().toISOString() : undefined,
        })
        .eq('id', data.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletter-subscribers'] });
      queryClient.invalidateQueries({ queryKey: ['newsletter-stats'] });
      setShowDetailModal(false);
      setSelectedSubscriber(null);
      setIsEditing(false);
    },
  });

  // Filtrer et rechercher
  const filteredSubscribers = subscribers?.filter((sub) => {
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const matchEmail = sub.email.toLowerCase().includes(search);
      const matchName = `${sub.first_name || ''} ${sub.last_name || ''}`
        .toLowerCase()
        .includes(search);
      if (!matchEmail && !matchName) return false;
    }

    if (statusFilter && sub.status !== statusFilter) return false;

    return true;
  });

  // Trier
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const sortedSubscribers = [...(filteredSubscribers || [])].sort((a, b) => {
    let comparison = 0;

    switch (sortColumn) {
      case 'email':
        comparison = a.email.localeCompare(b.email);
        break;
      case 'created_at':
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      subscribed: 'bg-green-500/10 text-green-400 border-green-500/20',
      pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      unsubscribed: 'bg-red-500/10 text-red-400 border-red-500/20',
    };

    const icons = {
      subscribed: <CheckCircle className="w-3 h-3" />,
      pending: <Clock className="w-3 h-3" />,
      unsubscribed: <XCircle className="w-3 h-3" />,
    };

    const labels = {
      subscribed: 'Abonné',
      pending: 'En attente',
      unsubscribed: 'Désabonné',
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${
          styles[status as keyof typeof styles]
        }`}
      >
        {icons[status as keyof typeof icons]}
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Newsletter</h1>
        <p className="text-gray-400">Gérer les abonnés à votre newsletter</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Abonnés</p>
              <p className="text-2xl font-bold text-white">
                {stats?.total_subscribed || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">En attente</p>
              <p className="text-2xl font-bold text-white">{stats?.total_pending || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Ce mois</p>
              <p className="text-2xl font-bold text-white">
                {stats?.new_last_month || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total</p>
              <p className="text-2xl font-bold text-white">{stats?.total_all || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Recherche */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par email ou nom..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Filtre statut */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="">Tous les statuts</option>
            <option value="subscribed">Abonnés</option>
            <option value="pending">En attente</option>
            <option value="unsubscribed">Désabonnés</option>
          </select>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-gray-400 text-sm">
            {sortedSubscribers?.length || 0} abonné(s) trouvé(s)
          </p>

          {/* Export */}
          <ExportButton
            data={sortedSubscribers || []}
            filename={`newsletter-${new Date().toISOString().split('T')[0]}`}
            title="Liste des abonnés newsletter"
            disabled={!sortedSubscribers || sortedSubscribers.length === 0}
          />
        </div>
      </div>

      {/* Liste */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden relative z-0">
        {sortedSubscribers && sortedSubscribers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  {/* Email - Triable */}
                  <th
                    className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase cursor-pointer hover:text-cyan-400 transition-colors select-none"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center gap-2">
                      Email
                      {sortColumn === 'email' ? (
                        sortDirection === 'asc' ? (
                          <ArrowUp className="w-4 h-4 text-cyan-400" />
                        ) : (
                          <ArrowDown className="w-4 h-4 text-cyan-400" />
                        )
                      ) : (
                        <ArrowUpDown className="w-4 h-4 opacity-50" />
                      )}
                    </div>
                  </th>

                  {/* Nom */}
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                    Nom
                  </th>

                  {/* Source */}
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                    Source
                  </th>

                  {/* Statut - Triable */}
                  <th
                    className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase cursor-pointer hover:text-cyan-400 transition-colors select-none"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-2">
                      Statut
                      {sortColumn === 'status' ? (
                        sortDirection === 'asc' ? (
                          <ArrowUp className="w-4 h-4 text-cyan-400" />
                        ) : (
                          <ArrowDown className="w-4 h-4 text-cyan-400" />
                        )
                      ) : (
                        <ArrowUpDown className="w-4 h-4 opacity-50" />
                      )}
                    </div>
                  </th>

                  {/* Date - Triable */}
                  <th
                    className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase cursor-pointer hover:text-cyan-400 transition-colors select-none"
                    onClick={() => handleSort('created_at')}
                  >
                    <div className="flex items-center gap-2">
                      Date inscription
                      {sortColumn === 'created_at' ? (
                        sortDirection === 'asc' ? (
                          <ArrowUp className="w-4 h-4 text-cyan-400" />
                        ) : (
                          <ArrowDown className="w-4 h-4 text-cyan-400" />
                        )
                      ) : (
                        <ArrowUpDown className="w-4 h-4 opacity-50" />
                      )}
                    </div>
                  </th>

                  {/* Actions */}
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {sortedSubscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-white">{sub.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300">
                        {sub.first_name || sub.last_name
                          ? `${sub.first_name || ''} ${sub.last_name || ''}`.trim()
                          : '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300">{sub.source}</span>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(sub.status)}</td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300">
                        {format(new Date(sub.created_at), 'dd/MM/yyyy HH:mm', {
                          locale: fr,
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* Si pending → Éditer | Si subscribed → Voir */}
                        {sub.status === 'pending' ? (
                          <button
                            onClick={() => {
                              setSelectedSubscriber(sub);
                              setIsEditing(true);
                              setEditName(
                                `${sub.first_name || ''} ${sub.last_name || ''}`.trim()
                              );
                            }}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            title="Modifier nom"
                          >
                            <Edit2 className="w-4 h-4 text-gray-400 hover:text-cyan-400" />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedSubscriber(sub);
                              setShowDetailModal(true);
                            }}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            title="Voir détails"
                          >
                            <Eye className="w-4 h-4 text-gray-400 hover:text-cyan-400" />
                          </button>
                        )}
                        
                        {/* Supprimer toujours visible */}
                        <button
                          onClick={() => {
                            setSelectedSubscriber(sub);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Mail className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Aucun abonné trouvé</p>
          </div>
        )}
      </div>

      {/* Modal Édition (si pending) */}
      {isEditing && selectedSubscriber && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl border border-white/10 max-w-md w-full">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Modifier le nom</h3>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setSelectedSubscriber(null);
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Email</label>
                <p className="text-white">{selectedSubscriber.email}</p>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Nom complet</label>
                <input
                  type="text"
                  placeholder="Ex: Jean Dupont"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-1">
                  Le nom sera sauvegardé et le statut passera en "Abonné"
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-white/10 flex gap-3">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setSelectedSubscriber(null);
                }}
                className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  if (!editName.trim()) return;
                  updateMutation.mutate({
                    id: selectedSubscriber.id,
                    name: editName.trim(),
                    status: 'subscribed',
                  });
                }}
                disabled={!editName.trim()}
                className="flex-1 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-white transition-colors"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Détails (si subscribed) */}
      {showDetailModal && selectedSubscriber && !isEditing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Détails abonné</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Email</label>
                <p className="text-white">{selectedSubscriber.email}</p>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">Nom</label>
                <p className="text-white">
                  {`${selectedSubscriber.first_name || ''} ${
                    selectedSubscriber.last_name || ''
                  }`.trim() || '-'}
                </p>
              </div>


              <div>
                <label className="text-sm text-gray-400 mb-1 block">Source</label>
                <p className="text-white">{selectedSubscriber.source}</p>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">Statut</label>
                {getStatusBadge(selectedSubscriber.status)}
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">
                  Date d'inscription
                </label>
                <p className="text-white">
                  {format(new Date(selectedSubscriber.created_at), 'dd MMMM yyyy à HH:mm', {
                    locale: fr,
                  })}
                </p>
              </div>

              {selectedSubscriber.confirmed_at && (
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Date confirmation</label>
                  <p className="text-white">
                    {format(
                      new Date(selectedSubscriber.confirmed_at),
                      'dd MMMM yyyy à HH:mm',
                      { locale: fr }
                    )}
                  </p>
                </div>
              )}

              {selectedSubscriber.tags && selectedSubscriber.tags.length > 0 && (
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedSubscriber.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedSubscriber.ip_address && (
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">IP</label>
                  <p className="text-white text-sm">{selectedSubscriber.ip_address}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-white/10">
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Suppression */}
      {showDeleteModal && selectedSubscriber && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl border border-white/10 max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Confirmer suppression</h3>
              <p className="text-gray-400 mb-6">
                Voulez-vous vraiment supprimer l'abonné{' '}
                <strong>{selectedSubscriber.email}</strong> ?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => deleteMutation.mutate(selectedSubscriber.id)}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Newsletters;
