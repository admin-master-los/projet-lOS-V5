/*
  # Migration 010 (Simplifiée) - Politiques RLS pour Storage
  
  ⚠️ PRÉREQUIS : 
  Le bucket 'portfolio-images' doit déjà être créé manuellement dans Supabase Dashboard
  
  Cette migration configure uniquement les politiques de sécurité RLS.
*/

-- ============================================================================
-- 1. SUPPRESSION DES ANCIENNES POLITIQUES (si elles existent)
-- ============================================================================

DROP POLICY IF EXISTS "Public read access for portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete portfolio images" ON storage.objects;

-- ============================================================================
-- 2. CRÉATION DES NOUVELLES POLITIQUES RLS
-- ============================================================================

-- POLITIQUE 1 : Lecture publique
-- Tout le monde peut voir les images (nécessaire pour l'affichage public)
CREATE POLICY "Public read access for portfolio images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'portfolio-images');

-- POLITIQUE 2 : Upload
-- Seuls les utilisateurs authentifiés peuvent uploader des images
CREATE POLICY "Authenticated users can upload portfolio images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio-images');

-- POLITIQUE 3 : Mise à jour
-- Seuls les utilisateurs authentifiés peuvent modifier les métadonnées
CREATE POLICY "Authenticated users can update portfolio images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio-images')
WITH CHECK (bucket_id = 'portfolio-images');

-- POLITIQUE 4 : Suppression
-- Seuls les utilisateurs authentifiés peuvent supprimer des images
CREATE POLICY "Authenticated users can delete portfolio images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio-images');

-- ============================================================================
-- 3. VÉRIFICATION
-- ============================================================================

-- Afficher les politiques créées (pour vérification)
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'objects' AND policyname LIKE '%portfolio images%'
ORDER BY policyname;

-- ============================================================================
-- RÉSULTAT ATTENDU
-- ============================================================================

/*
  Après cette migration, vous aurez 4 politiques actives :
  
  ✅ Public read access for portfolio images (SELECT)
  ✅ Authenticated users can upload portfolio images (INSERT)
  ✅ Authenticated users can update portfolio images (UPDATE)
  ✅ Authenticated users can delete portfolio images (DELETE)
  
  Sécurité :
  - Tout le monde peut VOIR les images (affichage public)
  - Seuls les admins authentifiés peuvent UPLOADER/MODIFIER/SUPPRIMER
*/
