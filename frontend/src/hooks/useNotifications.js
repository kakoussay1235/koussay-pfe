import { useCallback, useEffect, useRef } from 'react';
import { useNotifications, notificationTypes } from '../contexts/NotificationContext';

/**
 * Hook personnalisé pour gérer les notifications dans l'application
 * @returns {Object} Méthodes pour afficher différentes notifications
 */
const useNotification = () => {
  const { addNotification, removeNotification, checkBudgetAlerts, checkLowBalance } = useNotifications();
  const notificationTimeouts = useRef({});

  // Nettoyer les timeouts lors du démontage
  useEffect(() => {
    return () => {
      // Annuler tous les timeouts en cours
      Object.values(notificationTimeouts.current).forEach(timeoutId => {
        clearTimeout(timeoutId);
      });
    };
  }, []);

  /**
   * Affiche une notification
   * @param {string} type - Type de notification (success, error, warning, info)
   * @param {string} title - Titre de la notification
   * @param {string} message - Message de la notification
   * @param {number} duration - Durée d'affichage en ms (0 = pas de fermeture automatique)
   * @returns {string} ID de la notification
   */
  const notify = useCallback((type, title, message, duration = 5000) => {
    const id = addNotification({
      type,
      title,
      message,
      duration
    });

    // Gérer la fermeture automatique si une durée est spécifiée
    if (duration > 0) {
      const timeoutId = setTimeout(() => {
        removeNotification(id);
        delete notificationTimeouts.current[id];
      }, duration);

      // Stocker l'ID du timeout pour pouvoir l'annuler si nécessaire
      notificationTimeouts.current[id] = timeoutId;
    }

    return id;
  }, [addNotification, removeNotification]);

  /**
   * Affiche une notification de succès
   * @param {string} message - Message de succès
   * @param {string} [title='Succès'] - Titre de la notification
   * @param {number} [duration=3000] - Durée d'affichage en ms
   */
  const success = useCallback((message, title = 'Succès', duration = 3000) => {
    return notify(notificationTypes.SUCCESS, title, message, duration);
  }, [notify]);

  /**
   * Affiche une notification d'erreur
   * @param {string} message - Message d'erreur
   * @param {string} [title='Erreur'] - Titre de la notification
   * @param {number} [duration=5000] - Durée d'affichage en ms
   */
  const error = useCallback((message, title = 'Erreur', duration = 5000) => {
    return notify(notificationTypes.ERROR, title, message, duration);
  }, [notify]);

  /**
   * Affiche une notification d'avertissement
   * @param {string} message - Message d'avertissement
   * @param {string} [title='Avertissement'] - Titre de la notification
   * @param {number} [duration=4000] - Durée d'affichage en ms
   */
  const warning = useCallback((message, title = 'Avertissement', duration = 4000) => {
    return notify(notificationTypes.WARNING, title, message, duration);
  }, [notify]);

  /**
   * Affiche une notification d'information
   * @param {string} message - Message d'information
   * @param {string} [title='Information'] - Titre de la notification
   * @param {number} [duration=4000] - Durée d'affichage en ms
   */
  const info = useCallback((message, title = 'Information', duration = 4000) => {
    return notify(notificationTypes.INFO, title, message, duration);
  }, [notify]);

  /**
   * Ferme une notification par son ID
   * @param {string} id - ID de la notification à fermer
   */
  const dismiss = useCallback((id) => {
    removeNotification(id);
    
    // Annuler le timeout associé s'il existe
    if (notificationTimeouts.current[id]) {
      clearTimeout(notificationTimeouts.current[id]);
      delete notificationTimeouts.current[id];
    }
  }, [removeNotification]);

  return {
    success,
    error,
    warning,
    info,
    dismiss,
    checkBudgetAlerts,
    checkLowBalance,
    notificationTypes
  };
};

export default useNotification;
