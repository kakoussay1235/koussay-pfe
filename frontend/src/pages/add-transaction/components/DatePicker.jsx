import React from 'react';
import Input from '../../../components/ui/Input';

const DatePicker = ({ value, onChange, error }) => {
  // Format current date as YYYY-MM-DD for input
  const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="mb-6">
      <Input
        label="Date"
        type="date"
        value={value || getCurrentDate()}
        onChange={(e) => onChange(e.target.value)}
        error={error}
        required
        max={getCurrentDate()}
        description="La date ne peut pas être dans le futur"
      />
    </div>
  );
};

export default DatePicker;