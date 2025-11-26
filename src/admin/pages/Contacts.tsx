/**
 * Page: Contacts Admin
 * Liste des messages de contact reçus
 */

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient';
import {
  Mail,
  User,
  Building2,
  DollarSign,
  MessageSquare,
  Calendar,
  Search,
  Eye,
  Trash2,
  Filter,
  X,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  budget: string;
  project: string;
  rgpd_consent: boolean;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

const Contacts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Charger contacts
  const { data: contacts, isLoading, refetch } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact')  // ← Nom correct de la table
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Contact[];
    },
  });

  // Filtrer par recherche
  const filteredContacts = contacts?.filter((contact) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      contact.name.toLowerCase().includes(search) ||
      contact.email.toLowerCase().includes(search) ||
      contact.company.toLowerCase().includes(search) ||
      contact.project.toLowerCase().includes(search)
    );
  });

  // Supprimer contact
  const handleDelete = async () => {
    if (!selectedContact) return;

    try {
      const { error } = await supabase
        .from('contact')  // ← Nom correct
        .delete()
        .eq('id', selectedContact.id);

      if (error) throw error;

      setShowDeleteModal(false);
      setSelectedContact(null);
      refetch();
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
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
        <h1 className="text-3xl font-bold text-white mb-2">Messages de Contact</h1>
        <p className="text-gray-400">
          Gérer les messages reçus via le formulaire de contact
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Messages</p>
              <p className="text-2xl font-bold text-white">{contacts?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Entreprises</p>
              <p className="text-2xl font-bold text-white">
                {contacts?.filter((c) => c.company).length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Budget Moyen</p>
              <p className="text-2xl font-bold text-white">
                {contacts?.length ? '15-30K€' : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, email, entreprise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <p className="text-gray-400 text-sm mt-4">
          {filteredContacts?.length || 0} message(s) trouvé(s)
        </p>
      </div>

      {/* Liste */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden">
        {filteredContacts && filteredContacts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                    Entreprise
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                    Budget
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                    Projet
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(contact.created_at), 'dd/MM/yyyy HH:mm', {
                          locale: fr,
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{contact.name}</p>
                        <p className="text-gray-400 text-sm">{contact.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-300">
                        {contact.company || '-'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400">
                        {contact.budget}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-300 truncate max-w-xs">
                        {contact.project.substring(0, 50)}...
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedContact(contact);
                            setShowDetailModal(true);
                          }}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          title="Voir détails"
                        >
                          <Eye className="w-4 h-4 text-gray-400 hover:text-cyan-400" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedContact(contact);
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
            <p className="text-gray-400">Aucun message trouvé</p>
          </div>
        )}
      </div>

      {/* Modal Détails */}
      {showDetailModal && selectedContact && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Détails du message</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Nom</label>
                <p className="text-white">{selectedContact.name}</p>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">Email</label>
                <a
                  href={`mailto:${selectedContact.email}`}
                  className="text-cyan-400 hover:underline"
                >
                  {selectedContact.email}
                </a>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">Entreprise</label>
                <p className="text-white">{selectedContact.company || '-'}</p>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">Budget</label>
                <p className="text-white">{selectedContact.budget}</p>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">Projet</label>
                <p className="text-white whitespace-pre-wrap">{selectedContact.project}</p>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">Date</label>
                <p className="text-white">
                  {format(new Date(selectedContact.created_at), 'dd MMMM yyyy à HH:mm', {
                    locale: fr,
                  })}
                </p>
              </div>

              {selectedContact.ip_address && (
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">IP</label>
                  <p className="text-white text-sm">{selectedContact.ip_address}</p>
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
      {showDeleteModal && selectedContact && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl border border-white/10 max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Confirmer suppression</h3>
              <p className="text-gray-400 mb-6">
                Voulez-vous vraiment supprimer le message de <strong>{selectedContact.name}</strong> ?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
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

export default Contacts;
