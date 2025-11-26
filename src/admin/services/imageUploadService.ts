import { supabase } from '../../lib/supabaseClient';

/**
 * Service de gestion des uploads d'images vers Supabase Storage
 * 
 * Fonctionnalités :
 * - Upload d'images avec compression automatique
 * - Génération de noms uniques
 * - Support du drag & drop
 * - Validation de type et taille
 * - Suppression d'anciennes images
 * - Gestion d'erreurs
 */

// ============================================================================
// TYPES
// ============================================================================

export interface UploadOptions {
  folder: 'sectors' | 'services' | 'projects' | 'blog' | 'avatars';
  maxSizeMB?: number;
  quality?: number;
  maxWidthPx?: number;
}

export interface UploadResult {
  success: boolean;
  publicUrl?: string;
  filePath?: string;
  error?: string;
}

// ============================================================================
// CONSTANTES
// ============================================================================

const BUCKET_NAME = 'portfolio-images';
const DEFAULT_MAX_SIZE_MB = 5;
const DEFAULT_QUALITY = 0.85; // 85% de qualité JPEG
const DEFAULT_MAX_WIDTH_PX = 1920;

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

/**
 * Valide qu'un fichier est une image valide
 */
export const validateImageFile = (file: File, maxSizeMB: number = DEFAULT_MAX_SIZE_MB): { valid: boolean; error?: string } => {
  // Vérifier le type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Type de fichier non supporté. Utilisez : ${ALLOWED_TYPES.join(', ')}`,
    };
  }

  // Vérifier la taille
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `Fichier trop volumineux. Maximum : ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
};

/**
 * Génère un nom de fichier unique basé sur un timestamp et un hash aléatoire
 */
export const generateUniqueFileName = (originalName: string): string => {
  const timestamp = Date.now();
  const randomHash = Math.random().toString(36).substring(2, 9);
  const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg';
  const nameWithoutExt = originalName.split('.').slice(0, -1).join('.');
  const sanitizedName = nameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 30);

  return `${sanitizedName}-${timestamp}-${randomHash}.${extension}`;
};

/**
 * Compresse une image avant l'upload
 * Réduit la taille du fichier tout en conservant une bonne qualité
 */
export const compressImage = async (
  file: File,
  maxWidthPx: number = DEFAULT_MAX_WIDTH_PX,
  quality: number = DEFAULT_QUALITY
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculer les nouvelles dimensions
        let width = img.width;
        let height = img.height;

        if (width > maxWidthPx) {
          height = (height * maxWidthPx) / width;
          width = maxWidthPx;
        }

        // Créer un canvas pour redimensionner
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Impossible de créer le contexte canvas'));
          return;
        }

        // Dessiner l'image redimensionnée
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir en blob avec compression
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Échec de la compression'));
            }
          },
          file.type === 'image/png' ? 'image/png' : 'image/jpeg',
          quality
        );
      };

      img.onerror = () => reject(new Error('Erreur lors du chargement de l\'image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'));
    reader.readAsDataURL(file);
  });
};

// ============================================================================
// FONCTIONS PRINCIPALES
// ============================================================================

/**
 * Upload une image vers Supabase Storage
 * 
 * @param file - Le fichier image à uploader
 * @param options - Options d'upload (folder, compression, etc.)
 * @returns Résultat de l'upload avec l'URL publique
 */
export const uploadImage = async (
  file: File,
  options: UploadOptions
): Promise<UploadResult> => {
  try {
    // 1. Validation
    const validation = validateImageFile(file, options.maxSizeMB);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // 2. Compression de l'image
    console.log('🖼️ Compression de l\'image...');
    const compressedBlob = await compressImage(
      file,
      options.maxWidthPx || DEFAULT_MAX_WIDTH_PX,
      options.quality || DEFAULT_QUALITY
    );

    // Créer un nouveau fichier à partir du blob compressé
    const compressedFile = new File([compressedBlob], file.name, { type: file.type });

    console.log(`📊 Taille originale: ${(file.size / 1024).toFixed(2)}KB`);
    console.log(`📊 Taille compressée: ${(compressedFile.size / 1024).toFixed(2)}KB`);
    console.log(`📊 Réduction: ${(((file.size - compressedFile.size) / file.size) * 100).toFixed(1)}%`);

    // 3. Générer un nom de fichier unique
    const fileName = generateUniqueFileName(file.name);
    const filePath = `${options.folder}/${fileName}`;

    console.log(`📤 Upload vers: ${BUCKET_NAME}/${filePath}`);

    // 4. Upload vers Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, compressedFile, {
        cacheControl: '3600',
        upsert: false, // Ne pas écraser si existe déjà
      });

    if (error) {
      console.error('❌ Erreur upload:', error);
      return { success: false, error: error.message };
    }

    // 5. Obtenir l'URL publique
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    console.log('✅ Upload réussi!');
    console.log('🔗 URL publique:', publicUrlData.publicUrl);

    return {
      success: true,
      publicUrl: publicUrlData.publicUrl,
      filePath: filePath,
    };
  } catch (error: any) {
    console.error('❌ Erreur lors de l\'upload:', error);
    return {
      success: false,
      error: error.message || 'Erreur inconnue lors de l\'upload',
    };
  }
};

/**
 * Supprime une image de Supabase Storage
 * 
 * @param filePath - Le chemin du fichier à supprimer (ex: "sectors/image-123.jpg")
 * @returns true si succès, false sinon
 */
export const deleteImage = async (filePath: string): Promise<boolean> => {
  try {
    console.log(`🗑️ Suppression de: ${BUCKET_NAME}/${filePath}`);

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error('❌ Erreur suppression:', error);
      return false;
    }

    console.log('✅ Image supprimée avec succès');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error);
    return false;
  }
};

/**
 * Extrait le chemin du fichier depuis une URL publique Supabase
 * 
 * @param publicUrl - L'URL publique de l'image
 * @returns Le chemin du fichier (ex: "sectors/image-123.jpg")
 */
export const extractFilePathFromUrl = (publicUrl: string): string | null => {
  try {
    // Format attendu : https://xxx.supabase.co/storage/v1/object/public/portfolio-images/sectors/image.jpg
    const match = publicUrl.match(/\/portfolio-images\/(.+)$/);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Erreur lors de l\'extraction du chemin:', error);
    return null;
  }
};

/**
 * Remplace une image existante par une nouvelle
 * Supprime l'ancienne et upload la nouvelle
 * 
 * @param file - Le nouveau fichier à uploader
 * @param oldImageUrl - L'URL de l'ancienne image à supprimer
 * @param options - Options d'upload
 * @returns Résultat de l'upload avec la nouvelle URL
 */
export const replaceImage = async (
  file: File,
  oldImageUrl: string | null,
  options: UploadOptions
): Promise<UploadResult> => {
  try {
    // 1. Upload la nouvelle image
    const uploadResult = await uploadImage(file, options);
    
    if (!uploadResult.success) {
      return uploadResult;
    }

    // 2. Si l'upload a réussi, supprimer l'ancienne image
    if (oldImageUrl) {
      const oldFilePath = extractFilePathFromUrl(oldImageUrl);
      if (oldFilePath) {
        await deleteImage(oldFilePath);
      }
    }

    return uploadResult;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Erreur lors du remplacement de l\'image',
    };
  }
};

// ============================================================================
// EXPORT DU SERVICE
// ============================================================================

export const imageUploadService = {
  upload: uploadImage,
  delete: deleteImage,
  replace: replaceImage,
  validate: validateImageFile,
  extractFilePath: extractFilePathFromUrl,
  generateFileName: generateUniqueFileName,
};
