import React, { useState } from 'react';
import { useConversations, useDeleteConversation, useMarkAsReviewed, useFlagConversation } from '../../hooks/useChatbot';
import { useToast } from '../../hooks/useToast';
import Button from '../common/Button';
import { LoadingSpinner, ErrorMessage } from '../common/LoadingSpinner';
import ConfirmDialog from '../common/ConfirmDialog';
import { MessageSquare, Eye, Flag, Trash2, CheckCircle, AlertTriangle, Filter, Search } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ConversationsTab: React.FC = () => {
  const toast = useToast();
  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [flagId, setFlagId] = useState<string | null>(null);
  const [flagReason, setFlagReason] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'flagged' | 'needs_review'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filters = {
    is_flagged: filterType === 'flagged' ? true : undefined,
    needs_review: filterType === 'needs_review' ? true : undefined,
    search: searchTerm || undefined,
  };

  const { data: conversations, isLoading, error, refetch } = useConversations(filters);
  const deleteMutation = useDeleteConversation();
  const reviewMutation = useMarkAsReviewed();
  const flagMutation = useFlagConversation();

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success('Conversation supprimée !');
      setDeleteId(null);
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleMarkReviewed = async (id: string) => {
    try {
      await reviewMutation.mutateAsync(id);
      toast.success('Marquée comme révisée !');
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const handleFlag = async () => {
    if (!flagId || !flagReason.trim()) return;
    try {
      await flagMutation.mutateAsync({ id: flagId, reason: flagReason });
      toast.success('Conversation signalée !');
      setFlagId(null);
      setFlagReason('');
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  if (isLoading) return <LoadingSpinner size="lg" text="Chargement..." />;
  if (error) return <ErrorMessage title="Erreur" message="Impossible de charger les conversations" onRetry={refetch} />;

  const filteredConvs = conversations || [];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white/5 border border-gray-700/50 rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher dans les messages..."
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-gray-700/50 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-2 bg-white/5 border border-gray-700/50 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">Toutes</option>
            <option value="flagged">Signalées</option>
            <option value="needs_review">À réviser</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-gray-700/50 rounded-xl p-4">
          <p className="text-sm text-gray-400">Total</p>
          <p className="text-2xl font-bold text-white">{filteredConvs.length}</p>
        </div>
        <div className="bg-white/5 border border-gray-700/50 rounded-xl p-4">
          <p className="text-sm text-gray-400">Signalées</p>
          <p className="text-2xl font-bold text-red-400">{filteredConvs.filter(c => c.is_flagged).length}</p>
        </div>
        <div className="bg-white/5 border border-gray-700/50 rounded-xl p-4">
          <p className="text-sm text-gray-400">À réviser</p>
          <p className="text-2xl font-bold text-amber-400">{filteredConvs.filter(c => c.needs_review).length}</p>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredConvs.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
            <p>Aucune conversation</p>
          </div>
        ) : (
          filteredConvs.map((conv) => (
            <div key={conv.id} className="bg-white/5 border border-gray-700/50 rounded-xl p-4">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {conv.is_flagged && <Flag size={16} className="text-red-400" />}
                    {conv.needs_review && <AlertTriangle size={16} className="text-amber-400" />}
                    <span className="text-xs text-gray-500">
                      {format(new Date(conv.created_at), 'PPp', { locale: fr })}
                    </span>
                    {conv.sentiment && (
                      <span className={`text-xs ${getSentimentColor(conv.sentiment)}`}>
                        {conv.sentiment}
                      </span>
                    )}
                  </div>
                  <p className="text-white font-medium mb-1">{conv.message}</p>
                  <p className="text-gray-400 text-sm">{conv.response}</p>
                </div>
                <div className="flex gap-2">
                  {conv.needs_review && (
                    <Button size="sm" variant="primary" icon={<CheckCircle size={16} />} onClick={() => handleMarkReviewed(conv.id)}>
                      Réviser
                    </Button>
                  )}
                  {!conv.is_flagged && (
                    <Button size="sm" variant="secondary" icon={<Flag size={16} />} onClick={() => setFlagId(conv.id)}>
                      Signaler
                    </Button>
                  )}
                  <Button size="sm" variant="danger" icon={<Trash2 size={16} />} onClick={() => setDeleteId(conv.id)} />
                </div>
              </div>
              {conv.confidence_score !== undefined && (
                <div className="text-xs text-gray-500">
                  Confiance: {(conv.confidence_score * 100).toFixed(0)}%
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Flag Dialog */}
      <ConfirmDialog
        isOpen={flagId !== null}
        onClose={() => { setFlagId(null); setFlagReason(''); }}
        onConfirm={handleFlag}
        title="Signaler la conversation"
        message={
          <div>
            <p className="mb-3">Raison du signalement :</p>
            <textarea
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-gray-700/50 rounded-lg text-white focus:border-cyan-500 focus:outline-none resize-none"
              rows={3}
              placeholder="Décrire la raison..."
            />
          </div>
        }
        confirmText="Signaler"
        isLoading={flagMutation.isPending}
      />

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Supprimer la conversation"
        message="Cette action est irréversible."
        confirmText="Supprimer"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default ConversationsTab;
