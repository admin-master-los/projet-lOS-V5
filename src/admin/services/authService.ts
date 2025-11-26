import { supabase } from '../../lib/supabaseClient';
import type { User, Session } from '@supabase/supabase-js';

/**
 * Service d'authentification pour l'interface admin
 * Utilise Supabase Auth pour la gestion des sessions
 */

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: Error | null;
}

/**
 * Connecte un utilisateur avec email et mot de passe
 */
export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      console.error('Erreur de connexion:', error.message);
      return {
        user: null,
        session: null,
        error: new Error(error.message),
      };
    }

    return {
      user: data.user,
      session: data.session,
      error: null,
    };
  } catch (error) {
    console.error('Erreur inattendue lors de la connexion:', error);
    return {
      user: null,
      session: null,
      error: error as Error,
    };
  }
};

/**
 * Déconnecte l'utilisateur actuel
 */
export const logout = async (): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Erreur de déconnexion:', error.message);
      return { error: new Error(error.message) };
    }

    return { error: null };
  } catch (error) {
    console.error('Erreur inattendue lors de la déconnexion:', error);
    return { error: error as Error };
  }
};

/**
 * Récupère la session active
 */
export const getSession = async (): Promise<Session | null> => {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Erreur lors de la récupération de la session:', error.message);
      return null;
    }

    return data.session;
  } catch (error) {
    console.error('Erreur inattendue lors de la récupération de la session:', error);
    return null;
  }
};

/**
 * Récupère l'utilisateur actuel
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error.message);
      return null;
    }

    return data.user;
  } catch (error) {
    console.error('Erreur inattendue lors de la récupération de l\'utilisateur:', error);
    return null;
  }
};

/**
 * Vérifie si l'utilisateur est authentifié
 */
export const checkAuth = async (): Promise<boolean> => {
  const session = await getSession();
  return session !== null;
};

/**
 * Change le mot de passe de l'utilisateur connecté
 */
export const updatePassword = async (
  newPassword: string
): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error('Erreur lors du changement de mot de passe:', error.message);
      return { error: new Error(error.message) };
    }

    return { error: null };
  } catch (error) {
    console.error('Erreur inattendue lors du changement de mot de passe:', error);
    return { error: error as Error };
  }
};

/**
 * Envoie un email de réinitialisation de mot de passe
 */
export const resetPassword = async (
  email: string
): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });

    if (error) {
      console.error('Erreur lors de l\'envoi de l\'email de réinitialisation:', error.message);
      return { error: new Error(error.message) };
    }

    return { error: null };
  } catch (error) {
    console.error('Erreur inattendue lors de la réinitialisation:', error);
    return { error: error as Error };
  }
};

// Export d'un objet groupant tous les services
export const authService = {
  login,
  logout,
  getSession,
  getCurrentUser,
  checkAuth,
  updatePassword,
  resetPassword,
};
