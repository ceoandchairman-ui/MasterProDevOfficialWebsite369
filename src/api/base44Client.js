import axios from 'axios';

// Create a simple axios client for API calls
export const apiClient = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add token to requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

// Base44 compatibility object
export const base44 = {
  auth: {
    me: async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) return null;
      const mockUser = localStorage.getItem('mock_user');
      return mockUser ? JSON.parse(mockUser) : null;
    }
  },
  appLogs: {
    logUserInApp: async (pageName) => {
      console.log('Page tracked:', pageName);
      return { success: true };
    }
  },
  integrations: {
    Core: {
      SendEmail: async (data) => {
        console.warn('SendEmail mock called:', data);
        return { success: true, message: 'Email queued (mock)' };
      }
    }
  }
};

export default apiClient;
