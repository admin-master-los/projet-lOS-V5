import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient';

export interface BlogComment {
  id: string;
  post_id: string;
  parent_id: string | null;
  author_name: string;
  author_email: string;
  author_website?: string;
  content: string;
  status: 'pending' | 'approved' | 'spam' | 'rejected';
  created_at: string;
  updated_at: string;
  replies?: BlogComment[];
  replies_count?: number;
}

export interface CommentFormData {
  post_id: string;
  parent_id?: string | null;
  author_name: string;
  author_email: string;
  author_website?: string;
  content: string;
}

/**
 * Hook pour récupérer les commentaires approuvés d'un article
 */
export const useApprovedComments = (postId: string | null) => {
  return useQuery({
    queryKey: ['approvedComments', postId],
    queryFn: async () => {
      if (!postId) return [];

      const { data, error } = await supabase
        .from('blog_comments')
        .select('*')
        .eq('post_id', postId)
        .eq('status', 'approved')
        .is('parent_id', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Récupérer les réponses pour chaque commentaire
      const commentsWithReplies = await Promise.all(
        (data || []).map(async (comment) => {
          const { data: replies } = await supabase
            .from('blog_comments')
            .select('*')
            .eq('parent_id', comment.id)
            .eq('status', 'approved')
            .order('created_at', { ascending: true });

          return {
            ...comment,
            replies: replies || [],
            replies_count: replies?.length || 0,
          };
        })
      );

      return commentsWithReplies;
    },
    enabled: !!postId,
  });
};

/**
 * Hook pour compter les commentaires approuvés (racine + réponses)
 */
export const useCommentsCount = (postId: string | null) => {
  return useQuery({
    queryKey: ['commentsCount', postId],
    queryFn: async () => {
      if (!postId) return 0;

      // Compter TOUS les commentaires approved (racine + réponses)
      const { count, error } = await supabase
        .from('blog_comments')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId)
        .eq('status', 'approved');

      if (error) throw error;
      return count || 0;
    },
    enabled: !!postId,
  });
};

/**
 * Hook pour soumettre un commentaire
 */
export const useSubmitComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentData: CommentFormData) => {
      // Obtenir l'IP et user agent (optionnel)
      const ipResponse = await fetch('https://api.ipify.org?format=json').catch(() => null);
      const ipData = ipResponse ? await ipResponse.json() : null;

      const { data, error } = await supabase.from('blog_comments').insert({
        ...commentData,
        status: 'pending', // ✅ Commentaires publics en attente de modération
        ip_address: ipData?.ip || null,
        user_agent: navigator.userAgent,
      }).select().single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Invalider les queries de commentaires
      queryClient.invalidateQueries({ queryKey: ['approvedComments', data.post_id] });
      queryClient.invalidateQueries({ queryKey: ['commentsCount', data.post_id] });
      queryClient.invalidateQueries({ queryKey: ['allComments'] });
    },
  });
};

/**
 * Hook pour réponses admin (auto-approuvées avec email)
 */
export const useSubmitAdminReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentData: CommentFormData) => {
      // 1. Insérer la réponse admin (auto-approuvée)
      const { data, error } = await supabase.from('blog_comments').insert({
        ...commentData,
        status: 'approved', // ✅ Réponses admin auto-approuvées
      }).select(`
        *,
        post:blog_posts(title, slug)
      `).single();

      if (error) throw error;

      // 2. Si c'est une réponse (parent_id existe), envoyer email
      if (data.parent_id) {
        try {
          // Récupérer le commentaire parent
          const { data: parentComment, error: parentError } = await supabase
            .from('blog_comments')
            .select('*')
            .eq('id', data.parent_id)
            .single();

          if (parentError) throw parentError;

          if (parentComment) {
            const { sendCommentReplyEmail } = await import('../../services/emailService');
            
            const postUrl = `${window.location.origin}/blog/${data.post.slug}`;
            
            await sendCommentReplyEmail({
              originalAuthorName: parentComment.author_name,
              originalAuthorEmail: parentComment.author_email,
              originalCommentContent: parentComment.content,
              adminName: data.author_name || 'Admin',
              adminReplyContent: data.content,
              postTitle: data.post.title,
              postUrl,
              commentId: parentComment.id,
            });
            
            console.log('✅ Email de réponse envoyé à:', parentComment.author_email);
          }
        } catch (emailError) {
          console.error('⚠️ Erreur envoi email réponse:', emailError);
          // Ne pas bloquer la réponse si l'email échoue
        }
      }

      return data;
    },
    onSuccess: (data) => {
      // Invalider les queries de commentaires
      queryClient.invalidateQueries({ queryKey: ['approvedComments', data.post_id] });
      queryClient.invalidateQueries({ queryKey: ['commentsCount', data.post_id] });
      queryClient.invalidateQueries({ queryKey: ['allComments'] });
    },
  });
};

/**
 * Hook admin pour récupérer tous les commentaires (tous statuts)
 * Inclut les commentaires racine ET toutes les réponses
 */
