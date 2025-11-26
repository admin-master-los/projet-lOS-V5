/**
 * Utils: Excel Exporter
 * Export de données en format Excel avec mise en forme
 */

/**
 * Structure d'une cellule Excel
 */
interface ExcelCell {
  value: any;
  style?: {
    bold?: boolean;
    color?: string;
    bgColor?: string;
    alignment?: 'left' | 'center' | 'right';
  };
}

/**
 * Créer un workbook Excel simple (sans lib externe)
 * Utilise le format HTML pour Excel
 */
export const createExcelWorkbook = (
  data: any[],
  columns: { key: string; label: string; format?: (value: any, item: any) => string }[],
  title?: string
): string => {
  let html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
    <head>
      <meta charset="UTF-8">
      <style>
        table { border-collapse: collapse; width: 100%; }
        th { 
          background-color: #06b6d4; 
          color: white; 
          font-weight: bold; 
          padding: 12px; 
          text-align: left;
          border: 1px solid #ddd;
        }
        td { 
          padding: 10px; 
          border: 1px solid #ddd;
        }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .title { 
          font-size: 24px; 
          font-weight: bold; 
          margin-bottom: 20px;
          color: #0a0a0b;
        }
        .status-pending { background-color: #fef3c7; color: #92400e; }
        .status-confirmed { background-color: #d1fae5; color: #065f46; }
        .status-completed { background-color: #dbeafe; color: #1e40af; }
        .status-cancelled { background-color: #fee2e2; color: #991b1b; }
      </style>
    </head>
    <body>
  `;

  if (title) {
    html += `<div class="title">${title}</div>`;
  }

  html += '<table>';

  // Header
  html += '<thead><tr>';
  columns.forEach(col => {
    html += `<th>${col.label}</th>`;
  });
  html += '</tr></thead>';

  // Body
  html += '<tbody>';
  data.forEach(item => {
    html += '<tr>';
    columns.forEach(col => {
      let value = item[col.key];
      
      if (col.format) {
        value = col.format(value, item);
      }
      
      // Classe spéciale pour statut
      let className = '';
      if (col.key === 'status') {
        className = `status-${item[col.key] || 'pending'}`;
      }
      
      html += `<td class="${className}">${value || ''}</td>`;
    });
    html += '</tr>';
  });
  html += '</tbody>';

  html += '</table></body></html>';

  return html;
};

/**
 * Télécharger un fichier Excel
 */
export const downloadExcel = (
  data: any[],
  columns: { key: string; label: string; format?: (value: any, item: any) => string }[],
  filename: string,
  title?: string
): void => {
  const html = createExcelWorkbook(data, columns, title);
  const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.xls`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Colonnes pour export rendez-vous Excel
 */
export const getMeetingsExcelColumns = () => [
  { key: 'id', label: 'ID' },
  { 
    key: 'meeting_date', 
    label: 'Date', 
    format: (val: string) => new Date(val).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  },
  { key: 'meeting_time', label: 'Heure' },
  { key: 'duration', label: 'Durée (min)' },
  { key: 'client_name', label: 'Client' },
  { key: 'client_email', label: 'Email' },
  { key: 'client_phone', label: 'Téléphone' },
  { key: 'client_country_code', label: 'Pays' },
  { key: 'client_company', label: 'Entreprise' },
  { 
    key: 'service_name', 
    label: 'Service',
    format: (_val: any, item: any) => item.meeting_services?.name || 'N/A'
  },
  { key: 'meeting_channel', label: 'Canal' },
  { 
    key: 'status', 
    label: 'Statut',
    format: (val: string) => {
      const statusMap: Record<string, string> = {
        pending: 'En attente',
        confirmed: 'Confirmé',
        completed: 'Terminé',
        cancelled: 'Annulé',
        no_show: 'Absent',
      };
      return statusMap[val] || val;
    }
  },
  { 
    key: 'created_at', 
    label: 'Créé le',
    format: (val: string) => new Date(val).toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  },
];

/**
 * Export rendez-vous en Excel
 */
export const exportMeetingsToExcel = (
  meetings: any[],
  filename?: string,
  title?: string
): void => {
  const defaultFilename = `rendez-vous-${new Date().toISOString().split('T')[0]}`;
  const defaultTitle = `Rendez-vous - ${new Date().toLocaleDateString('fr-FR')}`;
  const columns = getMeetingsExcelColumns();
  
  downloadExcel(
    meetings,
    columns,
    filename || defaultFilename,
    title || defaultTitle
  );
};
