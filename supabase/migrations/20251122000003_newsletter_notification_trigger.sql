-- Migration: Trigger notification pour nouveaux abonnés newsletter
-- Crée automatiquement une notification quand quelqu'un s'inscrit

-- Fonction pour créer notification newsletter
CREATE OR REPLACE FUNCTION create_newsletter_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notifications (type, title, message, link, data)
  VALUES (
    'success',
    'Nouvel abonné newsletter',
    NEW.email || COALESCE(' (' || NEW.first_name || ' ' || NEW.last_name || ')', ''),
    '/admin/newsletters',
    jsonb_build_object(
      'subscriber_id', NEW.id,
      'email', NEW.email,
      'first_name', NEW.first_name,
      'last_name', NEW.last_name,
      'source', NEW.source
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer trigger sur INSERT newsletter_subscribers
DROP TRIGGER IF EXISTS on_newsletter_subscriber_created ON public.newsletter_subscribers;
CREATE TRIGGER on_newsletter_subscriber_created
  AFTER INSERT ON public.newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION create_newsletter_notification();

-- Commentaire
COMMENT ON FUNCTION create_newsletter_notification() IS 'Crée notification automatique pour nouvel abonné newsletter';
