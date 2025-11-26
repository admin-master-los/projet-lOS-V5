import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

/**
 * Modal de confirmation de suppression
 * 
 * Composant réutilisable qui affiche un modal de confirmation avec un message
 * personnalisé avant de supprimer un élément. Ce modal aide à prévenir les
 * suppressions accidentelles en forçant l'utilisateur à confirmer son action.
 * 
 * Utilisation:
 * - Afficher quand l'utilisateur clique sur "Supprimer"
 * - Personnaliser le titre et le message
 * - Gérer la confirmation ou l'annulation
 * - Afficher un état de chargement pendant la suppression
 */

interface DeleteConfirmModalProps {
  isOpen: boolean;           // Contrôle l'affichage du modal
  onClose: () => void;       // Fonction appelée pour fermer le modal
  onConfirm: () => void;     // Fonction appelée pour confirmer la suppression
  title: string;             // Titre du modal
  message: string;           // Message de confirmation à afficher
  isLoading?: boolean;       // État de chargement (suppression en cours)
  confirmText?: string;      // Texte du bouton de confirmation (défaut: "Supprimer")
  cancelText?: string;       // Texte du bouton d'annulation (défaut: "Annuler")
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading = false,
  confirmText = 'Supprimer',
  cancelText = 'Annuler',
}) => {
  // Ne rien afficher si le modal est fermé
  if (!isOpen) return null;

  /**
   * Gère la confirmation de la suppression
   * Empêche la fermeture accidentelle du modal pendant le chargement
   */
  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };

  /**
   * Gère la fermeture du modal
   * Empêche la fermeture pendant le chargement
   */
  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md border border-gray-700 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            {/* Icône d'avertissement */}
            <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
              <AlertTriangle size={20} className="text-red-400" />
            </div>
            {/* Titre */}
            <h2 className="text-xl font-bold text-white">{title}</h2>
          </div>
          {/* Bouton de fermeture */}
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6">
          <p className="text-gray-300 leading-relaxed">{message}</p>
        </div>

        {/* Boutons d'action */}
        <div className="flex items-center gap-3 p-6 border-t border-gray-700 bg-gray-800/50">
          {/* Bouton Annuler */}
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {cancelText}
          </button>

          {/* Bouton Confirmer la suppression */}
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/20 font-medium"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                {/* Spinner de chargement */}
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Suppression...
              </span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
