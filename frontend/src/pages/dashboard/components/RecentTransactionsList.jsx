import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentTransactionsList = () => {
  const navigate = useNavigate();

  const recentTransactions = [
    {
      id: 1,
      type: 'expense',
      category: 'Alimentation',
      description: 'Courses Carrefour',
      amount: -85.50,
      member: 'Marie',
      date: '2025-01-27',
      icon: 'ShoppingCart'
    },
    {
      id: 2,
      type: 'income',
      category: 'Salaire',
      description: 'Salaire Janvier',
      amount: 2800.00,
      member: 'Pierre',
      date: '2025-01-26',
      icon: 'Wallet'
    },
    {
      id: 3,
      type: 'expense',
      category: 'Transport',
      description: 'Essence',
      amount: -65.00,
      member: 'Pierre',
      date: '2025-01-25',
      icon: 'Car'
    },
    {
      id: 4,
      type: 'expense',
      category: 'Loisirs',
      description: 'Cinéma',
      amount: -24.00,
      member: 'Marie',
      date: '2025-01-24',
      icon: 'Film'
    },
    {
      id: 5,
      type: 'income',
      category: 'Freelance',
      description: 'Projet web',
      amount: 450.00,
      member: 'Marie',
      date: '2025-01-23',
      icon: 'Laptop'
    }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  const getAmountColor = (amount) => {
    return amount > 0 ? 'text-success' : 'text-error';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">
          Transactions Récentes
        </h3>
        <Button
          variant="ghost"
          size="sm"
          iconName="ArrowRight"
          iconPosition="right"
          onClick={() => navigate('/transactions')}
        >
          Voir tout
        </Button>
      </div>
      
      <div className="space-y-3">
        {recentTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-smooth cursor-pointer"
            onClick={() => navigate(`/transactions?id=${transaction.id}`)}
          >
            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name={transaction.icon} size={18} className="text-muted-foreground" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-medium text-foreground truncate">
                  {transaction.description}
                </h4>
                <span className={`text-sm font-semibold ${getAmountColor(transaction.amount)}`}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">
                    {transaction.category}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    {transaction.member}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDate(transaction.date)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactionsList;