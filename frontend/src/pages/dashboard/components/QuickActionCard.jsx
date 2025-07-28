import React from 'react';
import { useNavigate } from 'react-router-dom';

import Icon from '../../../components/AppIcon';

const QuickActionCard = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 1,
      title: 'Ajouter Dépense',
      description: 'Enregistrer une nouvelle dépense',
      icon: 'Minus',
      variant: 'outline',
      action: () => navigate('/add-transaction?type=expense')
    },
    {
      id: 2,
      title: 'Ajouter Revenu',
      description: 'Enregistrer un nouveau revenu',
      icon: 'Plus',
      variant: 'default',
      action: () => navigate('/add-transaction?type=income')
    },
    {
      id: 3,
      title: 'Voir Budget',
      description: 'Gérer les budgets par catégorie',
      icon: 'Target',
      variant: 'secondary',
      action: () => navigate('/budget-management')
    },
    {
      id: 4,
      title: 'Rapports',
      description: 'Analyser les tendances financières',
      icon: 'BarChart3',
      variant: 'ghost',
      action: () => navigate('/reports-analytics')
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">
        Actions Rapides
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {quickActions.map((action) => (
          <div
            key={action.id}
            className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-smooth cursor-pointer"
            onClick={action.action}
          >
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name={action.icon} size={20} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground mb-1">
                  {action.title}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActionCard;