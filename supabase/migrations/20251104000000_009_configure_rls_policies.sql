-- Migration 009: Configuration complète des politiques RLS
-- Date: 04 Novembre 2025
-- Description: Active RLS et crée les politiques pour toutes les tables

-- =====================================================
-- 1. ACTIVATION DE RLS SUR TOUTES LES TABLES
-- =====================================================

-- S'assurer que RLS est activé sur toutes les tables
ALTER TABLE navigation ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. FONCTION HELPER - Vérifier si l'utilisateur est admin
-- =====================================================

-- Cette fonction vérifie si l'utilisateur connecté est un admin
-- Elle sera utilisée dans les politiques pour restreindre les opérations d'écriture

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Un utilisateur est considéré comme admin s'il est authentifié
  -- Tu peux rendre cette fonction plus stricte en vérifiant un rôle spécifique
  RETURN auth.uid() IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 3. POLITIQUES POUR LA TABLE NAVIGATION
-- =====================================================

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Tout le monde peut lire la navigation" ON navigation;
DROP POLICY IF EXISTS "Les admins peuvent insérer dans navigation" ON navigation;
DROP POLICY IF EXISTS "Les admins peuvent modifier navigation" ON navigation;
DROP POLICY IF EXISTS "Les admins peuvent supprimer navigation" ON navigation;

-- LECTURE : Tout le monde peut voir les items de navigation (pour le site public)
CREATE POLICY "Tout le monde peut lire la navigation"
ON navigation FOR SELECT
TO public
USING (true);

-- INSERTION : Seuls les admins peuvent créer des items
CREATE POLICY "Les admins peuvent insérer dans navigation"
ON navigation FOR INSERT
TO authenticated
WITH CHECK (is_admin());

-- MODIFICATION : Seuls les admins peuvent modifier des items
CREATE POLICY "Les admins peuvent modifier navigation"
ON navigation FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- SUPPRESSION : Seuls les admins peuvent supprimer des items
CREATE POLICY "Les admins peuvent supprimer navigation"
ON navigation FOR DELETE
TO authenticated
USING (is_admin());

-- =====================================================
-- 4. POLITIQUES POUR LA TABLE SERVICES
-- =====================================================

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Tout le monde peut lire les services" ON services;
DROP POLICY IF EXISTS "Les admins peuvent insérer des services" ON services;
DROP POLICY IF EXISTS "Les admins peuvent modifier les services" ON services;
DROP POLICY IF EXISTS "Les admins peuvent supprimer les services" ON services;

-- LECTURE : Tout le monde peut voir les services (pour le site public)
CREATE POLICY "Tout le monde peut lire les services"
ON services FOR SELECT
TO public
USING (true);

-- INSERTION : Seuls les admins peuvent créer des services
CREATE POLICY "Les admins peuvent insérer des services"
ON services FOR INSERT
TO authenticated
WITH CHECK (is_admin());

-- MODIFICATION : Seuls les admins peuvent modifier des services
CREATE POLICY "Les admins peuvent modifier les services"
ON services FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- SUPPRESSION : Seuls les admins peuvent supprimer des services
CREATE POLICY "Les admins peuvent supprimer les services"
ON services FOR DELETE
TO authenticated
USING (is_admin());

-- =====================================================
-- 5. POLITIQUES POUR LA TABLE SECTORS
-- =====================================================

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Tout le monde peut lire les secteurs" ON sectors;
DROP POLICY IF EXISTS "Les admins peuvent insérer des secteurs" ON sectors;
DROP POLICY IF EXISTS "Les admins peuvent modifier les secteurs" ON sectors;
DROP POLICY IF EXISTS "Les admins peuvent supprimer les secteurs" ON sectors;

-- LECTURE : Tout le monde peut voir les secteurs (pour le site public)
CREATE POLICY "Tout le monde peut lire les secteurs"
ON sectors FOR SELECT
TO public
USING (true);

-- INSERTION : Seuls les admins peuvent créer des secteurs
CREATE POLICY "Les admins peuvent insérer des secteurs"
ON sectors FOR INSERT
TO authenticated
WITH CHECK (is_admin());

-- MODIFICATION : Seuls les admins peuvent modifier des secteurs
CREATE POLICY "Les admins peuvent modifier les secteurs"
ON sectors FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- SUPPRESSION : Seuls les admins peuvent supprimer des secteurs
CREATE POLICY "Les admins peuvent supprimer les secteurs"
ON sectors FOR DELETE
TO authenticated
USING (is_admin());

-- =====================================================
-- 6. POLITIQUES POUR LA TABLE CONTACT
-- =====================================================

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Tout le monde peut insérer un contact" ON contact;
DROP POLICY IF EXISTS "Les admins peuvent lire les contacts" ON contact;
DROP POLICY IF EXISTS "Les admins peuvent modifier les contacts" ON contact;
DROP POLICY IF EXISTS "Les admins peuvent supprimer les contacts" ON contact;

-- INSERTION : Tout le monde peut envoyer un message de contact (formulaire public)
CREATE POLICY "Tout le monde peut insérer un contact"
ON contact FOR INSERT
TO public
WITH CHECK (true);

-- LECTURE : Seuls les admins peuvent voir les messages de contact
CREATE POLICY "Les admins peuvent lire les contacts"
ON contact FOR SELECT
TO authenticated
USING (is_admin());

-- MODIFICATION : Seuls les admins peuvent modifier les contacts (ex: marquer comme lu)
CREATE POLICY "Les admins peuvent modifier les contacts"
ON contact FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- SUPPRESSION : Seuls les admins peuvent supprimer les contacts
CREATE POLICY "Les admins peuvent supprimer les contacts"
ON contact FOR DELETE
TO authenticated
USING (is_admin());

-- =====================================================
-- 7. VÉRIFICATION DES POLITIQUES
-- =====================================================

-- Afficher toutes les politiques créées pour vérification
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- =====================================================
-- 8. COMMENTAIRES POUR DOCUMENTATION
-- =====================================================

COMMENT ON FUNCTION is_admin() IS 
'Fonction helper qui vérifie si l''utilisateur connecté est un admin. 
Retourne true si l''utilisateur est authentifié, false sinon.
Utilisée dans les politiques RLS pour restreindre l''accès en écriture.';

COMMENT ON POLICY "Tout le monde peut lire la navigation" ON navigation IS
'Permet à tous les visiteurs (authentifiés ou non) de lire les items de navigation pour afficher le menu du site public.';

COMMENT ON POLICY "Tout le monde peut lire les services" ON services IS
'Permet à tous les visiteurs de lire les services pour les afficher sur le site public.';

COMMENT ON POLICY "Tout le monde peut lire les secteurs" ON sectors IS
'Permet à tous les visiteurs de lire les secteurs d''activité pour les afficher sur le site public.';

COMMENT ON POLICY "Tout le monde peut insérer un contact" ON contact IS
'Permet à tous les visiteurs d''envoyer un message via le formulaire de contact public.';

COMMENT ON POLICY "Les admins peuvent lire les contacts" ON contact IS
'Seuls les administrateurs authentifiés peuvent lire les messages de contact reçus.';
