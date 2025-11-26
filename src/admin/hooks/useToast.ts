import toast from 'react-hot-toast';

/**
 * Hook personnalisé pour les notifications toast
 * Simplifie l'utilisation de react-hot-toast avec des styles prédéfinis
 */

interface ToastOptions {
  duration?: number;
}

export const useToast = () => {
  const success = (message: string, options?: ToastOptions) => {
    toast.success(message, {
      duration: options?.duration || 4000,
      style: {
        background: '#0A0A0B',
        color: '#fff',
        border: '1px solid rgba(16, 185, 129, 0.5)',
        borderRadius: '12px',
        padding: '16px',
      },
      iconTheme: {
        primary: '#10B981',
        secondary: '#fff',
      },
    });
  };

  const error = (message: string, options?: ToastOptions) => {
    toast.error(message, {
      duration: options?.duration || 5000,
      style: {
        background: '#0A0A0B',
        color: '#fff',
        border: '1px solid rgba(239, 68, 68, 0.5)',
        borderRadius: '12px',
        padding: '16px',
      },
      iconTheme: {
        primary: '#EF4444',
        secondary: '#fff',
      },
    });
  };

  const loading = (message: string) => {
    return toast.loading(message, {
      style: {
        background: '#0A0A0B',
        color: '#fff',
        border: '1px solid rgba(107, 114, 128, 0.5)',
        borderRadius: '12px',
        padding: '16px',
      },
    });
  };

  const promise = <T,>(
    promise: Promise<T>,
    {
      loading: loadingMessage,
      success: successMessage,
      error: errorMessage,
    }: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(
      promise,
      {
        loading: loadingMessage,
        success: successMessage,
        error: errorMessage,
      },
      {
        style: {
          background: '#0A0A0B',
          color: '#fff',
          border: '1px solid rgba(107, 114, 128, 0.5)',
          borderRadius: '12px',
          padding: '16px',
        },
      }
    );
  };

  const dismiss = (toastId?: string) => {
    toast.dismiss(toastId);
  };

  return {
    success,
    error,
    loading,
    promise,
    dismiss,
  };
};
