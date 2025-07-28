import api from './api';

export const login = async (email, password) => {
  try {
    // First, get the CSRF cookie
    await api.get('/sanctum/csrf-cookie');
    
    // Then make the login request
    const response = await api.post('/login', { email, password });
    
    // Store the user data
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
      // Note: The token is stored in an HTTP-only cookie by Sanctum
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    // Ensure CSRF cookie is set before registration
    await api.get('/sanctum/csrf-cookie');
    const response = await api.post('/register', userData);
    
    // Store user data after successful registration
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await api.post('/logout');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  } finally {
    // Clear local storage even if the server request fails
    localStorage.removeItem('user');
  }
};

export const getCurrentUser = async () => {
  try {
    // Check if we have a user in local storage first
    const user = localStorage.getItem('user');
    if (!user) return null;
    
    // Optionally, validate the session with the server
    const response = await api.get('/api/user');
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    localStorage.removeItem('user');
    return null;
  }
};

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  try {
    const user = await getCurrentUser();
    return !!user;
  } catch (error) {
    return false;
  }
};