import apiClient from '@/api/base44Client';

// User Service - replaces Base44 User entity
export class User {
  static async me() {
    try {
      const user = await apiClient.get('/auth/me');
      return user;
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      return null;
    }
  }

  static async login(email, password) {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
      }
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  static async logout() {
    try {
      await apiClient.post('/auth/logout');
      localStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Logout failed:', error);
      localStorage.removeItem('auth_token');
    }
  }

  static async register(userData) {
    try {
      const response = await apiClient.post('/auth/register', userData);
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
      }
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }
}

export default User;
