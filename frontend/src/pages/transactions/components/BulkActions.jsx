import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const BulkActions = ({ selectedCount, onCategorize, onDelete, onExport, onClearSelection }) => {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Icon name="Check" size={16} color="white" />
          </div>
          <span className="text-sm font-medium text-card-foreground">
            {selectedCount} transaction{selectedCount > 1 ? 's' : ''} sélectionnée{selectedCount > 1 ? 's' : ''}
          </span>
        </div>
        
        <button
          onClick={onClearSelection}
          className="text-sm text-muted-foreground hover:text-card-foreground transition-smooth"
        >
          Désélectionner tout
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          iconName="Tag"
          iconPosition="left"
          onClick={onCategorize}
        >
          Catégoriser
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          iconName="Download"
          iconPosition="left"
          onClick={onExport}
        >
          Exporter
        </Button>
        
        <Button
          variant="destructive"
          size="sm"
          iconName="Trash2"
          iconPosition="left"
          onClick={onDelete}
        >
          Supprimer
        </Button>
      </div>
    </div>
  );
};

export default BulkActions;