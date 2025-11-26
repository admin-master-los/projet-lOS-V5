/**
 * Utils: Validation Schemas
 * Schémas de validation Zod pour les formulaires
 */

import { z } from 'zod';

/**
 * Schéma validation service
 */
export const serviceSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  description: z.string().optional(),
  duration: z.number().min(15, 'Durée minimum 15 minutes').max(240, 'Durée maximum 4 heures'),
  category: z.string().min(1, 'La catégorie est requise'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Couleur hexadécimale invalide'),
  icon: z.string().optional(),
});

/**
 * Schéma validation rendez-vous
 */
export const meetingSchema = z.object({
  service_id: z.string().uuid('Service invalide'),
  meeting_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date invalide'),
  meeting_time: z.string().regex(/^\d{2}:\d{2}$/, 'Heure invalide'),
  duration: z.number().min(15).max(240),
  client_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  client_email: z.string().email('Email invalide'),
  client_phone: z.string().min(6, 'Numéro de téléphone invalide'),
  client_country_code: z.string().default('+33'),
  client_company: z.string().optional(),
  client_notes: z.string().max(500, 'Notes trop longues (max 500 caractères)').optional(),
});

/**
 * Schéma validation disponibilité
 */
export const availabilitySchema = z.object({
  day_of_week: z.number().min(0).max(6),
  start_time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'Heure de début invalide'),
  end_time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'Heure de fin invalide'),
  is_available: z.boolean().default(true),
});

/**
 * Schéma validation date bloquée
 */
export const blockedDateSchema = z.object({
  blocked_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date invalide'),
  reason: z.string().optional(),
});

/**
 * Schéma validation paramètres
 */
export const settingsSchema = z.object({
  setting_key: z.string(),
  setting_value: z.string(),
  description: z.string().optional(),
});

/**
 * Schéma validation formulaire public
 */
export const publicBookingSchema = z.object({
  service: z.string().uuid('Veuillez sélectionner un service'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date invalide'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Heure invalide'),
  name: z.string().min(2, 'Votre nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(6, 'Numéro de téléphone invalide'),
  countryCode: z.string().default('+33'),
  company: z.string().optional(),
  notes: z.string().max(500, 'Vos notes sont trop longues (max 500 caractères)').optional(),
  acceptTerms: z.boolean().refine((val) => val === true, 'Vous devez accepter les conditions'),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;
export type MeetingFormData = z.infer<typeof meetingSchema>;
export type AvailabilityFormData = z.infer<typeof availabilitySchema>;
export type BlockedDateFormData = z.infer<typeof blockedDateSchema>;
export type SettingsFormData = z.infer<typeof settingsSchema>;
export type PublicBookingFormData = z.infer<typeof publicBookingSchema>;
