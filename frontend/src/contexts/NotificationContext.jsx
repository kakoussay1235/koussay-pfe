import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AlertCircle, CheckCircle, X, AlertTriangle, Info } from 'lucide-react';

const NotificationContext = createContext();

const notificationTypes = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};
// ...existing code...

const notificationIcons = {
  [notificationTypes.SUCCESS]: <CheckCircle className="h-5 w-5 text-green-400" />,
  [notificationTypes.ERROR]: <AlertCircle className="h-5 w-5 text-red-400" />,
  [notificationTypes.WARNING]: <AlertTriangle className="h-5 w-5 text-yellow-400" />,
  [notificationTypes.INFO]: <Info className="h-5 w-5 text-blue-400" />
};

const notificationColors = {
  [notificationTypes.SUCCESS]: 'bg-green-50 border-green-200',
  [notificationTypes.ERROR]: 'bg-red-50 border-red-200',
  [notificationTypes.WARNING]: 'bg-yellow-50 border-yellow-200',
  [notificationTypes.INFO]: 'bg-blue-50 border-blue-200'
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [autoClose, setAutoClose] = useState(true);
  const [autoCloseDuration] = useState(5000); // 5 secondes par défaut

  const removeNotification = useCallback((id) => {
    setNotifications((current) => current.filter((n) => n.id !== id));
  }, []);

  const addNotification = useCallback(
    ({ type = notificationTypes.INFO, title, message, duration = autoCloseDuration }) => {
      const id = Date.now().toString();
      const newNotification = { id, type, title, message };
      
      setNotifications((current) => [...current, newNotification]);

      if (autoClose && duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      }

      return id;
    },
    [autoClose, autoCloseDuration, removeNotification]
  );

  // Vérifier les notifications pour les alertes de budget
  const checkBudgetAlerts = useCallback((budgets, transactions) => {
    if (!budgets || !transactions) return;

    budgets.forEach(budget => {
      const spent = transactions
        .filter(t => t.categoryId === budget.id && t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      const percentage = (spent / budget.amount) * 100;
      
      if (percentage >= 90) {
        addNotification({
          type: percentage >= 100 ? notificationTypes.ERROR : notificationTypes.WARNING,
          title: `Budget ${budget.name}`,
          message: percentage >= 100 
            ? `Dépassement de budget! (${percentage.toFixed(0)}%)`
            : `Attention: ${percentage.toFixed(0)}% du budget utilisé`,
          duration: 10000 // 10 secondes pour les alertes de budget
        });
      }
    });
  }, [addNotification]);

  // Vérifier le solde faible
  const checkLowBalance = useCallback((balance, threshold = 100) => {
    if (balance <= threshold) {
      addNotification({
        type: notificationTypes.WARNING,
        title: 'Solde faible',
        message: `Votre solde est faible: ${balance.toFixed(2)}€`,
        duration: 10000
      });
    }
  }, [addNotification]);

  const contextValue = {
    notifications,
    addNotification,
    removeNotification,
    checkBudgetAlerts,
    checkLowBalance,
    notificationTypes
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

const NotificationContainer = () => {
  const { notifications, removeNotification } = useContext(NotificationContext);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3 w-80 max-w-full">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onDismiss={removeNotification}
        />
      ))}
    </div>
  );
};

const NotificationItem = ({ notification, onDismiss }) => {
  const { id, type, title, message } = notification;
  
  return (
    <div
      className={`rounded-lg p-4 shadow-lg border ${notificationColors[type]}`}
      role="alert"
    >
      <div className="flex">
        <div className="flex-shrink-0">
          {notificationIcons[type]}
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium">
            {title}
          </h3>
          <div className="mt-1 text-sm text-gray-700">
            {message}
          </div>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            onClick={() => onDismiss(id)}
            className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <span className="sr-only">Fermer</span>
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications doit être utilisé à l\'intérieur d\'un NotificationProvider');
  }
  return context;
};

