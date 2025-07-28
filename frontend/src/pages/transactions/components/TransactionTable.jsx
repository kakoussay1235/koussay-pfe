import React from 'react';
import Icon from '../../../components/AppIcon';

const TransactionTable = ({ transactions, onEdit, onDelete, onView, selectedTransactions, onSelectTransaction, onSelectAll }) => {
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

  const calculateRunningBalance = (transactions, currentIndex) => {
    let balance = 0;
    for (let i = 0; i <= currentIndex; i++) {
      const transaction = transactions[i];
      balance += transaction.type === 'income' ? transaction.amount : -transaction.amount;
    }
    return balance;
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="w-12 p-4">
                <input
                  type="checkbox"
                  checked={selectedTransactions.length === transactions.length && transactions.length > 0}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="rounded border-border"
                />
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Description</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Catégorie</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Membre</th>
              <th className="text-right p-4 font-medium text-muted-foreground">Montant</th>
              <th className="text-right p-4 font-medium text-muted-foreground">Solde</th>
              <th className="text-center p-4 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => {
              const isIncome = transaction.type === 'income';
              const amountColor = isIncome ? 'text-success' : 'text-error';
              const runningBalance = calculateRunningBalance(transactions, index);
              const balanceColor = runningBalance >= 0 ? 'text-success' : 'text-error';
              const isSelected = selectedTransactions.includes(transaction.id);

              return (
                <tr 
                  key={transaction.id} 
                  className={`border-b border-border hover:bg-muted/30 transition-smooth ${isSelected ? 'bg-primary/5' : ''}`}
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => onSelectTransaction(transaction.id, e.target.checked)}
                      className="rounded border-border"
                    />
                  </td>
                  <td className="p-4 text-sm text-card-foreground">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-card-foreground">
                        {transaction.description}
                      </div>
                      {transaction.notes && (
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {transaction.notes}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center space-x-1 text-sm">
                      <Icon name="Tag" size={14} className="text-muted-foreground" />
                      <span className="text-card-foreground">{transaction.category}</span>
                    </span>
                  </td>
                  <td className="p-4">
                    {transaction.member && (
                      <span className="inline-flex items-center space-x-1 text-sm">
                        <Icon name="User" size={14} className="text-muted-foreground" />
                        <span className="text-card-foreground">{transaction.member}</span>
                      </span>
                    )}
                  </td>
                  <td className={`p-4 text-right font-semibold ${amountColor}`}>
                    {isIncome ? '+' : '-'}{formatAmount(transaction.amount)}
                  </td>
                  <td className={`p-4 text-right font-medium ${balanceColor}`}>
                    {formatAmount(runningBalance)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center space-x-1">
                      <button
                        onClick={() => onView(transaction)}
                        className="p-2 rounded-md hover:bg-muted transition-smooth"
                        title="Voir les détails"
                      >
                        <Icon name="Eye" size={16} className="text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => onEdit(transaction)}
                        className="p-2 rounded-md hover:bg-muted transition-smooth"
                        title="Modifier"
                      >
                        <Icon name="Edit" size={16} className="text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => onDelete(transaction)}
                        className="p-2 rounded-md hover:bg-muted transition-smooth"
                        title="Supprimer"
                      >
                        <Icon name="Trash2" size={16} className="text-error" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;