export const useAllComments = (postId?: string | null) => {
  return useQuery({
    queryKey: ['allComments', postId],
    queryFn: async () => {
      // 1. Récupérer TOUS les commentaires (racine + réponses)
      let query = supabase
        .from('blog_comments')
        .select(`
          *,
          post:blog_posts(title, slug)
        `)
        .order('created_at', { ascending: false });

      if (postId) {
        query = query.eq('post_id', postId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // 2. Organiser en structure hiérarchique
      // Séparer commentaires racine et réponses
      const rootComments = (data || []).filter(comment => !comment.parent_id);
      const replies = (data || []).filter(comment => comment.parent_id);

      // 3. Attacher réponses aux commentaires parents
      const commentsWithReplies = rootComments.map(comment => ({
        ...comment,
        replies: replies.filter(reply => reply.parent_id === comment.id)
      }));

      // 4. Ajouter les réponses orphelines (dont le parent a été supprimé)
      const orphanReplies = replies.filter(reply => 
        !rootComments.some(comment => comment.id === reply.parent_id)
      ).map(reply => ({
        ...reply,
        replies: [] // Les réponses orphelines n'ont pas de sous-réponses
      }));

      // 5. Combiner tout : commentaires racine + réponses orphelines
      return [...commentsWithReplies, ...orphanReplies];
    },
  });
};

/**
 * Hook admin pour modifier le statut d'un commentaire
 */
export const useUpdateCommentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      // 1. Récupérer les données du commentaire et de l'article
      const { data: comment, error: commentError } = await supabase
        .from('blog_comments')
        .select(`
          *,
          post:blog_posts(title, slug)
        `)
        .eq('id', id)
        .single();

      if (commentError) throw commentError;

      // 2. Mettre à jour le status
      const { data, error } = await supabase
        .from('blog_comments')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      console.log('🔄 [UPDATE COMMENT STATUS]', { id, status });
      console.log('   → Comment data:', comment);

      // 3. Si approuvé, envoyer email de notification
      if (status === 'approved' && comment) {
        console.log('✅ Status = approved, tentative envoi email...');
        console.log('   → Author:', comment.author_name);
        console.log('   → Email:', comment.author_email);
        console.log('   → Post:', comment.post?.title || 'N/A');
        
        try {
          const { sendCommentApprovalEmail } = await import('../../services/emailService');
          
          const postUrl = `${window.location.origin}/blog/${comment.post.slug}`;
          
          console.log('📧 Appel sendCommentApprovalEmail...');
          
          const emailSent = await sendCommentApprovalEmail({
            authorName: comment.author_name,
            authorEmail: comment.author_email,
            commentContent: comment.content,
            postTitle: comment.post.title,
            postUrl,
          });
          
          if (emailSent) {
            console.log('✅ Email d\'approbation envoyé à:', comment.author_email);
          } else {
            console.warn('⚠️ Échec envoi email (mais commentaire approuvé)');
          }
        } catch (emailError) {
          console.error('⚠️ Erreur envoi email approbation:', emailError);
          // Ne pas bloquer l'approbation si l'email échoue
        }
      } else {
        console.log('ℹ️ Pas d\'email à envoyer (status:', status, ')');
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['allComments'] });
      queryClient.invalidateQueries({ queryKey: ['approvedComments', data.post_id] });
      queryClient.invalidateQueries({ queryKey: ['commentsCount', data.post_id] });
    },
  });
};

/**
 * Hook admin pour supprimer un commentaire
 */
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('blog_comments').delete().eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allComments'] });
      queryClient.invalidateQueries({ queryKey: ['approvedComments'] });
      queryClient.invalidateQueries({ queryKey: ['commentsCount'] });
      queryClient.invalidateQueries({ queryKey: ['pendingComments'] });
    },
  });
};

/**
 * Hook admin pour modifier le contenu d'un commentaire
 */
export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      const { data, error } = await supabase
        .from('blog_comments')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allComments'] });
      queryClient.invalidateQueries({ queryKey: ['approvedComments'] });
    },
  });
};

/**
 * Hook pour récupérer les commentaires en attente (pending)
 */
export const usePendingComments = () => {
  return useQuery({
    queryKey: ['pendingComments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_comments')
        .select(`
          *,
          post:blog_posts(title, slug)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000, // Refetch toutes les 30 secondes
  });
};

/**
 * Hook pour récupérer les stats des commentaires
 */
export const useCommentsStats = () => {
  return useQuery({
    queryKey: ['commentsStats'],
    queryFn: async () => {
      const { data: all, error: allError } = await supabase
        .from('blog_comments')
        .select('status');

      if (allError) throw allError;

      const stats = {
        total: all?.length || 0,
        pending: all?.filter(c => c.status === 'pending').length || 0,
        approved: all?.filter(c => c.status === 'approved').length || 0,
        spam: all?.filter(c => c.status === 'spam').length || 0,
        rejected: all?.filter(c => c.status === 'rejected').length || 0,
      };

      return stats;
    },
    refetchInterval: 60000, // Refetch toutes les minutes
  });
};
