-- ============================================
-- MIGRATION: Admin Settings & Users Management
-- Description: Tables pour la gestion des utilisateurs admin et paramètres système
-- Date: 2024-11-24
-- ============================================

-- ============================================
-- 1. TABLE admin_users (Profils admin étendus)
-- ============================================

-- Table pour gérer les profils d'administrateurs avec plus de détails
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Informations personnelles
  full_name text NOT NULL,
  email text NOT NULL UNIQUE,
  avatar_url text,
  phone text,
  
  -- Rôle et permissions
  role text NOT NULL DEFAULT 'editor', -- super_admin, admin, editor, viewer
  permissions jsonb DEFAULT '{"blog": true, "services": true, "projects": true, "contacts": true, "meetings": true, "analytics": true}'::jsonb,
  
  -- Statut
  is_active boolean DEFAULT true,
  is_email_verified boolean DEFAULT false,
  last_login_at timestamptz,
  
  -- Métadonnées
  bio text,
  title text, -- Titre professionnel
  department text,
  
  -- Préférences
  preferences jsonb DEFAULT '{
    "theme": "dark",
    "language": "fr",
    "notifications": {
      "email": true,
      "push": true,
      "frequency": "immediate"
    },
    "dashboard": {
      "default_view": "overview",
      "widgets": ["stats", "recent_contacts", "recent_meetings"]
    }
  }'::jsonb,
  
  -- Audit
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  updated_by uuid REFERENCES auth.users(id)
);

-- Index
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_role ON admin_users(role);
CREATE INDEX idx_admin_users_is_active ON admin_users(is_active);
CREATE INDEX idx_admin_users_last_login ON admin_users(last_login_at DESC);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_admin_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER admin_users_updated_at_trigger
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_users_updated_at();

-- ============================================
-- 2. TABLE system_settings (Paramètres système)
-- ============================================

CREATE TABLE IF NOT EXISTS system_settings (
  id serial PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL,
  category text NOT NULL DEFAULT 'general', -- general, email, seo, integrations, security
  description text,
  is_public boolean DEFAULT false, -- Si true, visible sur le frontend
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

-- Index
CREATE INDEX idx_system_settings_key ON system_settings(key);
CREATE INDEX idx_system_settings_category ON system_settings(category);
CREATE INDEX idx_system_settings_is_public ON system_settings(is_public);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_system_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER system_settings_updated_at_trigger
  BEFORE UPDATE ON system_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_system_settings_updated_at();

-- ============================================
-- 3. TABLE admin_activity_logs (Logs d'activité)
-- ============================================

CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Utilisateur et action
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email text,
  
  -- Détails de l'action
  action text NOT NULL, -- create, update, delete, login, logout, etc.
  resource_type text NOT NULL, -- blog, service, project, user, settings, etc.
  resource_id text,
  
  -- Données
  changes jsonb, -- Avant/après pour les updates
  metadata jsonb, -- Métadonnées supplémentaires
  
  -- Contexte technique
  ip_address inet,
  user_agent text,
  
  -- Status
  status text DEFAULT 'success', -- success, failed, pending
  error_message text,
  
  created_at timestamptz DEFAULT now()
);

-- Index
CREATE INDEX idx_admin_activity_logs_user ON admin_activity_logs(user_id);
CREATE INDEX idx_admin_activity_logs_action ON admin_activity_logs(action);
CREATE INDEX idx_admin_activity_logs_resource ON admin_activity_logs(resource_type, resource_id);
CREATE INDEX idx_admin_activity_logs_created ON admin_activity_logs(created_at DESC);
CREATE INDEX idx_admin_activity_logs_status ON admin_activity_logs(status);

-- ============================================
-- 4. TABLE admin_sessions (Sessions actives)
-- ============================================

CREATE TABLE IF NOT EXISTS admin_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Session info
  token_hash text NOT NULL UNIQUE,
  device_name text,
  device_type text, -- desktop, mobile, tablet
  browser text,
  os text,
  
  -- Location
  ip_address inet,
  location jsonb, -- {country, city, latitude, longitude}
  
  -- Status
  is_active boolean DEFAULT true,
  last_activity_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  
  created_at timestamptz DEFAULT now()
);

-- Index
CREATE INDEX idx_admin_sessions_user ON admin_sessions(user_id);
CREATE INDEX idx_admin_sessions_token ON admin_sessions(token_hash);
CREATE INDEX idx_admin_sessions_active ON admin_sessions(is_active) WHERE is_active = true;
CREATE INDEX idx_admin_sessions_expires ON admin_sessions(expires_at);

