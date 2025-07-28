import React from 'react';
import Icon from '../../../components/AppIcon';

const BudgetSummaryCard = ({ budgetSummary, period }) => {
  const { totalBudget, totalSpent, totalRemaining, overBudgetCategories } = budgetSummary;
  const spentPercentage = (totalSpent / totalBudget) * 100;

  const getOverallStatus = () => {
    if (spentPercentage >= 100) return { text: 'Over Budget', color: 'text-error', bg: 'bg-error/10' };
    if (spentPercentage >= 80) return { text: 'Approaching Limit', color: 'text-warning', bg: 'bg-warning/10' };
    return { text: 'On Track', color: 'text-success', bg: 'bg-success/10' };
  };

  const status = getOverallStatus();

  return (
    <div className="bg-card border border-border rounded-lg shadow-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-card-foreground">Budget Overview</h2>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.color}`}>
          {status.text}
        </div>
      </div>

      {/* Total Budget Progress */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total {period} Budget</span>
          <span className="text-sm font-medium text-card-foreground">
            {spentPercentage.toFixed(1)}%
          </span>
        </div>
        
        <div className="w-full bg-muted rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${
              spentPercentage >= 100 ? 'bg-error' : spentPercentage >= 80 ? 'bg-warning' : 'bg-success'
            }`}
            style={{ width: `${Math.min(spentPercentage, 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            €{totalSpent.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} spent
          </span>
          <span className="text-muted-foreground">
            €{totalBudget.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} total
          </span>
        </div>
      </div>

      {/* Budget Stats */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Wallet" size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Remaining Budget</span>
          </div>
          <p className={`text-xl font-bold ${totalRemaining >= 0 ? 'text-success' : 'text-error'}`}>
            €{Math.abs(totalRemaining).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
            {totalRemaining < 0 && ' over'}
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Calendar" size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Days Remaining</span>
          </div>
          <p className="text-xl font-bold text-card-foreground">
            {period === 'Monthly' ? (new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate()) : (365 - new Date().getDayOfYear())}
          </p>
        </div>
      </div>

      {/* Over Budget Alert */}
      {overBudgetCategories.length > 0 && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="AlertTriangle" size={16} className="text-error" />
            <span className="text-sm font-medium text-error">Budget Alerts</span>
          </div>
          <p className="text-sm text-error mb-2">
            {overBudgetCategories.length} {overBudgetCategories.length === 1 ? 'category is' : 'categories are'} over budget
          </p>
          <div className="space-y-1">
            {overBudgetCategories.slice(0, 3).map((category) => (
              <div key={category.id} className="flex items-center justify-between text-xs">
                <span className="text-error">{category.name}</span>
                <span className="text-error font-medium">
                  €{(category.spent - category.budgetLimit).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} over
                </span>
              </div>
            ))}
            {overBudgetCategories.length > 3 && (
              <p className="text-xs text-error">
                +{overBudgetCategories.length - 3} more categories
              </p>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-card-foreground mb-3">Quick Actions</h3>
        <button className="w-full flex items-center space-x-2 p-3 bg-muted/50 hover:bg-muted rounded-lg transition-smooth">
          <Icon name="Plus" size={16} className="text-muted-foreground" />
          <span className="text-sm text-card-foreground">Add New Category</span>
        </button>
        <button className="w-full flex items-center space-x-2 p-3 bg-muted/50 hover:bg-muted rounded-lg transition-smooth">
          <Icon name="Settings" size={16} className="text-muted-foreground" />
          <span className="text-sm text-card-foreground">Budget Settings</span>
        </button>
        <button className="w-full flex items-center space-x-2 p-3 bg-muted/50 hover:bg-muted rounded-lg transition-smooth">
          <Icon name="Download" size={16} className="text-muted-foreground" />
          <span className="text-sm text-card-foreground">Export Report</span>
        </button>
      </div>
    </div>
  );
};

export default BudgetSummaryCard;