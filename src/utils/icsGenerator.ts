/**
 * Utils: ICS Generator
 * Génération de fichiers .ics pour calendriers
 */

interface ICSEventData {
  title: string;
  description: string;
  location: string;
  startDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  duration: number; // minutes
  organizerEmail: string;
  organizerName: string;
  attendeeEmail: string;
  attendeeName: string;
}

/**
 * Formater une date pour ICS (format: YYYYMMDDTHHmmss)
 */
const formatICSDate = (date: string, time: string): string => {
  const [year, month, day] = date.split('-');
  const [hours, minutes] = time.split(':');
  return `${year}${month}${day}T${hours}${minutes}00`;
};

/**
 * Calculer date de fin
 */
const calculateEndDate = (startDate: string, startTime: string, duration: number): string => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + duration;
  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;
  
  const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  return formatICSDate(startDate, endTime);
};

/**
 * Générer un fichier ICS
 */
export const generateICS = (data: ICSEventData): string => {
  const startDateTime = formatICSDate(data.startDate, data.startTime);
  const endDateTime = calculateEndDate(data.startDate, data.startTime, data.duration);
  const timestamp = formatICSDate(
    new Date().toISOString().split('T')[0],
    new Date().toTimeString().slice(0, 5)
  );

  // Générer UID unique
  const uid = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}@votredomaine.com`;

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Votre Entreprise//Système de réservation//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${timestamp}`,
    `DTSTART:${startDateTime}`,
    `DTEND:${endDateTime}`,
    `SUMMARY:${data.title}`,
    `DESCRIPTION:${data.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${data.location}`,
    `ORGANIZER;CN=${data.organizerName}:mailto:${data.organizerEmail}`,
    `ATTENDEE;CN=${data.attendeeName};RSVP=TRUE:mailto:${data.attendeeEmail}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'DESCRIPTION:Rappel 15 minutes avant',
    'ACTION:DISPLAY',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  return ics;
};

/**
 * Télécharger le fichier ICS
 */
export const downloadICS = (icsContent: string, filename: string = 'rendez-vous.ics'): void => {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

/**
 * Générer et télécharger ICS pour un RDV
 */
export const generateMeetingICS = (meetingData: {
  serviceName: string;
  clientName: string;
  clientEmail: string;
  meetingDate: string;
  meetingTime: string;
  duration: number;
  channel: string;
  channelLink?: string;
}): void => {
  const channelLabels: Record<string, string> = {
    zoom: 'Zoom',
    google_meet: 'Google Meet',
    microsoft_teams: 'Microsoft Teams',
    whatsapp_video: 'WhatsApp Video',
    phone: 'Téléphone',
  };

  const description = [
    `Service : ${meetingData.serviceName}`,
    `Durée : ${meetingData.duration} minutes`,
    `Canal : ${channelLabels[meetingData.channel] || meetingData.channel}`,
    meetingData.channelLink ? `Lien : ${meetingData.channelLink}` : '',
    '',
    'À bientôt !',
  ]
    .filter(Boolean)
    .join('\\n');

  const icsContent = generateICS({
    title: `${meetingData.serviceName} - ${meetingData.clientName}`,
    description,
    location: meetingData.channelLink || channelLabels[meetingData.channel] || 'En ligne',
    startDate: meetingData.meetingDate,
    startTime: meetingData.meetingTime,
    duration: meetingData.duration,
    organizerEmail: import.meta.env.VITE_ADMIN_EMAIL || 'contact@votredomaine.com',
    organizerName: import.meta.env.VITE_SENDER_NAME || 'Votre Entreprise',
    attendeeEmail: meetingData.clientEmail,
    attendeeName: meetingData.clientName,
  });

  const filename = `rdv-${meetingData.serviceName.toLowerCase().replace(/\s+/g, '-')}-${meetingData.meetingDate}.ics`;
  downloadICS(icsContent, filename);
};
