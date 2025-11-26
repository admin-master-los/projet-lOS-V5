-- ================================================
-- TABLE: newsletter_subscribers
-- Système d'abonnement à la newsletter
-- ================================================

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  source VARCHAR(50) DEFAULT 'website', -- website, article, homepage, etc.
  tags TEXT[] DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'subscribed', 'unsubscribed')),
  ip_address INET,
  user_agent TEXT,
  confirmed_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_created_at ON newsletter_subscribers(created_at DESC);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_newsletter_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_newsletter_updated_at
  BEFORE UPDATE ON newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_newsletter_updated_at();

-- ================================================
-- RLS POLICIES
-- ================================================

-- Activer RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Politique: Tout le monde peut s'inscrire
CREATE POLICY "Anyone can subscribe"
  ON newsletter_subscribers
  FOR INSERT
  WITH CHECK (true);

-- Politique: Seuls les admins peuvent lire
CREATE POLICY "Admins can read subscribers"
  ON newsletter_subscribers
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Politique: Seuls les admins peuvent modifier
CREATE POLICY "Admins can update subscribers"
  ON newsletter_subscribers
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Politique: Seuls les admins peuvent supprimer
CREATE POLICY "Admins can delete subscribers"
  ON newsletter_subscribers
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- ================================================
-- FONCTION: Compter les abonnés actifs
-- ================================================

CREATE OR REPLACE FUNCTION count_active_subscribers()
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM newsletter_subscribers
    WHERE status = 'subscribed'
  );
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- VUE: Statistiques newsletter
-- ================================================

CREATE OR REPLACE VIEW newsletter_stats AS
SELECT 
  COUNT(*) FILTER (WHERE status = 'subscribed') as total_subscribed,
  COUNT(*) FILTER (WHERE status = 'pending') as total_pending,
  COUNT(*) FILTER (WHERE status = 'unsubscribed') as total_unsubscribed,
  COUNT(*) as total_all,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as new_last_month,
  COUNT(DISTINCT source) as sources_count
FROM newsletter_subscribers;

-- ================================================
-- TEST DATA (optionnel)
-- ================================================

-- Exemple d'insertion de test
-- INSERT INTO newsletter_subscribers (email, first_name, last_name, source, status)
-- VALUES (
--   'test@example.com',
--   'Jean',
--   'Dupont',
--   'article',
--   'subscribed'
-- );
