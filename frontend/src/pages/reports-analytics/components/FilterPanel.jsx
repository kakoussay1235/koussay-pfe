import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FilterPanel = ({ 
  filters, 
  onFiltersChange, 
  isOpen, 
  onToggle,
  categories = [],
  members = []
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onToggle();
  };

  const handleResetFilters = () => {
    const resetFilters = {
      categories: [],
      members: [],
      transactionType: 'all',
      amountRange: { min: '', max: '' }
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const handleCategoryToggle = (categoryId) => {
    const currentCategories = localFilters.categories || [];
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter(id => id !== categoryId)
      : [...currentCategories, categoryId];
    handleFilterChange('categories', newCategories);
  };

  const handleMemberToggle = (memberId) => {
    const currentMembers = localFilters.members || [];
    const newMembers = currentMembers.includes(memberId)
      ? currentMembers.filter(id => id !== memberId)
      : [...currentMembers, memberId];
    handleFilterChange('members', newMembers);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Filter Panel */}
      <div className={`
        fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 lg:relative lg:border lg:rounded-lg lg:shadow-card
        transform transition-transform duration-300 lg:transform-none
        ${isOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}
      `}>
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-border lg:hidden">
          <h3 className="text-lg font-semibold text-card-foreground">Filtres</h3>
          <button
            onClick={onToggle}
            className="p-2 rounded-md hover:bg-muted transition-smooth"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-card-foreground">Filtres</h3>
        </div>

        {/* Filter Content */}
        <div className="p-4 max-h-96 lg:max-h-none overflow-y-auto">
          {/* Transaction Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-card-foreground mb-3">
              Type de transaction
            </label>
            <div className="space-y-2">
              {[
                { value: 'all', label: 'Toutes' },
                { value: 'income', label: 'Revenus' },
                { value: 'expense', label: 'Dépenses' }
              ].map((type) => (
                <label key={type.value} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="transactionType"
                    value={type.value}
                    checked={localFilters.transactionType === type.value}
                    onChange={(e) => handleFilterChange('transactionType', e.target.value)}
                    className="w-4 h-4 text-primary border-border focus:ring-primary"
                  />
                  <span className="text-sm text-muted-foreground">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-card-foreground mb-3">
              Catégories
            </label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={localFilters.categories?.includes(category.id) || false}
                    onChange={() => handleCategoryToggle(category.id)}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <span className="text-sm text-muted-foreground">{category.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Members */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-card-foreground mb-3">
              Membres
            </label>
            <div className="space-y-2">
              {members.map((member) => (
                <label key={member.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={localFilters.members?.includes(member.id) || false}
                    onChange={() => handleMemberToggle(member.id)}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <span className="text-sm text-muted-foreground">{member.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Amount Range */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-card-foreground mb-3">
              Montant (€)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Min"
                value={localFilters.amountRange?.min || ''}
                onChange={(e) => handleFilterChange('amountRange', {
                  ...localFilters.amountRange,
                  min: e.target.value
                })}
                className="px-3 py-2 border border-border rounded-md bg-input text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Max"
                value={localFilters.amountRange?.max || ''}
                onChange={(e) => handleFilterChange('amountRange', {
                  ...localFilters.amountRange,
                  max: e.target.value
                })}
                className="px-3 py-2 border border-border rounded-md bg-input text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-border bg-muted/50">
          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              className="flex-1"
            >
              Réinitialiser
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleApplyFilters}
              className="flex-1"
            >
              Appliquer
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;