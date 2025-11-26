import { supabase } from '../../lib/supabaseClient';

/**
 * Service pour gérer les paramètres admin et les utilisateurs
 */

// ============================================
// TYPES - ADMIN USERS
// ============================================

export type AdminRole = 'super_admin' | 'admin' | 'editor' | 'viewer';

export interface AdminPermissions {
  blog: boolean;
  services: boolean;
  projects: boolean;
  contacts: boolean;
  meetings: boolean;
  analytics: boolean;
  settings?: boolean;
  users?: boolean;
}

export interface AdminUser {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  phone?: string;
  role: AdminRole;
  permissions: AdminPermissions;
  is_active: boolean;
  is_email_verified: boolean;
  last_login_at?: string;
  bio?: string;
  title?: string;
  department?: string;
  preferences: any;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface CreateAdminUserInput {
  full_name: string;
  email: string;
  password: string;
  role?: AdminRole;
  permissions?: AdminPermissions;
  avatar_url?: string;
  phone?: string;
  title?: string;
  department?: string;
}

export interface UpdateAdminUserInput {
  full_name?: string;
  email?: string;
  avatar_url?: string;
  phone?: string;
  role?: AdminRole;
  permissions?: AdminPermissions;
  is_active?: boolean;
  bio?: string;
  title?: string;
  department?: string;
  preferences?: any;
}

// ============================================
// TYPES - SYSTEM SETTINGS
// ============================================

export type SettingCategory = 'general' | 'email' | 'seo' | 'integrations' | 'security';

export interface SystemSetting {
  id: number;
  key: string;
  value: any;
  category: SettingCategory;
  description?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  updated_by?: string;
}

export interface UpdateSettingInput {
  value: any;
  category?: SettingCategory;
  description?: string;
  is_public?: boolean;
}

// ============================================
// TYPES - ACTIVITY LOGS
// ============================================

export interface AdminActivityLog {
  id: string;
  user_id?: string;
  user_email?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  changes?: any;
  metadata?: any;
  ip_address?: string;
  user_agent?: string;
  status: 'success' | 'failed' | 'pending';
  error_message?: string;
  created_at: string;
}

export interface LogActivityInput {
  action: string;
  resource_type: string;
  resource_id?: string;
  changes?: any;
  metadata?: any;
  status?: 'success' | 'failed' | 'pending';
  error_message?: string;
}

// ============================================
// ADMIN USERS - CRUD
// ============================================

/**
 * Récupère tous les utilisateurs admin
 */
export const getAllAdminUsers = async (): Promise<AdminUser[]> => {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    throw error;
  }
};

/**
 * Récupère un utilisateur par ID
 */
export const getAdminUserById = async (id: string): Promise<AdminUser | null> => {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'utilisateur ${id}:`, error);
    throw error;
  }
};

/**
 * Récupère l'utilisateur connecté
 */
export const getCurrentAdminUser = async (): Promise<AdminUser | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    return getAdminUserById(user.id);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur courant:', error);
    throw error;
  }
};

/**
 * Crée un nouvel utilisateur admin
 */
