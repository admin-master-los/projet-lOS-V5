import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient';

/**
 * Hooks React Query pour gérer les catégories de blog
 */

// ============================================
// TYPES
// ============================================

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  created_at: string;
}

export interface BlogCategoryCreateInput {
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface BlogCategoryUpdateInput {
  name?: string;
  slug?: string;
  description?: string;
  color?: string;
  icon?: string;
}

// ============================================
// SERVICES
// ============================================

const getAllCategories = async (): Promise<BlogCategory[]> => {
  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
};

const getCategoryById = async (id: string): Promise<BlogCategory | null> => {
  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

const createCategory = async (
  categoryData: BlogCategoryCreateInput
): Promise<BlogCategory> => {
  const { data, error } = await supabase
    .from('blog_categories')
    .insert(categoryData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

const updateCategory = async (
  id: string,
  categoryData: BlogCategoryUpdateInput
): Promise<BlogCategory> => {
  const { data, error } = await supabase
    .from('blog_categories')
    .update(categoryData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

const deleteCategory = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('blog_categories')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// ============================================
// HOOKS
// ============================================

export const useBlogCategories = () => {
  return useQuery({
    queryKey: ['blog-categories'],
    queryFn: getAllCategories,
    staleTime: 1000 * 60 * 10,
  });
};

export const useBlogCategory = (id: string | null) => {
  return useQuery({
    queryKey: ['blog-categories', id],
    queryFn: () => (id ? getCategoryById(id) : null),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });
};

export const useCreateBlogCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
    },
  });
};

export const useUpdateBlogCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: BlogCategoryUpdateInput }) =>
      updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
    },
  });
};

export const useDeleteBlogCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
    },
  });
};
