import React from 'react';
import Icon from '../../../components/AppIcon';

const TransactionCard = ({ transaction, onEdit, onDelete, onView }) => {
  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? 'text-success' : 'text-error';
  const iconName = isIncome ? 'TrendingUp' : 'TrendingDown';
  const iconBgColor = isIncome ? 'bg-success/10' : 'bg-error/10';
  const iconColor = isIncome ? 'text-success' : 'text-error';

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(Math.abs(amount));
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-card hover:shadow-modal transition-smooth">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className={`w-10 h-10 rounded-full ${iconBgColor} flex items-center justify-center flex-shrink-0`}>
            <Icon name={iconName} size={20} className={iconColor} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium text-card-foreground truncate">
                {transaction.description}
              </h3>
              <span className={`font-semibold ${amountColor}`}>
                {isIncome ? '+' : '-'}{formatAmount(transaction.amount)}
              </span>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>{formatDate(transaction.date)}</span>
              <span className="flex items-center space-x-1">
                <Icon name="Tag" size={14} />
                <span>{transaction.category}</span>
              </span>
              {transaction.member && (
                <span className="flex items-center space-x-1">
                  <Icon name="User" size={14} />
                  <span>{transaction.member}</span>
                </span>
              )}
            </div>
            
            {transaction.notes && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {transaction.notes}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-1 ml-2">
          <button
            onClick={() => onView(transaction)}
            className="p-2 rounded-md hover:bg-muted transition-smooth"
          >
            <Icon name="Eye" size={16} className="text-muted-foreground" />
          </button>
          <button
            onClick={() => onEdit(transaction)}
            className="p-2 rounded-md hover:bg-muted transition-smooth"
          >
            <Icon name="Edit" size={16} className="text-muted-foreground" />
          </button>
          <button
            onClick={() => onDelete(transaction)}
            className="p-2 rounded-md hover:bg-muted transition-smooth"
          >
            <Icon name="Trash2" size={16} className="text-error" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;