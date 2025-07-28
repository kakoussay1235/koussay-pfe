import React from 'react';
import Input from '../../../components/ui/Input';

const AmountInput = ({ value, onChange, error, type }) => {
  const handleAmountChange = (e) => {
    const inputValue = e.target.value;
    // Allow only numbers and decimal point
    if (inputValue === '' || /^\d*\.?\d*$/.test(inputValue)) {
      onChange(inputValue);
    }
  };

  return (
    <div className="mb-6">
      <Input
        label="Montant"
        type="text"
        placeholder="0,00"
        value={value}
        onChange={handleAmountChange}
        error={error}
        required
        className="text-2xl font-semibold text-center"
      />
      <div className="flex items-center justify-center mt-2">
        <span className="text-3xl font-bold text-primary">€</span>
      </div>
    </div>
  );
};

export default AmountInput;