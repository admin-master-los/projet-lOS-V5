import React, { useState } from 'react';
import { MessageCircle, Send, User, Mail, Globe, Clock, Reply, Check, AlertCircle, ChevronUp } from 'lucide-react';
import { useApprovedComments, useCommentsCount, useSubmitComment } from '../admin/hooks/useComments';
import toast from 'react-hot-toast';

interface BlogCommentsProps {
  postId: string;
}

const BlogComments: React.FC<BlogCommentsProps> = ({ postId }) => {
  const { data: comments, isLoading } = useApprovedComments(postId);
  const { data: commentsCount } = useCommentsCount(postId);
  const submitComment = useSubmitComment();

  const [formData, setFormData] = useState({
    author_name: '',
    author_email: '',
    author_website: '',
    content: '',
  });

  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submittedComment, setSubmittedComment] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.author_name || !formData.author_email || !formData.content) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.author_email)) {
      toast.error('Veuillez entrer une adresse email valide');
      return;
    }

    try {
      await submitComment.mutateAsync({
        post_id: postId,
        parent_id: replyTo?.id || null,
        ...formData,
      });

      setSubmittedComment({
        author_name: formData.author_name,
        content: formData.content,
        created_at: new Date().toISOString(),
        status: 'pending',
      });

      setFormData({
        author_name: '',
        author_email: '',
        author_website: '',
        content: '',
      });
      setReplyTo(null);
      setShowSuccessMessage(true);
      setShowForm(false);

      setTimeout(() => setShowSuccessMessage(false), 5000);
    } catch (error: any) {
      console.error('Comment submission error:', error);
      const errorMessage = error?.message || 'Erreur lors de l\'envoi du commentaire';
      toast.error(errorMessage);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return hours === 0 ? 'À l\'instant' : `Il y a ${hours}h`;
    } else if (diffInHours < 48) {
      return 'Hier';
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="mt-16 pt-8 border-t border-gray-700/50">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <MessageCircle size={28} className="text-cyan-400" />
          <h3 className="text-2xl font-bold text-white">
            Commentaire{(commentsCount || 0) > 1 ? 's' : ''} ({commentsCount || 0})
          </h3>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
          >
            <Send size={18} />
            Publier un commentaire
          </button>
        )}
      </div>

      {showSuccessMessage && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-start gap-3">
          <Check size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-green-400 font-medium">Commentaire envoyé avec succès !</p>
            <p className="text-sm text-gray-400 mt-1">
              Votre commentaire est en attente de modération.
            </p>
          </div>
        </div>
      )}

      {submittedComment && (
        <div className="mb-8 p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
          <div className="flex items-start gap-2 mb-3">
            <AlertCircle size={20} className="text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-400 font-medium">Votre commentaire est en attente de modération</p>
              <p className="text-sm text-gray-400 mt-1">{formatDate(submittedComment.created_at)}</p>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {getInitials(submittedComment.author_name)}
              </div>
              <span className="font-semibold text-white">{submittedComment.author_name}</span>
            </div>
            <p className="text-gray-300 whitespace-pre-wrap">{submittedComment.content}</p>
          </div>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-12 p-6 bg-white/5 border border-gray-700/50 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-white">Ajouter un commentaire</h4>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ChevronUp size={24} />
            </button>
          </div>

          {replyTo && (
            <div className="mb-4 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-cyan-400">
                <Reply size={16} />
                <span>En réponse à <strong>{replyTo.name}</strong></span>
              </div>
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          )}

          <p className="text-sm text-gray-400 mb-4">
            Votre adresse email ne sera pas publiée.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nom <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  required
                  value={formData.author_name}
                  onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                  placeholder="Votre nom"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  required
                  value={formData.author_email}
                  onChange={(e) => setFormData({ ...formData, author_email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                  placeholder="votre@email.com"
                />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Site web <span className="text-gray-500">(optionnel)</span>
            </label>
            <div className="relative">
              <Globe size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="url"
                value={formData.author_website}
                onChange={(e) => setFormData({ ...formData, author_website: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                placeholder="https://votresite.com"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Commentaire <span className="text-red-400">*</span>
            </label>
            <textarea
              required
              rows={5}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 resize-none"
              placeholder="Écrivez votre commentaire..."
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <AlertCircle size={16} />
              Votre commentaire sera modéré avant publication
            </p>
            <button
              type="submit"
              disabled={submitComment.isPending}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50"
            >
              {submitComment.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Envoi...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Publier
                </>
              )}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="group">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {getInitials(comment.author_name)}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="bg-white/5 border border-gray-700/50 rounded-xl p-4 group-hover:border-gray-600/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-white">{comment.author_name}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <Clock size={14} />
                          {formatDate(comment.created_at)}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setReplyTo({ id: comment.id, name: comment.author_name });
                          setShowForm(true);
                        }}
                        className="flex items-center gap-1 text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                      >
                        <Reply size={16} />
                        Répondre
                      </button>
                    </div>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                  </div>

                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 ml-8 space-y-4">
                      {comment.replies.map((reply: any) => (
                        <div key={reply.id} className="flex gap-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                              {getInitials(reply.author_name)}
                            </div>
                          </div>
                          <div className="flex-1 bg-white/5 border border-gray-700/50 rounded-xl p-4">
                            <div className="mb-2">
                              <h5 className="font-medium text-white text-sm">{reply.author_name}</h5>
                              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                <Clock size={12} />
                                {formatDate(reply.created_at)}
                              </div>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                              {reply.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <MessageCircle size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">Aucun commentaire pour le moment.</p>
            <p className="text-sm text-gray-500 mt-2">Soyez le premier à commenter !</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogComments;
