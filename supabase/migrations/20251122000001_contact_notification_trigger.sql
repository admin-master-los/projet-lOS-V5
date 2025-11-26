-- Migration: Trigger notification pour nouveaux contacts
-- Crée automatiquement une notification quand un contact est envoyé

-- Fonction pour créer notification contact
CREATE OR REPLACE FUNCTION create_contact_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notifications (type, title, message, link, data)
  VALUES (
    'info',
    'Nouveau message de contact',
    NEW.name || ' - ' || COALESCE(NEW.company, 'Particulier') || ' (' || NEW.budget || ')',
    '/admin/contacts',
    jsonb_build_object(
      'contact_id', NEW.id,
      'name', NEW.name,
      'email', NEW.email,
      'company', NEW.company,
      'budget', NEW.budget,
      'project', LEFT(NEW.project, 100)
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer trigger sur INSERT contact
DROP TRIGGER IF EXISTS on_contact_created ON public.contact;
CREATE TRIGGER on_contact_created
  AFTER INSERT ON public.contact
  FOR EACH ROW
  EXECUTE FUNCTION create_contact_notification();

-- Commentaire
COMMENT ON FUNCTION create_contact_notification() IS 'Crée notification automatique pour nouveau contact';
