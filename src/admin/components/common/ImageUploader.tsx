import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, Check } from 'lucide-react';
import { imageUploadService, UploadOptions } from '../../services/imageUploadService';

/**
 * Composant ImageUploader - Upload d'images avec drag & drop
 * 
 * Fonctionnalités :
 * - Drag & drop ou clic pour sélectionner
 * - Prévisualisation en temps réel
 * - Barre de progression
 * - Compression automatique
 * - Validation de type et taille
 * - Remplacement d'image existante
 * 
 * Réutilisable pour : Secteurs, Services, Projets, Blog, Avatars
 */

// ============================================================================
// TYPES
// ============================================================================

interface ImageUploaderProps {
  // Valeur actuelle (URL de l'image)
  value: string;
  
  // Callback appelé quand l'image change
  onChange: (imageUrl: string) => void;
  
  // Dossier de destination dans le bucket
  folder: 'sectors' | 'services' | 'projects' | 'blog' | 'avatars';
  
  // Label du champ
  label?: string;
  
  // Texte d'aide
  helpText?: string;
  
  // Est-ce un champ requis ?
  required?: boolean;
  
  // Options d'upload personnalisées
  uploadOptions?: Partial<UploadOptions>;
  
  // Taille de la prévisualisation (en hauteur)
  previewHeight?: string;
}

// ============================================================================
// COMPOSANT
// ============================================================================

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  folder,
  label = 'Image',
  helpText,
  required = false,
  uploadOptions = {},
  previewHeight = 'h-48',
}) => {
  // États
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Référence pour l'input file
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  /**
   * Gère l'upload d'un fichier
   */
  const handleFileUpload = async (file: File) => {
    try {
      setError(null);
      setIsUploading(true);
      setUploadProgress(0);
      setUploadSuccess(false);

      // Animation de progression (simulation)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Options d'upload avec valeurs par défaut
      const options: UploadOptions = {
        folder,
        maxSizeMB: 5,
        quality: 0.85,
        maxWidthPx: 1920,
        ...uploadOptions,
      };

      // Upload via le service
      const result = await imageUploadService.replace(file, value || null, options);

      clearInterval(progressInterval);

      if (result.success && result.publicUrl) {
        setUploadProgress(100);
        setUploadSuccess(true);
        onChange(result.publicUrl);

        // Réinitialiser après 2 secondes
        setTimeout(() => {
          setUploadSuccess(false);
          setIsUploading(false);
          setUploadProgress(0);
        }, 2000);
      } else {
        throw new Error(result.error || 'Erreur lors de l\'upload');
      }
    } catch (err: any) {
      console.error('Erreur upload:', err);
      setError(err.message || 'Erreur lors de l\'upload de l\'image');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  /**
   * Gère le changement de fichier via input
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  /**
   * Gère le drag over
   */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  /**
   * Gère le drag leave
   */
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  /**
   * Gère le drop de fichier
   */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      // Valider que c'est une image
      if (file.type.startsWith('image/')) {
        handleFileUpload(file);
      } else {
        setError('Le fichier doit être une image');
      }
    }
  };

  /**
   * Ouvre le sélecteur de fichier
   */
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * Supprime l'image actuelle
   */
  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
      // Note: On ne supprime pas du storage ici, juste du formulaire
      // L'ancienne image sera supprimée lors de l'upload d'une nouvelle
      onChange('');
      setError(null);
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-2">
      {/* Label */}
      <label className="block text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
        {helpText && (
          <span className="text-xs text-gray-500 ml-2 font-normal">
            {helpText}
          </span>
        )}
      </label>

      {/* Zone d'upload ou prévisualisation */}
      <div
        onClick={!value && !isUploading ? handleClick : undefined}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative rounded-lg border-2 border-dashed transition-all cursor-pointer
          ${previewHeight}
          ${isDragging
            ? 'border-pink-500 bg-pink-500/10'
            : value
            ? 'border-gray-600'
            : 'border-gray-600 hover:border-pink-500/50 bg-gray-700/30'
          }
          ${isUploading ? 'pointer-events-none' : ''}
        `}
      >
        {/* Input file caché */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* État : Pas d'image */}
        {!value && !isUploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <Upload className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-sm text-gray-300 font-medium mb-1">
              Glissez une image ici ou cliquez pour sélectionner
            </p>
            <p className="text-xs text-gray-500">
              JPG, PNG, WebP, GIF (max. 5MB)
            </p>
          </div>
        )}

        {/* État : Upload en cours */}
        {isUploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm">
            {!uploadSuccess ? (
              <>
                <Loader2 className="w-12 h-12 text-pink-500 animate-spin mb-3" />
                <p className="text-sm text-gray-300 font-medium mb-2">
                  Upload en cours...
                </p>
                <div className="w-full max-w-xs bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-purple-500 h-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">{uploadProgress}%</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-3">
                  <Check className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-green-400 font-medium">
                  Upload réussi !
                </p>
              </>
            )}
          </div>
        )}

        {/* État : Image uploadée */}
        {value && !isUploading && (
          <div className="relative w-full h-full group">
            <img
              src={value}
              alt="Prévisualisation"
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.src =
                  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23374151" width="100" height="100"/%3E%3Ctext fill="%239CA3AF" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImage invalide%3C/text%3E%3C/svg%3E';
              }}
            />

            {/* Overlay avec actions au survol */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 rounded-lg">
              {/* Bouton changer */}
              <button
                type="button"
                onClick={handleClick}
                className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Changer
              </button>

              {/* Bouton supprimer */}
              <button
                type="button"
                onClick={handleRemove}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Supprimer
              </button>
            </div>

            {/* Badge "Optimisée" */}
            <div className="absolute top-2 left-2 px-2 py-1 bg-green-500/90 backdrop-blur-sm rounded text-xs text-white font-medium flex items-center gap-1">
              <Check className="w-3 h-3" />
              Optimisée
            </div>
          </div>
        )}
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
          <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-red-400 font-medium">Erreur</p>
            <p className="text-xs text-red-300 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Informations complémentaires */}
      {!error && value && !isUploading && (
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <ImageIcon className="w-4 h-4" />
          <span>Image optimisée et hébergée sur votre serveur</span>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
