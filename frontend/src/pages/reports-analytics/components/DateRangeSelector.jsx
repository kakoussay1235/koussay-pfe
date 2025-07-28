import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DateRangeSelector = ({ selectedRange, onRangeChange, customRange, onCustomRangeChange }) => {
  const [showCustom, setShowCustom] = useState(false);

  const predefinedRanges = [
    { id: 'week', label: 'Cette semaine', value: 'week' },
    { id: 'month', label: 'Ce mois', value: 'month' },
    { id: 'quarter', label: 'Ce trimestre', value: 'quarter' },
    { id: 'year', label: 'Cette année', value: 'year' },
    { id: 'custom', label: 'Personnalisé', value: 'custom' }
  ];

  const handleRangeSelect = (range) => {
    if (range === 'custom') {
      setShowCustom(true);
    } else {
      setShowCustom(false);
      onRangeChange(range);
    }
  };

  const handleCustomApply = () => {
    if (customRange.startDate && customRange.endDate) {
      onRangeChange('custom');
      setShowCustom(false);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-card-foreground">Période d'analyse</h3>
        <Icon name="Calendar" size={16} className="text-muted-foreground" />
      </div>

      {/* Predefined Ranges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {predefinedRanges.map((range) => (
          <button
            key={range.id}
            onClick={() => handleRangeSelect(range.value)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
              selectedRange === range.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Custom Date Range */}
      {showCustom && (
        <div className="border-t border-border pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Date de début
              </label>
              <input
                type="date"
                value={customRange.startDate || ''}
                onChange={(e) => onCustomRangeChange({ ...customRange, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Date de fin
              </label>
              <input
                type="date"
                value={customRange.endDate || ''}
                onChange={(e) => onCustomRangeChange({ ...customRange, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCustom(false)}
            >
              Annuler
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleCustomApply}
              disabled={!customRange.startDate || !customRange.endDate}
            >
              Appliquer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeSelector;