import React from 'react';
import Icon from '../../../components/AppIcon';

const TransactionSummary = ({ transactions, filteredTransactions }) => {
  const calculateSummary = (transactions) => {
    return transactions.reduce((acc, transaction) => {
      if (transaction.type === 'income') {
        acc.totalIncome += transaction.amount;
      } else {
        acc.totalExpenses += transaction.amount;
      }
      acc.balance = acc.totalIncome - acc.totalExpenses;
      return acc;
    }, { totalIncome: 0, totalExpenses: 0, balance: 0 });
  };

  const summary = calculateSummary(filteredTransactions);
  const allSummary = calculateSummary(transactions);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const isFiltered = filteredTransactions.length !== transactions.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Total Income */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
            <Icon name="TrendingUp" size={20} className="text-success" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Revenus totaux</p>
            <p className="text-lg font-semibold text-success">
              {formatAmount(summary.totalIncome)}
            </p>
            {isFiltered && (
              <p className="text-xs text-muted-foreground">
                Sur {formatAmount(allSummary.totalIncome)} au total
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Total Expenses */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-error/10 rounded-full flex items-center justify-center">
            <Icon name="TrendingDown" size={20} className="text-error" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Dépenses totales</p>
            <p className="text-lg font-semibold text-error">
              {formatAmount(summary.totalExpenses)}
            </p>
            {isFiltered && (
              <p className="text-xs text-muted-foreground">
                Sur {formatAmount(allSummary.totalExpenses)} au total
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Net Balance */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            summary.balance >= 0 ? 'bg-success/10' : 'bg-error/10'
          }`}>
            <Icon 
              name={summary.balance >= 0 ? 'Plus' : 'Minus'} 
              size={20} 
              className={summary.balance >= 0 ? 'text-success' : 'text-error'} 
            />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Solde net</p>
            <p className={`text-lg font-semibold ${
              summary.balance >= 0 ? 'text-success' : 'text-error'
            }`}>
              {formatAmount(summary.balance)}
            </p>
            {isFiltered && (
              <p className="text-xs text-muted-foreground">
                Sur {formatAmount(allSummary.balance)} au total
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionSummary;