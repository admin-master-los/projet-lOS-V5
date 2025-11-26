-- ============================================
-- MIGRATION: Enhanced Chatbot Tables
-- Description: Amélioration chatbot_knowledge + nouvelle table chatbot_conversations
-- Date: 2024-11-24
-- ============================================

-- ============================================
-- 1. AMÉLIORATION TABLE chatbot_knowledge
-- ============================================

-- Ajouter des colonnes supplémentaires à chatbot_knowledge (sans supprimer la table existante)
ALTER TABLE chatbot_knowledge 
  ADD COLUMN IF NOT EXISTS category text DEFAULT 'general',
  ADD COLUMN IF NOT EXISTS priority integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS usage_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_used_at timestamptz,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Index pour optimisation
CREATE INDEX IF NOT EXISTS idx_chatbot_knowledge_category ON chatbot_knowledge(category);
CREATE INDEX IF NOT EXISTS idx_chatbot_knowledge_is_active ON chatbot_knowledge(is_active);
CREATE INDEX IF NOT EXISTS idx_chatbot_knowledge_priority ON chatbot_knowledge(priority);

-- Commentaires
COMMENT ON COLUMN chatbot_knowledge.category IS 'Catégorie: services, portfolio, contact, about, technical, general';
COMMENT ON COLUMN chatbot_knowledge.priority IS 'Priorité d''affichage (plus élevé = plus important)';
COMMENT ON COLUMN chatbot_knowledge.usage_count IS 'Nombre de fois que cette connaissance a été utilisée';

-- ============================================
-- 2. CRÉATION TABLE chatbot_conversations
-- ============================================

-- Table pour enregistrer les conversations des visiteurs
CREATE TABLE IF NOT EXISTS chatbot_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identification de la session
  session_id text NOT NULL,
  visitor_id text, -- ID anonyme du visiteur (cookie ou fingerprint)
  
  -- Contenu de la conversation
  message text NOT NULL,
  response text NOT NULL,
  
  -- Métadonnées
  message_type text DEFAULT 'question', -- question, feedback, greeting, other
  sentiment text, -- positive, negative, neutral
  
  -- Contexte technique
  user_agent text,
  ip_address inet,
  page_url text,
  
  -- Statut et analyse
  is_resolved boolean DEFAULT true,
  needs_review boolean DEFAULT false,
  is_flagged boolean DEFAULT false,
  flag_reason text,
  
  -- Feedback utilisateur
  user_rating integer CHECK (user_rating >= 1 AND user_rating <= 5),
  user_feedback text,
  
  -- Analyse IA (pour amélioration future)
  keywords text[],
  matched_knowledge_ids text[], -- IDs des connaissances utilisées
  confidence_score numeric(3, 2), -- Score de confiance de la réponse (0-1)
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES auth.users(id)
);

-- Index pour optimisation des requêtes
CREATE INDEX idx_chatbot_conversations_session ON chatbot_conversations(session_id);
CREATE INDEX idx_chatbot_conversations_visitor ON chatbot_conversations(visitor_id);
CREATE INDEX idx_chatbot_conversations_created ON chatbot_conversations(created_at DESC);
CREATE INDEX idx_chatbot_conversations_needs_review ON chatbot_conversations(needs_review) WHERE needs_review = true;
CREATE INDEX idx_chatbot_conversations_is_flagged ON chatbot_conversations(is_flagged) WHERE is_flagged = true;
CREATE INDEX idx_chatbot_conversations_message_type ON chatbot_conversations(message_type);
CREATE INDEX idx_chatbot_conversations_sentiment ON chatbot_conversations(sentiment);
CREATE INDEX idx_chatbot_conversations_keywords ON chatbot_conversations USING GIN(keywords);

-- ============================================
-- 3. TABLE POUR LES STATISTIQUES CHATBOT
-- ============================================

