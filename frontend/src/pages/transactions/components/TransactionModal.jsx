import React, { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const TransactionModal = ({ isOpen, onClose, transaction, onSave, onDelete }) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    description: '',
    amount: '',
    category: '',
    member: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type,
        description: transaction.description,
        amount: transaction.amount.toString(),
        category: transaction.category,
        member: transaction.member || '',
        date: new Date(transaction.date).toISOString().split('T')[0],
        notes: transaction.notes || ''
      });
    } else {
      setFormData({
        type: 'expense',
        description: '',
        amount: '',
        category: '',
        member: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
    }
    setErrors({});
  }, [transaction, isOpen]);

  const categoryOptions = [
    { value: 'alimentation', label: 'Alimentation' },
    { value: 'transport', label: 'Transport' },
    { value: 'logement', label: 'Logement' },
    { value: 'sante', label: 'Santé' },
    { value: 'loisirs', label: 'Loisirs' },
    { value: 'education', label: 'Éducation' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'services', label: 'Services' },
    { value: 'salaire', label: 'Salaire' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'investissements', label: 'Investissements' },
    { value: 'autres', label: 'Autres' }
  ];

  const memberOptions = [
    { value: 'marie', label: 'Marie Dubois' },
    { value: 'pierre', label: 'Pierre Dubois' },
    { value: 'sophie', label: 'Sophie Dubois' },
    { value: 'lucas', label: 'Lucas Dubois' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Le montant doit être supérieur à 0';
    }

    if (!formData.category) {
      newErrors.category = 'La catégorie est requise';
    }

    if (!formData.date) {
      newErrors.date = 'La date est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        id: transaction?.id || Date.now()
      };
      
      await onSave(transactionData);
      onClose();
    } catch (error) {
      console.error('Error saving transaction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!transaction) return;
    
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
      setIsLoading(true);
      try {
        await onDelete(transaction.id);
        onClose();
      } catch (error) {
        console.error('Error deleting transaction:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const formatAmount = (amount) => {
    if (!amount) return '';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(Math.abs(parseFloat(amount)));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={transaction ? 'Modifier la transaction' : 'Nouvelle transaction'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type Toggle */}
        <div>
          <label className="text-sm font-medium text-card-foreground mb-3 block">
            Type de transaction
          </label>
          <div className="flex bg-muted rounded-lg p-1">
            <button
              type="button"
              onClick={() => handleInputChange('type', 'expense')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-smooth ${
                formData.type === 'expense' ?'bg-card text-card-foreground shadow-sm' :'text-muted-foreground hover:text-card-foreground'
              }`}
            >
              <Icon name="TrendingDown" size={16} />
              <span>Dépense</span>
            </button>
            <button
              type="button"
              onClick={() => handleInputChange('type', 'income')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-smooth ${
                formData.type === 'income' ?'bg-card text-card-foreground shadow-sm' :'text-muted-foreground hover:text-card-foreground'
              }`}
            >
              <Icon name="TrendingUp" size={16} />
              <span>Revenu</span>
            </button>
          </div>
        </div>

        {/* Description */}
        <Input
          label="Description"
          type="text"
          placeholder="Ex: Courses alimentaires, Salaire..."
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          error={errors.description}
          required
        />

        {/* Amount */}
        <div>
          <Input
            label="Montant (€)"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => handleInputChange('amount', e.target.value)}
            error={errors.amount}
            required
          />
          {formData.amount && (
            <p className="text-sm text-muted-foreground mt-1">
              Montant: {formatAmount(formData.amount)}
            </p>
          )}
        </div>

        {/* Category */}
        <Select
          label="Catégorie"
          options={categoryOptions}
          value={formData.category}
          onChange={(value) => handleInputChange('category', value)}
          error={errors.category}
          placeholder="Sélectionner une catégorie"
          searchable
          required
        />

        {/* Member */}
        <Select
          label="Membre de la famille"
          options={memberOptions}
          value={formData.member}
          onChange={(value) => handleInputChange('member', value)}
          placeholder="Sélectionner un membre (optionnel)"
        />

        {/* Date */}
        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => handleInputChange('date', e.target.value)}
          error={errors.date}
          required
        />

        {/* Notes */}
        <div>
          <label className="text-sm font-medium text-card-foreground mb-2 block">
            Notes (optionnel)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Informations supplémentaires..."
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-md bg-input text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          {transaction && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              iconName="Trash2"
              iconPosition="left"
              disabled={isLoading}
            >
              Supprimer
            </Button>
          )}
          <div className="flex-1" />
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="default"
            loading={isLoading}
            iconName="Save"
            iconPosition="left"
          >
            {transaction ? 'Modifier' : 'Ajouter'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TransactionModal;