-- ============================================
-- 5. DONNÉES INITIALES
-- ============================================

-- Paramètres système par défaut
INSERT INTO system_settings (key, value, category, description) VALUES
  ('site_name', '"Leonce Ouattara Studio"', 'general', 'Nom du site'),
  ('site_description', '"Portfolio et services de développement web"', 'general', 'Description du site'),
  ('contact_email', '"contact@leonceouattara.com"', 'general', 'Email de contact principal'),
  ('maintenance_mode', 'false', 'general', 'Mode maintenance'),
  
  ('smtp_host', '""', 'email', 'Serveur SMTP'),
  ('smtp_port', '587', 'email', 'Port SMTP'),
  ('smtp_from_email', '""', 'email', 'Email d''expédition'),
  
  ('seo_title', '"Portfolio - Leonce Ouattara"', 'seo', 'Titre SEO par défaut'),
  ('seo_keywords', '["développement web", "react", "typescript", "freelance"]', 'seo', 'Mots-clés SEO'),
  
  ('google_analytics_id', '""', 'integrations', 'ID Google Analytics'),
  ('tinymce_api_key', '""', 'integrations', 'Clé API TinyMCE'),
  
  ('max_login_attempts', '5', 'security', 'Tentatives de connexion max'),
  ('session_timeout', '3600', 'security', 'Timeout session (secondes)'),
  ('password_min_length', '8', 'security', 'Longueur minimale mot de passe')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- 6. RLS POLICIES
-- ============================================

-- admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read admin_users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Super admins can manage users"
  ON admin_users FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() 
      AND role = 'super_admin' 
      AND is_active = true
    )
  );

-- system_settings
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public settings are readable by all"
  ON system_settings FOR SELECT
  TO anon, authenticated
  USING (is_public = true);

CREATE POLICY "Authenticated admins can read all settings"
  ON system_settings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() 
      AND is_active = true
    )
  );

CREATE POLICY "Super admins can manage settings"
  ON system_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() 
      AND role = 'super_admin' 
      AND is_active = true
    )
  );

-- admin_activity_logs
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own logs"
  ON admin_activity_logs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can read all logs"
  ON admin_activity_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() 
      AND role IN ('super_admin', 'admin') 
      AND is_active = true
    )
  );

CREATE POLICY "Anyone authenticated can insert logs"
  ON admin_activity_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- admin_sessions
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own sessions"
  ON admin_sessions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own sessions"
  ON admin_sessions FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================
-- 7. FONCTIONS UTILITAIRES
-- ============================================

-- Fonction pour nettoyer les sessions expirées
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM admin_sessions
  WHERE expires_at < now() OR (is_active = true AND last_activity_at < now() - INTERVAL '7 days');
END;
$$ LANGUAGE plpgsql;

-- Fonction pour loguer une activité admin
CREATE OR REPLACE FUNCTION log_admin_activity(
  p_action text,
  p_resource_type text,
  p_resource_id text DEFAULT NULL,
  p_changes jsonb DEFAULT NULL,
  p_metadata jsonb DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  v_log_id uuid;
  v_user_email text;
BEGIN
  -- Récupérer l'email de l'utilisateur
  SELECT email INTO v_user_email FROM auth.users WHERE id = auth.uid();
  
  -- Insérer le log
  INSERT INTO admin_activity_logs (
    user_id,
    user_email,
    action,
    resource_type,
    resource_id,
    changes,
    metadata,
    status
  ) VALUES (
    auth.uid(),
    v_user_email,
    p_action,
    p_resource_type,
    p_resource_id,
    p_changes,
    p_metadata,
    'success'
  ) RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 8. COMMENTAIRES
-- ============================================

COMMENT ON TABLE admin_users IS 'Profils administrateurs étendus';
COMMENT ON TABLE system_settings IS 'Paramètres système configurables';
COMMENT ON TABLE admin_activity_logs IS 'Journal d''activité des administrateurs';
COMMENT ON TABLE admin_sessions IS 'Sessions actives des administrateurs';
COMMENT ON COLUMN admin_users.role IS 'Rôles: super_admin, admin, editor, viewer';
COMMENT ON COLUMN admin_users.permissions IS 'Permissions JSON par module';
COMMENT ON COLUMN system_settings.is_public IS 'Si true, accessible sur le frontend public';
