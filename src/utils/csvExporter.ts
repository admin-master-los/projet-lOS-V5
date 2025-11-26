/**
 * Utils: CSV Exporter
 * Export de données en format CSV
 */

export interface CSVColumn {
  key: string;
  label: string;
  format?: (value: any, item?: any) => string; // ← item optionnel
}

/**
 * Convertir des données en CSV
 */
export const convertToCSV = (
  data: any[],
  columns: CSVColumn[]
): string => {
  if (!data || data.length === 0) {
    return '';
  }

  // Header
  const header = columns.map(col => `"${col.label}"`).join(',');

  // Rows
  const rows = data.map(item => {
    return columns
      .map(col => {
        let value = item[col.key];
        
        // Appliquer format si disponible
        if (col.format) {
          value = col.format(value, item); // ← Ajouter item comme 2e paramètre
        }
        
        // Échapper les guillemets et retours à la ligne
        if (typeof value === 'string') {
          value = value.replace(/"/g, '""');
          value = value.replace(/\n/g, ' ');
        }
        
        return `"${value || ''}"`;
      })
      .join(',');
  });

  return [header, ...rows].join('\n');
};

/**
 * Télécharger un fichier CSV
 */
export const downloadCSV = (
  data: any[],
  columns: CSVColumn[],
  filename: string
): void => {
  const csv = convertToCSV(data, columns);
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Colonnes pour export rendez-vous
 */
export const getMeetingsCSVColumns = (): CSVColumn[] => [
  { key: 'id', label: 'ID' },
  { key: 'meeting_date', label: 'Date', format: (val) => new Date(val).toLocaleDateString('fr-FR') },
  { key: 'meeting_time', label: 'Heure' },
  { key: 'duration', label: 'Durée (min)' },
  { key: 'client_name', label: 'Client' },
  { key: 'client_email', label: 'Email' },
  { key: 'client_phone', label: 'Téléphone' },
  { key: 'client_country_code', label: 'Pays' },
  { key: 'client_company', label: 'Entreprise' },
  { key: 'service_name', label: 'Service', format: (val, item) => item.meeting_services?.name || 'N/A' },
  { key: 'meeting_channel', label: 'Canal' },
  { key: 'status', label: 'Statut', format: (val) => {
    const statusMap: Record<string, string> = {
      pending: 'En attente',
      confirmed: 'Confirmé',
      completed: 'Terminé',
      cancelled: 'Annulé',
      no_show: 'Absent',
    };
    return statusMap[val] || val;
  }},
  { key: 'created_at', label: 'Créé le', format: (val) => new Date(val).toLocaleString('fr-FR') },
];

/**
 * Export rendez-vous en CSV
 */
export const exportMeetingsToCSV = (meetings: any[], filename?: string): void => {
  const defaultFilename = `rendez-vous-${new Date().toISOString().split('T')[0]}`;
  const columns = getMeetingsCSVColumns();
  downloadCSV(meetings, columns, filename || defaultFilename);
};