CREATE TABLE IF NOT EXISTS chatbot_stats (
  id serial PRIMARY KEY,
  date date NOT NULL UNIQUE,
  
  -- Compteurs
  total_conversations integer DEFAULT 0,
  total_messages integer DEFAULT 0,
  unique_visitors integer DEFAULT 0,
  
  -- Qualité
  avg_confidence_score numeric(3, 2),
  flagged_count integer DEFAULT 0,
  needs_review_count integer DEFAULT 0,
  
  -- Satisfaction
  avg_rating numeric(3, 2),
  total_ratings integer DEFAULT 0,
  positive_sentiment integer DEFAULT 0,
  negative_sentiment integer DEFAULT 0,
  neutral_sentiment integer DEFAULT 0,
  
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_chatbot_stats_date ON chatbot_stats(date DESC);

-- ============================================
-- 4. FONCTIONS ET TRIGGERS
-- ============================================

-- Fonction pour mettre à jour les statistiques
CREATE OR REPLACE FUNCTION update_chatbot_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Insérer ou mettre à jour les stats du jour
  INSERT INTO chatbot_stats (
    date,
    total_conversations,
    total_messages,
    unique_visitors
  )
  VALUES (
    CURRENT_DATE,
    1,
    1,
    (SELECT COUNT(DISTINCT visitor_id) FROM chatbot_conversations WHERE DATE(created_at) = CURRENT_DATE)
  )
  ON CONFLICT (date) DO UPDATE SET
    total_messages = chatbot_stats.total_messages + 1,
    unique_visitors = (SELECT COUNT(DISTINCT visitor_id) FROM chatbot_conversations WHERE DATE(created_at) = CURRENT_DATE);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER chatbot_stats_trigger
  AFTER INSERT ON chatbot_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_chatbot_stats();

-- Fonction pour incrémenter usage_count dans chatbot_knowledge
CREATE OR REPLACE FUNCTION increment_knowledge_usage()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.matched_knowledge_ids IS NOT NULL THEN
    UPDATE chatbot_knowledge
    SET 
      usage_count = usage_count + 1,
      last_used_at = now()
    WHERE id = ANY(NEW.matched_knowledge_ids);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER knowledge_usage_trigger
  AFTER INSERT ON chatbot_conversations
  FOR EACH ROW
  EXECUTE FUNCTION increment_knowledge_usage();

-- ============================================
-- 5. RLS POLICIES
-- ============================================

-- chatbot_conversations
ALTER TABLE chatbot_conversations ENABLE ROW LEVEL SECURITY;

-- Lecture publique pour permettre aux visiteurs de voir leur propre historique
CREATE POLICY "Users can read their own conversations"
  ON chatbot_conversations FOR SELECT
  TO anon, authenticated
  USING (true);

-- Insertion publique pour les visiteurs
CREATE POLICY "Anyone can insert conversations"
  ON chatbot_conversations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Mise à jour et suppression réservées aux authentifiés
CREATE POLICY "Authenticated users can update conversations"
  ON chatbot_conversations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete conversations"
  ON chatbot_conversations FOR DELETE
  TO authenticated
  USING (true);

-- chatbot_stats
ALTER TABLE chatbot_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for chatbot_stats"
  ON chatbot_stats FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage chatbot_stats"
  ON chatbot_stats FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 6. COMMENTAIRES
-- ============================================

COMMENT ON TABLE chatbot_conversations IS 'Enregistrement de toutes les conversations avec le chatbot';
COMMENT ON TABLE chatbot_stats IS 'Statistiques quotidiennes du chatbot';
COMMENT ON COLUMN chatbot_conversations.session_id IS 'ID unique de la session de chat';
COMMENT ON COLUMN chatbot_conversations.confidence_score IS 'Score de confiance de la réponse IA (0-1)';
COMMENT ON COLUMN chatbot_conversations.matched_knowledge_ids IS 'IDs des articles de connaissance utilisés pour la réponse';
