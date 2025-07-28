import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FilterPanel = ({ filters, onFiltersChange, onClose, isOpen }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const categoryOptions = [
    { value: '', label: 'Toutes les catégories' },
    { value: 'alimentation', label: 'Alimentation' },
    { value: 'transport', label: 'Transport' },
    { value: 'logement', label: 'Logement' },
    { value: 'sante', label: 'Santé' },
    { value: 'loisirs', label: 'Loisirs' },
    { value: 'education', label: 'Éducation' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'services', label: 'Services' },
    { value: 'salaire', label: 'Salaire' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'investissements', label: 'Investissements' },
    { value: 'autres', label: 'Autres' }
  ];

  const memberOptions = [
    { value: '', label: 'Tous les membres' },
    { value: 'marie', label: 'Marie Dubois' },
    { value: 'pierre', label: 'Pierre Dubois' },
    { value: 'sophie', label: 'Sophie Dubois' },
    { value: 'lucas', label: 'Lucas Dubois' }
  ];

  const typeOptions = [
    { value: '', label: 'Tous les types' },
    { value: 'income', label: 'Revenus' },
    { value: 'expense', label: 'Dépenses' }
  ];

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleResetFilters = () => {
    const resetFilters = {
      dateFrom: '',
      dateTo: '',
      category: '',
      member: '',
      type: '',
      amountMin: '',
      amountMax: '',
      search: ''
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Overlay */}
      <div className="lg:hidden fixed inset-0 bg-black/50 z-200" onClick={onClose} />
      
      {/* Filter Panel */}
      <div className={`
        fixed lg:static inset-x-0 bottom-0 lg:inset-auto
        bg-card border-t lg:border border-border rounded-t-lg lg:rounded-lg
        z-300 lg:z-auto max-h-[80vh] lg:max-h-none overflow-y-auto
        ${isOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}
        transition-transform duration-300 lg:transition-none
      `}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-card-foreground">Filtres</h3>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-md hover:bg-muted transition-smooth"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <Input
              label="Rechercher"
              type="search"
              placeholder="Description ou montant..."
              value={localFilters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>

          {/* Date Range */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-card-foreground mb-3">Période</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Du"
                type="date"
                value={localFilters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              />
              <Input
                label="Au"
                type="date"
                value={localFilters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              />
            </div>
          </div>

          {/* Type Filter */}
          <div className="mb-6">
            <Select
              label="Type de transaction"
              options={typeOptions}
              value={localFilters.type}
              onChange={(value) => handleFilterChange('type', value)}
            />
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <Select
              label="Catégorie"
              options={categoryOptions}
              value={localFilters.category}
              onChange={(value) => handleFilterChange('category', value)}
              searchable
            />
          </div>

          {/* Member Filter */}
          <div className="mb-6">
            <Select
              label="Membre de la famille"
              options={memberOptions}
              value={localFilters.member}
              onChange={(value) => handleFilterChange('member', value)}
            />
          </div>

          {/* Amount Range */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-card-foreground mb-3">Montant (€)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Minimum"
                type="number"
                placeholder="0"
                value={localFilters.amountMin}
                onChange={(e) => handleFilterChange('amountMin', e.target.value)}
              />
              <Input
                label="Maximum"
                type="number"
                placeholder="10000"
                value={localFilters.amountMax}
                onChange={(e) => handleFilterChange('amountMax', e.target.value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="default"
              onClick={handleApplyFilters}
              iconName="Filter"
              iconPosition="left"
              fullWidth
            >
              Appliquer les filtres
            </Button>
            <Button
              variant="outline"
              onClick={handleResetFilters}
              iconName="RotateCcw"
              iconPosition="left"
              fullWidth
            >
              Réinitialiser
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;