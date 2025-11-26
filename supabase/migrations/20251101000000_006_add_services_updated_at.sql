/*
  # Ajout colonne updated_at à la table services
  
  1. Modifications
    - Ajoute la colonne `updated_at` (timestamptz) pour tracker les modifications
    
  2. Notes
    - updated_at se met à jour automatiquement avec un trigger
*/

-- Ajouter la colonne updated_at si elle n'existe pas
ALTER TABLE services ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Utiliser la fonction existante update_updated_at_column (créée dans migration 005)
-- Créer le trigger pour mettre à jour updated_at automatiquement
DROP TRIGGER IF EXISTS update_services_updated_at ON services;
CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Mettre à jour les enregistrements existants
UPDATE services SET updated_at = created_at WHERE updated_at IS NULL;
