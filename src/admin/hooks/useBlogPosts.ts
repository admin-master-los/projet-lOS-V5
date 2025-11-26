import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient';

/**
 * Hooks React Query pour gérer les articles de blog
 */

// ============================================
// TYPES
// ============================================

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featured_image: string;
  author: string;
  category_id: string;
  category_name?: string;
  category_slug?: string;
  category_color?: string;
  category_icon?: string;
  tags: string[];
  status: 'draft' | 'published';
  views: number;
  reading_time: number;
  meta_title: string;
  meta_description: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPostCreateInput {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featured_image: string;
  author?: string;
  category_id: string;
  tags: string[];
  status: 'draft' | 'published';
  reading_time?: number;
  meta_title?: string;
  meta_description?: string;
  published_at?: string;
}

export interface BlogPostUpdateInput {
  slug?: string;
  title?: string;
  excerpt?: string;
  content?: string;
  featured_image?: string;
  category_id?: string;
  tags?: string[];
  status?: 'draft' | 'published';
  reading_time?: number;
  meta_title?: string;
  meta_description?: string;
  published_at?: string;
}

// ============================================
// SERVICES
// ============================================

const getAllBlogPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      category:blog_categories (
        name,
        slug,
        color,
        icon
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map((post: any) => ({
    ...post,
    category_name: post.category?.name,
    category_slug: post.category?.slug,
    category_color: post.category?.color,
    category_icon: post.category?.icon,
  }));
};

const getPublishedBlogPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      category:blog_categories (
        name,
        slug,
        color,
        icon
      )
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) throw error;

  return (data || []).map((post: any) => ({
    ...post,
    category_name: post.category?.name,
    category_slug: post.category?.slug,
    category_color: post.category?.color,
    category_icon: post.category?.icon,
  }));
};

const getBlogPostById = async (id: string): Promise<BlogPost | null> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      category:blog_categories (
        name,
        slug,
        color,
        icon
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  if (!data) return null;

  return {
    ...data,
    category_name: data.category?.name,
    category_slug: data.category?.slug,
    category_color: data.category?.color,
    category_icon: data.category?.icon,
  };
};

const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      category:blog_categories (
        name,
        slug,
        color,
        icon
      )
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) throw error;
  if (!data) return null;

  return {
    ...data,
    category_name: data.category?.name,
    category_slug: data.category?.slug,
    category_color: data.category?.color,
    category_icon: data.category?.icon,
  };
};

const createBlogPost = async (postData: BlogPostCreateInput): Promise<BlogPost> => {
  if (!postData.reading_time && postData.content) {
    postData.reading_time = calculateReadingTime(postData.content);
  }

  if (postData.status === 'published' && !postData.published_at) {
    postData.published_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .insert(postData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

const updateBlogPost = async (
  id: string,
  postData: BlogPostUpdateInput
): Promise<BlogPost> => {
  if (postData.content) {
    postData.reading_time = calculateReadingTime(postData.content);
  }

  if (postData.status === 'published') {
    const { data: currentPost } = await supabase
      .from('blog_posts')
      .select('status, published_at')
      .eq('id', id)
      .single();

    if (currentPost?.status === 'draft' && !currentPost.published_at) {
      postData.published_at = new Date().toISOString();
    }
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .update(postData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

const deleteBlogPost = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

const incrementViews = async (id: string): Promise<void> => {
  const { data: post } = await supabase
    .from('blog_posts')
    .select('views')
    .eq('id', id)
    .single();

  if (post) {
    await supabase
      .from('blog_posts')
      .update({ views: (post.views || 0) + 1 })
      .eq('id', id);
  }
};

function calculateReadingTime(htmlContent: string): number {
  const text = htmlContent.replace(/<[^>]*>/g, '');
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(wordCount / 200));
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// ============================================
// HOOKS REACT QUERY
// ============================================

export const useBlogPosts = () => {
  return useQuery({
    queryKey: ['blog-posts'],
    queryFn: getAllBlogPosts,
    staleTime: 1000 * 60 * 5,
  });
};

export const usePublishedBlogPosts = () => {
  return useQuery({
    queryKey: ['blog-posts', 'published'],
    queryFn: getPublishedBlogPosts,
    staleTime: 1000 * 60 * 10,
  });
};

export const useBlogPost = (id: string | null) => {
  return useQuery({
    queryKey: ['blog-posts', id],
    queryFn: () => (id ? getBlogPostById(id) : null),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useBlogPostBySlug = (slug: string | null) => {
  return useQuery({
    queryKey: ['blog-posts', 'slug', slug],
    queryFn: () => (slug ? getBlogPostBySlug(slug) : null),
    enabled: !!slug,
    staleTime: 1000 * 60 * 10,
  });
};

export const useCreateBlogPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    },
  });
};

export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: BlogPostUpdateInput }) =>
      updateBlogPost(id, data),
    onSuccess: (updatedPost) => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog-posts', updatedPost.id] });
      queryClient.invalidateQueries({ queryKey: ['blog-posts', 'slug', updatedPost.slug] });
    },
  });
};

export const useDeleteBlogPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    },
  });
};

export const usePublishBlogPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      updateBlogPost(id, {
        status: 'published',
        published_at: new Date().toISOString(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    },
  });
};

export const useUnpublishBlogPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      updateBlogPost(id, {
        status: 'draft',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    },
  });
};

export const useIncrementViews = () => {
  return useMutation({
    mutationFn: incrementViews,
  });
};

/**
 * Hook pour récupérer les articles similaires
 * Basé sur la catégorie et les tags en commun
 */
export const useSimilarPosts = (currentPostId: string | null, categoryId: string | null, tags: string[] = []) => {
  return useQuery({
    queryKey: ['similarPosts', currentPostId, categoryId, tags],
    queryFn: async () => {
      if (!currentPostId) return [];

      // Récupérer les articles de la même catégorie (max 6 pour filtrer ensuite)
      let query = supabase
        .from('published_blog_posts')
        .select('*')
        .neq('id', currentPostId)
        .eq('status', 'published')
        .limit(6);

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Si on a des tags, trier par pertinence (nombre de tags communs)
      if (tags.length > 0 && data) {
        const postsWithScore = data.map((post: any) => {
          const commonTags = post.tags?.filter((tag: string) => tags.includes(tag)) || [];
          return {
            ...post,
            score: commonTags.length,
          };
        });

        // Trier par score décroissant puis prendre les 3 meilleurs
        postsWithScore.sort((a, b) => b.score - a.score);
        return postsWithScore.slice(0, 3);
      }

      return (data || []).slice(0, 3);
    },
    enabled: !!currentPostId,
  });
};
