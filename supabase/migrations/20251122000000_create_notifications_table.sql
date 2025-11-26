-- Migration: Create notifications table
-- Store notifications in database instead of localStorage

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error', 'meeting')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  link TEXT,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);

-- Enable Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL Security;

-- Policy: Allow all operations (since it's admin only)
CREATE POLICY "Allow all operations on notifications"
  ON public.notifications
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to auto-create notification on new meeting
CREATE OR REPLACE FUNCTION create_meeting_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notifications (type, title, message, link, data)
  VALUES (
    'meeting',
    'Nouveau rendez-vous',
    NEW.client_name || ' - ' || TO_CHAR(NEW.meeting_date, 'DD/MM/YYYY') || ' à ' || NEW.meeting_time,
    '/admin/meetings',
    jsonb_build_object(
      'meeting_id', NEW.id,
      'client_name', NEW.client_name,
      'client_email', NEW.client_email,
      'meeting_date', NEW.meeting_date,
      'meeting_time', NEW.meeting_time,
      'service_id', NEW.service_id
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on meetings INSERT
DROP TRIGGER IF EXISTS on_meeting_created ON public.meetings;
CREATE TRIGGER on_meeting_created
  AFTER INSERT ON public.meetings
  FOR EACH ROW
  EXECUTE FUNCTION create_meeting_notification();

-- Comment
COMMENT ON TABLE public.notifications IS 'Store application notifications';
COMMENT ON COLUMN public.notifications.type IS 'Type: info, success, warning, error, meeting';
COMMENT ON COLUMN public.notifications.read IS 'Whether notification has been read';
COMMENT ON COLUMN public.notifications.data IS 'Additional data as JSON';
