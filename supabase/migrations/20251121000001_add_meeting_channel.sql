-- ============================================
-- Migration: Ajouter canal de rendez-vous
-- ============================================
-- Fichier: 20251121000001_add_meeting_channel.sql
-- ============================================

-- 1. Créer le type ENUM pour les canaux
CREATE TYPE meeting_channel_type AS ENUM (
  'zoom',
  'google_meet',
  'microsoft_teams',
  'whatsapp_video',
  'skype',
  'phone',
  'in_person'
);

-- 2. Ajouter la colonne à la table meetings
ALTER TABLE meetings 
ADD COLUMN meeting_channel meeting_channel_type DEFAULT 'zoom';

-- 3. Ajouter la colonne pour le lien/numéro
ALTER TABLE meetings 
ADD COLUMN meeting_link text;

-- 4. Ajouter commentaires
COMMENT ON COLUMN meetings.meeting_channel IS 
'Canal de communication pour le rendez-vous (Zoom, Google Meet, etc.)';

COMMENT ON COLUMN meetings.meeting_link IS 
'Lien de la réunion ou numéro de téléphone selon le canal choisi';

-- 5. Créer index pour performance
CREATE INDEX idx_meetings_channel ON meetings(meeting_channel);

-- 6. Vérification
SELECT 
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'meetings'
  AND column_name IN ('meeting_channel', 'meeting_link');

-- ============================================
-- ROLLBACK (si besoin)
-- ============================================
-- ALTER TABLE meetings DROP COLUMN IF EXISTS meeting_channel;
-- ALTER TABLE meetings DROP COLUMN IF EXISTS meeting_link;
-- DROP TYPE IF EXISTS meeting_channel_type;
-- ============================================
