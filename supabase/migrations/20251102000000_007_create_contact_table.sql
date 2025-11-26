/*
  # Migration 007 - Création table contact avec données
  
  1. Modifications
    - Crée la table `contact` avec toutes les colonnes nécessaires
    - Insère les données depuis le CSV fourni
    - Configure les politiques RLS pour permettre les insertions anonymes
    - Active RLS sur la table
    
  2. Structure de la table
    - id (uuid, PK)
    - name (text)
    - email (text)
    - company (text)
    - budget (text)
    - project (text)
    - rgpd_consent (boolean)
    - status (text, default: 'pending')
    - admin_notes (text, nullable)
    - ip_address (text, nullable)
    - user_agent (text, nullable)
    - created_at (timestamptz)
    - updated_at (timestamptz)
*/

-- Créer la table contact
CREATE TABLE IF NOT EXISTS contact (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  budget text,
  project text NOT NULL,
  rgpd_consent boolean DEFAULT false,
  status text DEFAULT 'pending',
  admin_notes text,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Créer un index sur l'email pour les recherches rapides
CREATE INDEX IF NOT EXISTS idx_contact_email ON contact(email);

-- Créer un index sur le status
CREATE INDEX IF NOT EXISTS idx_contact_status ON contact(status);

-- Créer un index sur created_at pour le tri
CREATE INDEX IF NOT EXISTS idx_contact_created_at ON contact(created_at DESC);

-- Activer RLS
ALTER TABLE contact ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture par tous (authentifiés et anonymes)
CREATE POLICY "Anyone can read contact submissions"
  ON contact FOR SELECT
  TO public
  USING (true);

-- Politique pour permettre l'insertion par les utilisateurs anonymes
CREATE POLICY "Anyone can insert contact submissions"
  ON contact FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Politique pour permettre aux admins authentifiés de tout voir et modifier
CREATE POLICY "Authenticated users can update contact"
  ON contact FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Politique pour permettre aux admins de supprimer
CREATE POLICY "Authenticated users can delete contact"
  ON contact FOR DELETE
  TO authenticated
  USING (true);

-- Créer le trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER update_contact_updated_at
    BEFORE UPDATE ON contact
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insérer les données depuis le CSV
INSERT INTO contact (id, name, email, company, budget, project, rgpd_consent, created_at, updated_at, status, admin_notes, ip_address, user_agent) VALUES
  (
    '3de540c8-0a35-4ff3-a024-df0a7f6f4edb',
    'Test Sans RLS',
    'test-no-rls-4200@example.com',
    'Test Company',
    '5K€ - 15K€',
    'Test avec RLS complètement désactivé pour confirmer que le problème vient bien de RLS',
    true,
    '2025-10-30 04:25:33.31073+00',
    '2025-10-30 04:25:33.31073+00',
    'pending',
    null,
    null,
    null
  ),
  (
    '6f375762-356b-4342-9d97-56a2ea6b28b5',
    'Test Debug',
    'debug-test-1385@example.com',
    'Test Company',
    '5K€ - 15K€',
    'Test de débogage pour vérifier que la table fonctionne sans RLS',
    true,
    '2025-10-30 03:57:45.322095+00',
    '2025-10-30 03:57:45.322095+00',
    'pending',
    null,
    null,
    null
  ),
  (
    '70d73c9a-c6b9-4eaa-b11e-016fa40494ed',
    'Test RLS Public',
    'test-public-4504@example.com',
    'Test Company Public',
    '5K€ - 15K€',
    'Test avec politique PUBLIC pour supporter anonymous sign-ins',
    true,
    '2025-10-30 04:36:01.241469+00',
    '2025-10-30 04:36:01.241469+00',
    'pending',
    null,
    null,
    null
  ),
  (
    'a7422b7e-2b6c-49e2-8fcc-58a308fe52c8',
    'projet-lOS''s Org',
    'projet-leonceouattarastudio@outlook.com',
    'lOS''Org',
    '30K€ - 50K€',
    'BEsoin d''une application métier pour optimiser le processus de controle des agents du Tresor',
    true,
    '2025-10-30 04:28:18.266084+00',
    '2025-10-30 04:28:18.266084+00',
    'pending',
    null,
    '102.208.131.78',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36'
  ),
  (
    'e380399e-305e-42de-bf0b-0881e05e341a',
    'Test User',
    'test@example.com',
    'Test Company',
    '5K€ - 15K€',
    'Ceci est un projet de test pour vérifier que la table fonctionne correctement.',
    true,
    '2025-10-28 03:39:41.601578+00',
    '2025-10-28 03:39:41.601578+00',
    'pending',
    null,
    null,
    null
  ),
  (
    'f264e6f8-37f6-4689-a9a6-ae5b0a14af4d',
    'Jean Dupont',
    'jean.dupont@example.com',
    'ACME Corporation',
    '15K€ - 30K€',
    'Nous souhaitons développer une plateforme e-commerce B2B avec gestion des stocks, multi-devises et intégration ERP. Le projet doit être livré dans un délai de 6 mois.',
    true,
    '2025-10-25 05:09:38.292115+00',
    '2025-10-25 05:09:38.292115+00',
    'pending',
    null,
    null,
    null
  ),
  (
    'f748da5a-60e8-4df9-b743-e645bf9a8d96',
    'Lucien Terry',
    'lucien.terry@web.iu',
    'Luncine COPORATION',
    '5K€ - 15K€',
    'Besoin d''un site web pour la présentation des services de notre entreprises de nettoyage',
    true,
    '2025-10-30 04:02:34.200359+00',
    '2025-10-30 04:02:34.200359+00',
    'pending',
    null,
    '102.208.131.78',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36'
  )
ON CONFLICT (id) DO NOTHING;

-- Vérification
SELECT COUNT(*) as total_contacts FROM contact;
