import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { authService, type LoginCredentials } from '../services/authService';
import type { User, Session } from '@supabase/supabase-js';

/**
 * Context d'authentification pour l'admin
 */

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider d'authentification
 * À wrapper autour de l'application admin
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Initialise la session au chargement
   */
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const initAuth = async () => {
      try {
        // Timeout de sécurité : si après 5 secondes rien ne se passe, on arrête le loading
        timeoutId = setTimeout(() => {
          console.warn('⚠️ Timeout de vérification de session, arrêt du loading');
          setLoading(false);
        }, 5000);

        // Récupérer la session existante
        const currentSession = await authService.getSession();
        setSession(currentSession);

        if (currentSession) {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        }
        
        // Si tout s'est bien passé, annuler le timeout
        clearTimeout(timeoutId);
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'auth:', error);
        clearTimeout(timeoutId);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      console.log('🔐 État auth changé:', _event, currentSession ? 'Session active' : 'Pas de session');
      
      setSession(currentSession);

      if (currentSession) {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Fonction de connexion
   */
  const login = async (
    credentials: LoginCredentials
  ): Promise<{ error: Error | null }> => {
    setLoading(true);
    try {
      const { user: authUser, session: authSession, error } = await authService.login(
        credentials
      );

      if (error) {
        return { error };
      }

      setUser(authUser);
      setSession(authSession);
      return { error: null };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fonction de déconnexion
   */
  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Rafraîchit la session
   */
  const refreshSession = async (): Promise<void> => {
    try {
      const currentSession = await authService.getSession();
      setSession(currentSession);

      if (currentSession) {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement de la session:', error);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    isAuthenticated: !!session && !!user,
    login,
    logout,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook pour utiliser le context d'authentification
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }

  return context;
};
