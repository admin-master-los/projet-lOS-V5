/*
  # Ajout des colonnes manquantes à la table navigation
  
  1. Modifications
    - Ajoute la colonne `is_external` (boolean) pour indiquer si le lien s'ouvre dans un nouvel onglet
    - Ajoute la colonne `updated_at` (timestamptz) pour tracker les modifications
    
  2. Notes
    - is_external par défaut à false
    - updated_at se met à jour automatiquement avec un trigger
*/

-- Ajouter la colonne is_external si elle n'existe pas
ALTER TABLE navigation ADD COLUMN IF NOT EXISTS is_external boolean DEFAULT false;

-- Ajouter la colonne updated_at si elle n'existe pas
ALTER TABLE navigation ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Créer une fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Créer un trigger pour mettre à jour updated_at automatiquement
DROP TRIGGER IF EXISTS update_navigation_updated_at ON navigation;
CREATE TRIGGER update_navigation_updated_at
    BEFORE UPDATE ON navigation
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Mettre à jour les enregistrements existants
UPDATE navigation SET updated_at = created_at WHERE updated_at IS NULL;
UPDATE navigation SET is_external = false WHERE is_external IS NULL;
