/**
 * Utils: PDF Exporter
 * Export de données en format PDF
 * Utilise l'API print du navigateur pour simplicité
 */

/**
 * Créer un document HTML pour PDF
 */
export const createPDFDocument = (
  data: any[],
  columns: { key: string; label: string; format?: (value: any, item: any) => string }[],
  title?: string
): string => {
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        @page { size: A4 landscape; margin: 1cm; }
        body { 
          font-family: Arial, sans-serif; 
          padding: 20px;
          color: #0a0a0b;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 3px solid #06b6d4;
          padding-bottom: 20px;
        }
        .title { 
          font-size: 28px; 
          font-weight: bold;
          color: #06b6d4;
          margin-bottom: 10px;
        }
        .subtitle {
          font-size: 14px;
          color: #666;
        }
        table { 
          border-collapse: collapse; 
          width: 100%;
          font-size: 11px;
        }
        th { 
          background-color: #06b6d4; 
          color: white; 
          font-weight: bold; 
          padding: 10px 8px; 
          text-align: left;
          border: 1px solid #0891b2;
        }
        td { 
          padding: 8px; 
          border: 1px solid #ddd;
        }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .status-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: bold;
          display: inline-block;
        }
        .status-pending { background-color: #fef3c7; color: #92400e; }
        .status-confirmed { background-color: #d1fae5; color: #065f46; }
        .status-completed { background-color: #dbeafe; color: #1e40af; }
        .status-cancelled { background-color: #fee2e2; color: #991b1b; }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 10px;
          color: #666;
          border-top: 1px solid #ddd;
          padding-top: 10px;
        }
        @media print {
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">${title || 'Rendez-vous'}</div>
        <div class="subtitle">Généré le ${new Date().toLocaleString('fr-FR')}</div>
      </div>
      
      <table>
        <thead>
          <tr>
  `;

  // Header
  columns.forEach(col => {
    html += `<th>${col.label}</th>`;
  });
  html += '</tr></thead><tbody>';

  // Body
  data.forEach(item => {
    html += '<tr>';
    columns.forEach(col => {
      let value = item[col.key];
      
      if (col.format) {
        value = col.format(value, item);
      }
      
      // Badge pour statut
      if (col.key === 'status') {
        const statusClass = `status-${item[col.key] || 'pending'}`;
        html += `<td><span class="status-badge ${statusClass}">${value || ''}</span></td>`;
      } else {
        html += `<td>${value || ''}</td>`;
      }
    });
    html += '</tr>';
  });

  html += `
        </tbody>
      </table>
      
      <div class="footer">
        <p>Total: ${data.length} rendez-vous</p>
      </div>
    </body>
    </html>
  `;

  return html;
};

/**
 * Ouvrir PDF dans nouvelle fenêtre et imprimer
 */
export const printPDF = (
  data: any[],
  columns: { key: string; label: string; format?: (value: any, item: any) => string }[],
  title?: string
): void => {
  const html = createPDFDocument(data, columns, title);
  const printWindow = window.open('', '_blank');
  
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    
    // Attendre que la page soit chargée avant d'imprimer
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  }
};

/**
 * Colonnes pour export rendez-vous PDF
 */
export const getMeetingsPDFColumns = () => [
  { 
    key: 'meeting_date', 
    label: 'Date', 
    format: (val: string) => new Date(val).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  },
  { key: 'meeting_time', label: 'Heure' },
  { key: 'client_name', label: 'Client' },
  { key: 'client_email', label: 'Email' },
  { key: 'client_phone', label: 'Tél.' },
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
];

/**
 * Export rendez-vous en PDF
 */
export const exportMeetingsToPDF = (
  meetings: any[],
  title?: string
): void => {
  const defaultTitle = `Rendez-vous - ${new Date().toLocaleDateString('fr-FR')}`;
  const columns = getMeetingsPDFColumns();
  
  printPDF(meetings, columns, title || defaultTitle);
};
