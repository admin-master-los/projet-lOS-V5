-- ================================================
-- TABLE: blog_comments
-- Système de commentaires pour les articles de blog
-- ================================================

CREATE TABLE IF NOT EXISTS blog_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE,
  author_name VARCHAR(100) NOT NULL,
  author_email VARCHAR(255) NOT NULL,
  author_website VARCHAR(500),
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'spam', 'rejected')),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_blog_comments_post_id ON blog_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_parent_id ON blog_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_status ON blog_comments(status);
CREATE INDEX IF NOT EXISTS idx_blog_comments_created_at ON blog_comments(created_at DESC);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_blog_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_blog_comments_updated_at
  BEFORE UPDATE ON blog_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_comments_updated_at();

-- ================================================
-- RLS POLICIES
-- ================================================

-- Activer RLS
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

-- Politique: Tout le monde peut lire les commentaires approuvés
CREATE POLICY "Public can read approved comments"
  ON blog_comments
  FOR SELECT
  USING (status = 'approved');

-- Politique: Tout le monde peut créer des commentaires (status = pending par défaut)
CREATE POLICY "Anyone can create comments"
  ON blog_comments
  FOR INSERT
  WITH CHECK (status = 'pending');

-- Politique: Seuls les admins peuvent modifier le statut des commentaires
CREATE POLICY "Admins can update comments"
  ON blog_comments
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Politique: Seuls les admins peuvent supprimer des commentaires
CREATE POLICY "Admins can delete comments"
  ON blog_comments
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- ================================================
-- VUE: Commentaires avec réponses imbriquées
-- ================================================

CREATE OR REPLACE VIEW blog_comments_with_replies AS
SELECT 
  c.*,
  COALESCE(
    (
      SELECT json_agg(
        json_build_object(
          'id', r.id,
          'author_name', r.author_name,
          'author_email', r.author_email,
          'content', r.content,
          'created_at', r.created_at
        )
        ORDER BY r.created_at ASC
      )
      FROM blog_comments r
      WHERE r.parent_id = c.id AND r.status = 'approved'
    ),
    '[]'::json
  ) as replies,
  (
    SELECT COUNT(*)
    FROM blog_comments r
    WHERE r.parent_id = c.id AND r.status = 'approved'
  ) as replies_count
FROM blog_comments c
WHERE c.parent_id IS NULL
ORDER BY c.created_at DESC;

-- ================================================
-- FONCTION: Compter les commentaires approuvés d'un article
-- ================================================

CREATE OR REPLACE FUNCTION count_approved_comments(post_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM blog_comments
    WHERE post_id = post_uuid AND status = 'approved'
  );
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- TEST DATA (optionnel)
-- ================================================

-- Exemple d'insertion de commentaire de test
-- INSERT INTO blog_comments (post_id, author_name, author_email, content, status)
-- VALUES (
--   'YOUR_POST_ID_HERE',
--   'Jean Dupont',
--   'jean@example.com',
--   'Excellent article ! Merci pour le partage.',
--   'approved'
-- );
