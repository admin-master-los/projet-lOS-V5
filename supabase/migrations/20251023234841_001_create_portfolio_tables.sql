/*
  # Migration Portfolio - Création du schéma complet
  
  ## Description
  Migration complète des données du fichier index.ts vers Supabase.
  Cette migration crée toutes les tables nécessaires pour stocker les données du portfolio.
  
  ## 1. Nouvelles Tables
  
  ### `navigation`
  - `id` (text, primary key) - Identifiant unique de l'élément de navigation
  - `label` (text) - Libellé affiché dans le menu
  - `href` (text) - Lien de destination
  - `created_at` (timestamptz) - Date de création
  
  ### `services`
  - `id` (text, primary key) - Identifiant unique du service
  - `icon` (text) - Nom de l'icône (Lucide React)
  - `title` (text) - Titre du service
  - `description` (text) - Description courte
  - `features` (text[]) - Liste des fonctionnalités
  - `created_at` (timestamptz) - Date de création
  
  ### `sectors`
  - `id` (text, primary key) - Identifiant unique du secteur
  - `title` (text) - Titre du secteur
  - `description` (text) - Description du secteur
  - `services` (text[]) - Liste des services associés
  - `icon` (text) - Nom de l'icône
  - `created_at` (timestamptz) - Date de création
  
  ### `projects`
  - `id` (text, primary key) - Identifiant unique du projet
  - `title` (text) - Titre du projet
  - `description` (text) - Description courte
  - `image` (text) - URL de l'image principale
  - `tech` (text[]) - Technologies utilisées
  - `results` (text[]) - Résultats obtenus
  - `link` (text) - Lien vers le projet
  - `content_project_modal` (jsonb) - Contenu détaillé pour la modale
  - `created_at` (timestamptz) - Date de création
  
  ### `blog_posts`
  - `id` (text, primary key) - Identifiant unique de l'article
  - `title` (text) - Titre de l'article
  - `excerpt` (text) - Extrait/résumé
  - `category` (text) - Catégorie de l'article
  - `date` (text) - Date de publication (format string)
  - `read_time` (text) - Temps de lecture estimé
  - `image` (text) - URL de l'image de couverture
  - `content_blog` (text) - Contenu complet de l'article
  - `created_at` (timestamptz) - Date de création
  
  ### `chatbot_knowledge`
  - `id` (text, primary key) - Identifiant unique de l'élément de connaissance
  - `title` (text) - Titre de l'élément
  - `content` (text) - Contenu de la connaissance
  - `tags` (text[]) - Tags associés
  - `created_at` (timestamptz) - Date de création
  
  ### `skills`
  - `id` (serial, primary key) - Identifiant auto-généré
  - `name` (text) - Nom de la compétence
  - `created_at` (timestamptz) - Date de création
  
  ## 2. Sécurité
  - RLS activé sur toutes les tables
  - Politique de lecture publique (données en lecture seule pour le portfolio)
  - Politique d'écriture réservée aux utilisateurs authentifiés (pour future administration)
  
  ## 3. Notes importantes
  - Les données sont publiques (site portfolio) donc politiques SELECT ouvertes
  - Les INSERT/UPDATE/DELETE nécessitent une authentification
  - Le champ `content_project_modal` utilise JSONB pour stocker des structures complexes
*/

-- Création de la table navigation
CREATE TABLE IF NOT EXISTS navigation (
  id text PRIMARY KEY,
  label text NOT NULL,
  href text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Création de la table services
CREATE TABLE IF NOT EXISTS services (
  id text PRIMARY KEY,
  icon text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  features text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Création de la table sectors
CREATE TABLE IF NOT EXISTS sectors (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  services text[] NOT NULL DEFAULT '{}',
  icon text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Création de la table projects
CREATE TABLE IF NOT EXISTS projects (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  image text NOT NULL,
  tech text[] NOT NULL DEFAULT '{}',
  results text[] NOT NULL DEFAULT '{}',
  link text NOT NULL,
  content_project_modal jsonb,
  created_at timestamptz DEFAULT now()
);

-- Création de la table blog_posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id text PRIMARY KEY,
  title text NOT NULL,
  excerpt text NOT NULL,
  category text NOT NULL,
  date text NOT NULL,
  read_time text NOT NULL,
  image text NOT NULL,
  content_blog text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Création de la table chatbot_knowledge
CREATE TABLE IF NOT EXISTS chatbot_knowledge (
  id text PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Création de la table skills
CREATE TABLE IF NOT EXISTS skills (
  id serial PRIMARY KEY,
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Activation de RLS sur toutes les tables
ALTER TABLE navigation ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité : Lecture publique pour toutes les tables (portfolio public)
CREATE POLICY "Public read access for navigation"
  ON navigation FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read access for services"
  ON services FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read access for sectors"
  ON sectors FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read access for projects"
  ON projects FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read access for blog_posts"
  ON blog_posts FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read access for chatbot_knowledge"
  ON chatbot_knowledge FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read access for skills"
  ON skills FOR SELECT
  TO anon, authenticated
  USING (true);

-- Politiques d'écriture : Réservées aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can insert navigation"
  ON navigation FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update navigation"
  ON navigation FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete navigation"
  ON navigation FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert services"
  ON services FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update services"
  ON services FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete services"
  ON services FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert sectors"
  ON sectors FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update sectors"
  ON sectors FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete sectors"
  ON sectors FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete projects"
  ON projects FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert blog_posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update blog_posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete blog_posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert chatbot_knowledge"
  ON chatbot_knowledge FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update chatbot_knowledge"
  ON chatbot_knowledge FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete chatbot_knowledge"
  ON chatbot_knowledge FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert skills"
  ON skills FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update skills"
  ON skills FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete skills"
  ON skills FOR DELETE
  TO authenticated
  USING (true);

-- Création d'index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_date ON blog_posts(date);
CREATE INDEX IF NOT EXISTS idx_chatbot_knowledge_tags ON chatbot_knowledge USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_projects_tech ON projects USING GIN(tech);