export const createAdminUser = async (input: CreateAdminUserInput): Promise<AdminUser> => {
  try {
    // 1. Créer l'utilisateur dans auth.users via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: input.email,
      password: input.password,
      email_confirm: true,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Utilisateur non créé');

    // 2. Créer le profil admin
    const { data: { user: currentUser } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('admin_users')
      .insert({
        id: authData.user.id,
        full_name: input.full_name,
        email: input.email,
        avatar_url: input.avatar_url,
        phone: input.phone,
        role: input.role || 'editor',
        permissions: input.permissions || {
          blog: true,
          services: true,
          projects: true,
          contacts: true,
          meetings: true,
          analytics: true,
        },
        title: input.title,
        department: input.department,
        is_active: true,
        created_by: currentUser?.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    throw error;
  }
};

/**
 * Met à jour un utilisateur admin
 */
export const updateAdminUser = async (
  id: string,
  input: UpdateAdminUserInput
): Promise<AdminUser> => {
  try {
    const { data: { user: currentUser } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('admin_users')
      .update({
        ...input,
        updated_at: new Date().toISOString(),
        updated_by: currentUser?.id,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Si l'email est modifié, mettre à jour aussi dans auth.users
    if (input.email) {
      await supabase.auth.admin.updateUserById(id, {
        email: input.email,
      });
    }

    return data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de l'utilisateur ${id}:`, error);
    throw error;
  }
};

/**
 * Supprime un utilisateur admin
 */
export const deleteAdminUser = async (id: string): Promise<void> => {
  try {
    // Supprimer de auth.users (CASCADE supprimera aussi de admin_users)
    const { error } = await supabase.auth.admin.deleteUser(id);
    if (error) throw error;
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'utilisateur ${id}:`, error);
    throw error;
  }
};

/**
 * Active/désactive un utilisateur
 */
export const toggleAdminUserActive = async (id: string): Promise<AdminUser> => {
  try {
    const user = await getAdminUserById(id);
    if (!user) throw new Error('Utilisateur non trouvé');

    return updateAdminUser(id, { is_active: !user.is_active });
  } catch (error) {
    console.error(`Erreur lors du toggle de l'utilisateur ${id}:`, error);
    throw error;
  }
};

/**
 * Change le mot de passe d'un utilisateur
 */
export const changeAdminUserPassword = async (
  userId: string,
  newPassword: string
): Promise<void> => {
  try {
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      password: newPassword,
    });

    if (error) throw error;
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error);
    throw error;
  }
};

// ============================================
// SYSTEM SETTINGS - CRUD
// ============================================

/**
 * Récupère tous les paramètres
 */
export const getAllSettings = async (): Promise<SystemSetting[]> => {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .order('category', { ascending: true })
      .order('key', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres:', error);
    throw error;
  }
};

/**
 * Récupère les paramètres par catégorie
 */
export const getSettingsByCategory = async (
  category: SettingCategory
): Promise<SystemSetting[]> => {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .eq('category', category)
      .order('key', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Erreur lors de la récupération des paramètres ${category}:`, error);
    throw error;
  }
};

/**
 * Récupère un paramètre par clé
 */
export const getSettingByKey = async (key: string): Promise<SystemSetting | null> => {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .eq('key', key)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du paramètre ${key}:`, error);
    throw error;
  }
};

/**
 * Met à jour un paramètre
 */
export const updateSetting = async (
  key: string,
  input: UpdateSettingInput
): Promise<SystemSetting> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('system_settings')
      .update({
        ...input,
        updated_at: new Date().toISOString(),
        updated_by: user?.id,
      })
      .eq('key', key)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du paramètre ${key}:`, error);
    throw error;
  }
};

/**
 * Met à jour plusieurs paramètres en une fois
 */
export const updateMultipleSettings = async (
  settings: Record<string, any>
): Promise<void> => {
  try {
    const updates = Object.entries(settings).map(([key, value]) =>
      updateSetting(key, { value })
    );

    await Promise.all(updates);
  } catch (error) {
    console.error('Erreur lors de la mise à jour multiple des paramètres:', error);
    throw error;
  }
};

// ============================================
// ACTIVITY LOGS
// ============================================

/**
 * Récupère les logs d'activité
 */
export const getActivityLogs = async (
  limit: number = 100,
  userId?: string
): Promise<AdminActivityLog[]> => {
  try {
    let query = supabase
      .from('admin_activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des logs:', error);
    throw error;
  }
};

/**
 * Log une activité admin
 */
export const logActivity = async (input: LogActivityInput): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    await supabase
      .from('admin_activity_logs')
      .insert({
        user_id: user?.id,
        user_email: user?.email,
        ...input,
        status: input.status || 'success',
      });
  } catch (error) {
    // Ne pas throw pour ne pas bloquer l'action principale
    console.error('Erreur lors du logging de l\'activité:', error);
  }
};

// ============================================
// STATISTIQUES
// ============================================

/**
 * Récupère les statistiques des utilisateurs
 */
export const getAdminUsersStats = async () => {
  try {
    const users = await getAllAdminUsers();

    return {
      total: users.length,
      active: users.filter(u => u.is_active).length,
      by_role: {
        super_admin: users.filter(u => u.role === 'super_admin').length,
        admin: users.filter(u => u.role === 'admin').length,
        editor: users.filter(u => u.role === 'editor').length,
        viewer: users.filter(u => u.role === 'viewer').length,
      },
    };
  } catch (error) {
    console.error('Erreur lors du calcul des stats utilisateurs:', error);
    throw error;
  }
};
