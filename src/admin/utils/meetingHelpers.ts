/**
 * Utils: Meeting Helpers
 * Fonctions métier pour les rendez-vous
 */

import { MeetingStatus } from '../services/meetingsService';

/**
 * Obtenir le libellé d'un statut
 */
export const getStatusLabel = (status: MeetingStatus): string => {
  const labels: Record<MeetingStatus, string> = {
    pending: 'En attente',
    confirmed: 'Confirmé',
    completed: 'Terminé',
    cancelled: 'Annulé',
    no_show: 'Absence',
  };
  return labels[status] || status;
};

/**
 * Obtenir la couleur d'un statut
 */
export const getStatusColor = (status: MeetingStatus): string => {
  const colors: Record<MeetingStatus, string> = {
    pending: 'yellow',
    confirmed: 'green',
    completed: 'blue',
    cancelled: 'red',
    no_show: 'gray',
  };
  return colors[status] || 'gray';
};

/**
 * Générer les créneaux disponibles pour une journée
 */
export const generateTimeSlots = (
  startTime: string,
  endTime: string,
  duration: number,
  bufferTime: number = 0
): string[] => {
  const slots: string[] = [];
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  const totalSlotTime = duration + bufferTime;

  for (let time = start; time + duration <= end; time += totalSlotTime) {
    slots.push(minutesToTime(time));
  }

  return slots;
};

/**
 * Vérifier si un créneau est dans le futur
 */
export const isSlotInFuture = (date: string, time: string, minAdvanceHours: number = 24): boolean => {
  const slotDateTime = new Date(date + 'T' + time);
  const now = new Date();
  const minAdvanceMs = minAdvanceHours * 60 * 60 * 1000;

  return slotDateTime.getTime() - now.getTime() >= minAdvanceMs;
};

/**
 * Calculer la fin d'un créneau
 */
export const calculateEndTime = (startTime: string, duration: number): string => {
  const start = timeToMinutes(startTime);
  const end = start + duration;
  return minutesToTime(end);
};

/**
 * Vérifier si deux créneaux se chevauchent
 */
export const doSlotsOverlap = (
  slot1Start: string,
  slot1Duration: number,
  slot2Start: string,
  slot2Duration: number
): boolean => {
  const s1Start = timeToMinutes(slot1Start);
  const s1End = s1Start + slot1Duration;
  const s2Start = timeToMinutes(slot2Start);
  const s2End = s2Start + slot2Duration;

  return (
    (s1Start >= s2Start && s1Start < s2End) ||
    (s1End > s2Start && s1End <= s2End) ||
    (s1Start <= s2Start && s1End >= s2End)
  );
};

// Helper functions
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}
