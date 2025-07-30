import axios from 'axios';
//import { notificationTypes } from '../contexts/NotificationContext';

// Créer une instance d'axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
});

// Gestion des requêtes
api.interceptors.request.use(
  async (config) => {
    // Ne pas intercepter les requêtes de CSRF
    if (config.url === '/sanctum/csrf-cookie') {
      return config;
    }
    
    // Récupérer le token CSRF avant chaque requête
    /*
    try {
      await api.get('/sanctum/csrf-cookie');
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du CSRF token:', error);
    }
      */
    
    return config;
  },
  (error) => {
    console.error('Erreur de requête API:', error);
    return Promise.reject(error);
  }
);

// Gestion des réponses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Gestion des erreurs 401 (non autorisé)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Si le token a expiré, on déconnecte l'utilisateur
      if (error.response.data.message === 'Unauthenticated.') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
