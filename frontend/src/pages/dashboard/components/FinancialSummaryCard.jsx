import React from 'react';
import Icon from '../../../components/AppIcon';

const FinancialSummaryCard = ({ title, amount, currency = "€", trend, trendValue, icon, variant = "default" }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'bg-success/10 border-success/20';
      case 'warning':
        return 'bg-warning/10 border-warning/20';
      case 'error':
        return 'bg-error/10 border-error/20';
      default:
        return 'bg-card border-border';
    }
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-success';
    if (trend === 'down') return 'text-error';
    return 'text-muted-foreground';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return 'TrendingUp';
    if (trend === 'down') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className={`p-4 lg:p-6 rounded-lg border transition-smooth ${getVariantStyles()}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name={icon} size={20} className="text-primary" />
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
            <Icon name={getTrendIcon()} size={16} />
            <span className="text-xs font-medium">{trendValue}</span>
          </div>
        )}
      </div>
      <div className="flex items-baseline space-x-1">
        <span className="text-2xl lg:text-3xl font-semibold text-foreground">
          {amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
        </span>
        <span className="text-lg text-muted-foreground">{currency}</span>
      </div>
    </div>
  );
};

export default FinancialSummaryCard;