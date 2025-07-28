import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  fr: {
    // Authentication
    login: 'Connexion',
    register: 'Inscription',
    email: 'Adresse email',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    forgotPassword: 'Mot de passe oublié ?',
    resetPassword: 'Réinitialiser le mot de passe',
    loginButton: 'Se connecter',
    registerButton: 'S\'inscrire',
    logout: 'Déconnexion',
    
    // Dashboard
    dashboard: 'Tableau de Bord',
    currentBalance: 'Solde Actuel',
    monthlyIncome: 'Revenus Mensuels',
    monthlyExpenses: 'Dépenses Mensuelles',
    reservedFunds: 'Fonds Réservés',
    financialOverview: 'Vue d\'Ensemble Financière',
    analytics: 'Analyses',
    quickActions: 'Actions Rapides',
    
    // Transactions
    transactions: 'Transactions',
    addTransaction: 'Ajouter une transaction',
    income: 'Revenus',
    expense: 'Dépenses',
    amount: 'Montant',
    category: 'Catégorie',
    member: 'Membre',
    date: 'Date',
    description: 'Description',
    
    // Categories
    salary: 'Salaire',
    freelance: 'Freelance',
    investment: 'Investissement',
    gift: 'Cadeau',
    other: 'Autre',
    food: 'Alimentation',
    transport: 'Transport',
    housing: 'Logement',
    entertainment: 'Loisirs',
    health: 'Santé',
    education: 'Éducation',
    shopping: 'Achats',
    utilities: 'Services publics',
    
    // Members
    husband: 'Mari',
    wife: 'Épouse',
    child: 'Enfant',
    addMember: 'Ajouter un membre',
    managMembers: 'Gérer les membres',
    
    // Reserved Funds
    emergency: 'Urgence',
    savings: 'Épargne',
    vacation: 'Vacances',
    
    // Common
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    search: 'Rechercher',
    filter: 'Filtrer',
    export: 'Exporter',
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    
    // Notifications
    lowBalance: 'Solde faible',
    budgetExceeded: 'Budget dépassé',
    monthlyGoalReached: 'Objectif mensuel atteint',
    
    // Settings
    settings: 'Paramètres',
    language: 'Langue',
    currency: 'Devise',
    notifications: 'Notifications',
    profile: 'Profil',
    
    // Validation
    required: 'Ce champ est requis',
    invalidEmail: 'Format d\'email invalide',
    passwordTooShort: 'Le mot de passe doit contenir au moins 8 caractères',
    passwordsNoMatch: 'Les mots de passe ne correspondent pas'
  },
  en: {
    // Authentication
    login: 'Login',
    register: 'Register',
    email: 'Email Address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot Password?',
    resetPassword: 'Reset Password',
    loginButton: 'Sign In',
    registerButton: 'Sign Up',
    logout: 'Logout',
    
    // Dashboard
    dashboard: 'Dashboard',
    currentBalance: 'Current Balance',
    monthlyIncome: 'Monthly Income',
    monthlyExpenses: 'Monthly Expenses',
    reservedFunds: 'Reserved Funds',
    financialOverview: 'Financial Overview',
    analytics: 'Analytics',
    quickActions: 'Quick Actions',
    
    // Transactions
    transactions: 'Transactions',
    addTransaction: 'Add Transaction',
    income: 'Income',
    expense: 'Expense',
    amount: 'Amount',
    category: 'Category',
    member: 'Member',
    date: 'Date',
    description: 'Description',
    
    // Categories
    salary: 'Salary',
    freelance: 'Freelance',
    investment: 'Investment',
    gift: 'Gift',
    other: 'Other',
    food: 'Food',
    transport: 'Transport',
    housing: 'Housing',
    entertainment: 'Entertainment',
    health: 'Health',
    education: 'Education',
    shopping: 'Shopping',
    utilities: 'Utilities',
    
    // Members
    husband: 'Husband',
    wife: 'Wife',
    child: 'Child',
    addMember: 'Add Member',
    managMembers: 'Manage Members',
    
    // Reserved Funds
    emergency: 'Emergency',
    savings: 'Savings',
    vacation: 'Vacation',
    
    // Common
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    
    // Notifications
    lowBalance: 'Low Balance',
    budgetExceeded: 'Budget Exceeded',
    monthlyGoalReached: 'Monthly Goal Reached',
    
    // Settings
    settings: 'Settings',
    language: 'Language',
    currency: 'Currency',
    notifications: 'Notifications',
    profile: 'Profile',
    
    // Validation
    required: 'This field is required',
    invalidEmail: 'Invalid email format',
    passwordTooShort: 'Password must be at least 8 characters',
    passwordsNoMatch: 'Passwords do not match'
  }
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('fr');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'fr';
    setCurrentLanguage(savedLanguage);
  }, []);

  const changeLanguage = (language) => {
    if (language !== currentLanguage && translations[language]) {
      setCurrentLanguage(language);
      localStorage.setItem('language', language);
    }
  };

  const t = (key, defaultValue = '') => {
    return translations[currentLanguage]?.[key] || translations.fr[key] || defaultValue || key;
  };

  const getAvailableLanguages = () => [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    translations: translations[currentLanguage],
    getAvailableLanguages
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;