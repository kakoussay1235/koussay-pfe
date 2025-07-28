import React from 'react';
import Button from '../../../components/ui/Button';

const FormActions = ({ onSave, onCancel, isLoading, isValid }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
      <Button
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
        className="flex-1 sm:flex-none sm:w-32"
      >
        Annuler
      </Button>
      
      <Button
        variant="default"
        onClick={onSave}
        loading={isLoading}
        disabled={!isValid}
        iconName="Check"
        iconPosition="left"
        className="flex-1"
      >
        Enregistrer la transaction
      </Button>
    </div>
  );
};

export default FormActions;