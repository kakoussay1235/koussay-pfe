import React, { useState } from 'react';

import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const ReservedFundsAllocation = ({ allocation, onChange, totalAmount }) => {
  const [allocationType, setAllocationType] = useState('percentage');

  const reservedFunds = [
    { value: 'emergency', label: 'Fonds d\'urgence', icon: 'Shield', color: 'text-red-600' },
    { value: 'savings', label: 'Épargne', icon: 'PiggyBank', color: 'text-green-600' },
    { value: 'leisure', label: 'Loisirs', icon: 'Gamepad2', color: 'text-blue-600' }
  ];

  const handleAllocationChange = (fundId, value) => {
    const updatedAllocation = { ...allocation };
    if (value === '' || value === '0') {
      delete updatedAllocation[fundId];
    } else {
      updatedAllocation[fundId] = {
        type: allocationType,
        value: parseFloat(value) || 0
      };
    }
    onChange(updatedAllocation);
  };

  const calculateAmount = (fundId) => {
    if (!allocation[fundId] || !totalAmount) return 0;
    const { type, value } = allocation[fundId];
    if (type === 'percentage') {
      return (parseFloat(totalAmount) * value / 100).toFixed(2);
    }
    return value;
  };

  const getTotalAllocated = () => {
    return Object.keys(allocation).reduce((total, fundId) => {
      const amount = calculateAmount(fundId);
      return total + parseFloat(amount || 0);
    }, 0);
  };

  const getRemainingAmount = () => {
    const total = parseFloat(totalAmount) || 0;
    const allocated = getTotalAllocated();
    return Math.max(0, total - allocated);
  };

  return (
    <div className="mb-6 p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground">Allocation aux fonds réservés</h3>
        <div className="flex bg-background rounded-md p-1">
          <button
            type="button"
            onClick={() => setAllocationType('percentage')}
            className={`px-3 py-1 text-xs rounded transition-smooth ${
              allocationType === 'percentage' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            %
          </button>
          <button
            type="button"
            onClick={() => setAllocationType('fixed')}
            className={`px-3 py-1 text-xs rounded transition-smooth ${
              allocationType === 'fixed' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            €
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {reservedFunds.map((fund) => (
          <div key={fund.value} className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 flex-1">
              <Icon name={fund.icon} size={16} className={fund.color} />
              <span className="text-sm font-medium">{fund.label}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                placeholder="0"
                value={allocation[fund.value]?.value || ''}
                onChange={(e) => handleAllocationChange(fund.value, e.target.value)}
                className="w-20 text-center"
                min="0"
                max={allocationType === 'percentage' ? '100' : totalAmount}
                step={allocationType === 'percentage' ? '1' : '0.01'}
              />
              <span className="text-xs text-muted-foreground w-8">
                {allocationType === 'percentage' ? '%' : '€'}
              </span>
              {allocationType === 'percentage' && allocation[fund.value] && (
                <span className="text-xs text-muted-foreground w-12">
                  {calculateAmount(fund.value)}€
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {totalAmount && (
        <div className="mt-4 pt-3 border-t border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total alloué:</span>
            <span className="font-medium">{getTotalAllocated().toFixed(2)}€</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Restant:</span>
            <span className="font-medium">{getRemainingAmount().toFixed(2)}€</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservedFundsAllocation;