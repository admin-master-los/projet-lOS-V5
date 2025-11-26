/**
 * Component: MeetingsList
 * Liste des rendez-vous avec filtres et actions
 */

import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  MoreVertical,
  Mail,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import {
  useAllMeetings,
  useUpdateMeetingStatus,
  useDeleteMeeting,
} from '../../hooks/useMeetings';
import { MeetingFilters, MeetingStatus } from '../../services/meetingsService';
import { formatDateFR, formatTime } from '../../utils/dateHelpers';
import { LoadingSpinner } from '../common/LoadingSpinner';
import Modal from '../common/Modal';
import Button from '../common/Button';
import ExportButton from '../common/ExportButton';

// Helper pour afficher le canal
const getChannelIcon = (channel: string | null) => {
  switch (channel) {
    case 'zoom':
      return '🎥 Zoom';
    case 'google_meet':
      return '📹 Google Meet';
    case 'microsoft_teams':
      return '👥 Teams';
    case 'whatsapp_video':
      return '💬 WhatsApp';
    case 'phone':
      return '📞 Téléphone';
    case 'skype':
      return '📞 Skype';
    case 'in_person':
      return '🏢 En personne';
    default:
      return '❓ Non défini';
  }
};

const MeetingsList: React.FC = () => {
  const [filters, setFilters] = useState<MeetingFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // États de tri
  const [sortColumn, setSortColumn] = useState<'date' | 'time' | 'client' | 'status'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc'); // desc = plus récent d'abord

  const { data: meetings, isLoading } = useAllMeetings(filters);
  const updateStatus = useUpdateMeetingStatus();
  const deleteMeeting = useDeleteMeeting();

  // Filter meetings by search
  const filteredMeetings = meetings?.filter((meeting) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      meeting.client_name.toLowerCase().includes(search) ||
      meeting.client_email.toLowerCase().includes(search) ||
      meeting.client_phone.includes(search)
    );
  });

  // Fonction de tri
  const handleSort = (column: 'date' | 'time' | 'client' | 'status') => {
    if (sortColumn === column) {
      // Inverser direction si même colonne
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Nouvelle colonne, tri descendant par défaut
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  // Trier les meetings filtrés
  const sortedMeetings = [...(filteredMeetings || [])].sort((a, b) => {
    let comparison = 0;

    switch (sortColumn) {
      case 'date':
        // Comparer dates puis heures
        const dateA = new Date(a.meeting_date + ' ' + a.meeting_time);
        const dateB = new Date(b.meeting_date + ' ' + b.meeting_time);
        comparison = dateA.getTime() - dateB.getTime();
        break;
      case 'time':
        comparison = a.meeting_time.localeCompare(b.meeting_time);
        break;
      case 'client':
        comparison = a.client_name.localeCompare(b.client_name);
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleStatusChange = (id: string, status: MeetingStatus) => {
    updateStatus.mutate({ id, status });
  };

  const handleDelete = () => {
    if (selectedMeeting) {
      deleteMeeting.mutate(selectedMeeting.id, {
        onSuccess: () => {
          setShowDeleteModal(false);
          setSelectedMeeting(null);
        },
      });
    }
  };

  const getStatusBadge = (status: MeetingStatus) => {
    const styles = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      confirmed: 'bg-green-500/20 text-green-400 border-green-500/30',
      completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
      no_show: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };

    const labels = {
      pending: 'En attente',
      confirmed: 'Confirmé',
      completed: 'Terminé',
      cancelled: 'Annulé',
      no_show: 'Absence',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filters & Search */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, email, téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={filters.status || ''}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value as MeetingStatus })
            }
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmés</option>
            <option value="completed">Terminés</option>
            <option value="cancelled">Annulés</option>
            <option value="no_show">Absences</option>
          </select>

          {/* Export Button */}
          <ExportButton
            data={sortedMeetings || []}
            filename={`rendez-vous-${new Date().toISOString().split('T')[0]}`}
            title="Liste des rendez-vous"
            disabled={!sortedMeetings || sortedMeetings.length === 0}
          />
        </div>

        <p className="text-gray-400 text-sm">
          {sortedMeetings?.length || 0} rendez-vous trouvé(s)
        </p>
      </div>

      {/* Meetings Table */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden">
        {isLoading ? (
          <div className="p-12">
            <LoadingSpinner />
          </div>
        ) : sortedMeetings && sortedMeetings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  {/* Date - Triable */}
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase cursor-pointer hover:text-cyan-400 transition-colors select-none"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center gap-2">
                      Date
                      {sortColumn === 'date' ? (
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
                  
                  {/* Client - Triable */}
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase cursor-pointer hover:text-cyan-400 transition-colors select-none"
                    onClick={() => handleSort('client')}
                  >
                    <div className="flex items-center gap-2">
                      Client
                      {sortColumn === 'client' ? (
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
                  
                  {/* Service - Non triable */}
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                    Service
                  </th>
                  
                  {/* Contact - Non triable */}
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                    Contact
                  </th>
                  
                  {/* Canal - Non triable */}
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                    Canal
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
                  
                  {/* Actions - Non triable */}
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {sortedMeetings.map((meeting) => (
                  <tr
                    key={meeting.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-white font-medium">
                          {new Date(meeting.meeting_date).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'short',
                          })}
                        </p>
                        <p className="text-sm text-gray-400">
                          {formatTime(meeting.meeting_time)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">
                          {meeting.client_name}
                        </p>
                        {meeting.client_company && (
                          <p className="text-sm text-gray-400">
                            {meeting.client_company}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white">
                        {meeting.meeting_services?.name || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-400">
                        {meeting.duration} min
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-gray-300">{meeting.client_email}</p>
                        <p className="text-gray-400">
                          {meeting.client_country_code} {meeting.client_phone}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-300">
                        {getChannelIcon(meeting.meeting_channel)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(meeting.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedMeeting(meeting);
                            setShowDetailModal(true);
                          }}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          title="Voir détails"
                        >
                          <Eye className="w-5 h-5 text-gray-400" />
                        </button>

                        {meeting.status === 'pending' && (
                          <button
                            onClick={() =>
                              handleStatusChange(meeting.id, 'confirmed')
                            }
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            title="Confirmer"
                          >
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          </button>
                        )}

                        {['pending', 'confirmed'].includes(meeting.status) && (
                          <button
                            onClick={() =>
                              handleStatusChange(meeting.id, 'cancelled')
                            }
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            title="Annuler"
                          >
                            <XCircle className="w-5 h-5 text-red-400" />
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setSelectedMeeting(meeting);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-5 h-5 text-red-400" />
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
            <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Aucun rendez-vous trouvé</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedMeeting && (
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title="Détails du rendez-vous"
        >
          <div className="space-y-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Service</p>
              <p className="text-white font-medium">
                {selectedMeeting.meeting_services?.name}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Date</p>
                <p className="text-white">
                  {formatDateFR(selectedMeeting.meeting_date)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Heure</p>
                <p className="text-white">
                  {formatTime(selectedMeeting.meeting_time)}
                </p>
              </div>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-1">Client</p>
              <p className="text-white">{selectedMeeting.client_name}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-1">Email</p>
              <p className="text-white">{selectedMeeting.client_email}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-1">Téléphone</p>
              <p className="text-white">
                {selectedMeeting.client_country_code}{' '}
                {selectedMeeting.client_phone}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-1">Canal de communication</p>
              <p className="text-white font-medium">
                {getChannelIcon(selectedMeeting.meeting_channel)}
              </p>
            </div>

            {selectedMeeting.client_notes && (
              <div>
                <p className="text-gray-400 text-sm mb-1">Notes client</p>
                <p className="text-white">{selectedMeeting.client_notes}</p>
              </div>
            )}

            <div>
              <p className="text-gray-400 text-sm mb-1">Statut</p>
              {getStatusBadge(selectedMeeting.status)}
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Supprimer le rendez-vous"
        >
          <div className="space-y-4">
            <p className="text-gray-300">
              Êtes-vous sûr de vouloir supprimer ce rendez-vous ?
            </p>
            <p className="text-gray-400 text-sm">
              Cette action est irréversible.
            </p>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowDeleteModal(false)}
                variant="secondary"
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                onClick={handleDelete}
                variant="danger"
                className="flex-1"
                disabled={deleteMeeting.isPending}
              >
                {deleteMeeting.isPending ? 'Suppression...' : 'Supprimer'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MeetingsList;
