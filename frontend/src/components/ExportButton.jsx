import React, { useState } from 'react';
import { Download, FileText, FileDown, Loader2 } from 'lucide-react';
import { exportToCSV, exportToPDF } from '../services/exportService';

const ExportButton = ({
  data,
  columns,
  title = 'Export',
  filename = 'export',
  buttonText = 'Exporter',
  className = '',
  disabled = false,
  onBeforeExport = () => {},
  onAfterExport = () => {}
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handleExport = async (format) => {
    if (!data || data.length === 0) return;
    
    try {
      setIsExporting(true);
      onBeforeExport();
      
      if (format === 'csv') {
        exportToCSV(data, filename);
      } else if (format === 'pdf') {
        exportToPDF(title, data, columns, filename);
      }
      
      onAfterExport();
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
    } finally {
      setIsExporting(false);
      setShowOptions(false);
    }
  };

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <div>
        <button
          type="button"
          onClick={() => setShowOptions(!showOptions)}
          disabled={disabled || isExporting || !data || data.length === 0}
          className={`inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            disabled || isExporting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isExporting ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Export en cours...
            </>
          ) : (
            <>
              <Download className="-ml-1 mr-2 h-4 w-4" />
              {buttonText}
            </>
          )}
        </button>
      </div>

      {showOptions && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-1">
            <button
              onClick={() => handleExport('csv')}
              className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <FileText className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
              Exporter en CSV
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <FileDown className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
              Exporter en PDF
            </button>
          </div>
        </div>
      )}
      
      {/* Fermer le menu en cliquant à l'extérieur */}
      {showOptions && (
        <div 
          className="fixed inset-0 z-0"
          onClick={() => setShowOptions(false)}
        />
      )}
    </div>
  );
};

export default ExportButton;
