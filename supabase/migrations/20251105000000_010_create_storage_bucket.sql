/*
  # Migration 010 - Configuration du stockage d'images (Supabase Storage)
  
  1. Création du bucket
    - Création du bucket 'portfolio-images' pour stocker toutes les images
    - Configuration publique pour affichage sur le site
    
  2. Politiques de sécurité
    - Lecture publique : Tout le monde peut voir les images
    - Upload : Seuls les utilisateurs authentifiés peuvent uploader
    - Mise à jour/Suppression : Seuls les utilisateurs authentifiés
    
  3. Types de fichiers autorisés
    - Images : JPEG, PNG, WebP, GIF
    - Taille max : 5MB par fichier
*/

-- ============================================================================
-- 1. CRÉATION DU BUCKET DE STOCKAGE
-- ============================================================================

-- Insérer le bucket s'il n'existe pas déjà
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-images',
  'portfolio-images',
  true, -- Bucket public pour que les images soient accessibles
  5242880, -- 5MB en bytes (5 * 1024 * 1024)
  ARRAY[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 2. POLITIQUES RLS POUR LE BUCKET
-- ============================================================================

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Public read access for portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete portfolio images" ON storage.objects;

-- POLITIQUE 1 : Lecture publique (tout le monde peut voir les images)
CREATE POLICY "Public read access for portfolio images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'portfolio-images');

-- POLITIQUE 2 : Upload (seuls les utilisateurs authentifiés peuvent uploader)
CREATE POLICY "Authenticated users can upload portfolio images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio-images');

-- POLITIQUE 3 : Mise à jour (seuls les utilisateurs authentifiés)
CREATE POLICY "Authenticated users can update portfolio images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio-images')
WITH CHECK (bucket_id = 'portfolio-images');

-- POLITIQUE 4 : Suppression (seuls les utilisateurs authentifiés)
CREATE POLICY "Authenticated users can delete portfolio images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio-images');

-- ============================================================================
-- 3. STRUCTURE DE DOSSIERS DANS LE BUCKET
-- ============================================================================

/*
  Structure recommandée des dossiers dans le bucket :
  
  portfolio-images/
  ├── sectors/           → Images des secteurs
  │   ├── e-commerce.jpg
  │   ├── education.jpg
  │   └── ...
  ├── services/          → Images des services
  │   ├── web-dev.jpg
  │   └── ...
  ├── projects/          → Images des projets (Phase 7)
  │   ├── project-1/
  │   │   ├── thumbnail.jpg
  │   │   ├── screenshot-1.jpg
  │   │   └── ...
  │   └── ...
  ├── blog/              → Images des articles (Phase 8)
  │   ├── article-1/
  │   │   ├── cover.jpg
  │   │   ├── image-1.jpg
  │   │   └── ...
  │   └── ...
  └── avatars/           → Avatars utilisateurs
      └── ...
*/

-- ============================================================================
-- 4. FONCTION HELPER : Obtenir l'URL publique d'une image
-- ============================================================================

-- Cette fonction n'est pas nécessaire car Supabase fournit déjà getPublicUrl()
-- Mais on peut créer une vue helper pour faciliter les requêtes

CREATE OR REPLACE VIEW public.storage_images AS
SELECT 
  id,
  name,
  bucket_id,
  created_at,
  updated_at,
  -- Construire l'URL publique (à adapter selon votre projet Supabase)
  'https://your-project.supabase.co/storage/v1/object/public/' || bucket_id || '/' || name as public_url
FROM storage.objects
WHERE bucket_id = 'portfolio-images';

-- Note : Remplacez 'your-project' par votre vrai ID de projet Supabase

-- ============================================================================
-- 5. COMMENTAIRES ET DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE storage.buckets IS 'Buckets de stockage Supabase pour les fichiers uploadés';
COMMENT ON COLUMN storage.buckets.public IS 'Si true, les fichiers sont accessibles publiquement via URL';
COMMENT ON COLUMN storage.buckets.file_size_limit IS 'Taille maximale des fichiers en bytes';
COMMENT ON COLUMN storage.buckets.allowed_mime_types IS 'Types MIME autorisés pour les uploads';

-- ============================================================================
-- RÉSULTAT ATTENDU
-- ============================================================================

/*
  Après cette migration, vous pourrez :
  
  ✅ Uploader des images depuis l'admin (max 5MB)
  ✅ Les images seront accessibles publiquement
  ✅ Seuls les admins authentifiés peuvent uploader/modifier/supprimer
  ✅ Types acceptés : JPEG, PNG, WebP, GIF
  ✅ Structure organisée par dossiers (sectors, services, projects, blog)
  
  URLs des images :
  https://your-project.supabase.co/storage/v1/object/public/portfolio-images/sectors/e-commerce.jpg
*/
