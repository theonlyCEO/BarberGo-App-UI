import api from './api'

export const authService = {
  // Register new user
  async register(userData) {
    try {
      // Clean up data before sending
      const cleanData = {
        name: userData.name?.trim(),
        email: userData.email?.toLowerCase().trim(),
        password: userData.password,
        role: userData.role || 'customer'
      };
      
      // Only add phone if it's not empty
      if (userData.phone && userData.phone.trim() !== '') {
        cleanData.phone = userData.phone.trim();
      }
      
      const response = await api.post('/auth/register', cleanData);
      const { data } = response.data;
      
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      return {
        user: data.user,
        token: data.token
      };
    } catch (error) {
      console.error('Register error:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.error?.message || 
        error.response?.data?.error?.details?.[0]?.message || 
        'Registration failed. Please try again.'
      );
    }
  },

  // Login user
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { 
        email: email.toLowerCase().trim(), 
        password 
      });
      const { data } = response.data;
      
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      return {
        user: data.user,
        token: data.token
      };
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.error?.message || 
        'Login failed. Please check your credentials.'
      );
    }
  },

  // Logout user
  async logout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('redirectAfterLogin');
  },

  // Get current user
  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      return response.data.data.user;
    } catch (error) {
      throw error;
    }
  },

  // Update profile
  async updateProfile(data) {
    try {
      const response = await api.put('/auth/me', data);
      return response.data.data.user;
    } catch (error) {
      throw error;
    }
  },

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      await api.post('/auth/change-password', { 
        currentPassword, 
        newPassword 
      });
    } catch (error) {
      throw error;
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  // Get token
  getToken() {
    return localStorage.getItem('token');
  }
}