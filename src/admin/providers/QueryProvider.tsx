import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';

/**
 * Configuration de React Query pour l'application admin
 * Gère le cache, les refetch automatiques et les mutations
 */

// Configuration du QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache plus court pour éviter les données obsolètes
      staleTime: 1000 * 30, // 30 secondes au lieu de 5 minutes
      // Garder les données en cache pendant 5 minutes
      gcTime: 1000 * 60 * 5, // 5 minutes au lieu de 10
      // Retry 1 fois en cas d'erreur
      retry: 1,
      // Refetch on window focus (désactivé pour éviter les problèmes)
      refetchOnWindowFocus: false, // ⚠️ Changé de true à false
      // Refetch on reconnect
      refetchOnReconnect: true,
      // Refetch on mount si les données sont stale
      refetchOnMount: true,
    },
    mutations: {
      // Retry 0 fois pour les mutations
      retry: 0,
      // Callback global après succès des mutations
      onSuccess: () => {
        // Invalider toutes les queries après une mutation réussie
        queryClient.invalidateQueries();
      },
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

/**
 * Provider React Query à wrapper autour de l'app admin
 */
export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools uniquement en développement */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};

export { queryClient };
