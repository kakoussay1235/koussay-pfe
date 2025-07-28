import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const userData = localStorage.getItem('familyExpenseUser');
      if (userData) {
        const user = JSON.parse(userData);
        setUser(user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      localStorage.removeItem('familyExpenseUser');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check stored users
    const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const user = storedUsers.find(u => u.email === email);
    
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    
    // Simple password check (in real app, use proper hashing)
    if (user.password !== password) {
      throw new Error('Mot de passe incorrect');
    }
    
    // Store current user
    localStorage.setItem('familyExpenseUser', JSON.stringify(user));
    setUser(user);
    setIsAuthenticated(true);
    setIsLoading(false);
    
    return user;
  };

  const register = async (userData) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Store in registered users
    const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const newUser = {
      ...userData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    
    storedUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(storedUsers));
    localStorage.setItem('familyExpenseUser', JSON.stringify(newUser));
    
    setUser(newUser);
    setIsAuthenticated(true);
    setIsLoading(false);
    
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('familyExpenseUser');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  const resetPassword = async (email) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const user = storedUsers.find(u => u.email === email);
    
    if (!user) {
      setIsLoading(false);
      throw new Error('Aucun compte associé à cette adresse email');
    }
    
    // In real app, send email with reset link
    setIsLoading(false);
    return { message: 'Instructions de réinitialisation envoyées par email' };
  };

  const updateProfile = async (updates) => {
    setIsLoading(true);
    
    try {
      const updatedUser = { ...user, ...updates };
      
      // Update in stored users
      const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const userIndex = storedUsers.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        storedUsers[userIndex] = updatedUser;
        localStorage.setItem('registeredUsers', JSON.stringify(storedUsers));
      }
      
      localStorage.setItem('familyExpenseUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;