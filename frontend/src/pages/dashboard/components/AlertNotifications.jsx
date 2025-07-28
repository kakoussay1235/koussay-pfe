import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertNotifications = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'warning',
      title: 'Budget Alimentation Dépassé',
      message: 'Vous avez dépassé votre budget alimentation de 15% ce mois-ci.',
      timestamp: new Date(Date.now() - 3600000),
      isRead: false
    },
    {
      id: 2,
      type: 'info',
      title: 'Solde Fonds d\'Urgence Faible',
      message: 'Votre fonds d\'urgence est en dessous du seuil recommandé de 1000€.',
      timestamp: new Date(Date.now() - 7200000),
      isRead: false
    },
    {
      id: 3,
      type: 'success',
      title: 'Objectif d\'Épargne Atteint',
      message: 'Félicitations ! Vous avez atteint votre objectif d\'épargne mensuel.',
      timestamp: new Date(Date.now() - 86400000),
      isRead: true
    }
  ]);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return 'AlertTriangle';
      case 'error':
        return 'AlertCircle';
      case 'success':
        return 'CheckCircle';
      default:
        return 'Info';
    }
  };

  const getAlertStyles = (type) => {
    switch (type) {
      case 'warning':
        return 'bg-warning/10 border-warning/20 text-warning';
      case 'error':
        return 'bg-error/10 border-error/20 text-error';
      case 'success':
        return 'bg-success/10 border-success/20 text-success';
      default:
        return 'bg-primary/10 border-primary/20 text-primary';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `Il y a ${minutes} min`;
    } else if (hours < 24) {
      return `Il y a ${hours}h`;
    } else {
      const days = Math.floor(hours / 24);
      return `Il y a ${days}j`;
    }
  };

  const dismissAlert = (alertId) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const markAsRead = (alertId) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const unreadAlerts = alerts.filter(alert => !alert.isRead);

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-card-foreground">
            Notifications
          </h3>
          {unreadAlerts.length > 0 && (
            <span className="bg-error text-error-foreground text-xs font-medium px-2 py-1 rounded-full">
              {unreadAlerts.length}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-3 rounded-lg border transition-smooth ${getAlertStyles(alert.type)} ${
              !alert.isRead ? 'border-l-4' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              <Icon 
                name={getAlertIcon(alert.type)} 
                size={18} 
                className="flex-shrink-0 mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="text-sm font-medium text-foreground">
                    {alert.title}
                  </h4>
                  <div className="flex items-center space-x-1 ml-2">
                    {!alert.isRead && (
                      <Button
                        variant="ghost"
                        size="xs"
                        iconName="Eye"
                        onClick={() => markAsRead(alert.id)}
                        className="h-6 w-6 p-0"
                      />
                    )}
                    <Button
                      variant="ghost"
                      size="xs"
                      iconName="X"
                      onClick={() => dismissAlert(alert.id)}
                      className="h-6 w-6 p-0"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {alert.message}
                </p>
                <span className="text-xs text-muted-foreground">
                  {formatTimestamp(alert.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertNotifications;