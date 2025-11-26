import React, { useState } from 'react';
import {
  MessageCircle,
  CheckCircle,
  XCircle,
  Trash2,
  Edit3,
  Reply,
  Clock,
  AlertTriangle,
  Mail,
  Globe,
  FileText,
} from 'lucide-react';
import {
  useAllComments,
  useUpdateCommentStatus,
  useDeleteComment,
  useUpdateComment,
  useSubmitAdminReply,
  useCommentsStats,
  BlogComment,
} from '../hooks/useComments';
import toast from 'react-hot-toast';
import { Modal, Button, Textarea, ConfirmDialog } from '../components/common';

const BlogCommentsAdmin: React.FC = () => {
  const { data: comments, isLoading, error } = useAllComments();
  const { data: stats } = useCommentsStats();
  const updateStatus = useUpdateCommentStatus();
  const deleteComment = useDeleteComment();
  const updateComment = useUpdateComment();
  const submitAdminReply = useSubmitAdminReply();

  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'spam' | 'rejected' | 'replies'>('all');
  const [editingComment, setEditingComment] = useState<BlogComment | null>(null);
  const [editContent, setEditContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<BlogComment | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Gestion des erreurs
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle size={20} />
            <h3 className="font-semibold">Erreur de chargement</h3>
          </div>
          <p className="text-sm text-gray-400 mt-2">{error?.message || 'Impossible de charger les commentaires'}</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement des commentaires...</p>
        </div>
      </div>
    );
  }

  const filteredComments = comments?.filter((comment) => {
    if (filter === 'all') return true;
    if (filter === 'replies') {
      // Afficher UNIQUEMENT les réponses utilisateurs (avec parent_id)
      // Exclure les réponses admin
      return comment.parent_id && comment.author_name !== 'Admin';
    }
    return comment.status === filter;
  });

  const handleApprove = async (id: string) => {
    try {
      await updateStatus.mutateAsync({ id, status: 'approved' });
      toast.success('Commentaire approuvé');
    } catch (error) {
      toast.error('Erreur lors de l\'approbation');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateStatus.mutateAsync({ id, status: 'rejected' });
      toast.success('Commentaire rejeté');
    } catch (error) {
      toast.error('Erreur lors du rejet');
    }
  };

  const handleMarkAsSpam = async (id: string) => {
    try {
      await updateStatus.mutateAsync({ id, status: 'spam' });
      toast.success('Commentaire marqué comme spam');
    } catch (error) {
      toast.error('Erreur lors du marquage');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteComment.mutateAsync(id);
      toast.success('Commentaire supprimé');
      setDeleteConfirm(null);
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleEdit = (comment: BlogComment) => {
    setEditingComment(comment);
    setEditContent(comment.content);
  };

  const handleSaveEdit = async () => {
    if (!editingComment) return;

    try {
      await updateComment.mutateAsync({
        id: editingComment.id,
        content: editContent,
      });
      toast.success('Commentaire modifié');
      setEditingComment(null);
      setEditContent('');
    } catch (error) {
      toast.error('Erreur lors de la modification');
    }
  };

  const handleReply = (comment: BlogComment) => {
    setReplyingTo(comment);
    setReplyContent('');
  };

  const handleSendReply = async () => {
    if (!replyingTo || !replyContent.trim()) {
      toast.error('Veuillez écrire une réponse');
      return;
    }

    try {
      await submitAdminReply.mutateAsync({
        post_id: replyingTo.post_id,
        parent_id: replyingTo.id,
        author_name: 'Admin',
        author_email: 'admin@example.com',
        content: replyContent,
      });
      
      toast.success('Réponse envoyée');
      setReplyingTo(null);
      setReplyContent('');
    } catch (error) {
      toast.error('Erreur lors de l\'envoi');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { label: 'En attente', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
      approved: { label: 'Approuvé', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
      spam: { label: 'Spam', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
      rejected: { label: 'Rejeté', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
    };

    const badge = badges[status as keyof typeof badges] || badges.pending;
    
    return (
      <span className={`px-3 py-1 text-xs font-medium border rounded-full ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-xl">
            <MessageCircle size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Gestion des Commentaires</h1>
            <p className="text-gray-400 mt-1">Modérez les commentaires de votre blog</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
              </div>
              <MessageCircle size={24} className="text-gray-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-400 text-sm">En attente</p>
                <p className="text-2xl font-bold text-yellow-400 mt-1">{stats.pending}</p>
              </div>
              <Clock size={24} className="text-yellow-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm">Approuvés</p>
                <p className="text-2xl font-bold text-green-400 mt-1">{stats.approved}</p>
              </div>
              <CheckCircle size={24} className="text-green-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-400 text-sm">Réponses</p>
                <p className="text-2xl font-bold text-purple-400 mt-1">
                  {comments?.filter(c => c.parent_id && c.author_name !== 'Admin').length || 0}
                </p>
              </div>
              <MessageCircle size={24} className="text-purple-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-400 text-sm">Spam</p>
                <p className="text-2xl font-bold text-red-400 mt-1">{stats.spam}</p>
              </div>
              <AlertTriangle size={24} className="text-red-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-500/10 to-gray-600/10 border border-gray-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Rejetés</p>
                <p className="text-2xl font-bold text-gray-400 mt-1">{stats.rejected}</p>
              </div>
              <XCircle size={24} className="text-gray-400" />
            </div>
          </div>
        </div>
      )}

      {/* Filtres */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'pending', 'approved', 'replies', 'spam', 'rejected'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === status
                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
            }`}
          >
            {status === 'all' && 'Tous'}
            {status === 'pending' && 'En attente'}
            {status === 'approved' && 'Approuvés'}
            {status === 'replies' && '💬 Réponses utilisateurs'}
            {status === 'spam' && 'Spam'}
            {status === 'rejected' && 'Rejetés'}
          </button>
        ))}
      </div>

      {/* Liste commentaires */}
      <div className="space-y-4">
        {filteredComments && filteredComments.length > 0 ? (
          filteredComments.map((comment) => (
            <div
              key={comment.id}
              className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {comment.author_name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-white">{comment.author_name}</h3>
                      {getStatusBadge(comment.status)}
                      {/* Indicateur de réponse */}
                      {comment.parent_id && (
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full border border-purple-500/30">
                          💬 Réponse utilisateur
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-400 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Mail size={14} />
                        {comment.author_email}
                      </span>
                      {comment.author_website && (
                        <span className="flex items-center gap-1">
                          <Globe size={14} />
                          <a href={comment.author_website} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400">
                            Site web
                          </a>
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    {/* @ts-ignore */}
                    {comment.post && (
                      <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                        <FileText size={14} />
                        {/* @ts-ignore */}
                        Sur: <span className="text-cyan-400">{comment.post.title}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-4 p-4 bg-white/5 rounded-lg">
                <p className="text-gray-300 whitespace-pre-wrap">{comment.content}</p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {comment.status !== 'approved' && (
                  <button
                    onClick={() => handleApprove(comment.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors"
                  >
                    <CheckCircle size={16} />
                    Approuver
                  </button>
                )}

                {comment.status === 'approved' && (
                  <button
                    onClick={() => handleReject(comment.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500/20 text-gray-400 border border-gray-500/30 rounded-lg hover:bg-gray-500/30 transition-colors"
                  >
                    <XCircle size={16} />
                    Désapprouver
                  </button>
                )}

                {comment.status !== 'spam' && (
                  <button
                    onClick={() => handleMarkAsSpam(comment.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    <AlertTriangle size={16} />
                    Spam
                  </button>
                )}

                <button
                  onClick={() => handleEdit(comment)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  <Edit3 size={16} />
                  Modifier
                </button>

                <button
                  onClick={() => handleReply(comment)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 transition-colors"
                >
                  <Reply size={16} />
                  Répondre
                </button>

                <button
                  onClick={() => setDeleteConfirm(comment.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors ml-auto"
                >
                  <Trash2 size={16} />
                  Supprimer
                </button>
              </div>

              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 ml-8 space-y-3">
                  <p className="text-sm font-medium text-gray-400">
                    {comment.replies.length} réponse{comment.replies.length > 1 ? 's' : ''}
                  </p>
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="bg-white/5 border border-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-start gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {reply.author_name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-white text-sm">{reply.author_name}</p>
                              {getStatusBadge(reply.status)}
                            </div>
                            <p className="text-xs text-gray-500">{formatDate(reply.created_at)}</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm whitespace-pre-wrap mb-3">{reply.content}</p>
                      
                      {/* Actions modération sur réponse */}
                      <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-gray-700">
                        {reply.status === 'pending' && (
                          <button
                            onClick={() => handleApprove(reply.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors text-xs"
                          >
                            <CheckCircle size={14} />
                            Approuver
                          </button>
                        )}

                        {reply.status === 'approved' && (
                          <button
                            onClick={() => handleReject(reply.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-gray-500/20 text-gray-400 border border-gray-500/30 rounded-lg hover:bg-gray-500/30 transition-colors text-xs"
                          >
                            <XCircle size={14} />
                            Désapprouver
                          </button>
                        )}

                        {reply.status !== 'spam' && (
                          <button
                            onClick={() => handleMarkAsSpam(reply.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors text-xs"
                          >
                            <AlertTriangle size={14} />
                            Spam
                          </button>
                        )}

                        <button
                          onClick={() => handleEdit(reply)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors text-xs"
                        >
                          <Edit3 size={14} />
                          Modifier
                        </button>

                        <button
                          onClick={() => handleReply(reply)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 transition-colors text-xs"
                        >
                          <Reply size={14} />
                          Répondre
                        </button>

                        <button
                          onClick={() => setDeleteConfirm(reply.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors text-xs ml-auto"
                        >
                          <Trash2 size={14} />
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl">
            <MessageCircle size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">Aucun commentaire trouvé</p>
          </div>
        )}
      </div>

      {/* Modal Édition */}
      {editingComment && (
        <Modal isOpen={true} onClose={() => setEditingComment(null)} title="Modifier le commentaire">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Auteur</label>
              <p className="text-white">{editingComment.author_name}</p>
            </div>

            <Textarea
              label="Contenu"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={6}
            />

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setEditingComment(null)}>
                Annuler
              </Button>
              <Button onClick={handleSaveEdit} disabled={updateComment.isPending}>
                {updateComment.isPending ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Réponse */}
      {replyingTo && (
        <Modal isOpen={true} onClose={() => setReplyingTo(null)} title={`Répondre à ${replyingTo.author_name}`}>
          <div className="space-y-4">
            <div className="p-3 bg-white/5 rounded-lg">
              <p className="text-sm text-gray-400 mb-2">Commentaire original:</p>
              <p className="text-gray-300">{replyingTo.content}</p>
            </div>

            <Textarea
              label="Votre réponse"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={5}
              placeholder="Écrivez votre réponse..."
            />

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setReplyingTo(null)}>
                Annuler
              </Button>
              <Button onClick={handleSendReply} disabled={submitAdminReply.isPending}>
                {submitAdminReply.isPending ? 'Envoi...' : 'Envoyer'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirmation Suppression */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="Supprimer le commentaire"
        message="Êtes-vous sûr de vouloir supprimer ce commentaire ? Cette action est irréversible."
        confirmText="Supprimer"
        confirmVariant="danger"
      />
    </div>
  );
};

export default BlogCommentsAdmin;
