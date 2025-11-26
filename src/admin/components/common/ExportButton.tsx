/**
 * Component: ExportButton
 * Bouton avec modal pour exporter en CSV ou PDF
 */

import React, { useState } from 'react';
import { Download, FileSpreadsheet, Printer, X } from 'lucide-react';
import { exportMeetingsToCSV } from '../../../utils/csvExporter';
import { exportMeetingsToPDF } from '../../../utils/pdfExporter';
import toast from 'react-hot-toast';

interface ExportButtonProps {
  data: any[];
  filename?: string;
  title?: string;
  disabled?: boolean;
  className?: string;
}

type ExportFormat = 'csv' | 'pdf';

const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  filename,
  title,
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: ExportFormat) => {
    if (!data || data.length === 0) {
      toast.error('Aucune donnée à exporter');
      return;
    }

    setIsExporting(true);

    try {
      const exportFilename = filename || `export-${Date.now()}`;

      switch (format) {
        case 'csv':
          exportMeetingsToCSV(data, exportFilename);
          toast.success('Export CSV terminé !');
          break;
        case 'pdf':
          exportMeetingsToPDF(data, title);
          toast.success('Export PDF lancé !');
          break;
      }

      // Fermer modal après export réussi
      setTimeout(() => {
        setIsOpen(false);
      }, 500);
    } catch (error) {
      console.error('Erreur export:', error);
      toast.error("Erreur lors de l'export");
    } finally {
      setTimeout(() => setIsExporting(false), 1000);
    }
  };

  return (
    <>
      {/* Bouton Export */}
      <button
        onClick={() => setIsOpen(true)}
        disabled={disabled || isExporting}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-medium
          transition-all duration-200
          ${
            disabled || isExporting
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-cyan-500 text-white hover:bg-cyan-600 active:scale-95'
          }
          ${className}
        `}
      >
        <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
        <span>{isExporting ? 'Export...' : 'Exporter'}</span>
      </button>

      {/* Modal Export */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[200] p-4"
          onClick={() => !isExporting && setIsOpen(false)}
        >
          <div 
            className="bg-gray-900 rounded-xl border border-white/10 max-w-md w-full animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Exporter les données</h3>
                <p className="text-sm text-gray-400 mt-1">
                  Choisissez le format d'export
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                disabled={isExporting}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Boutons Export */}
            <div className="p-6 space-y-3">
              {/* CSV */}
              <button
                onClick={() => handleExport('csv')}
                disabled={isExporting}
                className="w-full flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed group hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                  <FileSpreadsheet className="w-6 h-6 text-green-400" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-white font-medium">Exporter CSV</div>
                  <div className="text-xs text-gray-400">
                    Format tableur, compatible Excel
                  </div>
                </div>
              </button>

              {/* PDF */}
              <button
                onClick={() => handleExport('pdf')}
                disabled={isExporting}
                className="w-full flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed group hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                  <Printer className="w-6 h-6 text-red-400" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-white font-medium">Exporter PDF</div>
                  <div className="text-xs text-gray-400">
                    Document imprimable et partageable
                  </div>
                </div>
              </button>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10">
              <button
                onClick={() => setIsOpen(false)}
                disabled={isExporting}
                className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExportButton;
