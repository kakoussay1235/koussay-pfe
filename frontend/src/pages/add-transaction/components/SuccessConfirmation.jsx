import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SuccessConfirmation = ({ 
  transaction, 
  balanceImpact, 
  onAddAnother, 
  onViewTransactions, 
  onClose 
}) => {
  return (
    <div className="text-center py-6">
      <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon name="CheckCircle" size={32} className="text-success" />
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Transaction enregistrée !
      </h3>
      
      <p className="text-muted-foreground mb-6">
        Votre {transaction.type === 'income' ? 'revenu' : 'dépense'} de{' '}
        <span className="font-semibold text-foreground">{transaction.amount}€</span>{' '}
        a été ajouté avec succès.
      </p>

      {/* Balance Impact */}
      <div className="bg-muted/50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Impact sur le solde:</span>
          <span className={`font-semibold ${
            transaction.type === 'income' ? 'text-success' : 'text-error'
          }`}>
            {transaction.type === 'income' ? '+' : '-'}{transaction.amount}€
          </span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-muted-foreground">Nouveau solde:</span>
          <span className="font-semibold text-foreground">
            {balanceImpact.newBalance}€
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={onAddAnother}
          iconName="Plus"
          iconPosition="left"
          className="flex-1"
        >
          Ajouter une autre
        </Button>
        
        <Button
          variant="default"
          onClick={onViewTransactions}
          iconName="List"
          iconPosition="left"
          className="flex-1"
        >
          Voir les transactions
        </Button>
      </div>

      <Button
        variant="ghost"
        onClick={onClose}
        className="mt-4 w-full"
      >
        Fermer
      </Button>
    </div>
  );
};

export default SuccessConfirmation;