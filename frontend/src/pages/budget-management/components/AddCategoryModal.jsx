import React, { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const AddCategoryModal = ({ isOpen, onClose, onAddCategory }) => {
  const [formData, setFormData] = useState({
    name: '',
    budgetLimit: '',
    icon: 'ShoppingCart',
    color: 'bg-primary'
  });
  const [errors, setErrors] = useState({});

  const availableIcons = [
    'ShoppingCart', 'Car', 'Home', 'Utensils', 'Gamepad2', 
    'Shirt', 'Heart', 'GraduationCap', 'Plane', 'Gift'
  ];

  const availableColors = [
    { name: 'Blue', value: 'bg-primary' },
    { name: 'Teal', value: 'bg-secondary' },
    { name: 'Amber', value: 'bg-accent' },
    { name: 'Red', value: 'bg-error' },
    { name: 'Green', value: 'bg-success' },
    { name: 'Orange', value: 'bg-warning' },
    { name: 'Purple', value: 'bg-purple-600' },
    { name: 'Pink', value: 'bg-pink-600' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }
    
    if (!formData.budgetLimit || parseFloat(formData.budgetLimit) <= 0) {
      newErrors.budgetLimit = 'Budget limit must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const newCategory = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        budgetLimit: parseFloat(formData.budgetLimit),
        spent: 0,
        icon: formData.icon,
        color: formData.color,
        transactionCount: 0,
        recentTransactions: []
      };
      
      onAddCategory(newCategory);
      
      // Reset form
      setFormData({
        name: '',
        budgetLimit: '',
        icon: 'ShoppingCart',
        color: 'bg-primary'
      });
      setErrors({});
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      budgetLimit: '',
      icon: 'ShoppingCart',
      color: 'bg-primary'
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Budget Category"
      size="default"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Name */}
        <Input
          label="Category Name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="e.g., Groceries, Transportation"
          error={errors.name}
          required
        />

        {/* Budget Limit */}
        <Input
          label="Monthly Budget Limit (€)"
          type="number"
          value={formData.budgetLimit}
          onChange={(e) => handleInputChange('budgetLimit', e.target.value)}
          placeholder="0.00"
          error={errors.budgetLimit}
          required
          min="0"
          step="0.01"
        />

        {/* Icon Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-card-foreground">
            Choose Icon
          </label>
          <div className="grid grid-cols-5 gap-3">
            {availableIcons.map((iconName) => (
              <button
                key={iconName}
                type="button"
                onClick={() => handleInputChange('icon', iconName)}
                className={`p-3 rounded-lg border-2 transition-smooth ${
                  formData.icon === iconName
                    ? 'border-primary bg-primary/10' :'border-border hover:border-muted-foreground'
                }`}
              >
                <Icon name={iconName} size={20} className="mx-auto" />
              </button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-card-foreground">
            Choose Color
          </label>
          <div className="grid grid-cols-4 gap-3">
            {availableColors.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => handleInputChange('color', color.value)}
                className={`p-3 rounded-lg border-2 transition-smooth ${
                  formData.color === color.value
                    ? 'border-primary' :'border-border hover:border-muted-foreground'
                }`}
              >
                <div className={`w-8 h-8 rounded-full ${color.value} mx-auto`} />
                <span className="text-xs text-muted-foreground mt-1 block">
                  {color.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm font-medium text-card-foreground mb-3">Preview</p>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${formData.color}`}>
              <Icon name={formData.icon} size={20} color="white" />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">
                {formData.name || 'Category Name'}
              </h3>
              <p className="text-sm text-muted-foreground">
                Budget: €{formData.budgetLimit || '0.00'}
              </p>
            </div>
          </div>
        </div>

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
            iconName="Plus"
            iconPosition="left"
          >
            Add Category
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddCategoryModal;