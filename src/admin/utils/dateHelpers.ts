/**
 * Utils: Date Helpers
 * Fonctions utilitaires pour manipulation des dates
 */

/**
 * Formater une date en français (ex: "Lundi 15 janvier 2024")
 */
export const formatDateFR = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Formater une heure (ex: "14:30")
 */
export const formatTime = (time: string): string => {
  return time.substring(0, 5);
};

/**
 * Obtenir le nom du mois
 */
export const getMonthName = (month: number): string => {
  const months = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ];
  return months[month];
};

/**
 * Obtenir les jours d'un mois
 */
export const getDaysInMonth = (year: number, month: number): Date[] => {
  const date = new Date(year, month - 1, 1);
  const days: Date[] = [];

  while (date.getMonth() === month - 1) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return days;
};

/**
 * Obtenir le premier jour du mois (0 = dimanche)
 */
export const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month - 1, 1).getDay();
};

/**
 * Ajouter des jours à une date
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Vérifier si une date est aujourd'hui
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Vérifier si une date est un week-end
 */
export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

/**
 * Convertir date en format ISO (YYYY-MM-DD)
 */
export const toISODate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Parser une date ISO
 */
export const parseISODate = (dateString: string): Date => {
  return new Date(dateString + 'T00:00:00');
};
