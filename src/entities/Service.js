import apiClient from '@/api/base44Client';

// Service entity - handles services/offerings
export class Service {
  static async list(filters = {}) {
    try {
      const response = await apiClient.get('/services', { params: filters });
      return Array.isArray(response) ? response : response.data || [];
    } catch (error) {
      console.warn('Failed to fetch services, returning empty array:', error.message);
      return [];
    }
  }

  static async getById(id) {
    try {
      const response = await apiClient.get(`/services/${id}`);
      return response;
    } catch (error) {
      console.warn('Failed to fetch service:', error.message);
      return null;
    }
  }

  static async search(query) {
    try {
      const response = await apiClient.get('/services/search', { 
        params: { q: query } 
      });
      return Array.isArray(response) ? response : response.data || [];
    } catch (error) {
      console.warn('Failed to search services:', error.message);
      return [];
    }
  }

  static async create(data) {
    try {
      const response = await apiClient.post('/services', data);
      return response;
    } catch (error) {
      console.error('Failed to create service:', error);
      throw error;
    }
  }

  static async update(id, data) {
    try {
      const response = await apiClient.put(`/services/${id}`, data);
      return response;
    } catch (error) {
      console.error('Failed to update service:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      await apiClient.delete(`/services/${id}`);
      return true;
    } catch (error) {
      console.error('Failed to delete service:', error);
      throw error;
    }
  }
}

export default Service;
