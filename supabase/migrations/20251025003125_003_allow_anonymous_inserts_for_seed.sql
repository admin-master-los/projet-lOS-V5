/*
  # Permettre les insertions anonymes pour le seed

  Cette migration ajuste temporairement les politiques RLS pour permettre
  les insertions par des utilisateurs anonymes. Ceci est nécessaire pour
  le script de seed qui utilise la clé anonyme.

  1. Modifications
    - Ajoute des politiques INSERT pour les utilisateurs anonymes sur toutes les tables
    - Maintient les politiques SELECT existantes
    
  2. Sécurité
    - Ces politiques permettent uniquement les INSERT
    - Les SELECT, UPDATE et DELETE restent protégés
    - Dans un environnement de production, vous devriez restreindre ces politiques
*/

-- Navigation: Permettre INSERT anonyme
DROP POLICY IF EXISTS "Allow anonymous insert on navigation" ON navigation;
CREATE POLICY "Allow anonymous insert on navigation"
  ON navigation FOR INSERT
  TO anon
  WITH CHECK (true);

-- Services: Permettre INSERT anonyme
DROP POLICY IF EXISTS "Allow anonymous insert on services" ON services;
CREATE POLICY "Allow anonymous insert on services"
  ON services FOR INSERT
  TO anon
  WITH CHECK (true);

-- Sectors: Permettre INSERT anonyme
DROP POLICY IF EXISTS "Allow anonymous insert on sectors" ON sectors;
CREATE POLICY "Allow anonymous insert on sectors"
  ON sectors FOR INSERT
  TO anon
  WITH CHECK (true);

-- Projects: Permettre INSERT anonyme
DROP POLICY IF EXISTS "Allow anonymous insert on projects" ON projects;
CREATE POLICY "Allow anonymous insert on projects"
  ON projects FOR INSERT
  TO anon
  WITH CHECK (true);

-- Blog Posts: Permettre INSERT anonyme
DROP POLICY IF EXISTS "Allow anonymous insert on blog_posts" ON blog_posts;
CREATE POLICY "Allow anonymous insert on blog_posts"
  ON blog_posts FOR INSERT
  TO anon
  WITH CHECK (true);

-- Chatbot Knowledge: Permettre INSERT anonyme
DROP POLICY IF EXISTS "Allow anonymous insert on chatbot_knowledge" ON chatbot_knowledge;
CREATE POLICY "Allow anonymous insert on chatbot_knowledge"
  ON chatbot_knowledge FOR INSERT
  TO anon
  WITH CHECK (true);

-- Skills: Permettre INSERT anonyme
DROP POLICY IF EXISTS "Allow anonymous insert on skills" ON skills;
CREATE POLICY "Allow anonymous insert on skills"
  ON skills FOR INSERT
  TO anon
  WITH CHECK (true);
