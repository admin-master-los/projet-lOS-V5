import React from 'react';
import { Loader, AlertCircle } from 'lucide-react';

/**
 * Composant LoadingSpinner
 * Affiche un spinner de chargement animé
 */

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const sizeMap = {
  sm: 24,
  md: 40,
  lg: 56,
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Loader
        size={sizeMap[size]}
        className="animate-spin text-cyan-400"
      />
      {text && <p className="text-gray-400 text-sm">{text}</p>}
    </div>
  );
};

/**
 * Composant ErrorMessage
 * Affiche un message d'erreur stylisé
 */

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Une erreur est survenue',
  message,
  onRetry,
}) => {
  return (
    <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-red-500/20 rounded-full mb-4">
        <AlertCircle size={24} className="text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-red-400 mb-2">{title}</h3>
      <p className="text-gray-300 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
        >
          Réessayer
        </button>
      )}
    </div>
  );
};
