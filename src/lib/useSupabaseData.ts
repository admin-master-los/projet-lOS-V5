import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

// ✨ Types pour la table contact
export interface ContactData {
  id: string;
  name: string;
  email: string;
  company: string;
  budget: string;
  project: string;
  rgpd_consent: boolean;
  created_at: string;
  updated_at: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  admin_notes: string | null;
  ip_address: string | null;
  user_agent: string | null;
}

export interface ContactFormData {
  name: string;
  email: string;
  company: string;
  budget: string;
  project: string;
  rgpd_consent: boolean;
  ip_address?: string;
  user_agent?: string;
}

// ========================================
// HOOKS EXISTANTS
// ========================================

export function useNavigation() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: result, error: err } = await supabase
          .from('navigation')
          .select('*')
          .order('order');

        if (err) throw err;
        setData(result || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, loading, error };
}

export function useServices() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: result, error: err } = await supabase
          .from('services')
          .select('*')
          .order('id');

        if (err) throw err;
        setData(result || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, loading, error };
}

export function useSectors() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: result, error: err } = await supabase
          .from('sectors')
          .select('*')
          .order('id');

        if (err) throw err;
        setData(result || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, loading, error };
}

export function useProjects() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: result, error: err } = await supabase
          .from('projects')
          .select('*')
          .order('id');

        if (err) throw err;
        setData(result || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, loading, error };
}

export function useBlogPosts() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Récupérer uniquement les articles publiés avec leurs catégories
        const { data: result, error: err } = await supabase
          .from('blog_posts')
          .select(`
            *,
            category:blog_categories(
              id,
              name,
              slug,
              color,
              icon
            )
          `)
          .eq('status', 'published')
          .order('published_at', { ascending: false });

        if (err) throw err;
        
        // Adapter les données au format attendu par Blog.tsx
        const adaptedData = (result || []).map((post: any) => ({
          ...post,
          // Compatibilité ancien format
          category: post.category?.name || 'Non catégorisé',
          date: post.published_at,
          read_time: `${post.reading_time} min`,
          image: post.featured_image,
          content_blog: post.content,
          // Ajouter les infos catégorie pour accès direct
          category_name: post.category?.name,
          category_color: post.category?.color,
          category_icon: post.category?.icon,
        }));
        
        setData(adaptedData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, loading, error };
}

export function useChatbotKnowledge() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: result, error: err } = await supabase
          .from('chatbot_knowledge')
          .select('*')
          .order('id');

        if (err) throw err;
        setData(result || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, loading, error };
}

export function useSkills() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: result, error: err } = await supabase
          .from('skills')
          .select('*')
          .order('id');

        if (err) throw err;
        setData(result || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, loading, error };
}

// ========================================
// ✨ NOUVEAU : HOOK POUR LA TABLE CONTACT
// ========================================

/**
 * Hook pour récupérer toutes les demandes de contact (admin)
 * Utilisé pour le dashboard administrateur
 */
export function useContacts() {
  const [data, setData] = useState<ContactData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: result, error: err } = await supabase
          .from('contact')
          .select('*')
          .order('created_at', { ascending: false });

        if (err) throw err;
        setData(result || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, loading, error };
}

/**
 * Hook pour récupérer une demande de contact par ID (admin)
 */
export function useContactById(id: string | null) {
  const [data, setData] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        const { data: result, error: err } = await supabase
          .from('contact')
          .select('*')
          .eq('id', id)
          .single();

        if (err) throw err;
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  return { data, loading, error };
}

/**
 * Hook pour récupérer les statistiques des demandes de contact (admin)
 */
export function useContactStats() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data: result, error: err } = await supabase
          .from('contact')
          .select('status');

        if (err) throw err;

        const counts = (result || []).reduce(
          (acc, contact) => {
            acc.total++;
            acc[contact.status]++;
            return acc;
          },
          {
            total: 0,
            pending: 0,
            in_progress: 0,
            completed: 0,
            cancelled: 0,
          }
        );

        setStats(counts);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, loading, error };
}

// ========================================
// ✨ FONCTIONS UTILITAIRES POUR CONTACT
// ========================================

/**
 * Soumet une demande de contact depuis le formulaire
 */
export async function submitContactForm(formData: ContactFormData): Promise<ContactData> {
  const { data, error } = await supabase
    .from('contact')
    .insert([
      {
        name: formData.name,
        email: formData.email,
        company: formData.company,
        budget: formData.budget,
        project: formData.project,
        rgpd_consent: formData.rgpd_consent,
        status: 'pending',
        ip_address: formData.ip_address || null,
        user_agent: formData.user_agent || null,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Erreur lors de la soumission du formulaire:', error);
    throw error;
  }

  return data;
}

/**
 * Met à jour le statut d'une demande de contact (admin)
 */
export async function updateContactStatus(
  id: string,
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled',
  adminNotes?: string
): Promise<ContactData> {
  const updateData: any = { status };
  if (adminNotes !== undefined) {
    updateData.admin_notes = adminNotes;
  }

  const { data, error } = await supabase
    .from('contact')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Erreur lors de la mise à jour du contact ${id}:`, error);
    throw error;
  }

  return data;
}

/**
 * Supprime une demande de contact (admin)
 */
export async function deleteContact(id: string): Promise<void> {
  const { error } = await supabase.from('contact').delete().eq('id', id);

  if (error) {
    console.error(`Erreur lors de la suppression du contact ${id}:`, error);
    throw error;
  }
}