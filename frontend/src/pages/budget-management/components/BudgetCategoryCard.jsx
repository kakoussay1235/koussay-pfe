import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const BudgetCategoryCard = ({ 
  category, 
  onUpdateBudget, 
  onDeleteCategory,
  isExpanded,
  onToggleExpand 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editAmount, setEditAmount] = useState(category.budgetLimit.toString());

  const progressPercentage = Math.min((category.spent / category.budgetLimit) * 100, 100);
  const remaining = category.budgetLimit - category.spent;
  
  const getStatusColor = () => {
    if (progressPercentage >= 100) return 'bg-error';
    if (progressPercentage >= 80) return 'bg-warning';
    return 'bg-success';
  };

  const getStatusText = () => {
    if (progressPercentage >= 100) return 'Over Budget';
    if (progressPercentage >= 80) return 'Approaching Limit';
    return 'On Track';
  };

  const handleSaveEdit = () => {
    const newAmount = parseFloat(editAmount);
    if (newAmount > 0) {
      onUpdateBudget(category.id, newAmount);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditAmount(category.budgetLimit.toString());
    setIsEditing(false);
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-card">
      {/* Card Header */}
      <div 
        className="p-4 cursor-pointer"
        onClick={onToggleExpand}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category.color}`}>
              <Icon name={category.icon} size={20} color="white" />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">{category.name}</h3>
              <p className="text-sm text-muted-foreground">
                {category.transactionCount} transactions this month
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <p className="text-sm font-medium text-card-foreground">
                €{category.spent.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-muted-foreground">
                of €{category.budgetLimit.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <Icon 
              name={isExpanded ? "ChevronUp" : "ChevronDown"} 
              size={20} 
              className="text-muted-foreground"
            />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              progressPercentage >= 100 
                ? 'bg-error/10 text-error' 
                : progressPercentage >= 80 
                ? 'bg-warning/10 text-warning' :'bg-success/10 text-success'
            }`}>
              {getStatusText()}
            </span>
            <span className="text-xs text-muted-foreground">
              {progressPercentage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getStatusColor()}`}
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-border">
          <div className="pt-4 space-y-4">
            {/* Budget Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Remaining</p>
                <p className={`font-semibold ${remaining >= 0 ? 'text-success' : 'text-error'}`}>
                  €{Math.abs(remaining).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                  {remaining < 0 && ' over'}
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Daily Average</p>
                <p className="font-semibold text-card-foreground">
                  €{(category.spent / new Date().getDate()).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* Budget Limit Editing */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-card-foreground">Budget Limit</span>
                {!isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Edit2"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                )}
              </div>
              
              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="flex-1"
                  />
                  <Button
                    variant="default"
                    size="sm"
                    iconName="Check"
                    onClick={handleSaveEdit}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="X"
                    onClick={handleCancelEdit}
                  />
                </div>
              ) : (
                <p className="text-lg font-semibold text-card-foreground">
                  €{category.budgetLimit.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                </p>
              )}
            </div>

            {/* Recent Transactions */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-card-foreground">Recent Transactions</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {category.recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded-md">
                    <div>
                      <p className="text-sm font-medium text-card-foreground">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">{transaction.date}</p>
                    </div>
                    <p className="text-sm font-semibold text-error">
                      -€{transaction.amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                iconName="TrendingUp"
                onClick={() => {/* Handle view details */}}
              >
                View Details
              </Button>
              <Button
                variant="ghost"
                size="sm"
                iconName="Trash2"
                onClick={() => onDeleteCategory(category.id)}
                className="text-error hover:text-error"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetCategoryCard;