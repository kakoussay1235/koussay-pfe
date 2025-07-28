import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExportControls = ({ onExport, isExporting = false }) => {
  const [showOptions, setShowOptions] = useState(false);

  const exportOptions = [
    {
      id: 'pdf-summary',
      label: 'Rapport PDF - Résumé',
      description: 'Graphiques principaux et statistiques',
      icon: 'FileText',
      format: 'pdf',
      type: 'summary'
    },
    {
      id: 'pdf-detailed',
      label: 'Rapport PDF - Détaillé',
      description: 'Tous les graphiques et données',
      icon: 'FileText',
      format: 'pdf',
      type: 'detailed'
    },
    {
      id: 'csv-transactions',
      label: 'Export CSV - Transactions',
      description: 'Données brutes des transactions',
      icon: 'Download',
      format: 'csv',
      type: 'transactions'
    },
    {
      id: 'csv-summary',
      label: 'Export CSV - Résumé',
      description: 'Données agrégées par catégorie',
      icon: 'Download',
      format: 'csv',
      type: 'summary'
    }
  ];

  const handleExport = (option) => {
    onExport(option);
    setShowOptions(false);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        iconName="Download"
        iconPosition="left"
        onClick={() => setShowOptions(!showOptions)}
        disabled={isExporting}
        loading={isExporting}
      >
        Exporter
      </Button>

      {showOptions && (
        <>
          {/* Mobile Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setShowOptions(false)}
          />

          {/* Export Options */}
          <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg shadow-modal z-50">
            <div className="p-4 border-b border-border">
              <h3 className="text-sm font-semibold text-popover-foreground">
                Options d'export
              </h3>
            </div>
            
            <div className="p-2">
              {exportOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleExport(option)}
                  className="w-full flex items-start space-x-3 p-3 rounded-md hover:bg-muted transition-smooth text-left"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <Icon name={option.icon} size={16} className="text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-popover-foreground">
                      {option.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {option.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-4 border-t border-border bg-muted/50">
              <p className="text-xs text-muted-foreground">
                Les exports incluent les données de la période sélectionnée et les filtres appliqués.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ExportControls;