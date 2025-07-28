import React from 'react';
import Icon from '../../../components/AppIcon';

const BudgetProgressCard = () => {
  const budgetCategories = [
    {
      id: 1,
      name: 'Alimentation',
      spent: 850,
      budget: 800,
      icon: 'ShoppingCart',
      color: 'bg-error'
    },
    {
      id: 2,
      name: 'Transport',
      spent: 420,
      budget: 500,
      icon: 'Car',
      color: 'bg-success'
    },
    {
      id: 3,
      name: 'Loisirs',
      spent: 320,
      budget: 400,
      icon: 'Film',
      color: 'bg-warning'
    },
    {
      id: 4,
      name: 'Santé',
      spent: 180,
      budget: 300,
      icon: 'Heart',
      color: 'bg-success'
    }
  ];

  const getProgressPercentage = (spent, budget) => {
    return Math.min((spent / budget) * 100, 100);
  };

  const getProgressColor = (spent, budget) => {
    const percentage = (spent / budget) * 100;
    if (percentage >= 100) return 'bg-error';
    if (percentage >= 80) return 'bg-warning';
    return 'bg-success';
  };

  const getStatusIcon = (spent, budget) => {
    const percentage = (spent / budget) * 100;
    if (percentage >= 100) return 'AlertTriangle';
    if (percentage >= 80) return 'AlertCircle';
    return 'CheckCircle';
  };

  const getStatusColor = (spent, budget) => {
    const percentage = (spent / budget) * 100;
    if (percentage >= 100) return 'text-error';
    if (percentage >= 80) return 'text-warning';
    return 'text-success';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">
        Progression des Budgets
      </h3>
      
      <div className="space-y-4">
        {budgetCategories.map((category) => {
          const percentage = getProgressPercentage(category.spent, category.budget);
          const remaining = Math.max(category.budget - category.spent, 0);
          
          return (
            <div key={category.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                    <Icon name={category.icon} size={16} className="text-muted-foreground" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {category.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={getStatusIcon(category.spent, category.budget)} 
                    size={16} 
                    className={getStatusColor(category.spent, category.budget)}
                  />
                  <span className="text-sm text-muted-foreground">
                    {category.spent.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} € / {category.budget.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                  </span>
                </div>
              </div>
              
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(category.spent, category.budget)}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{percentage.toFixed(1)}% utilisé</span>
                <span>
                  {remaining > 0 
                    ? `${remaining.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} € restant`
                    : `Dépassé de ${Math.abs(remaining).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`
                  }
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetProgressCard;