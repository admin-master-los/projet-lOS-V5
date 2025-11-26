-- Migration: Autoriser insertion publique dans meetings
-- Fichier: 20251121000000_allow_public_meeting_insert.sql

-- Activer RLS si pas déjà fait
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

-- Supprimer ancienne politique si existe
DROP POLICY IF EXISTS "Allow public to insert meetings" ON meetings;

-- Créer politique pour permettre insertion publique
CREATE POLICY "Allow public to insert meetings"
ON meetings
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Politique pour lecture (admin seulement)
DROP POLICY IF EXISTS "Allow authenticated users to read meetings" ON meetings;
CREATE POLICY "Allow authenticated users to read meetings"
ON meetings
FOR SELECT
TO authenticated
USING (true);

-- Politique pour mise à jour (admin seulement)
DROP POLICY IF EXISTS "Allow authenticated users to update meetings" ON meetings;
CREATE POLICY "Allow authenticated users to update meetings"
ON meetings
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Politique pour suppression (admin seulement)
DROP POLICY IF EXISTS "Allow authenticated users to delete meetings" ON meetings;
CREATE POLICY "Allow authenticated users to delete meetings"
ON meetings
FOR DELETE
TO authenticated
USING (true);

-- Commentaire
COMMENT ON POLICY "Allow public to insert meetings" ON meetings IS 
'Permet aux utilisateurs publics (non authentifiés) de créer des rendez-vous via le formulaire de réservation';
