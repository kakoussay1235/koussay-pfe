import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/ui/Modal';
import Header from '../../components/ui/Header';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';

import TransactionTypeToggle from './components/TransactionTypeToggle';
import AmountInput from './components/AmountInput';
import CategorySelector from './components/CategorySelector';
import MemberSelector from './components/MemberSelector';
import DatePicker from './components/DatePicker';
import DescriptionInput from './components/DescriptionInput';
import ReservedFundsAllocation from './components/ReservedFundsAllocation';
import FormActions from './components/FormActions';
import SuccessConfirmation from './components/SuccessConfirmation';

const AddTransaction = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    member: '',
    date: '',
    description: '',
    reservedFundsAllocation: {}
  });
  
  // Validation errors
  const [errors, setErrors] = useState({});
  
  // Auto-save draft functionality
  useEffect(() => {
    const savedDraft = localStorage.getItem('transaction-draft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setFormData(draft);
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, []);

  // Save draft on form changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.amount || formData.description) {
        localStorage.setItem('transaction-draft', JSON.stringify(formData));
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [formData]);

  const handleClose = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      navigate('/dashboard');
    }, 150);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Le montant doit être supérieur à 0';
    }
    
    if (!formData.category) {
      newErrors.category = 'Veuillez sélectionner une catégorie';
    }
    
    if (!formData.member) {
      newErrors.member = 'Veuillez sélectionner un membre';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }
    
    if (!formData.date) {
      newErrors.date = 'La date est requise';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      
      if (selectedDate > today) {
        newErrors.date = 'La date ne peut pas être dans le futur';
      }
    }

    // Validate reserved funds allocation for income
    if (formData.type === 'income' && Object.keys(formData.reservedFundsAllocation).length > 0) {
      const totalAmount = parseFloat(formData.amount) || 0;
      let totalAllocated = 0;
      
      Object.values(formData.reservedFundsAllocation).forEach(allocation => {
        if (allocation.type === 'percentage') {
          totalAllocated += (totalAmount * allocation.value / 100);
        } else {
          totalAllocated += allocation.value;
        }
      });
      
      if (totalAllocated > totalAmount) {
        newErrors.allocation = 'L\'allocation totale ne peut pas dépasser le montant de la transaction';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clear draft
      localStorage.removeItem('transaction-draft');
      
      // Show success confirmation
      setShowSuccess(true);
      
    } catch (error) {
      console.error('Error saving transaction:', error);
      setErrors({ submit: 'Erreur lors de l\'enregistrement. Veuillez réessayer.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessAction = (action) => {
    setShowSuccess(false);
    
    switch (action) {
      case 'addAnother':
        setFormData({
          type: 'expense',
          amount: '',
          category: '',
          member: '',
          date: '',
          description: '',
          reservedFundsAllocation: {}
        });
        setErrors({});
        break;
      case 'viewTransactions': navigate('/transactions');
        break;
      case 'close': navigate('/dashboard');
        break;
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear related errors
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const isFormValid = () => {
    return formData.amount && 
           formData.category && 
           formData.member && 
           formData.description.trim() && 
           formData.date &&
           Object.keys(errors).length === 0;
  };

  // Mock balance impact calculation
  const calculateBalanceImpact = () => {
    const currentBalance = 2450.75; // Mock current balance
    const amount = parseFloat(formData.amount) || 0;
    const impact = formData.type === 'income' ? amount : -amount;
    
    return {
      currentBalance,
      impact,
      newBalance: (currentBalance + impact).toFixed(2)
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={showSuccess ? '' : 'Ajouter une transaction'}
        size="lg"
        closeOnBackdrop={false}
        className="lg:max-w-2xl"
      >
        {showSuccess ? (
          <SuccessConfirmation
            transaction={formData}
            balanceImpact={calculateBalanceImpact()}
            onAddAnother={() => handleSuccessAction('addAnother')}
            onViewTransactions={() => handleSuccessAction('viewTransactions')}
            onClose={() => handleSuccessAction('close')}
          />
        ) : (
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <TransactionTypeToggle
              type={formData.type}
              onChange={(type) => updateFormData('type', type)}
            />

            <AmountInput
              value={formData.amount}
              onChange={(amount) => updateFormData('amount', amount)}
              error={errors.amount}
              type={formData.type}
            />

            <CategorySelector
              value={formData.category}
              onChange={(category) => updateFormData('category', category)}
              type={formData.type}
              error={errors.category}
            />

            <MemberSelector
              value={formData.member}
              onChange={(member) => updateFormData('member', member)}
              error={errors.member}
            />

            <DatePicker
              value={formData.date}
              onChange={(date) => updateFormData('date', date)}
              error={errors.date}
            />

            <DescriptionInput
              value={formData.description}
              onChange={(description) => updateFormData('description', description)}
              category={formData.category}
              type={formData.type}
            />

            {formData.type === 'income' && (
              <ReservedFundsAllocation
                allocation={formData.reservedFundsAllocation}
                onChange={(allocation) => updateFormData('reservedFundsAllocation', allocation)}
                totalAmount={formData.amount}
              />
            )}

            {errors.submit && (
              <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
                <p className="text-sm text-error">{errors.submit}</p>
              </div>
            )}

            {errors.allocation && (
              <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                <p className="text-sm text-warning">{errors.allocation}</p>
              </div>
            )}

            <FormActions
              onSave={handleSave}
              onCancel={handleClose}
              isLoading={isLoading}
              isValid={isFormValid()}
            />
          </form>
        )}
      </Modal>

      <BottomTabNavigation />
    </div>
  );
};

export default AddTransaction;