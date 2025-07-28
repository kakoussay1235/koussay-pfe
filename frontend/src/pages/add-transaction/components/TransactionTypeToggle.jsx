import React from 'react';
import Button from '../../../components/ui/Button';

const TransactionTypeToggle = ({ type, onChange }) => {
  return (
    <div className="flex bg-muted rounded-lg p-1 mb-6">
      <Button
        variant={type === 'expense' ? 'default' : 'ghost'}
        onClick={() => onChange('expense')}
        className="flex-1 rounded-md"
      >
        Dépense
      </Button>
      <Button
        variant={type === 'income' ? 'default' : 'ghost'}
        onClick={() => onChange('income')}
        className="flex-1 rounded-md"
      >
        Revenu
      </Button>
    </div>
  );
};

export default TransactionTypeToggle;