-- ============================================
-- MIGRATION: Enhanced Skills Table
-- Description: Amélioration de la table skills avec catégories, niveau et icône
-- Date: 2024-11-24
-- ============================================

-- Supprimer la table existante si elle existe
DROP TABLE IF EXISTS skills CASCADE;

-- Créer la table skills améliorée
CREATE TABLE skills (
  id serial PRIMARY KEY,
  name text NOT NULL UNIQUE,
  category text NOT NULL DEFAULT 'other', -- frontend, backend, database, cloud, tools, other
  level text NOT NULL DEFAULT 'intermediate', -- beginner, intermediate, advanced, expert
  icon text, -- Nom de l'icône Lucide React (optionnel)
  color text DEFAULT '#3b82f6', -- Couleur hex pour l'affichage
  is_featured boolean DEFAULT false, -- Compétence mise en avant
  description text, -- Description optionnelle
  order_index integer DEFAULT 0, -- Ordre d'affichage
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index pour optimiser les requêtes
CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_skills_level ON skills(level);
CREATE INDEX idx_skills_featured ON skills(is_featured);
CREATE INDEX idx_skills_order ON skills(order_index);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_skills_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER skills_updated_at_trigger
  BEFORE UPDATE ON skills
  FOR EACH ROW
  EXECUTE FUNCTION update_skills_updated_at();

-- Activer RLS
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Politique de lecture publique (pour affichage sur le site)
CREATE POLICY "Public read access for skills"
  ON skills FOR SELECT
  TO anon, authenticated
  USING (true);

-- Politiques d'écriture pour utilisateurs authentifiés
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

-- Données d'exemple (optionnel)
INSERT INTO skills (name, category, level, icon, color, is_featured, order_index) VALUES
  ('React', 'frontend', 'expert', 'Atom', '#61dafb', true, 1),
  ('TypeScript', 'frontend', 'expert', 'FileCode2', '#3178c6', true, 2),
  ('Node.js', 'backend', 'advanced', 'Server', '#339933', true, 3),
  ('Python', 'backend', 'advanced', 'Code2', '#3776ab', true, 4),
  ('PostgreSQL', 'database', 'advanced', 'Database', '#336791', true, 5),
  ('Docker', 'tools', 'intermediate', 'Container', '#2496ed', false, 6),
  ('AWS', 'cloud', 'intermediate', 'Cloud', '#ff9900', false, 7)
ON CONFLICT (name) DO NOTHING;

-- Commentaires pour documentation
COMMENT ON TABLE skills IS 'Table des compétences techniques avec catégorisation avancée';
COMMENT ON COLUMN skills.category IS 'Catégorie: frontend, backend, database, cloud, tools, other';
COMMENT ON COLUMN skills.level IS 'Niveau: beginner, intermediate, advanced, expert';
COMMENT ON COLUMN skills.icon IS 'Nom de l''icône Lucide React';
COMMENT ON COLUMN skills.is_featured IS 'Compétence mise en avant sur la page d''accueil';
