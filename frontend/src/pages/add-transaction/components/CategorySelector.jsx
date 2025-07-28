import React, { useState } from 'react';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const CategorySelector = ({ value, onChange, type, error }) => {
  const expenseCategories = [
    { value: 'food', label: 'Alimentation', icon: 'UtensilsCrossed' },
    { value: 'transport', label: 'Transport', icon: 'Car' },
    { value: 'housing', label: 'Logement', icon: 'Home' },
    { value: 'utilities', label: 'Services publics', icon: 'Zap' },
    { value: 'healthcare', label: 'Santé', icon: 'Heart' },
    { value: 'entertainment', label: 'Divertissement', icon: 'Gamepad2' },
    { value: 'shopping', label: 'Achats', icon: 'ShoppingBag' },
    { value: 'education', label: 'Éducation', icon: 'GraduationCap' },
    { value: 'other', label: 'Autre', icon: 'MoreHorizontal' }
  ];

  const incomeCategories = [
    { value: 'salary', label: 'Salaire', icon: 'Briefcase' },
    { value: 'freelance', label: 'Freelance', icon: 'Laptop' },
    { value: 'investment', label: 'Investissement', icon: 'TrendingUp' },
    { value: 'rental', label: 'Location', icon: 'Building' },
    { value: 'bonus', label: 'Prime', icon: 'Gift' },
    { value: 'other', label: 'Autre', icon: 'MoreHorizontal' }
  ];

  const categories = type === 'expense' ? expenseCategories : incomeCategories;

  const categoryOptions = categories.map(cat => ({
    value: cat.value,
    label: cat.label,
    description: cat.icon
  }));

  return (
    <div className="mb-6">
      <Select
        label="Catégorie"
        placeholder="Sélectionner une catégorie"
        options={categoryOptions}
        value={value}
        onChange={onChange}
        error={error}
        required
        searchable
      />
      
      {/* Visual category grid for quick selection */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        {categories.slice(0, 6).map((category) => (
          <button
            key={category.value}
            type="button"
            onClick={() => onChange(category.value)}
            className={`flex flex-col items-center p-3 rounded-lg border transition-smooth ${
              value === category.value
                ? 'border-primary bg-primary/10 text-primary' :'border-border hover:border-primary/50 hover:bg-muted'
            }`}
          >
            <Icon name={category.icon} size={24} className="mb-1" />
            <span className="text-xs font-medium text-center">{category.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;