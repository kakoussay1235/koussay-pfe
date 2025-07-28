import React from 'react';
import Icon from '../../../components/AppIcon';

const SummaryStats = ({ stats }) => {
  const statItems = [
    {
      id: 'totalIncome',
      label: 'Revenus totaux',
      value: stats.totalIncome,
      icon: 'TrendingUp',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      id: 'totalExpenses',
      label: 'Dépenses totales',
      value: stats.totalExpenses,
      icon: 'TrendingDown',
      color: 'text-error',
      bgColor: 'bg-error/10'
    },
    {
      id: 'netBalance',
      label: 'Solde net',
      value: stats.netBalance,
      icon: stats.netBalance >= 0 ? 'Plus' : 'Minus',
      color: stats.netBalance >= 0 ? 'text-success' : 'text-error',
      bgColor: stats.netBalance >= 0 ? 'bg-success/10' : 'bg-error/10'
    },
    {
      id: 'reservedFunds',
      label: 'Fonds réservés',
      value: stats.reservedFunds,
      icon: 'PiggyBank',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    }
  ];

  const formatCurrency = (amount) => {
    return amount.toLocaleString('fr-FR', { 
      style: 'currency', 
      currency: 'EUR' 
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">
        Résumé financier
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {statItems.map((item) => (
          <div key={item.id} className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${item.bgColor}`}>
              <Icon 
                name={item.icon} 
                size={20} 
                className={item.color}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className={`text-lg font-semibold ${item.color}`}>
                {formatCurrency(item.value)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Insights */}
      <div className="mt-6 pt-4 border-t border-border">
        <h4 className="text-sm font-medium text-card-foreground mb-3">
          Indicateurs clés
        </h4>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Taux d'épargne</span>
            <span className="text-sm font-medium text-card-foreground">
              {stats.totalIncome > 0 ? 
                `${((stats.netBalance / stats.totalIncome) * 100).toFixed(1)}%` : 
                '0%'
              }
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Dépense moyenne/jour</span>
            <span className="text-sm font-medium text-card-foreground">
              {formatCurrency(stats.avgDailyExpense || 0)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Catégorie principale</span>
            <span className="text-sm font-medium text-card-foreground">
              {stats.topCategory || 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryStats;