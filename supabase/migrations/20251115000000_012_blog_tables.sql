-- ============================================
-- MIGRATION BLOG - Tables complètes
-- ============================================
-- Date: 2025-11-15
-- Description: Système de blog complet (catégories + articles)

-- 1. Supprimer existant si besoin de recréer
DROP VIEW IF EXISTS published_blog_posts CASCADE;
DROP VIEW IF EXISTS blog_stats CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS blog_categories CASCADE;
DROP FUNCTION IF EXISTS generate_blog_slug(TEXT);
DROP FUNCTION IF EXISTS calculate_reading_time(TEXT);
DROP FUNCTION IF EXISTS update_blog_posts_updated_at();

-- ============================================
-- 2. TABLE : blog_categories
-- ============================================

CREATE TABLE blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3B82F6',
  icon TEXT DEFAULT 'FileText',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_blog_categories_slug ON blog_categories(slug);

-- ============================================
-- 3. TABLE : blog_posts
-- ============================================

CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  author TEXT DEFAULT 'Leonce Ouattara',
  category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
  tags TEXT[],
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  views INTEGER DEFAULT 0,
  reading_time INTEGER,
  meta_title TEXT,
  meta_description TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX idx_blog_posts_tags ON blog_posts USING GIN(tags);

-- Trigger updated_at
CREATE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_posts_updated_at();

-- ============================================
-- 4. CATÉGORIES PAR DÉFAUT
-- ============================================

INSERT INTO blog_categories (name, slug, description, color, icon) VALUES
  ('Développement Web', 'developpement-web', 'Articles sur React, Next.js, JavaScript, TypeScript et frameworks modernes', '#3B82F6', 'Code2'),
  ('Intelligence Artificielle', 'intelligence-artificielle', 'IA, Machine Learning, ChatGPT, automatisation et tendances', '#8B5CF6', 'Brain'),
  ('DevOps & Cloud', 'devops-cloud', 'Docker, Kubernetes, AWS, CI/CD, déploiement et infrastructure', '#10B981', 'Cloud'),
  ('Base de données', 'base-de-donnees', 'PostgreSQL, MongoDB, Redis, optimisation et architecture data', '#F59E0B', 'Database'),
  ('Tutoriels', 'tutoriels', 'Guides pratiques step-by-step pour apprendre rapidement', '#EC4899', 'BookOpen'),
  ('Career & Tech', 'career-tech', 'Carrière dev, conseils, freelance, remote work et productivité', '#06B6D4', 'Briefcase');

-- ============================================
-- 5. RLS (Row Level Security)
-- ============================================

ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Policies catégories
CREATE POLICY "Public can view categories"
  ON blog_categories FOR SELECT TO public USING (true);

CREATE POLICY "Authenticated users can manage categories"
  ON blog_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Policies articles
CREATE POLICY "Public can view published posts"
  ON blog_posts FOR SELECT TO public USING (status = 'published');

CREATE POLICY "Authenticated users can view all posts"
  ON blog_posts FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage posts"
  ON blog_posts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- 6. VUES UTILES
-- ============================================

CREATE VIEW published_blog_posts AS
SELECT 
  bp.*,
  bc.name as category_name,
  bc.slug as category_slug,
  bc.color as category_color,
  bc.icon as category_icon
FROM blog_posts bp
LEFT JOIN blog_categories bc ON bp.category_id = bc.id
WHERE bp.status = 'published'
ORDER BY bp.published_at DESC;

CREATE VIEW blog_stats AS
SELECT 
  (SELECT COUNT(*) FROM blog_posts WHERE status = 'published') as published_count,
  (SELECT COUNT(*) FROM blog_posts WHERE status = 'draft') as draft_count,
  (SELECT COUNT(*) FROM blog_categories) as categories_count,
  (SELECT SUM(views) FROM blog_posts) as total_views,
  (SELECT AVG(reading_time) FROM blog_posts WHERE reading_time IS NOT NULL) as avg_reading_time;

-- ============================================
-- 7. FONCTIONS UTILES
-- ============================================

-- Générer slug unique
CREATE FUNCTION generate_blog_slug(title TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  base_slug := lower(trim(regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g')));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  final_slug := base_slug;
  WHILE EXISTS (SELECT 1 FROM blog_posts WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Calculer temps de lecture
CREATE FUNCTION calculate_reading_time(content TEXT)
RETURNS INTEGER AS $$
DECLARE
  word_count INTEGER;
  reading_time INTEGER;
BEGIN
  word_count := array_length(
    regexp_split_to_array(regexp_replace(content, '<[^>]*>', '', 'g'), '\s+'),
    1
  );
  reading_time := GREATEST(1, ROUND(word_count / 200.0));
  RETURN reading_time;
END;
$$ LANGUAGE plpgsql;

-- ✅ Succès
SELECT '✅ Migration blog terminée - Tables créées avec succès !' as message;
