/**
 * Types: Booking System
 * Types pour le système de réservation public
 */

export type MeetingChannel = 
  | 'zoom'
  | 'google_meet'
  | 'microsoft_teams'
  | 'whatsapp_video'
  | 'skype'
  | 'phone'
  | 'in_person';

export interface ChannelOption {
  value: MeetingChannel;
  label: string;
  icon: string;
  description: string;
}

export interface BookingData {
  // Service sélectionné
  service: {
    id: string;
    name: string;
    duration: number;
    color: string;
    description: string | null;
  } | null;

  // Date et heure choisies
  date: string | null;
  time: string | null;

  // Informations client
  client: {
    name: string;
    email: string;
    phone: string;
    countryCode: string;
    company: string;
    notes: string;
  } | null;

  // Canal de communication
  channel: MeetingChannel | null;

  // Acceptation des conditions
  acceptTerms: boolean;
}

export type BookingStep = 'service' | 'datetime' | 'contact' | 'confirmation';

export interface TimeSlot {
  time: string;
  available: boolean;
  reason?: string;
}

export interface DayAvailability {
  date: string;
  available: boolean;
  slots: TimeSlot[];
  blocked?: boolean;
  reason?: string;
}
