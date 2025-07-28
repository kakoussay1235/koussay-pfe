import React, { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';


const BulkBudgetModal = ({ isOpen, onClose, categories, onBulkUpdate }) => {
  const [adjustmentType, setAdjustmentType] = useState('percentage');
  const [adjustmentValue, setAdjustmentValue] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [errors, setErrors] = useState({});

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(categories.map(cat => cat.id));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (selectedCategories.length === 0) {
      newErrors.categories = 'Please select at least one category';
    }
    
    if (!adjustmentValue || parseFloat(adjustmentValue) <= 0) {
      newErrors.adjustmentValue = 'Adjustment value must be greater than 0';
    }

    if (adjustmentType === 'percentage' && parseFloat(adjustmentValue) > 1000) {
      newErrors.adjustmentValue = 'Percentage cannot exceed 1000%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateNewBudgets = () => {
    const value = parseFloat(adjustmentValue);
    return categories
      .filter(cat => selectedCategories.includes(cat.id))
      .map(cat => {
        let newBudget;
        if (adjustmentType === 'percentage') {
          newBudget = cat.budgetLimit * (1 + value / 100);
        } else {
          newBudget = cat.budgetLimit + value;
        }
        return {
          ...cat,
          newBudgetLimit: Math.max(0, newBudget)
        };
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const updatedCategories = calculateNewBudgets();
      onBulkUpdate(updatedCategories);
      
      // Reset form
      setAdjustmentValue('');
      setSelectedCategories([]);
      setErrors({});
      onClose();
    }
  };

  const handleClose = () => {
    setAdjustmentValue('');
    setSelectedCategories([]);
    setErrors({});
    onClose();
  };

  const previewCategories = adjustmentValue ? calculateNewBudgets() : [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Bulk Budget Adjustment"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Adjustment Type */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-card-foreground">
            Adjustment Type
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="adjustmentType"
                value="percentage"
                checked={adjustmentType === 'percentage'}
                onChange={(e) => setAdjustmentType(e.target.value)}
                className="w-4 h-4 text-primary"
              />
              <span className="text-sm text-card-foreground">Percentage</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="adjustmentType"
                value="fixed"
                checked={adjustmentType === 'fixed'}
                onChange={(e) => setAdjustmentType(e.target.value)}
                className="w-4 h-4 text-primary"
              />
              <span className="text-sm text-card-foreground">Fixed Amount (€)</span>
            </label>
          </div>
        </div>

        {/* Adjustment Value */}
        <Input
          label={adjustmentType === 'percentage' ? 'Percentage Increase/Decrease (%)' : 'Amount to Add/Subtract (€)'}
          type="number"
          value={adjustmentValue}
          onChange={(e) => setAdjustmentValue(e.target.value)}
          placeholder={adjustmentType === 'percentage' ? 'e.g., 10 for 10% increase, -5 for 5% decrease' : 'e.g., 100 to add €100, -50 to subtract €50'}
          error={errors.adjustmentValue}
          required
          step={adjustmentType === 'percentage' ? '0.1' : '0.01'}
        />

        {/* Category Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-card-foreground">
              Select Categories
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
            >
              {selectedCategories.length === categories.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
          
          {errors.categories && (
            <p className="text-sm text-error">{errors.categories}</p>
          )}

          <div className="max-h-48 overflow-y-auto space-y-2 border border-border rounded-lg p-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded-md">
                <Checkbox
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCategoryToggle(category.id)}
                />
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${category.color}`}>
                  <Icon name={category.icon} size={16} color="white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-card-foreground">{category.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Current: €{category.budgetLimit.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preview */}
        {previewCategories.length > 0 && (
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm font-medium text-card-foreground mb-3">Preview Changes</p>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {previewCategories.map((category) => (
                <div key={category.id} className="flex items-center justify-between text-sm">
                  <span className="text-card-foreground">{category.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">
                      €{category.budgetLimit.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <span className="font-medium text-card-foreground">
                      €{category.newBudgetLimit.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="default"
            iconName="Save"
            iconPosition="left"
          >
            Apply Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BulkBudgetModal;